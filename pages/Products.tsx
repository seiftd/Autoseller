import React, { useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { Product, Language, ShippingConfig } from '../types';
import { TEXTS, WILAYAS, SHIPPING_COMPANIES } from '../constants';
import { Plus, Package, Edit2, Trash2, CheckCircle, XCircle, Truck, Facebook, Share2, Upload, X, Image as ImageIcon } from 'lucide-react';

interface Props {
  lang: Language;
}

export const Products: React.FC<Props> = ({ lang }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const t = TEXTS;
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [shippingType, setShippingType] = useState<'free'|'paid'>('paid');
  const [defaultShipping, setDefaultShipping] = useState(600);
  const [autoPublish, setAutoPublish] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setProducts(storageService.getProducts());
  };

  const handleImageSelect = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Max 5MB.");
      return;
    }
    // Check file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert("Invalid file type. Only JPG, PNG, WEBP allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const newProduct: Product = {
          id: editingId || crypto.randomUUID(),
          name,
          price: Number(price),
          stock: Number(stock),
          description: desc,
          category,
          hashtags: ['#new', `#${category.toLowerCase()}`],
          imageUrl: imagePreview || undefined,
          active: true,
          shipping: {
              type: shippingType,
              defaultCost: shippingType === 'free' ? 0 : defaultShipping,
              wilayaCosts: {},
              companies: ['Yalidine']
          },
          paymentMethods: ['cod'],
          publishedTo: autoPublish ? ['Facebook', 'Instagram'] : (editingId ? products.find(p=>p.id===editingId)?.publishedTo || [] : [])
      };
      
      storageService.saveProduct(newProduct);
      
      if (autoPublish) {
          // Simulate Social Media Post Structure
          const postContent = `
[Image Attached]
🔥 ${newProduct.name}

${newProduct.description}

Price: ${newProduct.price} DA
Delivery: ${newProduct.shipping.type === 'free' ? 'FREE' : `Starts from ${newProduct.shipping.defaultCost} DA`}

Payment: Cash on delivery

${newProduct.hashtags.join(' ')}
          `;
          console.log("PUBLISHING TO SOCIALS:", postContent);
          alert(`Product Published to Facebook & Instagram! \n\nCheck console for post preview.`);
      }
      
      loadProducts();
      setShowForm(false);
      resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price.toString());
    setStock(product.stock.toString());
    setDesc(product.description);
    setCategory(product.category);
    setShippingType(product.shipping.type);
    setDefaultShipping(product.shipping.defaultCost);
    setImagePreview(product.imageUrl || null);
    setAutoPublish(false);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
      if(confirm('Delete this product?')) {
          storageService.deleteProduct(id);
          loadProducts();
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
      setImagePreview(null);
      setAutoPublish(true);
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
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="bg-accent hover:bg-accentHover text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all"
                >
                    <Plus size={18} />
                    {t.addProduct[lang]}
                </button>
            )}
        </div>

        {/* Add/Edit Product Form */}
        {showForm && (
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl animate-fade-in-up">
                <h2 className="text-xl font-bold text-white mb-6">
                    {editingId ? 'Edit Product' : 'New Product Details'}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Image Upload */}
                    <div className="space-y-4">
                        <label className="block text-sm text-slate-400 mb-1">{t.productImage[lang]}</label>
                        
                        {!imagePreview ? (
                             <div 
                                onDragOver={onDragOver}
                                onDragLeave={onDragLeave}
                                onDrop={onDrop}
                                className={`
                                    border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer h-64
                                    ${isDragging 
                                        ? 'border-blue-500 bg-blue-500/10' 
                                        : 'border-slate-700 bg-slate-900/50 hover:border-blue-400 hover:bg-slate-900'}
                                `}
                                onClick={() => document.getElementById('file-upload')?.click()}
                             >
                                <input 
                                    id="file-upload" 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={(e) => e.target.files && handleImageSelect(e.target.files[0])}
                                />
                                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                                    <Upload className={`text-slate-400 ${isDragging ? 'text-blue-400' : ''}`} size={24} />
                                </div>
                                <p className="text-slate-300 font-medium mb-1">{t.dragDrop[lang]}</p>
                                <p className="text-xs text-slate-500">JPG, PNG, WEBP (Max 5MB)</p>
                             </div>
                        ) : (
                            <div className="relative group rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 h-64 flex items-center justify-center">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button 
                                        type="button"
                                        onClick={() => setImagePreview(null)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition"
                                    >
                                        <X size={16} />
                                        {t.remove[lang]}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Form Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Product Name</label>
                            <input required type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-accent outline-none" placeholder="e.g., Smart Watch Ultra" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Price (DA)</label>
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
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm text-slate-400 mb-1">Description</label>
                             <textarea value={desc} onChange={e=>setDesc(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-accent outline-none h-24" placeholder="Describe features, warranty, etc." />
                        </div>
                    </div>

                    {/* Bottom Full Width: Shipping & Publishing */}
                    <div className="col-span-1 md:col-span-2 space-y-6 border-t border-slate-700 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                                <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><Truck size={16}/> Shipping Configuration</h3>
                                <div className="flex gap-4 mb-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" checked={shippingType==='paid'} onChange={()=>setShippingType('paid')} className="accent-blue-500" />
                                        <span className="text-slate-300">Paid Shipping</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" checked={shippingType==='free'} onChange={()=>setShippingType('free')} className="accent-blue-500" />
                                        <span className="text-slate-300">Free Shipping</span>
                                    </label>
                                </div>
                                {shippingType === 'paid' && (
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Default Cost (DA)</label>
                                        <input type="number" value={defaultShipping} onChange={e=>setDefaultShipping(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white" />
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-blue-900/10 rounded-xl border border-blue-900/30">
                                <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><Share2 size={16}/> Social Publishing</h3>
                                <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-800/50 transition">
                                    <input 
                                        type="checkbox" 
                                        checked={autoPublish} 
                                        onChange={e=>setAutoPublish(e.target.checked)} 
                                        disabled={!!editingId} // Disable auto-publish on edit to prevent reposting spam
                                        className="w-5 h-5 accent-blue-500 rounded" 
                                    />
                                    <div>
                                        <p className="text-white font-medium">Auto-Publish to Connected Accounts</p>
                                        <p className="text-xs text-slate-400">
                                            {editingId ? "Republishing disabled during edit" : "Post to Facebook & Instagram automatically"}
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
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
                        <th className="p-4 font-medium">Shipping</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 text-slate-300">
                    {products.map(p => (
                        <tr key={p.id} className="hover:bg-slate-700/20 transition-colors group">
                            <td className="p-4 text-center">
                                <div className="w-16 h-16 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden relative mx-auto">
                                    {p.imageUrl ? (
                                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                                            <ImageIcon size={24} />
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="font-bold text-white text-lg">{p.name}</div>
                                <div className="text-xs text-slate-500 mt-1 flex flex-col gap-1">
                                    <span>{p.category}</span>
                                    <span>Stock: <span className={p.stock < 10 ? 'text-red-400 font-bold' : 'text-slate-400'}>{p.stock} units</span></span>
                                </div>
                            </td>
                            <td className="p-4 font-mono text-white">{p.price} DA</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${p.shipping.type === 'free' ? 'bg-green-500/10 text-green-400' : 'bg-slate-700 text-slate-300'}`}>
                                    {p.shipping.type === 'free' ? 'FREE' : `${p.shipping.defaultCost} DA`}
                                </span>
                            </td>
                            <td className="p-4">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        {p.publishedTo.includes('Facebook') && <Facebook size={16} className="text-blue-500" title="Published on Facebook"/>}
                                        {p.publishedTo.includes('Instagram') && <div className="w-4 h-4 rounded bg-gradient-to-tr from-yellow-400 to-purple-600" title="Published on Instagram"/>}
                                        {p.publishedTo.length === 0 && <span className="text-xs text-slate-500 italic">Unpublished</span>}
                                    </div>
                                </div>
                            </td>
                            <td className="p-4">
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
                                <button onClick={() => setShowForm(true)} className="text-blue-400 hover:underline mt-2">Add your first product</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};