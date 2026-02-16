import { Translation, Country } from './types';
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
  Truck,
  Globe
} from 'lucide-react';

export const TEXTS: Translation = {
  heroTitle: {
    en: "Sell Smarter.",
    fr: "Vendez Plus Intelligemment.",
    ar: "بع بذكاء."
  },
  heroHighlight: {
    en: "Automate Everything.",
    fr: "Automatisez Tout.",
    ar: "أتمت كل شيء."
  },
  heroSubtitle: {
    en: "Connect your business accounts. Publish products. Auto-reply to customers. Manage orders.",
    fr: "Connectez vos comptes pro. Publiez vos produits. Répondez automatiquement. Gérez vos commandes.",
    ar: "اربط حساباتك التجارية، انشر منتجاتك تلقائيًا، ودع ReplyGenie يرد على عملائك ويجمع طلباتك نيابةً عنك."
  },
  ctaStart: {
    en: "Start Free Trial",
    fr: "Essai Gratuit",
    ar: "ابدأ التجربة المجانية"
  },
  dashboard: {
    en: "Overview",
    fr: "Vue d'ensemble",
    ar: "لوحة التحكم"
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
    ar: "صندوق الوارد"
  },
  connectedAccounts: {
    en: "Connected Accounts",
    fr: "Comptes connectés",
    ar: "الحسابات المتصلة"
  },
  deliverySettings: {
    en: "Settings",
    fr: "Paramètres",
    ar: "الإعدادات"
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
    ar: "تسجيل الخروج"
  },
  connectBtn: {
    en: "Connect",
    fr: "Connecter",
    ar: "ربط الحساب"
  },
  disconnectBtn: {
    en: "Disconnect",
    fr: "Déconnecter",
    ar: "فصل الحساب"
  },
  simulatorTitle: {
    en: "Auto-Reply Simulator",
    fr: "Simulateur de réponse auto",
    ar: "محاكي الرد الآلي"
  },
  simulatorDesc: {
    en: "Test how your bot responds to comments and messages across platforms.",
    fr: "Testez comment votre bot répond aux commentaires et messages.",
    ar: "اختبر دقة ردود البوت الذكي على التعليقات والرسائل قبل تفعيلها."
  },
  addProduct: {
    en: "Add Product",
    fr: "Ajouter produit",
    ar: "إضافة منتج جديد"
  },
  publish: {
    en: "Publish to Socials",
    fr: "Publier sur les réseaux",
    ar: "نشر على المنصات"
  },
  save: {
    en: "Save",
    fr: "Enregistrer",
    ar: "حفظ التغييرات"
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
    ar: "دخول آمن"
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
    ar: "أحدث الطلبات"
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
  },
  countrySettings: {
      en: "Countries & Delivery",
      fr: "Pays & Livraison",
      ar: "الدول والتوصيل"
  },
  // Showcase Section Translations
  showcaseSectionTitle: {
    en: "How ReplyGenie Works in Algeria",
    fr: "Comment ReplyGenie fonctionne en Algérie",
    ar: "كيف يعمل ReplyGenie في الجزائر"
  },
  showcaseHeadline: {
    en: "Turn your page into a smart sales machine",
    fr: "Transformez votre page en machine de vente",
    ar: "حوّل صفحتك إلى آلة مبيعات ذكية"
  },
  showcaseBody: {
    en: "ReplyGenie connects your Facebook & Instagram business accounts, auto-publishes products, replies to customers based on region & shipping cost, and collects orders without your intervention.",
    fr: "ReplyGenie connecte vos comptes Facebook et Instagram, publie automatiquement, répond selon la région et collecte les commandes sans intervention.",
    ar: "يقوم ReplyGenie بربط حساباتك التجارية على فيسبوك وإنستغرام، وينشر منتجاتك تلقائيًا، ويرد على العملاء حسب الولاية وسعر الشحن، ويجمع الطلبات بدون أي تدخل منك."
  },
  showcaseBtn: {
    en: "Start Now for Free",
    fr: "Commencez Gratuitement",
    ar: "ابدأ الآن مجانًا"
  }
};

export const MENU_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
  { path: '/products', icon: ShoppingBag, labelKey: 'products' },
  { path: '/orders', icon: Package, labelKey: 'orders' },
  { path: '/inbox', icon: MessageSquareText, labelKey: 'inbox' },
  { path: '/connected-accounts', icon: Share2, labelKey: 'connectedAccounts' },
  { path: '/delivery-settings', icon: Settings, labelKey: 'deliverySettings' }, // Changed icon to Settings
  { path: '/analytics', icon: BarChart3, labelKey: 'analytics' },
  { path: '/billing', icon: CreditCard, labelKey: 'billing' },
];

export const ALGERIA_WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira", 
  "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers", "Djelfa", "Jijel", "Sétif", "Saïda", 
  "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", 
  "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arreridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt",
  "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane"
];

export const FRANCE_REGIONS = [
    "Île-de-France", "Provence-Alpes-Côte d'Azur", "Auvergne-Rhône-Alpes", "Nouvelle-Aquitaine", "Occitanie", "Hauts-de-France", "Grand Est", "Brittany", "Normandy"
];

export const MOROCCO_REGIONS = [
    "Casablanca-Settat", "Rabat-Salé-Kénitra", "Marrakech-Safi", "Fès-Meknès", "Tangier-Tétouan-Al Hoceïma", "Souss-Massa"
];

export const TUNISIA_REGIONS = [
    "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan", "Bizerte", "Béja", "Jendouba", "Kef", "Siliana", "Sousse", "Monastir", "Mahdia", "Sfax"
];


export const DEFAULT_COUNTRIES: Country[] = [
    {
        id: 'dz',
        name: 'Algeria',
        currency: 'DZD',
        regions: ALGERIA_WILAYAS.map(n => ({ id: n, name: n })),
        shippingCompanies: ['Yalidine', 'ZR Express', 'EMS', 'Kazi Tour']
    },
    {
        id: 'fr',
        name: 'France',
        currency: 'EUR',
        regions: FRANCE_REGIONS.map(n => ({ id: n, name: n })),
        shippingCompanies: ['La Poste', 'Chronopost', 'Mondial Relay', 'DHL']
    },
    {
        id: 'ma',
        name: 'Morocco',
        currency: 'MAD',
        regions: MOROCCO_REGIONS.map(n => ({ id: n, name: n })),
        shippingCompanies: ['Amana', 'CTM Messagerie', 'Aramex']
    },
    {
        id: 'tn',
        name: 'Tunisia',
        currency: 'TND',
        regions: TUNISIA_REGIONS.map(n => ({ id: n, name: n })),
        shippingCompanies: ['Aramex', 'Tunisie Express', 'Rapide Poste']
    }
];