import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Trash2, Mail } from 'lucide-react';

const LegalLayout: React.FC<{ title: string; lastUpdated: string; children: React.ReactNode }> = ({ title, lastUpdated, children }) => (
  <div className="min-h-screen bg-[#020617] text-slate-300 font-sans">
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to Home
      </Link>
      
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 md:p-12 shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h1>
        <p className="text-slate-500 text-sm mb-12">Last Updated: {lastUpdated}</p>
        
        <div className="prose prose-invert prose-slate max-w-none space-y-6">
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
  <LegalLayout title="Privacy Policy" lastUpdated="October 24, 2024">
    <section>
      <h3 className="text-xl font-bold text-white mb-3">1. Introduction</h3>
      <p>
        ReplyGenie ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our social commerce automation platform.
        ReplyGenie connects to Facebook and Instagram to help businesses manage their products, orders, and customer interactions efficiently.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-bold text-white mb-3">2. Data We Collect</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Account Information:</strong> Name, email address, and encrypted password.</li>
        <li><strong>Connected Platform Data:</strong> Facebook Page IDs, Instagram Business Account IDs, Page Names, and Access Tokens.</li>
        <li><strong>Business Data:</strong> Product details (images, descriptions, prices) created within our platform.</li>
        <li><strong>Interaction Data:</strong> Comments and Direct Messages from your customers specifically related to your business page, strictly for the purpose of automation.</li>
      </ul>
    </section>

    <section>
      <h3 className="text-xl font-bold text-white mb-3">3. How We Use Your Data</h3>
      <p>We use your data solely to provide the ReplyGenie service:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>To publish products to your connected Facebook and Instagram pages.</li>
        <li>To detect comments and messages on your business posts.</li>
        <li>To send automated replies regarding pricing, delivery, and orders.</li>
        <li>To generate order summaries for your business.</li>
      </ul>
      <p className="mt-2 text-emerald-400">
        We do NOT use your data for advertising, we do NOT sell your data to third parties, and we do NOT access personal profiles or private conversations unrelated to your business page.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-bold text-white mb-3">4. Platform Permissions</h3>
      <p>To function, ReplyGenie requires specific permissions from Facebook/Meta:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><code>pages_manage_posts</code>: To publish your products.</li>
        <li><code>pages_read_engagement</code>: To read comments for auto-replies.</li>
        <li><code>pages_messaging</code>: To send private replies to customers.</li>
      </ul>
    </section>

    <section>
      <h3 className="text-xl font-bold text-white mb-3">5. Data Retention & Deletion</h3>
      <p>
        We retain your data only as long as your account is active. 
        You may request full data deletion at any time by navigating to our <Link to="/data-deletion" className="text-blue-400 hover:underline">Data Deletion</Link> page or contacting support.
        Upon disconnection of a social account, all access tokens are immediately invalidated and removed from our database.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-bold text-white mb-3">6. International Compliance</h3>
      <p>
        <strong>GDPR (Europe):</strong> We process data based on contract necessity. You have the right to access, rectify, and erase your data.
        <br />
        <strong>Algeria (Law 18-07):</strong> We comply with Algerian regulations regarding the protection of individuals in the processing of personal data.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-bold text-white mb-3">7. Contact Us</h3>
      <p>If you have questions about this policy, please contact us at: <a href="mailto:privacy@replygenie.com" className="text-blue-400">privacy@replygenie.com</a></p>
    </section>
  </LegalLayout>
);

