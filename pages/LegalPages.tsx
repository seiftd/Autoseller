
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Shield, FileText, Trash2, Mail, Lock,
  CheckCircle2, AlertTriangle, Facebook, Instagram,
  ShieldCheck, Globe, Scale, Cookie, UserCheck,
  MessageSquare, Info, ShieldAlert
} from 'lucide-react';

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  description: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, lastUpdated, description, children }: LegalLayoutProps) {
  useEffect(() => {
    document.title = `${title} | ReplyGenie`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
  }, [title, description]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-blue-500/30">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 mb-12 group transition-all duration-300"
        >
          <div className="p-2 rounded-full border border-slate-800 bg-slate-900/50 group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="font-medium">Return to ReplyGenie</span>
        </Link>

        <div className="bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] p-8 md:p-14 shadow-2xl backdrop-blur-xl mb-12">
          <header className="mb-14">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Shield size={14} /> Official Compliance Document
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-slate-400 text-xs font-medium">Active & Valid</p>
              </div>
              <p className="text-slate-500 text-sm">Last Updated: <span className="text-slate-300 font-semibold">{lastUpdated}</span></p>
              <div className="hidden md:block h-4 w-[1px] bg-slate-800"></div>
              <p className="text-slate-500 text-sm">Review Cycle: <span className="text-slate-300 font-semibold">Quarterly</span></p>
            </div>
          </header>

          <div className="prose prose-invert prose-slate max-w-none space-y-12">
            {children}
          </div>

          <footer className="mt-20 pt-10 border-t border-slate-800/60">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 border border-blue-500/20">
                  <ShieldCheck className="text-blue-400" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold">Data Sovereignty</h4>
                  <p className="text-slate-500 text-xs">Your data, your control. Always.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Link to="/contact" className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/30 text-slate-300 text-sm font-semibold hover:bg-slate-700 transition-all">Support Center</Link>
                <Link to="/security" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 shadow-xl shadow-blue-900/20 transition-all">Security Audit</Link>
              </div>
            </div>
          </footer>
        </div>

        <div className="text-center text-slate-500 text-sm flex flex-col items-center gap-4">
          <p>© {new Date().getFullYear()} ReplyGenie. A secure AI automation platform for Meta Business Partners.</p>
          <div className="flex gap-4 grayscale opacity-50">
            <Facebook size={20} />
            <Instagram size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated="February 19, 2026"
      description="Learn how ReplyGenie collects, uses, and protects your data in accordance with Meta Platform Terms and GDPR."
    >
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400"><Info size={20} /></div>
          <h2 className="text-2xl font-bold text-white mb-0 mt-0">Introduction</h2>
        </div>
        <p className="text-slate-400 leading-relaxed">
          ReplyGenie ("we", "us", or "the Service") operates a SaaS platform designed to automate interactions on Facebook Pages and Instagram Business Accounts. We value your privacy and are committed to full transparency regarding data collection, usage, and security.
          This policy details our alignment with <strong>Meta Platform Terms</strong> and <strong>GDPR</strong> regulations.
        </p>
      </section>

      <section className="mt-12">
        <h3 className="text-xl font-bold text-white mb-6">1. Information We Collect</h3>
        <div className="grid gap-6">
          <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <Mail size={18} className="text-blue-400" /> Account Identity
            </h4>
            <p className="text-sm text-slate-400">We store your name, email address, and profile picture (if provided) via Firebase Authentication to manage your account access and billing.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <Facebook size={18} className="text-blue-400" /> Meta Business Data
            </h4>
            <p className="text-sm text-slate-400">When you connect your Facebook or Instagram account, we collect Page IDs, Instagram Business Account IDs, Page names, and metadata required for automation.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <Lock size={18} className="text-blue-400" /> Secure Access Tokens
            </h4>
            <p className="text-sm text-slate-400">We store OAuth 2.0 Access Tokens provided by Meta. These are <strong>AES-256 encrypted</strong> at rest and used solely to perform actions you authorize.</p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h3 className="text-xl font-bold text-white mb-6">2. How We Use Data</h3>
        <ul className="list-none p-0 space-y-4">
          <li className="flex gap-4">
            <div className="mt-1 text-emerald-400"><CheckCircle2 size={18} /></div>
            <div>
              <strong className="text-slate-200">Automation:</strong> Processing comments and messages on your behalf using AI to generate responses.
            </div>
          </li>
          <li className="flex gap-4">
            <div className="mt-1 text-emerald-400"><CheckCircle2 size={18} /></div>
            <div>
              <strong className="text-slate-200">Analytics:</strong> Providing you with performance reports on how your pages are performing.
            </div>
          </li>
          <li className="flex gap-4">
            <div className="mt-1 text-emerald-400"><CheckCircle2 size={18} /></div>
            <div>
              <strong className="text-slate-200">Security:</strong> Monitoring for unauthorized access and ensuring platform integrity.
            </div>
          </li>
        </ul>
      </section>

      <section className="mt-12 p-8 rounded-3xl bg-blue-600/5 border border-blue-500/20">
        <h3 className="text-xl font-bold text-white mb-4">Meta Platform Compliance</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4">
          ReplyGenie strictly adheres to Meta's developer policies. We only access data for which you have granted explicit OAuth consent.
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-400 space-y-2">
          <li>We <strong>never</strong> access your personal Facebook profile data.</li>
          <li>We <strong>never</strong> access friends lists or personal messaging not related to business pages.</li>
          <li>You can revoke our access at any time via Facebook's "Business Integrations" settings.</li>
        </ul>
      </section>

      <section className="mt-12">
        <h3 className="text-xl font-bold text-white mb-4">3. Data Sharing & Security</h3>
        <p className="text-slate-400">
          We do <strong>not sell</strong> user data to third parties. We only share data with essential service providers (e.g., Firebase for hosting, Meta for API functionality, Stripe for billing) as necessary to provide the service.
        </p>
        <p className="text-slate-400 mt-4">
          All data is stored in the <strong>United States</strong> using Google Cloud Infrastructure, protected by enterprise-grade firewalls and encryption protocols.
        </p>
      </section>

      <section className="mt-12">
        <h3 className="text-xl font-bold text-white mb-4">4. Contact Information</h3>
        <p className="text-slate-400">
          For any privacy-related inquiries, please contact our Data Protection Officer at:
          <br /><a href="mailto:replygenie.platform@gmail.com" className="text-blue-400 font-semibold">replygenie.platform@gmail.com</a>
        </p>
      </section>
    </LegalLayout>
  );
}

