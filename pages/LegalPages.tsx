
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Trash2, Mail, Lock, CheckCircle2, AlertTriangle, Facebook, Instagram, ShieldCheck } from 'lucide-react';

// Use standard function declarations for better React 19 compatibility
export function LegalLayout({ title, lastUpdated, children }: { title: string; lastUpdated: string; children: React.ReactNode }) {
  return (
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
}

export function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="February 18, 2026">
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
        <p>
          ReplyGenie ("the Service") is committed to maintaining the highest standards of data privacy and transparency. To provide our automation services, we collect:
        </p>
        <ul className="list-disc pl-5 space-y-3 mt-4">
          <li><strong>Account Identifiers:</strong> Your name and email address provided via Firebase authentication.</li>
          <li><strong>Meta Platform Data:</strong> Facebook Page IDs, Instagram Business Account IDs, and Page metadata.</li>
          <li><strong>Authentication Tokens:</strong> Long-lived Page Access Tokens (PAT). These are stored in an encrypted format using AES-256 and are never exposed to the client-side of the application.</li>
        </ul>
      </section>
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-4">2. Security</h2>
        <p>All data is encrypted. We do not store plain-text passwords or tokens.</p>
      </section>
    </LegalLayout>
  );
}

export function TermsOfService() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="February 18, 2026">
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">1. Use of Service</h2>
        <p>By using ReplyGenie, you agree to comply with Meta's Platform Terms.</p>
      </section>
    </LegalLayout>
  );
}

export function DataDeletion() {
  return (
    <LegalLayout title="Data Deletion" lastUpdated="February 18, 2026">
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">How to Delete Your Data</h2>
        <p>Contact us at support@replygenie.app or use the delete button in your account settings.</p>
      </section>
    </LegalLayout>
  );
}

export function FacebookPermissions() {
  return (
    <LegalLayout title="Permissions Guide" lastUpdated="February 18, 2026">
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Required Permissions</h2>
        <p>We request access to manage posts and read comments on your connected pages.</p>
      </section>
    </LegalLayout>
  );
}

export function SecurityPage() {
  return (
    <LegalLayout title="Security" lastUpdated="February 18, 2026">
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Technical Security</h2>
        <p>We use AES-256-GCM encryption for all sensitive data stored at rest.</p>
      </section>
    </LegalLayout>
  );
}