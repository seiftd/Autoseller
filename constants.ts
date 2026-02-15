import { Translation } from './types';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  MessageSquareText, 
  Settings, 
  LogOut,
  Share2,
  BarChart3,
  CreditCard,
  Truck
} from 'lucide-react';

export const TEXTS: Translation = {
  heroTitle: {
    en: "Social Commerce Automation",
    fr: "Automatisation du Commerce Social",
    ar: "أتمتة التجارة الاجتماعية"
  },
  heroSubtitle: {
    en: "One platform to manage Facebook, Instagram & WhatsApp. Auto-publish products and auto-reply to customers.",
    fr: "Une seule plateforme pour gérer Facebook, Instagram et WhatsApp. Publiez automatiquement et répondez aux clients.",
    ar: "منصة واحدة لإدارة فيسبوك وإنستغرام وواتساب. نشر المنتجات والرد على العملاء تلقائيًا."
  },
  ctaStart: {
    en: "Start Free Trial",
    fr: "Essai Gratuit",
    ar: "ابدأ التجربة المجانية"
  },
  dashboard: {
    en: "Overview",
    fr: "Vue d'ensemble",
    ar: "نظرة عامة"
  },
  products: {
    en: "Products",
    fr: "Produits",
    ar: "المنتجات"
  },
  orders: {
    en: "Orders",
    fr: "Commandes",
    ar: "الطلبات"
  },
  inbox: {
    en: "Inbox",
    fr: "Boîte de réception",
    ar: "الرسائل"
  },
  connectedAccounts: {
    en: "Connected Accounts",
    fr: "Comptes connectés",
    ar: "الحسابات المتصلة"
  },
  deliverySettings: {
    en: "Delivery Settings",
    fr: "Paramètres de livraison",
    ar: "إعدادات التوصيل"
  },
  analytics: {
    en: "Analytics",
    fr: "Analytique",
    ar: "التحليلات"
  },
  billing: {
    en: "Billing",
    fr: "Facturation",
    ar: "الفوترة"
  },
  logout: {
    en: "Logout",
    fr: "Déconnexion",
    ar: "خروج"
  },
  connectBtn: {
    en: "Connect",
    fr: "Connecter",
    ar: "ربط"
  },
  disconnectBtn: {
    en: "Disconnect",
    fr: "Déconnecter",
    ar: "فصل"
  },
  simulatorTitle: {
    en: "Auto-Reply Simulator",
    fr: "Simulateur de réponse auto",
    ar: "محاكي الرد الآلي"
  },
  simulatorDesc: {
    en: "Test how your bot responds to comments and messages across platforms.",
    fr: "Testez comment votre bot répond aux commentaires et messages.",
    ar: "اختبر كيف يرد البوت على التعليقات والرسائل عبر المنصات."
  },
  addProduct: {
    en: "Add Product",
    fr: "Ajouter produit",
    ar: "إضافة منتج"
  },
  publish: {
    en: "Publish to Socials",
    fr: "Publier sur les réseaux",
    ar: "نشر على التواصل الاجتماعي"
  },
  save: {
    en: "Save",
    fr: "Enregistrer",
    ar: "حفظ"
  },
  loginTitle: {
    en: "Login",
    fr: "Connexion",
    ar: "تسجيل الدخول"
  },
  username: {
    en: "Username",
    fr: "Nom d'utilisateur",
    ar: "اسم المستخدم"
  },
  password: {
    en: "Password",
    fr: "Mot de passe",
    ar: "كلمة المرور"
  },
  loginBtn: {
    en: "Sign In",
    fr: "Se connecter",
    ar: "دخول"
  },
  totalOrders: {
    en: "Total Orders",
    fr: "Total Commandes",
    ar: "إجمالي الطلبات"
  },
  totalRevenue: {
    en: "Total Revenue",
    fr: "Revenu Total",
    ar: "إجمالي الإيرادات"
  },
  activeProducts: {
    en: "Active Products",
    fr: "Produits Actifs",
    ar: "المنتجات النشطة"
  },
  recentOrders: {
    en: "Recent Orders",
    fr: "Commandes Récentes",
    ar: "الطلبات الأخيرة"
  },
  connectTitle: {
    en: "Platform Connections",
    fr: "Connexions Plateforme",
    ar: "ربط المنصات"
  },
  shippingCompany: {
    en: "Shipping Company",
    fr: "Société de Livraison",
    ar: "شركة الشحن"
  },
  settings: {
    en: "Settings",
    fr: "Paramètres",
    ar: "الإعدادات"
  },
  productImage: {
    en: "Product Image",
    fr: "Image du produit",
    ar: "صورة المنتج"
  },
  dragDrop: {
    en: "Drag image here or click to upload",
    fr: "Glissez l'image ici ou cliquez pour télécharger",
    ar: "اسحب الصورة هنا أو انقر للتحميل"
  },
  remove: {
    en: "Remove",
    fr: "Supprimer",
    ar: "حذف"
  }
};

export const MENU_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
  { path: '/products', icon: ShoppingBag, labelKey: 'products' },
  { path: '/orders', icon: Package, labelKey: 'orders' },
  { path: '/inbox', icon: MessageSquareText, labelKey: 'inbox' },
  { path: '/connected-accounts', icon: Share2, labelKey: 'connectedAccounts' },
  { path: '/delivery-settings', icon: Truck, labelKey: 'deliverySettings' },
  { path: '/analytics', icon: BarChart3, labelKey: 'analytics' },
  { path: '/billing', icon: CreditCard, labelKey: 'billing' },
];

export const WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira", 
  "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers", "Djelfa", "Jijel", "Sétif", "Saïda", 
  "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", 
  "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arreridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt",
  "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane"
];

export const SHIPPING_COMPANIES = ["Yalidine", "ZR Express", "EMS", "Kazi Tour", "May Stro", "Custom"];