export function TermsOfService() {
  return (
    <LegalLayout
      title="Terms of Service"
      lastUpdated="February 19, 2026"
      description="Read the terms and conditions for using ReplyGenie's AI social media automation services."
    >
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">1. Acceptance of Terms</h2>
        <p className="text-slate-400 leading-relaxed">
          By accessing or using ReplyGenie, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the platform. These terms incorporate Meta's Platform Terms by reference.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">2. Description of Service</h2>
        <p className="text-slate-400 leading-relaxed">
          ReplyGenie provides an AI-powered automation suite for Facebook Pages and Instagram Business Accounts, allowing users to schedule posts, automate replies to comments, and manage social interactions through Meta's Official APIs.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">3. User Responsibilities</h2>
        <ul className="list-disc pl-5 space-y-4 text-slate-400">
          <li>You must be at least 18 years old to use this service.</li>
          <li>You are responsible for maintaining the security of your account and credentials.</li>
          <li>You must own or have explicit administrative rights to the Facebook Pages and Instagram Accounts you connect.</li>
          <li>You agree not to use the service for spam, harassment, or any illegal activities.</li>
        </ul>
      </section>

      <section className="mt-12 p-8 rounded-3xl bg-amber-500/5 border border-amber-500/20">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="text-amber-500" size={24} /> Acceptable Use Policy
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Automation must comply with Meta's Community Standards. Excessive automation that mimics "bot behavior" in a way that violates platform policies may result in account suspension.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">4. Limitation of Liability</h2>
        <p className="text-slate-400 leading-relaxed">
          ReplyGenie is provided "as is". We are not liable for any account restrictions or bans imposed by Meta as a result of using automation tools, nor for any indirect loss of business resulting from service downtime.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">5. Termination</h2>
        <p className="text-slate-400 leading-relaxed">
          We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including breach of the Terms.
        </p>
      </section>
    </LegalLayout>
  );
}

