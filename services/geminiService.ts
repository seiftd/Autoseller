import { GoogleGenAI, Type } from "@google/genai";
import { storageService } from './storageService';
import { Product } from '../types';

const apiKey = import.meta.env.VITE_API_KEY || 'dummy-key';
const ai = new GoogleGenAI({ apiKey });

interface IntentAnalysis {
  intent: 'price_inquiry' | 'delivery_inquiry' | 'order_intent' | 'product_info' | 'greeting' | 'other';
  entities: {
    productName?: string;
    region?: string; // Generalized from wilaya
    country?: string; // New entity
    quantity?: number;
    customerName?: string;
    phone?: string;
    address?: string;
  };
}

export const geminiService = {
  processMessage: async (userMessage: string, contextType: 'comment' | 'message'): Promise<string> => {
    try {
      const analysis = await geminiService.analyzeIntent(userMessage);
      const products = storageService.getProducts();
      return geminiService.constructReply(analysis, products, contextType);
    } catch (error) {
      console.error("AutoReply Error:", error);
      return "I'm checking that for you, please wait a moment.";
    }
  },

  analyzeIntent: async (message: string): Promise<IntentAnalysis> => {
    const prompt = `
      Analyze this customer message for a multi-country e-commerce store (Algeria, France, Morocco, Tunisia).
      Extract intent and entities.
      
      Message: "${message}"
      
      Output JSON with:
      - intent: 'price_inquiry' | 'delivery_inquiry' | 'order_intent' | 'product_info' | 'greeting' | 'other'
      - entities: { 
          productName, 
          region (e.g. Wilaya, State, City), 
          country (e.g. Algeria, France), 
          quantity, 
          customerName, 
          phone, 
          address 
        }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: { type: Type.STRING },
            entities: {
              type: Type.OBJECT,
              properties: {
                productName: { type: Type.STRING, nullable: true },
                region: { type: Type.STRING, nullable: true },
                country: { type: Type.STRING, nullable: true },
                quantity: { type: Type.NUMBER, nullable: true },
                customerName: { type: Type.STRING, nullable: true },
                phone: { type: Type.STRING, nullable: true },
                address: { type: Type.STRING, nullable: true },
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text) as IntentAnalysis;
  },

  constructReply: (analysis: IntentAnalysis, products: Product[], contextType: 'comment' | 'message'): string => {
    const { intent, entities } = analysis;

    // Fuzzy Search Product
    const findProduct = () => {
      if (!entities.productName) return null;
      const lower = entities.productName.toLowerCase();

      // Filter by country if detected
      let candidates = products;
      if (entities.country) {
        const countryLower = entities.country.toLowerCase();
        // Simplified mapping: assume we can match country code or name from mock data
        // In real app, we'd query Country list
        const countryMap: { [key: string]: string } = { 'algeria': 'dz', 'france': 'fr', 'morocco': 'ma', 'tunisia': 'tn' };
        const cid = countryMap[countryLower];
        if (cid) candidates = candidates.filter(p => p.targetCountryId === cid);
      }

      return candidates.find(p => p.name.toLowerCase().includes(lower) || p.description.toLowerCase().includes(lower)) || null;
    };

    const product = findProduct();

    // Context aware brevity
    const isComment = contextType === 'comment';

    switch (intent) {
      case 'greeting':
        return isComment ? "👋 Send us a DM for orders!" : "Hello! Welcome to our global store. How can I help you today?";

      case 'price_inquiry':
        if (product) {
          return `The price of ${product.name} is ${product.price} ${product.currency}. ${isComment ? 'Check DM for details.' : 'We have stock available.'}`;
        }
        return `We have many products available. Which one are you interested in?`;

      case 'delivery_inquiry':
        if (!product && !entities.region) return "Delivery available to Algeria, France, Morocco, and Tunisia. Payment methods vary by country.";

        if (product) {
          const defaultCost = product.shipping.defaultCost;
          // Check specific region cost
          let cost = defaultCost;
          let costText = "";

          // Try to match region roughly
          if (entities.region) {
            const matchedRegion = Object.keys(product.shipping.locationCosts).find(r => r.toLowerCase() === entities.region?.toLowerCase());
            if (matchedRegion) {
              cost = product.shipping.locationCosts[matchedRegion];
              costText = `Delivery to ${matchedRegion} is ${cost} ${product.currency}.`;
            } else {
              costText = `Delivery starts from ${defaultCost} ${product.currency}.`;
            }
          } else {
            costText = `Delivery starts from ${defaultCost} ${product.currency}.`;
          }

          if (product.shipping.type === 'free') {
            costText = "Delivery is FREE.";
          }

          return `${costText} Payment is ${product.paymentMethods.join(' or ')}.`;
        }
        return `Delivery costs vary by product and location. Please specify the product name.`;

      case 'order_intent':
        if (!product) return "Great! Please let me know which product you want to order.";

        if (entities.phone && entities.region) {
          const defaultCost = product.shipping.defaultCost;
          const matchedRegion = Object.keys(product.shipping.locationCosts).find(r => r.toLowerCase() === entities.region?.toLowerCase());
          const shipping = matchedRegion ? product.shipping.locationCosts[matchedRegion] : defaultCost;

          const total = product.price + shipping;
          return `Order received for ${product.name}! Total: ${total} ${product.currency}. We will contact you on ${entities.phone}.`;
        }

        return isComment
          ? "Please send us a private message with your Name, Phone, and Address to order."
          : `To order ${product.name}, please provide: Full Name, Address (Region), and Phone Number.`;

      default:
        return "I'm here to help! Ask me about prices or delivery.";
    }
  }
};