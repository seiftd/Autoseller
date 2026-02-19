import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot, ShoppingBag, Zap, TrendingUp, Globe, Check,
  ArrowRight, MessageCircle, BarChart3, Shield, Truck,
  Layers, ChevronRight, Play, CheckCircle2, ArrowLeft,
  Plus
} from 'lucide-react';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Language } from '../types';
import { TEXTS } from '../constants';

export const Landing: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');

  // Local texts for Landing specific content not in global constants
  const content = {
    navFeatures: { en: "Features", fr: "Fonctionnalités", ar: "المميزات" },
    navPricing: { en: "Pricing", fr: "Tarifs", ar: "الأسعار" },
    navLogin: { en: "Login", fr: "Connexion", ar: "دخول" },
    ctaConnect: { en: "Connect Your Business", fr: "Connecter mon Business", ar: "اربط حسابك التجاري" },
    ctaDemo: { en: "See How It Works", fr: "Voir la Démo", ar: "شاهد طريقة العمل" },
    stepsTitle: { en: "How It Works", fr: "Comment ça marche", ar: "كيف يعمل النظام" },
    stepsSub: { en: "Five simple steps to automate your social commerce.", fr: "Cinq étapes simples pour automatiser.", ar: "خمس خطوات بسيطة لأتمتة تجارتك الإلكترونية." },
    pricingTitle: { en: "Simple Pricing", fr: "Tarifs Simples", ar: "أسعار بسيطة وشفافة" },
    pricingSub: { en: "Start free, upgrade as you grow.", fr: "Commencez gratuit, évoluez selon vos besoins.", ar: "ابدأ مجاناً، وقم بالترقية مع نمو عملك." },
    footerRights: { en: "All rights reserved.", fr: "Tous droits réservés.", ar: "جميع الحقوق محفوظة." },

    // Steps
    step1: { title: { en: "Connect", ar: "ربط الحسابات" }, desc: { en: "Link Facebook & Instagram", ar: "اربط فيسبوك وإنستغرام" } },
    step2: { title: { en: "Configure", ar: "إعداد المتجر" }, desc: { en: "Add products & delivery settings", ar: "أضف المنتجات وإعدادات التوصيل" } },
    step3: { title: { en: "Publish", ar: "النشر التلقائي" }, desc: { en: "Auto-post across all platforms", ar: "نشر تلقائي عبر جميع المنصات" } },
    step4: { title: { en: "Auto-Reply", ar: "الرد الذكي" }, desc: { en: "AI answers comments & DMs", ar: "الذكاء الاصطناعي يرد على التعليقات" } },
    step5: { title: { en: "Collect", ar: "جمع الطلبات" }, desc: { en: "Get structured orders instantly", ar: "استلام طلبات منظمة فورياً" } },

    // Showcase Bullets
    showcasePoints: {
      en: ["Auto-publish products", "Smart replies by region", "Auto-calculate shipping", "Organized order collection"],
      fr: ["Publication automatique", "Réponses intelligentes par région", "Calcul auto livraison", "Collection de commandes"],
      ar: ["نشر تلقائي للمنتجات", "ردود ذكية حسب الولاية", "حساب تكلفة الشحن تلقائيًا", "جمع الطلبات بشكل منظم"]
    }
  };

  const isRTL = lang === 'ar';
  const t = TEXTS;

  return (
    <div className={`min-h-screen bg-[#020617] text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-blue-500/30 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>

      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse delay-700" />
        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 w-[60%] h-[40%] bg-cyan-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
              <Bot className="text-white w-6 h-6" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ReplyGenie
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">{content.navFeatures[lang]}</a>
            <a href="#pricing" className="hover:text-white transition-colors">{content.navPricing[lang]}</a>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher current={lang} onChange={setLang} />
            <Link
              to="/sign-in"
              className="hidden md:flex px-5 py-2.5 rounded-full border border-slate-700 hover:border-slate-500 hover:bg-slate-800 transition-all text-sm font-medium"
            >
              {content.navLogin[lang]}
            </Link>
            <Link
              to="/sign-in"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold shadow-lg shadow-blue-900/20 transition-all hover:scale-105 text-sm"
            >
              {content.ctaConnect[lang]}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/20 border border-blue-500/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            v2.0 Now Available
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-tight">
            <span className="text-white">{t.heroTitle[lang]}</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              {t.heroHighlight[lang]}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.heroSubtitle[lang]}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              to="/sign-in"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-full font-bold shadow-xl hover:shadow-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2 group"
            >
              {content.ctaConnect[lang]}
              {isRTL ? (
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              ) : (
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              )}
            </Link>
            <a href="#demo" className="w-full sm:w-auto px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-white border border-slate-700 rounded-full font-semibold transition-all backdrop-blur-sm flex items-center justify-center gap-2">
              <Play className="w-4 h-4 fill-current" />
              {content.ctaDemo[lang]}
            </a>
          </div>
        </div>
      </section>

      {/* NEW: Professional Dashboard Showcase Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Background Gradient for Section */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-blue-900/10 to-[#020617]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {t.showcaseSectionTitle[lang]}
            </h2>
            <div className="h-1 w-24 bg-blue-500 mx-auto rounded-full"></div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 flex flex-col-reverse md:flex-row items-center gap-12 shadow-2xl relative group hover:border-blue-500/20 transition-all duration-500">

            {/* Glowing Particles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-blue-500/30 transition-all" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-purple-500/30 transition-all" />

            {/* Left Side (Text) */}
            <div className="flex-1 space-y-8 text-center md:text-start relative z-10">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  {t.showcaseHeadline[lang]}
                </h3>
                <p className="text-slate-300 text-lg leading-relaxed opacity-90">
                  {t.showcaseBody[lang]}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.showcasePoints[lang].map((point, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-white/5">
                    <div className="min-w-6 min-h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 size={14} className="text-green-400" />
                    </div>
                    <span className="text-slate-200 font-medium text-sm">{point}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 hover:scale-105 transition-all duration-300 group/btn"
                >
                  {t.showcaseBtn[lang]}
                  {isRTL ? (
                    <ArrowLeft className="w-5 h-5 group-hover/btn:-translate-x-1 transition-transform" />
                  ) : (
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  )}
                </Link>
              </div>
            </div>

            {/* Right Side (Image) */}
            <div className="flex-1 w-full relative perspective-1000">
              <div className="relative z-10 transform md:rotate-y-[-10deg] md:group-hover:rotate-y-0 transition-transform duration-700 ease-out">
                {/* Using a placeholder that represents the Algerian Dashboard Map concept */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl animate-float">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80"
                    alt="ReplyGenie Dashboard Algeria"
                    className="w-full h-auto object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
                  />
                  {/* Overlay to simulate the specific UI provided in prompt */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>

                  {/* Floating Card Mockup - Simulated */}
                  <div className={`absolute top-10 ${isRTL ? 'left-4' : 'right-4'} bg-slate-800/90 backdrop-blur-md p-4 rounded-xl border border-slate-600 shadow-xl max-w-[200px]`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-xs text-green-400 font-bold">New Order</span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 bg-slate-600 rounded w-3/4"></div>
                      <div className="h-2 bg-slate-600 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements behind image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/10 blur-[80px] -z-10 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (Timeline) */}
      <section className="py-24 relative bg-slate-900/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{content.stepsTitle[lang]}</h2>
            <p className="text-slate-400">{content.stepsSub[lang]}</p>
          </div>

          <div className="relative">
            {/* Center Line */}
            <div className={`absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-transparent md:transform md:-translate-x-1/2 ${isRTL ? 'right-4 md:right-1/2 left-auto' : ''}`} />

            {/* Steps */}
            {[
              { icon: MessageCircle, title: content.step1.title[lang === 'fr' ? 'fr' : lang === 'ar' ? 'ar' : 'en'], desc: content.step1.desc[lang === 'fr' ? 'fr' : lang === 'ar' ? 'ar' : 'en'] },
              { icon: Truck, title: content.step2.title[lang === 'fr' ? 'fr' : lang === 'ar' ? 'ar' : 'en'], desc: content.step2.desc[lang === 'fr' ? 'fr' : lang === 'ar' ? 'ar' : 'en'] },
              { icon: Globe, title: content.step3.title[lang === 'fr' ? 'fr' : lang === 'ar' ? 'ar' : 'en'], desc: content.step3.desc[lang === 'fr' ? 'fr' : lang === 'ar' ? 'ar' : 'en'] },
              { icon: Bot, title: content.step4.title[lang === 'fr' ? 'fr' : lang === 'ar' ? 'ar' : 'en'], desc: content.step4.desc[lang === 'fr' ? 'fr' : lang === 'ar' ? 'ar' : 'en'] },
              { icon: ShoppingBag, title: content.step5.title[lang === 'fr' ? 'fr' : lang === 'ar' ? 'ar' : 'en'], desc: content.step5.desc[lang === 'fr' ? 'fr' : lang === 'ar' ? 'ar' : 'en'] },
            ].map((step, idx) => (
              <div key={idx} className={`relative flex items-center gap-8 mb-16 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="hidden md:block flex-1" />

                {/* Timeline Dot */}
                <div className={`absolute left-4 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-[#020617] border-4 border-blue-500 z-10 ${isRTL ? 'right-4 md:right-1/2 translate-x-1/2 left-auto' : ''}`} />

                <div className={`flex-1 pl-16 md:pl-0 ${isRTL ? 'pr-16 md:pr-0 pl-0' : ''}`}>
                  <div className={`p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-blue-500/50 transition-colors backdrop-blur-sm md:max-w-md ${idx % 2 === 0 ? isRTL ? 'mr-auto' : 'mr-auto' : isRTL ? 'ml-auto' : 'ml-auto'}`}>
                    <div className="w-12 h-12 rounded-lg bg-blue-900/20 flex items-center justify-center mb-4 text-blue-400">
                      <step.icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      <span className="text-blue-500 mr-2">0{idx + 1}.</span>
                      {step.title}
                    </h3>
                    <p className="text-slate-400">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Layers}
              title="Multi-Channel"
              desc="Control Facebook Page, Instagram Business, and WhatsApp from a single dashboard."
            />
            <FeatureCard
              icon={Globe}
              title="Global Selling"
              desc="Multi-country support (DZ, FR, MA, TN) with automatic currency conversion."
            />
            <FeatureCard
              icon={Bot}
              title="Smart AI Agent"
              desc="Understands dialects, context, and intent to provide human-like responses."
            />
            <FeatureCard
              icon={Truck}
              title="Dynamic Delivery"
              desc="Calculates shipping costs based on customer region (Wilaya/State) automatically."
            />
            <FeatureCard
              icon={ShoppingBag}
              title="Order Parsing"
              desc="Extracts Name, Address, and Phone from messy chat messages into clean data."
            />
            <FeatureCard
              icon={Shield}
              title="Secure & Safe"
              desc="Uses official Meta APIs. We never ask for your personal password."
            />
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-24 bg-gradient-to-b from-slate-900/50 to-[#020617] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold mb-6 border border-green-500/20">
              LIVE DEMO
            </div>
            <h2 className="text-4xl font-bold mb-6">See the magic in action.</h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              When a customer comments "Price?" on your post, ReplyGenie replies instantly in DM with product details, images, and shipping costs.
            </p>
            <ul className="space-y-4">
              {[
                "Instant response time (< 2 seconds)",
                "Increases conversion by 40%",
                "Works while you sleep"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Check size={14} className="text-blue-400" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            {/* Chat UI Simulation */}
            <div className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl max-w-md mx-auto transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="bg-[#0084FF] p-4 text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot size={24} />
                </div>
                <div>
                  <div className="font-bold">ReplyGenie Bot</div>
                  <div className="text-xs opacity-80">Typically replies instantly</div>
                </div>
              </div>
              <div className="p-6 bg-slate-100 h-[400px] flex flex-col gap-4 overflow-hidden relative">
                <div className={`self-end bg-[#0084FF] text-white p-3 rounded-2xl rounded-tr-none max-w-[80%] text-sm shadow-sm ${isRTL ? 'self-start rounded-tr-2xl rounded-tl-none' : ''}`}>
                  Prix livraison Alger svp?
                </div>
                <div className={`self-start bg-white text-slate-800 p-4 rounded-2xl rounded-tl-none max-w-[90%] text-sm shadow-sm space-y-2 animate-fade-in-up delay-300 ${isRTL ? 'self-end rounded-tl-2xl rounded-tr-none' : ''}`}>
                  <p className="font-bold text-[#0084FF]">Smart Watch Ultra</p>
                  <div className="h-32 bg-slate-200 rounded-lg mb-2 bg-[url('https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=300&q=80')] bg-cover bg-center"></div>
                  <p>The price is <strong>4,500 DZD</strong>.</p>
                  <p>Delivery to <strong>Algiers</strong> is 400 DZD via Yalidine.</p>
                  <p className="text-xs text-slate-500 mt-2">Reply with Name & Phone to order!</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-100 to-transparent pointer-events-none" />
              </div>
              <div className="p-4 bg-white border-t border-slate-200">
                <div className="h-10 bg-slate-100 rounded-full w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">{content.pricingTitle[lang]}</h2>
            <p className="text-slate-400">{content.pricingSub[lang]}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <PricingCard
              title="Free"
              price="0"
              features={[
                "1 Social Account",
                "50 Auto Replies/mo",
                "Basic Publishing",
                "No Team",
                "No Recurring Posts"
              ]}
            />
            <PricingCard
              title="Pro"
              price="29"
              featured
              badge="Customizable with Add-ons"
              features={[
                "3 Social Accounts",
                "Unlimited Replies",
                "Scheduling",
                "Add-On Marketplace Available",
                "Advanced Analytics Option",
                "No Team"
              ]}
            />
            <PricingCard
              title="Business"
              price="99"
              features={[
                "10 Social Accounts",
                "Unlimited Everything",
                "Team (Up to 5 members)",
                "API Access",
                "Dedicated Manager",
                "All Add-ons Included"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl font-bold mb-8 text-white">
            {lang === 'ar' ? "حوّل تواصلك الاجتماعي إلى" : "Turn Your Social Media Into a"}
            <span className="text-blue-500 mx-2">
              {lang === 'ar' ? "آلة مبيعات" : "Sales Machine"}
            </span>
          </h2>
          <p className="text-xl text-slate-400 mb-12">
            {lang === 'ar' ? "انضم إلى أكثر من 10,000 تاجر يقومون بأتمتة أعمالهم اليوم." : "Join 10,000+ merchants automating their business today. No credit card required."}
          </p>
          <Link
            to="/login"
            className="px-12 py-5 bg-white text-slate-900 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-blue-50 transition-all inline-flex items-center gap-3"
          >
            {content.ctaConnect[lang]} <Zap fill="currentColor" size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#020617] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 font-bold text-2xl text-white mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Bot size={24} className="text-white" />
                </div>
                ReplyGenie
              </div>
              <p className="text-slate-400 max-w-sm leading-relaxed">
                Empowering businesses with AI-driven social commerce automation. Secure, transparent, and Meta-compliant.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-sm">
                <li><Link to="/privacy" className="text-slate-400 hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-slate-400 hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                <li><Link to="/data-deletion" className="text-slate-400 hover:text-blue-400 transition-colors">Data Deletion</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Compliance</h4>
              <ul className="space-y-4 text-sm">
                <li><Link to="/facebook-permissions" className="text-slate-400 hover:text-blue-400 transition-colors">Meta Permissions</Link></li>
                <li><Link to="/security" className="text-slate-400 hover:text-blue-400 transition-colors">Security Architecture</Link></li>
                <li><a href="mailto:support@replygenie.app" className="text-slate-400 hover:text-blue-400 transition-colors">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-slate-500 text-xs tracking-wide">
              © {new Date().getFullYear()} ReplyGenie. {content.footerRights[lang]}
            </div>
            <div className="flex gap-6 text-slate-500 text-xs">
              <span className="flex items-center gap-1"><Shield size={12} className="text-emerald-500" /> Meta Verified Provider</span>
              <span className="flex items-center gap-1"><Lock size={12} className="text-blue-500" /> AES-256 Encrypted</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Internal Components for Landing Page

const FeatureCard: React.FC<{ icon: any, title: string, desc: string }> = ({ icon: Icon, title, desc }) => (
  <div className="group p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/60 transition-all duration-300 backdrop-blur-sm">
    <div className="w-14 h-14 rounded-2xl bg-blue-900/20 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-300">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{desc}</p>
  </div>
);

const PricingCard: React.FC<{ title: string, price: string, features: string[], featured?: boolean, badge?: string }> = ({ title, price, features, featured, badge }) => (
  <div className={`p-8 rounded-3xl border transition-all duration-300 relative ${featured ? 'bg-slate-800/80 border-blue-500 shadow-2xl shadow-blue-900/20 scale-105 z-10' : 'bg-slate-900/20 border-slate-800 hover:border-slate-700'}`}>
    {featured && (
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
        Most Popular
      </div>
    )}
    <h3 className="text-xl font-medium text-slate-300 mb-2">{title}</h3>
    <div className="flex items-baseline gap-1 mb-6">
      <span className="text-4xl font-bold text-white">${price}</span>
      <span className="text-slate-500">/mo</span>
    </div>

    {badge && (
      <div className="mb-6 flex items-center gap-2 text-xs font-bold text-blue-400 bg-blue-900/20 px-3 py-1.5 rounded-lg border border-blue-500/30">
        <Plus size={12} /> {badge}
      </div>
    )}

    <ul className="space-y-4 mb-8">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
          <Check size={16} className={featured ? "text-blue-400" : "text-slate-500"} />
          {f}
        </li>
      ))}
    </ul>
    <Link
      to="/register"
      className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center ${featured ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
    >
      Choose {title}
    </Link>
  </div>
);