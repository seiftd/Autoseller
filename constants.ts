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
  Globe,
  Users,
  History,
  Activity
} from 'lucide-react';

export const TEXTS: Translation & Record<string, { en: string, fr: string, ar: string }> = {
  // ... existing translations ...
  heroTitle: {
    en: "Sell Smarter.",
    fr: "Vendez Plus Intelligemment.",
    ar: "تجارة أذكى."
  },
  heroHighlight: {
    en: "Automate Everything.",
    fr: "Automatisez Tout.",
    ar: "أتمتة شاملة."
  },
  heroSubtitle: {
    en: "Connect your business accounts. Publish products. Auto-reply to customers. Manage orders.",
    fr: "Connectez vos comptes pro. Publiez vos produits. Répondez automatiquement. Gérez vos commandes.",
    ar: "منصة متكاملة لإدارة حساباتك التجارية، نشر المنتجات تلقائياً، والرد الذكي على العملاء لجمع الطلبات دون عناء."
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
    ar: "الرسائل"
  },
  connectedAccounts: {
    en: "Connected Accounts",
    fr: "Comptes connectés",
    ar: "الحسابات المرتبطة"
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
    ar: "إلغاء الربط"
  },
  simulatorTitle: {
    en: "Auto-Reply Simulator",
    fr: "Simulateur de réponse auto",
    ar: "محاكي الرد الآلي"
  },
  simulatorDesc: {
    en: "Test how your bot responds to comments and messages across platforms.",
    fr: "Testez comment votre bot répond aux commentaires et messages.",
    ar: "اختبر دقة ردود المساعد الذكي على التعليقات والرسائل قبل اعتمادها."
  },
  addProduct: {
    en: "Add Product",
    fr: "Ajouter produit",
    ar: "إضافة منتج"
  },
  publish: {
    en: "Publish to Socials",
    fr: "Publier sur les réseaux",
    ar: "نشر على المنصات"
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
    ar: "اسحب الصورة هنا أو اضغط للتحميل"
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
  showcaseSectionTitle: {
    en: "How ReplyGenie Works in Algeria",
    fr: "Comment ReplyGenie fonctionne en Algérie",
    ar: "كيف يعمل ReplyGenie في الجزائر"
  },
  showcaseHeadline: {
    en: "Turn your page into a smart sales machine",
    fr: "Transformez votre page en machine de vente",
    ar: "حول صفحتك إلى منصة مبيعات ذكية"
  },
  showcaseBody: {
    en: "ReplyGenie connects your Facebook & Instagram business accounts, auto-publishes products, replies to customers based on region & shipping cost, and collects orders without your intervention.",
    fr: "ReplyGenie connecte vos comptes Facebook et Instagram, publie automatiquement, répond selon la région et collecte les commandes sans intervention.",
    ar: "يربط ReplyGenie حساباتك التجارية، ينشر المنتجات تلقائياً، ويرد على العملاء بناءً على المنطقة وتكلفة الشحن، ويجمع الطلبات دون أي تدخل يدوي."
  },
  showcaseBtn: {
    en: "Start Now for Free",
    fr: "Commencez Gratuitement",
    ar: "ابدأ الآن مجاناً"
  },
  systemOperational: { en: "System Operational", fr: "Système Opérationnel", ar: "النظام يعمل بكفاءة" },
  degradedPerformance: { en: "Degraded Performance", fr: "Performance Dégradée", ar: "أداء النظام منخفض" },
  dailyAiUsage: { en: "Daily AI Reply Usage", fr: "Utilisation IA Quotidienne", ar: "استهلاك الرد الذكي اليومي" },
  plan: { en: "Plan", fr: "Plan", ar: "الباقة" },
  successRate: { en: "Success Rate", fr: "Taux de Succès", ar: "نسبة النجاح" },
  avgResponse: { en: "Avg Response", fr: "Réponse Moy.", ar: "متوسط الاستجابة" },
  revenueOverview: { en: "Revenue Overview", fr: "Aperçu des Revenus", ar: "تحليل الإيرادات" },
  scheduledPosts: { en: "Scheduled Posts", fr: "Posts Planifiés", ar: "المنشورات المجدولة" },
  pendingPublication: { en: "Pending Publication", fr: "En attente de publication", ar: "قيد الانتظار للنشر" },
  publishedStatus: { en: "Published", fr: "Publié", ar: "تم النشر" },
  liveOnSocials: { en: "Live on Socials", fr: "En ligne", ar: "منشور على الحسابات" },
  noOrders: { en: "No orders yet.", fr: "Pas encore de commandes.", ar: "لا توجد طلبات حتى الآن." },
  noOrdersSub: { en: "Use the Simulator to create test orders.", fr: "Utilisez le simulateur pour créer des commandes test.", ar: "استخدم المحاكي لإنشاء طلبات تجريبية." },
  productGallery: { en: "Product Gallery", fr: "Galerie Produit", ar: "معرض الصور" },
  primary: { en: "Primary", fr: "Principale", ar: "الرئيسية" },
  makePrimary: { en: "Make Primary", fr: "Définir Principale", ar: "تعيين كرئيسية" },
  publishTargets: { en: "Publish Targets", fr: "Cibles de Publication", ar: "منصات النشر" },
  productName: { en: "Product Name", fr: "Nom du Produit", ar: "اسم المنتج" },
  price: { en: "Price", fr: "Prix", ar: "السعر" },
  stock: { en: "Stock", fr: "Stock", ar: "المخزون" },
  description: { en: "Description", fr: "Description", ar: "الوصف" },
  scheduling: { en: "Scheduling", fr: "Planification", ar: "الجدولة" },
  publishNow: { en: "Publish Now", fr: "Publier Maintenant", ar: "نشر فوري" },
  schedule: { en: "Schedule", fr: "Planifier", ar: "جدولة" },
  autoRepost: { en: "Auto-Repost", fr: "Republication Auto", ar: "إعادة النشر التلقائي" },
  repeatFrequency: { en: "Repeat Frequency", fr: "Fréquence de Répétition", ar: "تكرار كل" },
  days7: { en: "Every 7 Days", fr: "Tous les 7 jours", ar: "7 أيام" },
  days14: { en: "Every 14 Days", fr: "Tous les 14 jours", ar: "14 يوم" },
  days30: { en: "Every 30 Days", fr: "Tous les 30 jours", ar: "30 يوم" },
  cancel: { en: "Cancel", fr: "Annuler", ar: "إلغاء" },
  confirmPublish: { en: "Preview & Publish", fr: "Aperçu & Publier", ar: "معاينة ونشر" },
  editProduct: { en: "Edit Product", fr: "Modifier Produit", ar: "تعديل المنتج" },
  createNewProduct: { en: "Create New Product", fr: "Créer Nouveau Produit", ar: "إضافة منتج جديد" },
  noProducts: { en: "No Products Yet", fr: "Pas encore de produits", ar: "لا توجد منتجات حالياً" },
  createFirstProduct: { en: "Create your first product to start selling on Facebook and Instagram automatically.", fr: "Créez votre premier produit pour commencer à vendre.", ar: "ابدأ بإضافة أول منتج لتفعيل البيع التلقائي على فيسبوك وإنستغرام." },
  activeSessions: { en: "Active Sessions", fr: "Sessions Actives", ar: "الجلسات النشطة" },
  integrations: { en: "Integrations", fr: "Intégrations", ar: "التكاملات" },
  security: { en: "Security", fr: "Sécurité", ar: "الأمان" },
  systemHealth: { en: "System Health", fr: "Santé Système", ar: "حالة النظام" },
  logoutAll: { en: "Log out all other devices", fr: "Déconnecter les autres appareils", ar: "تسجيل الخروج من الأجهزة الأخرى" },
  authentication: { en: "Authentication", fr: "Authentification", ar: "المصادقة" },
  changePassword: { en: "Change Password", fr: "Changer le mot de passe", ar: "تغيير كلمة المرور" },
  enable2FA: { en: "Enable 2-Factor Auth", fr: "Activer 2FA", ar: "تفعيل المصادقة الثنائية" },
  saveChanges: { en: "Save Changes", fr: "Enregistrer", ar: "حفظ التغييرات" },
  manageDevices: { en: "Manage devices where you are currently logged in.", fr: "Gérer les appareils connectés.", ar: "إدارة الأجهزة المتصلة حالياً بحسابك." },
  updatePass: { en: "Update your password or enable 2FA.", fr: "Mettez à jour mot de passe ou 2FA.", ar: "تحديث كلمة المرور أو تفعيل الحماية الثنائية." },
  
  // New Translations for V3 Update
  team: { en: "Team", fr: "Équipe", ar: "فريق العمل" },
  history: { en: "Publish History", fr: "Historique", ar: "سجل النشر" },
  activity: { en: "Activity", fr: "Activité", ar: "النشاطات" },
  export: { en: "Export CSV", fr: "Exporter CSV", ar: "تصدير CSV" },
  role: { en: "Role", fr: "Rôle", ar: "الدور" },
  owner: { en: "Owner", fr: "Propriétaire", ar: "المالك" },
  manager: { en: "Manager", fr: "Manager", ar: "مدير" },
  invite: { en: "Invite Member", fr: "Inviter un membre", ar: "دعوة عضو" },
  accountHealth: { en: "Account Health", fr: "Santé du compte", ar: "حالة الحساب" },
  healthy: { en: "Healthy", fr: "Sain", ar: "سليم" },
  attentionNeeded: { en: "Attention Needed", fr: "Attention Requise", ar: "يتطلب اهتماماً" },
  tokenExpiring: { en: "Token Expiring Soon", fr: "Jeton expire bientôt", ar: "رمز الوصول سينتهي قريباً" },
};

export const MENU_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, labelKey: 'dashboard', roles: ['owner', 'manager'] },
  { path: '/products', icon: ShoppingBag, labelKey: 'products', roles: ['owner', 'manager'] },
  { path: '/orders', icon: Package, labelKey: 'orders', roles: ['owner', 'manager'] },
  { path: '/inbox', icon: MessageSquareText, labelKey: 'inbox', roles: ['owner', 'manager'] },
  { path: '/history', icon: History, labelKey: 'history', roles: ['owner', 'manager'] },
  { path: '/connected-accounts', icon: Share2, labelKey: 'connectedAccounts', roles: ['owner'] },
  { path: '/team', icon: Users, labelKey: 'team', roles: ['owner'] },
  { path: '/activity', icon: Activity, labelKey: 'activity', roles: ['owner'] },
  { path: '/delivery-settings', icon: Settings, labelKey: 'deliverySettings', roles: ['owner'] },
  { path: '/analytics', icon: BarChart3, labelKey: 'analytics', roles: ['owner', 'manager'] },
  { path: '/billing', icon: CreditCard, labelKey: 'billing', roles: ['owner'] },
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