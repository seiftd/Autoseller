
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Trash2, Mail, Lock, CheckCircle2, CircleAlert, Facebook, Instagram } from 'lucide-react';

const LegalLayout: React.FC<{ title: string; lastUpdated: string; children: React.ReactNode }> = ({ title, lastUpdated, children }) => (
  <div className="min-h-screen bg-[#020617] text-slate-300 font-sans">
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-sm">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">{title}</h1>
        <div className="flex items-center gap-4 mb-12">
          <p className="text-slate-500 text-sm">Last Updated: {lastUpdated}</p>
          <div className="h-4 w-[1px] bg-slate-800"></div>
          <p className="text-slate-500 text-sm">Version 2.1.0</p>
        </div>

        <div className="prose prose-invert prose-slate max-w-none space-y-10">
          {children}
        </div>
      </div>

      <div className="mt-12 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} ReplyGenie. All rights reserved.
      </div>
    </div>
  </div>
);

export const PrivacyPolicy: React.FC = () => (
  <LegalLayout title="Privacy Policy" lastUpdated="February 18, 2026">
    <section>
      <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
      <p>
        ReplyGenie ("the Service") is committed to maintaining the highest standards of data privacy and transparency. To provide our automation services, we collect:
      </p>
      <ul className="list-disc pl-5 space-y-3 mt-4">
        <li><strong>Account Identifiers:</strong> Your name and email address provided via Clerk authentication.</li>
        <li><strong>Meta Platform Data:</strong> Facebook Page IDs, Instagram Business Account IDs, and Page metadata.</li>
        <li><strong>Authentication Tokens:</strong> Long-lived Page Access Tokens (PAT). These are stored in an encrypted format using AES-256 and are never exposed to the client-side of the application.</li>
        <li><strong>Content Data:</strong> Comment text and Direct Message (DM) content from your connected business pages, strictly for the purpose of facilitating AI-driven auto-replies.</li>
      </ul>
    </section>

    <section>
      <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Facebook/Instagram Data</h2>
      <p>Your data is processed exclusively to deliver product automation features:</p>
      <ul className="list-disc pl-5 space-y-3 mt-4 text-slate-400">
        <li>Detecting customer inquiries on your connected business pages.</li>
        <li>Generating and publishing automated replies to pricing and delivery questions.</li>
        <li>Publishing product catalogs to your Facebook feed and Instagram profile.</li>
        <li>Monitoring the health of your webhook connections to ensure reliability.</li>
      </ul>
      <p className="mt-6 p-4 bg-blue-900/20 border border-blue-800 rounded-xl text-blue-400 text-sm">
        <strong>Important:</strong> ReplyGenie DOES NOT access your personal Facebook profile, private friends lists, or private conversations outside of the specific business pages you explicitly connect.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-bold text-white mb-4">3. Data Security & Encryption</h2>
      <p>
        Security is at the core of our architecture. All sensitive data, including Meta Access Tokens, are encrypted using **AES-256-GCM** before being stored in our database. Encryption keys are managed securely on our backend servers (Netlify Functions environment) and are never bundled in the frontend application build.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-bold text-white mb-4">4. GDPR Compliance & User Rights</h2>
      <p>Under GDPR and international data protection laws, you retain full control over your data:</p>
      <ul className="list-disc pl-5 space-y-3 mt-4">
        <li><strong>Right to Access:</strong> Viewing your connected account metadata in the dashboard.</li>
        <li><strong>Right to Rectify:</strong> Updating your business settings and product data.</li>
        <li><strong>Right to Erasure:</strong> The "Right to be Forgotten." You may delete your account and all associated data at any time.</li>
      </ul>
    </section>

    <section>
      <h2 className="text-2xl font-bold text-white mb-4">5. Data Retention Policy</h2>
      <p>
        We retain your business data for the duration of your active subscription. If an account is disconnected or deleted, all associated access tokens and cached interaction data are wiped from our production database within 7 days.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-bold text-white mb-4">6. Contact & Support</h2>
      <p>For any privacy-related inquiries, please contact our Data Protection Officer at:</p>
      <div className="mt-4 flex items-center gap-3 text-blue-400">
        <Mail size={18} />
        <a href="mailto:support@replygenie.app">support@replygenie.app</a>
      </div>
    </section>
  </LegalLayout>
);

