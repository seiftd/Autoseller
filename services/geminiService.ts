import { GoogleGenAI, Type } from "@google/genai";
import { storageService } from './storageService';
import { Product } from '../types';

const apiKey = process.env.API_KEY || 'dummy-key'; 
const ai = new GoogleGenAI({ apiKey });

interface IntentAnalysis {
  intent: 'price_inquiry' | 'delivery_inquiry' | 'order_intent' | 'product_info' | 'greeting' | 'other';
  entities: {
    productName?: string;
    wilaya?: string;
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
      Analyze this customer message for an Algerian e-commerce store.
      Extract intent and entities (Wilaya must be one of the 58 Algerian states).
      
      Message: "${message}"
      
      Output JSON with:
      - intent: 'price_inquiry' | 'delivery_inquiry' | 'order_intent' | 'product_info' | 'greeting' | 'other'
      - entities: { productName, wilaya, quantity, customerName, phone, address }
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
                wilaya: { type: Type.STRING, nullable: true },
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
      return products.find(p => p.name.toLowerCase().includes(lower) || p.description.toLowerCase().includes(lower)) || null;
    };

    const product = findProduct();

    // Context aware brevity
    const isComment = contextType === 'comment';

    switch (intent) {
      case 'greeting':
        return isComment ? "👋 Send us a DM for orders!" : "Hello! Welcome to our store. How can I help you today?";

      case 'price_inquiry':
        if (product) {
          return `The price of ${product.name} is ${product.price} DA. ${isComment ? 'Check DM for details.' : 'We have stock available.'}`;
        }
        return `We have many products. Which one are you interested in?`;

      case 'delivery_inquiry':
        if (!product && !entities.wilaya) return "Delivery available to 58 wilayas. Payment on delivery.";
        
        let costText = "Delivery charges apply.";
        if (product) {
            const defaultCost = product.shipping.defaultCost;
            const wilayaCost = entities.wilaya ? (product.shipping.wilayaCosts[entities.wilaya] ?? defaultCost) : defaultCost;
            
            if (product.shipping.type === 'free') {
                costText = "Delivery is FREE.";
            } else {
                costText = entities.wilaya ? `Delivery to ${entities.wilaya} is ${wilayaCost} DA.` : `Delivery starts from ${defaultCost} DA.`;
            }
            return `${costText} Payment is ${product.paymentMethods.join(' or ')}.`;
        }
        return `Delivery is available to ${entities.wilaya || 'all wilayas'}. Costs vary by product.`;

      case 'order_intent':
        if (!product) return "Great! Please let me know which product you want to order.";
        
        if (entities.phone && entities.wilaya) {
           const defaultCost = product.shipping.defaultCost;
           const shipping = entities.wilaya ? (product.shipping.wilayaCosts[entities.wilaya] ?? defaultCost) : defaultCost;
           const total = product.price + shipping;
           return `Order received for ${product.name}! Total: ${total} DA. We will contact you on ${entities.phone}.`;
        }
        
        return isComment 
            ? "Please send us a private message with your Name, Phone, and Address to order."
            : `To order ${product.name}, please provide: Full Name, Address, Wilaya, and Phone Number.`;

      default:
        return "I'm here to help! Ask me about prices or delivery.";
    }
  }
};