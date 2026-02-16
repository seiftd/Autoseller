import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { facebookService } from '../services/facebookService';
import { Product, Language, Country } from '../types';
import { TEXTS } from '../constants';
import { Plus, Package, Edit2, Trash2, CheckCircle, XCircle, Truck, Facebook, Share2, Upload, X, Image as ImageIcon, Star, Layers, Globe, Zap, Calendar, Clock, AlertTriangle } from 'lucide-react';

interface Props {
  lang: Language;
}

export const Products: React.FC<Props> = ({ lang }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [showForm, setShowForm] = useState(false);
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
  const [autoPublish, setAutoPublish] = useState(true);
  
  // Scheduling State
  const [publishMode, setPublishMode] = useState<'instant' | 'scheduled'>('instant');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  // Publishing State
  const [publishing, setPublishing] = useState(false);
  
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
      setShowForm(true);
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

        // Simulate upload delay
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

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (productImages.length === 0) {
          alert("Please upload at least one image.");
          return;
      }

      const activeCountry = getActiveCountry();
      let scheduleTimestamp: number | undefined = undefined;

      if (publishMode === 'scheduled') {
          if (!scheduledDate || !scheduledTime) {
              alert("Please select date and time for scheduling.");
              return;
          }
          const dt = new Date(`${scheduledDate}T${scheduledTime}`);
          if (dt.getTime() <= Date.now()) {
              alert("Scheduled time must be in the future.");
              return;
          }
          scheduleTimestamp = dt.getTime();
      }

      const newProduct: Product = {
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
          publishedTo: [],
          publishMode,
          scheduledAt: scheduleTimestamp,
          publishStatus: publishMode === 'scheduled' ? 'scheduled' : 'draft' 
      };
      
      let publishedPlatforms: string[] = [];

      // Logic: If Instant and AutoPublish is ON, publish now.
      // If Scheduled, just save.
      if (publishMode === 'instant' && autoPublish) {
          setPublishing(true);
          const accounts = storageService.getAccounts().filter(a => a.connected);
          
          if (accounts.length === 0) {
              alert("No connected accounts found. Product saved but not published.");
          } else {
              try {
                  for (const account of accounts) {
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
              } catch (error) {
                  console.error("Publish Error:", error);
                  alert(`Error publishing: ${error}`);
              }
          }
          setPublishing(false);
      } else if (publishMode === 'scheduled') {
          alert(`Product scheduled for ${new Date(scheduleTimestamp!).toLocaleString()}.`);
      }

      storageService.saveProduct(newProduct);
      
      loadData();
      setShowForm(false);
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
        setAutoPublish(true); // Default to true if re-editing non-scheduled
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
  };

  const activeCountry = getActiveCountry();

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

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
                                    <ImageIcon size={48} className="mb-2 opacity-50" />
                                    <span className="text-sm">No image selected</span>
                                </div>
                            )}
                        </div>

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
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-blue-900/50 mb-4">
                            <label className="block text-sm text-blue-300 mb-2 font-medium flex items-center gap-2">
                                <Globe size={14} /> Target Country & Market
                            </label>
                            <div className="flex gap-2 flex-wrap">
                                {countries.map(c => (
                                    <button 
                                        key={c.id}
                                        type="button"
                                        onClick={() => setTargetCountryId(c.id)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${targetCountryId === c.id ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}
                                    >
                                        {c.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Product Name</label>
                                    <input required type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-accent outline-none" placeholder="e.g., Smart Watch Ultra" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Price ({activeCountry.currency})</label>
                                        <input required type="number" value={price} onChange={e=>setPrice(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-accent outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Stock</label>
                                        <input required type="number" value={stock} onChange={e=>setStock(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-accent outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Category</label>
                                    <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-accent outline-none">
                                        <option>Electronics</option>
                                        <option>Fashion</option>
                                        <option>Home</option>
                                        <option>Beauty</option>
                                        <option>Photography</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                     <label className="block text-sm text-slate-400 mb-1">Description</label>
                                     <textarea value={desc} onChange={e=>setDesc(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-accent outline-none h-[180px] resize-none" placeholder="Describe features, warranty, etc." />
                                </div>
                            </div>
                        </div>

                        {/* Shipping & Publishing */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-700 pt-6">
                            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                                <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><Truck size={16}/> Shipping Configuration</h3>
                                <div className="flex gap-4 mb-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" checked={shippingType==='paid'} onChange={()=>setShippingType('paid')} className="accent-blue-500" />
                                        <span className="text-slate-300">Paid</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" checked={shippingType==='free'} onChange={()=>setShippingType('free')} className="accent-blue-500" />
                                        <span className="text-slate-300">Free</span>
                                    </label>
                                </div>
                                {shippingType === 'paid' && (
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Default Cost ({activeCountry.currency})</label>
                                        <input type="number" value={defaultShipping} onChange={e=>setDefaultShipping(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white" />
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-blue-900/10 rounded-xl border border-blue-900/30">
                                <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><Share2 size={16}/> Publishing Schedule</h3>
                                <div className="space-y-3">
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                checked={publishMode==='instant'} 
                                                onChange={()=>setPublishMode('instant')} 
                                                className="accent-blue-500" 
                                            />
                                            <span className="text-sm text-slate-300">Publish Now</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                checked={publishMode==='scheduled'} 
                                                onChange={()=>setPublishMode('scheduled')} 
                                                className="accent-blue-500" 
                                            />
                                            <span className="text-sm text-slate-300">Schedule</span>
                                        </label>
                                    </div>

                                    {publishMode === 'instant' && (
                                        <label className="flex items-center gap-2 cursor-pointer pt-2">
                                            <input 
                                                type="checkbox" 
                                                checked={autoPublish} 
                                                onChange={e=>setAutoPublish(e.target.checked)} 
                                                className="w-4 h-4 accent-blue-500 rounded" 
                                            />
                                            <span className="text-sm text-slate-400">Auto-publish to connected accounts</span>
                                        </label>
                                    )}

                                    {publishMode === 'scheduled' && (
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            <div>
                                                <label className="text-xs text-slate-500 block mb-1">Date</label>
                                                <input 
                                                    type="date" 
                                                    value={scheduledDate}
                                                    onChange={e => setScheduledDate(e.target.value)}
                                                    className="w-full bg-slate-800 border border-slate-600 rounded p-1.5 text-xs text-white" 
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-500 block mb-1">Time</label>
                                                <input 
                                                    type="time" 
                                                    value={scheduledTime}
                                                    onChange={e => setScheduledTime(e.target.value)}
                                                    className="w-full bg-slate-800 border border-slate-600 rounded p-1.5 text-xs text-white" 
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 text-slate-400 hover:text-white transition">Cancel</button>
                            <button type="submit" className="bg-accent hover:bg-accentHover px-8 py-2.5 rounded-xl text-white font-bold shadow-lg shadow-blue-900/20">{t.save[lang]}</button>
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
                        <th className="p-4 font-medium">Price</th>
                        <th className="p-4 font-medium">Market</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 text-slate-300">
                    {products.map(p => (
                        <tr key={p.id} className="hover:bg-slate-700/20 transition-colors group">
                            <td className="p-4 text-center align-top">
                                <div className="w-16 h-16 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden relative mx-auto group-hover:shadow-lg transition-all">
                                    {p.imageUrl ? (
                                        <>
                                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                            {p.images && p.images.length > 1 && (
                                                <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-tl-md backdrop-blur-sm flex items-center gap-0.5">
                                                    <Layers size={8} /> +{p.images.length - 1}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                                            <ImageIcon size={24} />
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="p-4 align-top">
                                <div className="font-bold text-white text-lg">{p.name}</div>
                                <div className="text-xs text-slate-500 mt-1 flex flex-col gap-1">
                                    <span>{p.category}</span>
                                    <span>Stock: <span className={p.stock < 10 ? 'text-red-400 font-bold' : 'text-slate-400'}>{p.stock} units</span></span>
                                </div>
                            </td>
                            <td className="p-4 font-mono text-white align-top">{p.price} <span className="text-xs text-slate-500">{p.currency}</span></td>
                            <td className="p-4 align-top">
                                <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-slate-700 text-slate-300">
                                    {p.targetCountryId ? countries.find(c=>c.id===p.targetCountryId)?.name || 'Global' : 'Global'}
                                </span>
                            </td>
                            <td className="p-4 align-top">
                                <div className="flex flex-col gap-2">
                                    {p.publishStatus === 'scheduled' ? (
                                        <div className="flex items-center gap-2 text-yellow-400 text-sm font-medium bg-yellow-400/10 px-2 py-1 rounded border border-yellow-400/20 w-fit">
                                            <Clock size={14} />
                                            <span>
                                                {p.scheduledAt ? new Date(p.scheduledAt).toLocaleString() : 'Scheduled'}
                                            </span>
                                        </div>
                                    ) : p.publishStatus === 'published' ? (
                                        <div className="flex items-center gap-2">
                                            {p.publishedTo.includes('Facebook') && <Facebook size={16} className="text-blue-500" title="Published on Facebook"/>}
                                            {p.publishedTo.includes('Instagram') && <div className="w-4 h-4 rounded bg-gradient-to-tr from-yellow-400 to-purple-600" title="Published on Instagram"/>}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-500 italic">Draft</span>
                                    )}
                                </div>
                            </td>
                            <td className="p-4 align-top">
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
                    {products.length === 0 && (
                        <tr>
                            <td colSpan={6} className="p-12 text-center text-slate-500">
                                <Package className="mx-auto mb-4 opacity-50" size={48} />
                                <p>No products added yet.</p>
                                <button onClick={handleAddClick} className="text-blue-400 hover:underline mt-2">Add your first product</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};