export function DataDeletion() {
  return (
    <LegalLayout
      title="Data Deletion Instructions"
      lastUpdated="February 19, 2026"
      description="Step-by-step instructions on how to delete your account and associated Meta platform data from ReplyGenie."
    >
      <section>
        <div className="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Our Commitment to Your Data</h2>
          <p className="text-slate-400 leading-relaxed">
            In compliance with <strong>Meta's Data Deletion Policy</strong> and <strong>GDPR Article 17 (Right to Erasure)</strong>, we provide a simple and clear path for users to permanently remove their data from our platform.
          </p>
        </div>

        <h3 className="text-xl font-bold text-white mb-6">Option 1: In-App Deletion (Recommended)</h3>
        <p className="text-slate-400 mb-6">To permanently delete your account and all associated data:</p>
        <ol className="list-decimal pl-5 space-y-4 text-slate-400">
          <li>Log in to your <strong>ReplyGenie Dashboard</strong>.</li>
          <li>Navigate to <strong>Settings</strong> → <strong>Security</strong>.</li>
          <li>Click on the <strong>"Delete My Account"</strong> button at the bottom of the page.</li>
          <li>Confirm your password to authorize the permanent deletion.</li>
        </ol>
      </section>

      <section className="mt-12">
        <h3 className="text-xl font-bold text-white mb-6">Option 2: Email Request</h3>
        <p className="text-slate-400">
          You may also request data deletion by emailing us at <a href="mailto:replygenie.platform@gmail.com" className="text-blue-400 font-semibold">replygenie.platform@gmail.com</a>.
          Please use the subject "Data Deletion Request" and provide the email address associated with your account. We will process your request within 48 hours.
        </p>
      </section>

      <section className="mt-12">
        <h3 className="text-xl font-bold text-white mb-6">Option 3: Revoking Meta Access</h3>
        <p className="text-slate-400 mb-6">To stop ReplyGenie from accessing your Facebook/Instagram data without deleting your account:</p>
        <ol className="list-decimal pl-5 space-y-4 text-slate-400">
          <li>Go to your <strong>Facebook Account Settings & Privacy</strong>.</li>
          <li>Select <strong>Settings</strong> → <strong>Business Integrations</strong>.</li>
          <li>Find <strong>ReplyGenie</strong> and click <strong>Remove</strong>.</li>
        </ol>
      </section>

      <section className="mt-12 p-8 rounded-3xl bg-slate-800/30 border border-slate-700/50">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Trash2 className="text-red-400" size={24} /> What happens when you delete?
        </h3>
        <p className="text-slate-400 text-sm mb-4">When a deletion is processed, the following data is <strong>permanently purged</strong> from our servers:</p>
        <ul className="list-disc pl-5 text-xs text-slate-500 space-y-1">
          <li>Your User Profile (Email, Name, ID)</li>
          <li>All OAuth tokens (Page Access Tokens)</li>
          <li>Automated reply logs and settings</li>
          <li>Subscription and billing history (except where required for tax laws)</li>
          <li>Analysis and cached engagement data</li>
        </ul>
      </section>
    </LegalLayout>
  );
}

export function MetaPermissions() {
  return (
    <LegalLayout
      title="Meta Permissions & Usage"
      lastUpdated="February 19, 2026"
      description="Detailed explanation of the Meta (Facebook) permissions ReplyGenie requires and how we use them."
    >
      <section>
        <p className="text-slate-400 leading-relaxed mb-10">
          ReplyGenie is an officially registered Meta App. To provide automation services, we require specific permissions via the official Facebook OAuth 2.0 flow.
          We adhere to the <strong>Principle of Least Privilege</strong>—we only request what is absolutely necessary for the app to function.
        </p>

        <h2 className="text-2xl font-bold text-white mb-8">Required Scopes & Usage</h2>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-6">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 h-fit"><FileText size={24} /></div>
            <div>
              <h4 className="text-white font-bold mb-2">pages_manage_posts</h4>
              <p className="text-sm text-slate-400">Allows the app to publish posts on your behalf when you schedule them through our dashboard.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-6">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 h-fit"><MessageSquare size={24} /></div>
            <div>
              <h4 className="text-white font-bold mb-2">pages_manage_engagement</h4>
              <p className="text-sm text-slate-400">Crucial for AI automation. Allows the app to reply to, like, and delete comments on your Facebook page.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-6">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 h-fit"><Instagram size={24} /></div>
            <div>
              <h4 className="text-white font-bold mb-2">instagram_basic & instagram_manage_comments</h4>
              <p className="text-sm text-slate-400">Required to manage interactions and view basic profile information for connected Instagram Business accounts.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-6">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 h-fit"><Globe size={24} /></div>
            <div>
              <h4 className="text-white font-bold mb-2">pages_read_engagement</h4>
              <p className="text-sm text-slate-400">Used for analytics. Allows us to show you interaction counts and engagement metrics in your dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14 p-8 rounded-3xl bg-blue-600/5 border border-blue-500/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <ShieldAlert className="text-blue-400" size={24} /> Our Data Access Pledge
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4">
          Meta reviews our platform annually to ensure security and compliance. We <strong>do not</strong>:
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-400 space-y-2">
          <li>Access personal messages (inbox) between individual users.</li>
          <li>Store Page insights data for more than 30 days.</li>
          <li>Access any pages or accounts you haven't explicitly selected in the OAuth picker.</li>
          <li>Post content to your pages without your direct scheduling or automation rules.</li>
        </ul>
      </section>
    </LegalLayout>
  );
}

