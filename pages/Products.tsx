import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { facebookService } from '../services/facebookService';
import { Product, Language, Country, SocialAccount } from '../types';
import { TEXTS } from '../constants';
import { Plus, Package, Edit2, Trash2, CheckCircle, XCircle, Truck, Facebook, Instagram, Share2, Upload, X, Image as ImageIcon, Star, Layers, Globe, Zap, Calendar, Clock, AlertTriangle, Repeat, Eye, Smartphone, MoreHorizontal, Heart, MessageCircle, Send } from 'lucide-react';

interface Props {
  lang: Language;
}

export const Products: React.FC<Props> = ({ lang }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [connectedAccounts, setConnectedAccounts] = useState<SocialAccount[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  const navigate = useNavigate();
  const t = TEXTS;
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [targetCountryId, setTargetCountryId] = useState<string>('dz');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [shippingType, setShippingType] = useState<'free'|'paid'>('paid');
  const [defaultShipping, setDefaultShipping] = useState(600);
  
  // Publishing State
  const [targetAccountIds, setTargetAccountIds] = useState<string[]>([]);
  const [autoPublish, setAutoPublish] = useState(true);
  const [publishMode, setPublishMode] = useState<'instant' | 'scheduled'>('instant');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  
  // Recurring State
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceInterval, setRecurrenceInterval] = useState(7);

  // System State
  const [publishing, setPublishing] = useState(false);
  const [previewPlatform, setPreviewPlatform] = useState<'Facebook' | 'Instagram'>('Facebook');
  
  // Multi-image state
  const [productImages, setProductImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const prods = storageService.getProducts();
    setProducts(prods);
    setCountries(storageService.getCountries());
    const accounts = storageService.getAccounts().filter(a => a.connected);
    setConnectedAccounts(accounts);
    setHasAccount(accounts.length > 0);
  };

  const getActiveCountry = () => countries.find(c => c.id === targetCountryId) || countries[0];

  const handleAddClick = () => {
      if (!hasAccount) {
          if (confirm("You must connect at least one business account (Facebook or Instagram) before creating products.\n\nGo to Connected Accounts?")) {
              navigate('/connected-accounts');
          }
          return;
      }
      resetForm();
      // Auto-select all accounts by default
      setTargetAccountIds(connectedAccounts.map(a => a.id));
      setShowForm(true);
  };

  const toggleTargetAccount = (id: string) => {
      setTargetAccountIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const processFiles = async (files: FileList | File[]) => {
    if (productImages.length + files.length > 5) {
        alert("Maximum 5 images allowed per product.");
        return;
    }

    setUploading(true);
    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) {
            alert(`File ${file.name} too large. Max 5MB.`);
            continue;
        }
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            alert(`File ${file.name} invalid type. Only JPG, PNG, WEBP.`);
            continue;
        }

        await new Promise(r => setTimeout(r, 500));
        
        const reader = new FileReader();
        const result = await new Promise<string>((resolve) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
        });
        newImages.push(result);
    }

    setProductImages(prev => [...prev, ...newImages]);
    setUploading(false);
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
        processFiles(Array.from(e.dataTransfer.files));
    }
  }, [productImages]);

  const removeImage = (index: number) => {
      setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  const setPrimaryImage = (index: number) => {
      setProductImages(prev => {
          const newArr = [...prev];
          const [selected] = newArr.splice(index, 1);
          newArr.unshift(selected);
          return newArr;
      });
  };

  const constructProductObject = (): Product => {
      const activeCountry = getActiveCountry();
      let scheduleTimestamp: number | undefined = undefined;

      if (publishMode === 'scheduled') {
          const dt = new Date(`${scheduledDate}T${scheduledTime}`);
          scheduleTimestamp = dt.getTime();
      }

      // Calculate next publish for recurrence
      let nextPublish: number | undefined = undefined;
      if (isRecurring) {
          const baseTime = publishMode === 'scheduled' ? scheduleTimestamp! : Date.now();
          // If instant, next is now + interval. If scheduled, next is scheduled + interval (handled in scheduler mostly, but initial logic here)
          // Actually, if instant & recurring, we publish now, then set next = now + interval. 
          // If scheduled & recurring, we set next = scheduled.
          if (publishMode === 'instant') {
               const d = new Date();
               d.setDate(d.getDate() + recurrenceInterval);
               nextPublish = d.getTime();
          } else {
               // First run is scheduledAt. Scheduler handles the next calculation after run.
               nextPublish = scheduleTimestamp; 
          }
      } else if (publishMode === 'scheduled') {
          // Just one time
          // nextPublish used by scheduler for both scheduled/recurring logic in updated schema
          // but let's stick to using scheduledAt for one-time and nextPublishAt for recurring
      }

      return {
          id: editingId || crypto.randomUUID(),
          name,
          price: Number(price),
          stock: Number(stock),
          description: desc,
          category,
          hashtags: ['#new', `#${category.toLowerCase()}`],
          imageUrl: productImages[0], 
          images: productImages,
          active: true,
          targetCountryId: activeCountry.id,
          currency: activeCountry.currency,
          shipping: {
              type: shippingType,
              defaultCost: shippingType === 'free' ? 0 : defaultShipping,
              locationCosts: {}, 
              companies: activeCountry.shippingCompanies
          },
          paymentMethods: ['cod'],
          targetAccountIds,
          publishedTo: [], // will be filled on publish
          publishMode,
          scheduledAt: scheduleTimestamp,
          publishStatus: publishMode === 'scheduled' ? 'scheduled' : 'draft',
          isRecurring,
          recurrenceInterval,
          nextPublishAt: isRecurring && publishMode === 'scheduled' ? scheduleTimestamp : (isRecurring ? Date.now() + (recurrenceInterval * 86400000) : undefined)
      };
  };

  const handleSubmit = async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      
      if (productImages.length === 0) {
          alert("Please upload at least one image.");
          return;
      }
      if (targetAccountIds.length === 0) {
          alert("Please select at least one account to publish to.");
          return;
      }
      if (publishMode === 'scheduled' && (!scheduledDate || !scheduledTime)) {
          alert("Please select date and time.");
          return;
      }

      const newProduct = constructProductObject();
      let publishedPlatforms: string[] = [];

      // Logic: If Instant and AutoPublish is ON, publish now.
      if (publishMode === 'instant' && autoPublish) {
          setPublishing(true);
          const accountsToPublish = connectedAccounts.filter(a => targetAccountIds.includes(a.id));
          
          try {
              for (const account of accountsToPublish) {
                  if (account.platform === 'Facebook') {
                      await facebookService.publishToFacebook(account, newProduct);
                      publishedPlatforms.push('Facebook');
                  } else if (account.platform === 'Instagram') {
                      await facebookService.publishToInstagram(account, newProduct);
                      publishedPlatforms.push('Instagram');
                  }
              }
              alert(`Published to ${publishedPlatforms.join(' & ')} successfully!`);
              newProduct.publishStatus = 'published';
              newProduct.publishedTo = publishedPlatforms as any;
              newProduct.lastPublishedAt = Date.now();
          } catch (error) {
              console.error("Publish Error:", error);
              alert(`Error publishing: ${error}`);
          }
          setPublishing(false);
      } else if (publishMode === 'scheduled') {
          alert(`Product scheduled for ${new Date(newProduct.scheduledAt!).toLocaleString()}.`);
      }

      storageService.saveProduct(newProduct);
      loadData();
      setShowForm(false);
      setShowPreview(false);
      resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setTargetCountryId(product.targetCountryId || 'dz');
    setName(product.name);
    setPrice(product.price.toString());
    setStock(product.stock.toString());
    setDesc(product.description);
    setCategory(product.category);
    setShippingType(product.shipping.type);
    setDefaultShipping(product.shipping.defaultCost);
    setProductImages(product.images && product.images.length > 0 ? product.images : (product.imageUrl ? [product.imageUrl] : []));
    setTargetAccountIds(product.targetAccountIds || []);
    
    // Recurrence
    setIsRecurring(product.isRecurring || false);
    setRecurrenceInterval(product.recurrenceInterval || 7);

    // Set scheduling state if exists
    if (product.publishMode === 'scheduled' && product.scheduledAt) {
        setPublishMode('scheduled');
        const dt = new Date(product.scheduledAt);
        setScheduledDate(dt.toISOString().split('T')[0]);
        setScheduledTime(dt.toTimeString().slice(0, 5));
        setAutoPublish(false);
    } else {
        setPublishMode('instant');
        setScheduledDate('');
        setScheduledTime('');
        setAutoPublish(true);
    }
    
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
      if(confirm('Delete this product?')) {
          storageService.deleteProduct(id);
          loadData();
      }
  };

  const resetForm = () => {
      setEditingId(null);
      setName('');
      setPrice('');
      setStock('');
      setDesc('');
      setCategory('Electronics');
      setDefaultShipping(600);
      setProductImages([]);
      setAutoPublish(true);
      setPublishMode('instant');
      setScheduledDate('');
      setScheduledTime('');
      setTargetAccountIds([]);
      setIsRecurring(false);
      setRecurrenceInterval(7);
  };

  const activeCountry = getActiveCountry();

  // Preview Modal Component
  const PreviewModal = () => {
      if (!showPreview) return null;
      
      const currency = activeCountry.currency;
      
      return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-white text-slate-900 w-full max-w-4xl rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl animate-fade-in-up max-h-[90vh]">
                  {/* Controls Side */}
                  <div className="w-full md:w-1/3 bg-slate-100 p-6 flex flex-col border-r border-slate-200 overflow-y-auto">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                          <Eye size={20} className="text-blue-600"/> Post Preview
                      </h3>
                      
                      <div className="space-y-4 mb-8">
                          <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Select Platform</label>
                          <div className="flex bg-slate-200 p-1 rounded-xl">
                              <button 
                                  onClick={() => setPreviewPlatform('Facebook')}
                                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${previewPlatform === 'Facebook' ? 'bg-white shadow text-[#1877F2]' : 'text-slate-500 hover:text-slate-700'}`}
                              >
                                  <Facebook size={18}/> Facebook
                              </button>
                              <button 
                                  onClick={() => setPreviewPlatform('Instagram')}
                                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${previewPlatform === 'Instagram' ? 'bg-white shadow text-[#E4405F]' : 'text-slate-500 hover:text-slate-700'}`}
                              >
                                  <Instagram size={18}/> Instagram
                              </button>
                          </div>
                      </div>

                      <div className="mt-auto space-y-3">
                          <button 
                              onClick={() => setShowPreview(false)}
                              className="w-full py-3 bg-white border border-slate-300 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition"
                          >
                              Edit Details
                          </button>
                          <button 
                              onClick={() => handleSubmit()}
                              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                          >
                              Confirm & Schedule
                          </button>
                      </div>
                  </div>

                  {/* Preview Side */}
                  <div className="w-full md:w-2/3 bg-slate-200 p-8 overflow-y-auto flex justify-center items-center">
                      {/* Phone Container */}
                      <div className="bg-white w-[375px] rounded-[3rem] border-[8px] border-slate-900 shadow-xl overflow-hidden relative">
                           {/* Status Bar */}
                           <div className="h-7 bg-white flex justify-between items-center px-6 text-[10px] font-bold text-black pt-2">
                               <span>9:41</span>
                               <div className="flex gap-1">
                                   <div className="w-3 h-3 bg-black rounded-full"></div>
                               </div>
                           </div>
                           
                           {/* App Header */}
                           <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500"></div>
                                    <span className="font-semibold text-sm">Tech Store DZ</span>
                                </div>
                                <MoreHorizontal size={20} className="text-slate-400"/>
                           </div>

                           {/* Content */}
                           <div>
                                <div className="aspect-square bg-slate-100 relative">
                                    {productImages.length > 0 ? (
                                        <img src={productImages[0]} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">No Image</div>
                                    )}
                                    {productImages.length > 1 && (
                                        <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                                            1/{productImages.length}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Actions */}
                                <div className="px-4 py-3 flex justify-between items-center">
                                    <div className="flex gap-4 text-slate-800">
                                        <Heart size={24} />
                                        <MessageCircle size={24} />
                                        <Send size={24} />
                                    </div>
                                    <div className="text-slate-800"><Share2 size={24} /></div>
                                </div>

                                {/* Caption */}
                                <div className="px-4 pb-6 text-sm">
                                    <p className="font-bold mb-1">1,234 likes</p>
                                    <p className="leading-normal">
                                        <span className="font-bold mr-2">Tech Store DZ</span>
                                        {name}
                                        <br/><br/>
                                        {desc}
                                        <br/><br/>
                                        🔥 Price: <strong>{price} {currency}</strong>
                                        <br/>
                                        🚚 Shipping: {shippingType === 'free' ? 'FREE' : `Starts at ${defaultShipping} ${currency}`}
                                        <br/><br/>
                                        <span className="text-blue-900">
                                            #new #{category.toLowerCase()} #techstore
                                        </span>
                                    </p>
                                    <p className="text-slate-400 text-xs mt-2 uppercase">2 minutes ago</p>
                                </div>
                           </div>
                           
                           {/* Home Bar */}
                           <div className="h-1 w-1/3 bg-slate-900 mx-auto rounded-full mb-2 mt-4"></div>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Package className="text-accent" />
                {t.products[lang]}
            </h1>
            {!showForm && (
                <button 
                    onClick={handleAddClick}
                    className="bg-accent hover:bg-accentHover text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20"
                >
                    <Plus size={18} />
                    {t.addProduct[lang]}
                </button>
            )}
        </div>

        <PreviewModal />

        {/* Add/Edit Product Form */}
        {showForm && (
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl animate-fade-in-up relative">
                {publishing && (
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-2xl">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-white font-bold text-lg">Publishing to Social Media...</p>
                        <p className="text-slate-400 text-sm">Uploading images and creating posts</p>
                    </div>
                )}

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">
                        {editingId ? 'Edit Product' : 'New Product Details'}
                    </h2>
                    <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); setShowPreview(true); }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Multi-Image Gallery */}
                    <div className="space-y-4">
                        <label className="block text-sm text-slate-400 mb-1">Product Gallery ({productImages.length}/5)</label>
                        <div className="relative aspect-square rounded-2xl bg-slate-900 border border-slate-700 overflow-hidden group">
                            {productImages.length > 0 ? (
                                <>
                                    <img src={productImages[0]} alt="Primary" className="w-full h-full object-contain" />
                                    <div className="absolute top-2 left-2 bg-accent text-white text-xs px-2 py-1 rounded-md shadow-sm font-medium flex items-center gap-1">
                                        <Star size={10} fill="currentColor" /> Primary
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                         <button 
                                            type="button"
                                            onClick={() => removeImage(0)}
                                            className="bg-red-500/90 text-white p-3 rounded-full hover:bg-red-600 transition"
                                            title="Remove Image"
                                         >
                                             <Trash2 size={20} />
                                         </button>
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-600">
                                    <ImageIcon size={48} className="mb-2 opacity-50" />
                                    <span className="text-sm">No image selected</span>
                                </div>
                            )}
                        </div>
                        {/* Thumbnails code same as before... */}
                        <div className="grid grid-cols-4 gap-2">
                             {productImages.slice(1).map((img, idx) => (
                                 <div key={idx} className="relative aspect-square rounded-lg bg-slate-900 border border-slate-700 overflow-hidden group cursor-pointer" onClick={() => setPrimaryImage(idx + 1)}>
                                     <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-1">
                                         <span className="text-[10px] text-white font-medium">Set Primary</span>
                                         <button 
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); removeImage(idx + 1); }}
                                            className="text-red-400 hover:text-red-300"
                                         >
                                             <XCircle size={16} />
                                         </button>
                                     </div>
                                 </div>
                             ))}
                             {productImages.length < 5 && (
                                 <div 
                                    onClick={() => document.getElementById('gallery-upload')?.click()}
                                    onDragOver={onDragOver}
                                    onDragLeave={onDragLeave}
                                    onDrop={onDrop}
                                    className={`
                                        aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all
                                        ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-800'}
                                    `}
                                 >
                                     {uploading ? (
                                         <div className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div>
                                     ) : (
                                         <>
                                            <Plus size={20} className="text-slate-400" />
                                            <span className="text-[10px] text-slate-500 mt-1">Add</span>
                                         </>
                                     )}
                                     <input 
                                        id="gallery-upload" 
                                        type="file" 
                                        accept="image/*" 
                                        multiple
                                        className="hidden" 
                                        onChange={(e) => e.target.files && processFiles(Array.from(e.target.files))}
                                     />
                                 </div>
                             )}
                        </div>
                    </div>

                    {/* Right Columns: Form Fields */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Target Accounts Selection */}
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-blue-900/50">
                            <label className="block text-sm text-blue-300 mb-2 font-medium flex items-center gap-2">
                                <Share2 size={14} /> Publish Targets
                            </label>
                            <div className="flex gap-3 flex-wrap">
                                {connectedAccounts.map(account => (
                                    <button 
                                        key={account.id}
                                        type="button"
                                        onClick={() => toggleTargetAccount(account.id)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${targetAccountIds.includes(account.id) ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}
                                    >
                                        {account.platform === 'Facebook' ? <Facebook size={14} /> : <Instagram size={14} />}
                                        {account.name}
                                        {targetAccountIds.includes(account.id) && <CheckCircle size={12} className="text-white" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Product Name</label>
                                    <input required type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-accent outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Price</label>
                                        <input required type="number" value={price} onChange={e=>setPrice(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-accent outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Stock</label>
                                        <input required type="number" value={stock} onChange={e=>setStock(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-accent outline-none" />
                                    </div>
                                </div>
                             </div>
                             <div>
                                 <label className="block text-sm text-slate-400 mb-1">Description</label>
                                 <textarea value={desc} onChange={e=>setDesc(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-accent outline-none h-[130px] resize-none" />
                             </div>
                        </div>

                        {/* Recurring & Schedule */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-700 pt-6">
                            {/* Schedule */}
                            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                                <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><Clock size={16}/> Schedule</h3>
                                <div className="space-y-3">
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" checked={publishMode==='instant'} onChange={()=>setPublishMode('instant')} className="accent-blue-500" />
                                            <span className="text-sm text-slate-300">Publish Now</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" checked={publishMode==='scheduled'} onChange={()=>setPublishMode('scheduled')} className="accent-blue-500" />
                                            <span className="text-sm text-slate-300">Schedule</span>
                                        </label>
                                    </div>
                                    {publishMode === 'scheduled' && (
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            <input type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded p-1.5 text-xs text-white" />
                                            <input type="time" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded p-1.5 text-xs text-white" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Recurring */}
                            <div className={`p-4 rounded-xl border transition-all ${isRecurring ? 'bg-purple-900/10 border-purple-500/50' : 'bg-slate-900/50 border-slate-700'}`}>
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className={`font-semibold flex items-center gap-2 ${isRecurring ? 'text-purple-300' : 'text-slate-400'}`}>
                                        <Repeat size={16}/> Auto-Repost
                                    </h3>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={isRecurring} onChange={e => setIsRecurring(e.target.checked)} />
                                        <div className="w-9 h-5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                                    </label>
                                </div>
                                {isRecurring && (
                                    <div className="animate-fade-in">
                                        <label className="text-xs text-slate-400 block mb-1">Repeat Every</label>
                                        <select value={recurrenceInterval} onChange={e => setRecurrenceInterval(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-600 rounded p-1.5 text-xs text-white">
                                            <option value={7}>7 Days</option>
                                            <option value={14}>14 Days</option>
                                            <option value={30}>30 Days</option>
                                        </select>
                                        <p className="text-[10px] text-purple-400 mt-2">Next repost will be automated.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 text-slate-400 hover:text-white transition">Cancel</button>
                            <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-xl text-white font-bold shadow-lg shadow-blue-900/20 flex items-center gap-2">
                                <Eye size={18} /> Preview & Publish
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )}

        {/* Products List */}
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-sm">
                    <tr>
                        <th className="p-4 font-medium w-24 text-center">Image</th>
                        <th className="p-4 font-medium">Product Details</th>
                        <th className="p-4 font-medium">Publishing</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 text-slate-300">
                    {products.map(p => (
                        <tr key={p.id} className="hover:bg-slate-700/20 transition-colors group">
                            <td className="p-4 text-center align-top">
                                <div className="w-16 h-16 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden relative mx-auto group-hover:shadow-lg transition-all">
                                    {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />}
                                </div>
                            </td>
                            <td className="p-4 align-top">
                                <div className="font-bold text-white text-lg">{p.name}</div>
                                <div className="text-xs text-slate-500 mt-1 flex flex-col gap-1">
                                    <span>{p.price} {p.currency}</span>
                                    <span>Stock: {p.stock}</span>
                                </div>
                            </td>
                            <td className="p-4 align-top">
                                <div className="flex flex-col gap-2">
                                     <div className="flex items-center gap-1">
                                        {(p.publishedTo || []).map((plat, i) => (
                                            <div key={i} title={plat} className={`w-5 h-5 rounded flex items-center justify-center text-white ${plat==='Facebook'?'bg-blue-600':'bg-pink-600'}`}>
                                                {plat === 'Facebook' ? <Facebook size={12}/> : <Instagram size={12}/>}
                                            </div>
                                        ))}
                                     </div>
                                     {p.isRecurring && (
                                         <div className="flex items-center gap-1 text-[10px] text-purple-400 bg-purple-400/10 px-1.5 py-0.5 rounded w-fit border border-purple-500/20">
                                             <Repeat size={10} /> Auto {p.recurrenceInterval}d
                                         </div>
                                     )}
                                </div>
                            </td>
                            <td className="p-4 align-top">
                                <div className="flex flex-col gap-2">
                                    {p.publishStatus === 'scheduled' ? (
                                        <div className="flex items-center gap-2 text-yellow-400 text-sm font-medium bg-yellow-400/10 px-2 py-1 rounded border border-yellow-400/20 w-fit">
                                            <Clock size={14} />
                                            <span>
                                                {p.scheduledAt ? new Date(p.scheduledAt).toLocaleDateString() : 'Scheduled'}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                                            <CheckCircle size={14} /> Published
                                        </div>
                                    )}
                                    {p.nextPublishAt && (
                                        <span className="text-[10px] text-slate-500">
                                            Next: {new Date(p.nextPublishAt).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="p-4 align-top text-right">
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => handleEdit(p)} className="p-2 hover:bg-slate-700 rounded-lg text-blue-400 transition-colors" title="Edit">
                                        <Edit2 size={18}/>
                                    </button>
                                    <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-slate-700 rounded-lg text-red-400 transition-colors" title="Delete">
                                        <Trash2 size={18}/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};