import React, { useState } from 'react';
import { Copy, CheckCircle, ShieldCheck, Video, FileText } from 'lucide-react';

// Internal tool for Admin/Developer to prepare for App Review
export const ComplianceKit: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const Section: React.FC<{ title: string; icon: any; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-8">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
          <Icon size={24} />
        </div>
        {title}
      </h2>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );

  const CopyBlock: React.FC<{ label: string; text: string; id: string }> = ({ label, text, id }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
        <button 
          onClick={() => copyToClipboard(text, id)}
          className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg transition-all ${copied === id ? 'bg-green-500/10 text-green-400' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}
        >
          {copied === id ? <CheckCircle size={14} /> : <Copy size={14} />}
          {copied === id ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">
        {text}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 animate-fade-in">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Meta App Review Compliance Kit</h1>
        <p className="text-slate-400">Resources to copy/paste directly into the Meta App Review Dashboard.</p>
      </div>

      <Section title="Permission Justifications" icon={ShieldCheck}>
        <CopyBlock 
          id="p1"
          label="pages_manage_posts"
          text="ReplyGenie is a social commerce tool that allows business owners to manage their product inventory on our dashboard. We need this permission to publish these user-created products (images, descriptions, prices) directly to their connected Facebook Business Page as posts on their behalf. This is a core feature initiated by the user."
        />
        <CopyBlock 
          id="p2"
          label="pages_read_engagement"
          text="Our app provides automated replies to customer inquiries. We need this permission to read comments on the business page's posts in real-time. This allows our system to detect keywords (e.g., 'price', 'delivery') and trigger the appropriate automated response configured by the business owner."
        />
        <CopyBlock 
          id="p3"
          label="pages_messaging"
          text="When a customer comments on a product post, our system is configured to send a private reply containing specific order details or shipping costs that are too complex for a public comment. We need this permission to send these private messages on behalf of the page to the customer."
        />
        <CopyBlock 
          id="p4"
          label="instagram_basic"
          text="Our users often manage both Facebook and Instagram stores. We need this permission to fetch the user's connected Instagram Business accounts so they can be linked to the ReplyGenie dashboard for cross-platform publishing and management."
        />
        <CopyBlock 
          id="p5"
          label="instagram_manage_messages"
          text="Similar to our Facebook functionality, we allow businesses to automate responses to Direct Messages on Instagram. We need this permission to read incoming DMs regarding product inquiries and send automated, structured replies with product information."
        />
      </Section>

      <Section title="App Details" icon={FileText}>
        <CopyBlock 
          id="desc"
          label="Short Description"
          text="ReplyGenie is a social commerce automation platform designed for business page owners. It enables structured product publishing and automated replies based on product delivery settings and inventory data."
        />
        <CopyBlock 
          id="security"
          label="Security Statement"
          text="ReplyGenie adheres to strict security standards. All Meta Platform access tokens are encrypted at rest using AES-256 encryption. Our application enforces HTTPS for all data transmission. We do not sell or share user data with third parties. Access to data is strictly limited to the scope required for automation features (publishing and replying) initiated by the user. Our infrastructure is hosted in a secure, role-based access controlled environment."
        />
      </Section>

      <Section title="Screencast Script" icon={Video}>
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 text-slate-300 space-y-4">
            <p><strong className="text-white">Scene 1: Login</strong><br/>"I am logging into the ReplyGenie dashboard using my credentials."</p>
            <p><strong className="text-white">Scene 2: Connection</strong><br/>"I navigate to 'Connected Accounts'. I click 'Connect Facebook'. You can see the Facebook Login permissions dialog appearing. I grant the requested permissions including 'pages_manage_posts' and 'pages_messaging' to allow the app to function."</p>
            <p><strong className="text-white">Scene 3: Product Creation</strong><br/>"Now I go to the 'Products' page. I create a new product 'Red Sneakers', add a price and image. This data is stored in ReplyGenie."</p>
            <p><strong className="text-white">Scene 4: Publishing (pages_manage_posts)</strong><br/>"I select the product and click 'Publish'. I choose my connected Facebook Page. The app uses 'pages_manage_posts' to push this content to Facebook. Let's verify on the actual Facebook Page... here is the post."</p>
            <p><strong className="text-white">Scene 5: Auto-Reply (pages_read_engagement & pages_messaging)</strong><br/>"Now, as a test user, I comment 'Price?' on this post. ReplyGenie detects this comment using 'pages_read_engagement'. It automatically replies publicly with the price and sends a private message with order details using 'pages_messaging'. Here you can see the automatic response."</p>
        </div>
      </Section>

      <Section title="Business Verification Checklist" icon={CheckCircle}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
                "Verify Domain in Business Manager (DNS/HTML upload)",
                "Ensure Business Name matches Legal Docs exactly",
                "Prepare Utility Bill (Phone/Electricity) < 3 months old",
                "Prepare Certificate of Incorporation / Business Reg",
                "Ensure Website Footer has Privacy Policy & Terms links",
                "Verify Business Email (admin@replygenie.com) is active",
                "Add App ID to Business Manager"
            ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div className="w-5 h-5 rounded-full border-2 border-slate-600"></div>
                    <span className="text-sm text-slate-300">{item}</span>
                </div>
            ))}
        </div>
      </Section>
    </div>
  );
};