export function SecurityPage() {
  return (
    <LegalLayout
      title="Security & Infrastructure"
      lastUpdated="February 19, 2026"
      description="Details on our enterprise-grade security, encryption protocols, and infrastructure protection."
    >
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-8 rounded-[2rem] bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">AES-256</h3>
            <p className="text-slate-400 text-sm">Industrial grade encryption for all tokens and sensitive configuration data at rest.</p>
          </div>
          <div className="p-8 rounded-[2rem] bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">OAuth 2.0</h3>
            <p className="text-slate-400 text-sm">Secure authorization flow. We never handle your Facebook password directly.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-8">System Hardening</h2>
        <div className="prose prose-invert prose-slate">
          <p className="text-slate-400 leading-relaxed">
            ReplyGenie is built on top of <strong>Google Cloud Platform (GCP)</strong>, benefiting from world-class physical and network security.
            All traffic between our clients and servers is protected by <strong>TLS 1.3</strong> encryption.
          </p>
          <ul className="text-slate-400 space-y-4">
            <li><strong>Secure Authentication:</strong> Handled by Firebase Auth with support for Multi-Factor Authentication (MFA).</li>
            <li><strong>API Integrity:</strong> All internal API calls are signed and verified using JWT (JSON Web Tokens).</li>
            <li><strong>Token Vaulting:</strong> Meta Access Tokens are stored in a dedicated, isolated database partition.</li>
            <li><strong>Continuous Monitoring:</strong> Real-time logging and anomaly detection for all automated actions.</li>
          </ul>
        </div>
      </section>

      <section className="mt-12 p-8 rounded-3xl bg-slate-900 border border-slate-800">
        <h3 className="text-xl font-bold text-white mb-4">Compliance Standards</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-xl bg-slate-800/50">
            <div className="text-blue-400 font-bold text-lg mb-1">SOC 2</div>
            <div className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">Ready</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-slate-800/50">
            <div className="text-emerald-400 font-bold text-lg mb-1">GDPR</div>
            <div className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">Compliant</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-slate-800/50">
            <div className="text-pink-400 font-bold text-lg mb-1">PCI</div>
            <div className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">Compliant</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-slate-800/50">
            <div className="text-white font-bold text-lg mb-1">Meta</div>
            <div className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">Verified</div>
          </div>
        </div>
      </section>
    </LegalLayout>
  );
}

export function ContactPage() {
  return (
    <LegalLayout
      title="Contact & Support"
      lastUpdated="February 19, 2026"
      description="Get in touch with the ReplyGenie support and legal teams for inquiries and assistance."
    >
      <section>
        <p className="text-slate-400 leading-relaxed mb-12">
          Our team is here to assist you with technical issues, billing questions, or legal compliance inquiries.
          We typically respond to most requests within <strong>24 to 48 hours</strong>.
        </p>

        <div className="grid gap-6">
          <div className="p-8 rounded-[2.5rem] bg-slate-900/50 border border-slate-800 flex flex-col md:flex-row items-center gap-8">
            <div className="p-5 rounded-3xl bg-blue-600/10 text-blue-400"><Mail size={32} /></div>
            <div className="text-center md:text-left">
              <h4 className="text-xl font-bold text-white mb-1">Customer Support</h4>
              <p className="text-slate-400 text-sm mb-3">General inquiries, technical bugs, and product feedback.</p>
              <a href="mailto:replygenie.platform@gmail.com" className="text-blue-400 font-bold text-lg">replygenie.platform@gmail.com</a>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-slate-900/50 border border-slate-800 flex flex-col md:flex-row items-center gap-8">
            <div className="p-5 rounded-3xl bg-indigo-600/10 text-indigo-400"><Scale size={32} /></div>
            <div className="text-center md:text-left">
              <h4 className="text-xl font-bold text-white mb-1">Legal & Compliance</h4>
              <p className="text-slate-400 text-sm mb-3">GDPR requests, data deletion, and partnership inquiries.</p>
              <a href="mailto:replygenie.platform@gmail.com" className="text-indigo-400 font-bold text-lg">replygenie.platform@gmail.com</a>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <h3 className="text-xl font-bold text-white mb-6">Business Information</h3>
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-slate-500 uppercase text-xs font-bold tracking-widest mb-1">Operating Hours</p>
              <p className="text-slate-300">Mon - Fri: 9:00 AM - 6:00 PM EST</p>
            </div>
            <div>
              <p className="text-slate-500 uppercase text-xs font-bold tracking-widest mb-1">Response Guarantee</p>
              <p className="text-slate-300">48-hour response for all verified users</p>
            </div>
          </div>
        </div>
      </section>
    </LegalLayout>
  );
}