export const TermsOfService: React.FC = () => (
  <LegalLayout title="Terms of Service" lastUpdated="February 18, 2026">
    <section>
      <h2 className="text-2xl font-bold text-white mb-4">1. Service Description</h2>
      <p>
        ReplyGenie provides a Software-as-a-Service (SaaS) platform for automated social commerce, including comment auto-replies, post scheduling, and inventory synchronization with Meta platforms.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-bold text-white mb-4">2. User Responsibilities</h2>
      <p>Users must comply with Meta's Platform Terms and Community Standards. You are responsible for ensuring that your automated replies do not violate spam policies or local advertising laws.</p>
    </section>

    <section>
      <h2 className="text-2xl font-bold text-white mb-4">3. Billing & Subscriptions</h2>
      <p>
        Fees are billed on a monthly or annual basis.
        <strong>Business Plan Limit:</strong> The Business Plan includes team collaboration for a maximum of 5 members.
        <strong>Add-ons:</strong> Specialized AI modules or additional page slots may incur add-on pricing as detailed in our pricing directory.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-bold text-white mb-4">4. Account Termination</h2>
      <p>
        We reserve the right to suspend accounts that engage in fraudulent behavior or repeated violations of platform API limits. You may terminate your subscription at any time through the billing dashboard.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-bold text-white mb-4">5. Liability & Governing Law</h2>
      <p>
        ReplyGenie is not liable for business interruptions caused by Meta API outages. These terms are governed by the laws of Algeria.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-bold text-white mb-4">6. Contact Information</h2>
      <p>
        General inquiries: <a href="mailto:support@replygenie.app" className="text-blue-400">support@replygenie.app</a>
      </p>
    </section>
  </LegalLayout>
);

export const DataDeletion: React.FC = () => (
  <LegalLayout title="User Data Deletion Instructions" lastUpdated="February 18, 2026">
    <div className="bg-blue-500/10 border border-blue-500/20 p-8 rounded-3xl mb-12">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
          <Trash2 size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-2">How to Request Data Deletion</h2>
          <p className="text-slate-400 leading-relaxed">
            Meta requires that apps provide a clear way for users to request data deletion. At ReplyGenie, we offer multiple transparent methods to purge your data from our systems.
          </p>
        </div>
      </div>
    </div>

    <section>
      <h2 className="text-2xl font-bold text-white mb-6">Option 1: In-App Dashboard</h2>
      <p>The fastest way to delete your data is directly from your account:</p>
      <div className="mt-6 space-y-4">
        <div className="flex gap-4 items-start">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">1</div>
          <p>Log in to your <strong>ReplyGenie Dashboard</strong>.</p>
        </div>
        <div className="flex gap-4 items-start">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">2</div>
          <p>Navigate to <strong>Settings &gt; Account</strong>.</p>
        </div>
        <div className="flex gap-4 items-start">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">3</div>
          <p>Click "Delete My Account". This will trigger a complete wipe of all product data, order history, and social tokens.</p>
        </div>
      </div>
    </section>

    <section className="mt-12">
      <h2 className="text-2xl font-bold text-white mb-6">Option 2: Email Support Request</h2>
      <p>
        If you prefer manual deletion, please contact our support team. We will process your request within <strong>7 business days</strong>.
      </p>
      <div className="mt-6 p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        <p className="text-white font-medium mb-2">Send Request to:</p>
        <div className="flex items-center gap-3 text-blue-400 mb-4">
          <Mail size={18} />
          <a href="mailto:support@replygenie.app">support@replygenie.app</a>
        </div>
        <p className="text-sm text-slate-500 italic">Please include your account email address and "Data Deletion Request" in the subject line.</p>
      </div>
    </section>

    <section className="mt-12">
      <h2 className="text-2xl font-bold text-white mb-6">What Data is Deleted?</h2>
      <ul className="grid md:grid-cols-2 gap-4">
        <li className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
          <CheckCircle2 size={18} className="text-emerald-500" /> All OAuth Access Tokens
        </li>
        <li className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
          <CheckCircle2 size={18} className="text-emerald-500" /> Product & Catalog Data
        </li>
        <li className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
          <CheckCircle2 size={18} className="text-emerald-500" /> Order Summaries
        </li>
        <li className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
          <CheckCircle2 size={18} className="text-emerald-500" /> Team Member Records
        </li>
      </ul>
      <p className="mt-8 text-slate-500 text-sm">
        Once deletion is processed, you will received a <strong>Confirmation Email</strong>. After this, your data is irrecoverable.
      </p>
    </section>
  </LegalLayout>
);