export const TermsOfService: React.FC = () => (
  <LegalLayout title="Terms of Service" lastUpdated="October 24, 2024">
    <section>
      <h3 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h3>
      <p>
        By accessing or using ReplyGenie, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-bold text-white mb-3">2. Description of Service</h3>
      <p>
        ReplyGenie is a SaaS platform providing social media automation tools for e-commerce businesses. We enable users to manage inventory and automate responses on Facebook and Instagram.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-bold text-white mb-3">3. User Responsibilities</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li>You must maintain the security of your account credentials.</li>
        <li>You agree not to use the platform for spamming, harassment, or illegal activities.</li>
        <li>You are responsible for all content published through your account.</li>
        <li>You must comply with Meta's Platform Terms and Community Standards.</li>
      </ul>
    </section>

    <section>
      <h3 className="text-xl font-bold text-white mb-3">4. Limitation of Liability</h3>
      <p>
        ReplyGenie is provided "as is." We are not liable for any indirect, incidental, or consequential damages arising from your use of the service, including but not limited to loss of data, loss of profits, or business interruption due to API changes by third-party platforms (Facebook/Instagram).
      </p>
    </section>

    <section>
      <h3 className="text-xl font-bold text-white mb-3">5. Termination</h3>
      <p>
        We reserve the right to terminate or suspend access to our service immediately, without prior notice, for any breach of these Terms. Upon termination, your right to use the service will immediately cease.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-bold text-white mb-3">6. Governing Law</h3>
      <p>
        These terms shall be governed by and construed in accordance with the laws of Algeria, without regard to its conflict of law provisions.
      </p>
    </section>
  </LegalLayout>
);

export const DataDeletion: React.FC = () => (
  <LegalLayout title="Data Deletion Instructions" lastUpdated="October 24, 2024">
    <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl mb-8">
      <h3 className="text-red-400 font-bold flex items-center gap-2 mb-2">
        <Trash2 size={20} /> Important Notice
      </h3>
      <p className="text-slate-300 text-sm">
        Deleting your data is permanent and cannot be undone. All your product configurations, order history, and automation settings will be erased.
      </p>
    </div>

    <section>
      <h3 className="text-xl font-bold text-white mb-3">Method 1: Automatic Disconnection (Recommended)</h3>
      <p className="mb-4">You can remove ReplyGenie's access to your data directly through your account settings:</p>
      <ol className="list-decimal pl-5 space-y-3 text-slate-300">
        <li>Log in to your <strong>ReplyGenie Dashboard</strong>.</li>
        <li>Navigate to the <strong>Connected Accounts</strong> page.</li>
        <li>Click the <strong>Disconnect</strong> button next to each connected Facebook or Instagram account.</li>
        <li>
          Once disconnected, our system automatically invalidates your access tokens. 
          Your account metadata is scheduled for deletion within 30 days if no activity is detected.
        </li>
      </ol>
    </section>

    <section className="mt-8">
      <h3 className="text-xl font-bold text-white mb-3">Method 2: Email Request</h3>
      <p className="mb-4">If you no longer have access to your account or wish for an immediate hard delete:</p>
      <ol className="list-decimal pl-5 space-y-3 text-slate-300">
        <li>Send an email to <a href="mailto:privacy@replygenie.com" className="text-blue-400 font-medium">privacy@replygenie.com</a>.</li>
        <li>Use the subject line: <strong>Data Deletion Request - [Your Username/Email]</strong>.</li>
        <li>Include the URL of the Facebook Page you connected (for verification).</li>
        <li>We will process your request and confirm deletion within 48 hours.</li>
      </ol>
    </section>

    <section className="mt-8">
      <h3 className="text-xl font-bold text-white mb-3">Method 3: Remove via Facebook Settings</h3>
      <p className="mb-4">You can also revoke our access directly from Facebook:</p>
      <ol className="list-decimal pl-5 space-y-3 text-slate-300">
        <li>Go to your Facebook <strong>Settings & Privacy</strong> &gt; <strong>Settings</strong>.</li>
        <li>Select <strong>Business Integrations</strong>.</li>
        <li>Find "ReplyGenie" in the list of active apps.</li>
        <li>Click <strong>Remove</strong>.</li>
        <li>This immediately revokes our API access to your data.</li>
      </ol>
    </section>
  </LegalLayout>
);