export function CookiesPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      lastUpdated="February 19, 2026"
      description="Information about how ReplyGenie uses cookies to enhance your user experience."
    >
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-full bg-amber-500/10 text-amber-500"><Cookie size={24} /></div>
          <h2 className="text-2xl font-bold text-white mb-0 mt-0">Understanding Our Cookies</h2>
        </div>
        <p className="text-slate-400 leading-relaxed mb-10">
          ReplyGenie uses cookies and similar technologies to ensure our website functions correctly, to understand how visitors use our platform, and to provide personalized content and advertising.
        </p>

        <h3 className="text-xl font-bold text-white mb-6">1. Essential Cookies</h3>
        <p className="text-slate-400 mb-6 font-medium">Necessary for the platform to function. They cannot be switched off.</p>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-12">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-800/50">
                <th className="px-6 py-4 text-white font-bold">Purpose</th>
                <th className="px-6 py-4 text-white font-bold">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="px-6 py-4 text-slate-300 font-medium">Authentication Session</td>
                <td className="px-6 py-4 text-slate-400">Firebase (First Party)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-slate-300 font-medium">CSRF Protection</td>
                <td className="px-6 py-4 text-slate-400">Internal (First Party)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-bold text-white mb-6">2. Analytics & Performance</h3>
        <p className="text-slate-400 mb-10">
          These cookies help us measure site performance and optimize the user experience. We use tools like <strong>Google Analytics</strong> and <strong>Vercel Speed Insights</strong> to collect anonymized data.
        </p>

        <h3 className="text-xl font-bold text-white mb-6">How to Control Cookies</h3>
        <p className="text-slate-400">
          You can set your browser to block or alert you about these cookies, but some parts of the site will not then work. You can also clear cookies at any time from your browser settings.
        </p>
      </section>
    </LegalLayout>
  );
}

export function GDPRPage() {
  return (
    <LegalLayout
      title="GDPR & User Rights"
      lastUpdated="February 19, 2026"
      description="Details about your rights under the General Data Protection Regulation (GDPR)."
    >
      <section>
        <div className="p-10 rounded-[2.5rem] bg-gradient-to-r from-emerald-600/10 to-indigo-600/10 border border-emerald-500/20 mb-14 text-center">
          <UserCheck className="text-emerald-400 mx-auto mb-6" size={48} />
          <h2 className="text-2xl font-bold text-white mb-4 mt-0">Your Privacy, Protected by Law</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            The General Data Protection Regulation (GDPR) gives you specific rights regarding your personal data.
            ReplyGenie ensures these rights are fully supported for all users worldwide.
          </p>
        </div>

        <div className="grid gap-8">
          <div className="flex gap-6">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 flex-shrink-0">01</div>
            <div>
              <h4 className="text-white font-bold mb-2">Right to Access</h4>
              <p className="text-sm text-slate-400 leading-relaxed">You have the right to request a copy of the personal data we hold about you at any time.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 flex-shrink-0">02</div>
            <div>
              <h4 className="text-white font-bold mb-2">Right to Rectification</h4>
              <p className="text-sm text-slate-400 leading-relaxed">You have the right to ask us to correct or complete information you think is inaccurate or incomplete.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 flex-shrink-0">03</div>
            <div>
              <h4 className="text-white font-bold mb-2">Right to Erasure</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Under certain conditions, you have the right to request that we erase your personal data (The "Right to be Forgotten").</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 flex-shrink-0">04</div>
            <div>
              <h4 className="text-white font-bold mb-2">Right to Data Portability</h4>
              <p className="text-sm text-slate-400 leading-relaxed">You have the right to request that we transfer the data that we have collected to another organization, or directly to you.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 p-10 rounded-3xl bg-slate-900 border border-slate-800 text-center">
        <h3 className="text-xl font-bold text-white mb-4">Exercising Your Rights</h3>
        <p className="text-slate-400 text-sm mb-8 leading-loose">
          To exercise any of these rights, please contact our Data Protection Officer providing your account details.
          We are legally required to respond within 30 days, although we aim to respond much sooner.
        </p>
        <a href="mailto:replygenie.platform@gmail.com" className="inline-block px-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20">
          Request GDPR Data Export
        </a>
      </section>
    </LegalLayout>
  );
}