export const FacebookPermissions: React.FC = () => (
  <LegalLayout title="Facebook Permissions Guide" lastUpdated="February 18, 2026">
    <p className="text-lg leading-relaxed mb-8">
      Transparency is our priority. To provide the automation features you need, ReplyGenie requests specific permissions from your Meta account. Here is exactly why we need each one.
    </p>

    <div className="space-y-6">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500/30 transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <Facebook size={20} />
          </div>
          <h3 className="text-xl font-bold text-white">pages_manage_posts</h3>
        </div>
        <p className="text-slate-400">Allows us to publish your product photos and descriptions directly to your Facebook Page when you click "Publish" in our dashboard.</p>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500/30 transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <Facebook size={20} />
          </div>
          <h3 className="text-xl font-bold text-white">pages_manage_engagement</h3>
        </div>
        <p className="text-slate-400">Essential for our AI to reply to comments on your posts. This permission allows the app to post replies on your behalf.</p>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500/30 transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <Facebook size={20} />
          </div>
          <h3 className="text-xl font-bold text-white">pages_read_engagement</h3>
        </div>
        <p className="text-slate-400">Allows us to read incoming comments. Without this, our AI cannot know when a customer has asked for a price or delivery info.</p>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-pink-500/30 transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
            <Instagram size={20} />
          </div>
          <h3 className="text-xl font-bold text-white">instagram_content_publish</h3>
        </div>
        <p className="text-slate-400">Enables the publishing of product posts and carousels directly to your linked Instagram Business profile.</p>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-pink-500/30 transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
            <Instagram size={20} />
          </div>
          <h3 className="text-xl font-bold text-white">instagram_manage_comments</h3>
        </div>
        <p className="text-slate-400">Allows our AI to manage and reply to comments on your Instagram media posts.</p>
      </div>
    </div>

    <div className="mt-12 p-8 bg-blue-900/20 border border-blue-500/20 rounded-3xl">
      <div className="flex items-center gap-3 text-white font-bold mb-4">
        <Shield className="text-blue-400" /> Your Safety is Guaranteed
      </div>
      <p className="text-slate-300">
        We do NOT have permission to access your personal messages (outside business pages), your friend lists, or your private photos. We only interact with the business assets you explicitly select during the connection process.
      </p>
    </div>
  </LegalLayout>
);

export const SecurityPage: React.FC = () => (
  <LegalLayout title="Security & Architecture" lastUpdated="February 18, 2026">
    <div className="grid md:grid-cols-2 gap-8">
      <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl">
        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6">
          <Lock size={24} />
        </div>
        <h3 className="text-xl font-bold text-white mb-4">Server-Side OAuth</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          Our authentication flow is entirely backend-based. We do not store or process authentication secrets in the user's browser, preventing cross-site scripting (XSS) token theft.
        </p>
      </div>

      <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl">
        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-6">
          <Shield size={24} />
        </div>
        <h3 className="text-xl font-bold text-white mb-4">AES-256 Encryption</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          Access tokens are encrypted at rest using AES-256-GCM. Decryption only occurs within our isolated serverless execution environments when an API call is required.
        </p>
      </div>

      <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl">
        <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-6">
          <CheckCircle2 size={24} />
        </div>
        <h3 className="text-xl font-bold text-white mb-4">Webhook Verification</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          Every incoming webhook from Meta is verified using HMAC SHA-256 signatures and timing-safe equal comparisons to ensure requests genuinely originate from Facebook.
        </p>
      </div>

      <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl">
        <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-400 mb-6">
          <CircleAlert size={24} />
        </div>
        <h3 className="text-xl font-bold text-white mb-4">Tenant Isolation</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          We use strictly enforced multi-tenant isolation. Your business data and social accounts are isolated from other users at the database level and through session verification.
        </p>
      </div>
    </div>

    <div className="mt-12 p-8 border border-slate-800 rounded-3xl text-center">
      <h3 className="text-xl font-bold text-white mb-4">Meta Verified Platform</h3>
      <p className="text-slate-400 mb-6">
        ReplyGenie undergoes regular security audits to maintain its status as a verified Meta Business Integration.
      </p>
      <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600/10 text-blue-400 rounded-full text-sm font-bold border border-blue-600/20">
        <Lock size={14} /> SOC2-Type Principles Applied
      </div>
    </div>
  </LegalLayout>
);