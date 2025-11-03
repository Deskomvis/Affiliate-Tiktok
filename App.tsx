
import React, { useState, useEffect, useMemo } from 'react';
import { View, Affiliator, Sample, Treatment, Product } from './types';
import { NAV_ITEMS, INITIAL_AFFILIATORS, INITIAL_SAMPLES, INITIAL_PRODUCTS } from './constants';
import { PlusIcon, TrashIcon, XIcon, WhatsappIcon, LinkIcon, CopyIcon, CheckIcon, EditIcon } from './components/Icons';

// Custom hook for localStorage persistence
const usePersistentState = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
};

const calculateTier = (followers: number): Affiliator['tier'] => {
    if (followers > 1000000) return 'Mega';
    if (followers > 100000) return 'Macro';
    if (followers > 10000) return 'Mid';
    if (followers > 1000) return 'Micro';
    return 'New';
};

const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const AddAffiliateModal = ({ onClose, onAdd }: { onClose: () => void; onAdd: (affiliator: Omit<Affiliator, 'id'>) => void; }) => {
    const [name, setName] = useState('');
    const [tiktok, setTiktok] = useState('');
    const [followers, setFollowers] = useState(0);
    const [niche, setNiche] = useState('');
    const [whatsapp, setWhatsapp] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !tiktok || followers <= 0 || !niche || !whatsapp) {
            alert('Please fill all fields');
            return;
        }

        let formattedWhatsapp = whatsapp.trim();
        if (formattedWhatsapp.startsWith('08')) {
            formattedWhatsapp = '+62' + formattedWhatsapp.substring(1);
        }

        const newAffiliator: Omit<Affiliator, 'id'> = {
            name,
            tiktok_account: tiktok.startsWith('@') ? tiktok : `@${tiktok}`,
            followers,
            niche,
            whatsapp: formattedWhatsapp,
            tier: calculateTier(followers),
            last_activity: getCurrentDate(),
        };

        onAdd(newAffiliator);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="bg-base-200 rounded-2xl shadow-xl w-full max-w-md border border-base-300 animate-fade-in-up">
                <div className="p-6 flex justify-between items-center border-b border-base-300">
                    <h2 className="text-xl font-bold text-primary-content">Add New Affiliate</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-base-300 text-slate-400" aria-label="Close modal">
                        <XIcon />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                        <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                        <label htmlFor="tiktok" className="block text-sm font-medium text-slate-400 mb-1">TikTok Account</label>
                        <input id="tiktok" type="text" value={tiktok} onChange={e => setTiktok(e.target.value)} placeholder="@username" required className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                        <label htmlFor="followers" className="block text-sm font-medium text-slate-400 mb-1">Followers</label>
                        <input id="followers" type="number" value={followers || ''} onChange={e => setFollowers(Number(e.target.value))} required className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none" />
                    </div>
                     <div>
                        <label htmlFor="niche" className="block text-sm font-medium text-slate-400 mb-1">Niche</label>
                        <input id="niche" type="text" value={niche} onChange={e => setNiche(e.target.value)} required className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                        <label htmlFor="whatsapp" className="block text-sm font-medium text-slate-400 mb-1">WhatsApp</label>
                        <input id="whatsapp" type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="08..." required className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none" />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-base-300 hover:bg-base-300/80 text-primary-content font-semibold">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-focus text-primary-content font-semibold">Save Affiliate</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EditAffiliateModal = ({ onClose, onSave, affiliate }: { onClose: () => void; onSave: (affiliator: Affiliator) => void; affiliate: Affiliator | null }) => {
    const [name, setName] = useState('');
    const [tiktok, setTiktok] = useState('');
    const [followers, setFollowers] = useState(0);
    const [niche, setNiche] = useState('');
    const [whatsapp, setWhatsapp] = useState('');

    useEffect(() => {
        if (affiliate) {
            setName(affiliate.name);
            setTiktok(affiliate.tiktok_account);
            setFollowers(affiliate.followers);
            setNiche(affiliate.niche);
            setWhatsapp(affiliate.whatsapp);
        }
    }, [affiliate]);

    if (!affiliate) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !tiktok || followers <= 0 || !niche || !whatsapp) {
            alert('Please fill all fields');
            return;
        }

        let formattedWhatsapp = whatsapp.trim();
        if (formattedWhatsapp.startsWith('08')) {
            formattedWhatsapp = '+62' + formattedWhatsapp.substring(1);
        }

        const updatedAffiliator: Affiliator = {
            ...affiliate,
            name,
            tiktok_account: tiktok.startsWith('@') ? tiktok : `@${tiktok}`,
            followers,
            niche,
            whatsapp: formattedWhatsapp,
            tier: calculateTier(followers),
        };

        onSave(updatedAffiliator);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="bg-base-200 rounded-2xl shadow-xl w-full max-w-md border border-base-300 animate-fade-in-up">
                <div className="p-6 flex justify-between items-center border-b border-base-300">
                    <h2 className="text-xl font-bold text-primary-content">Edit Affiliate</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-base-300 text-slate-400" aria-label="Close modal">
                        <XIcon />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="edit-name" className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                        <input id="edit-name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                        <label htmlFor="edit-tiktok" className="block text-sm font-medium text-slate-400 mb-1">TikTok Account</label>
                        <input id="edit-tiktok" type="text" value={tiktok} onChange={e => setTiktok(e.target.value)} placeholder="@username" required className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                        <label htmlFor="edit-followers" className="block text-sm font-medium text-slate-400 mb-1">Followers</label>
                        <input id="edit-followers" type="number" value={followers || ''} onChange={e => setFollowers(Number(e.target.value))} required className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none" />
                    </div>
                     <div>
                        <label htmlFor="edit-niche" className="block text-sm font-medium text-slate-400 mb-1">Niche</label>
                        <input id="edit-niche" type="text" value={niche} onChange={e => setNiche(e.target.value)} required className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                        <label htmlFor="edit-whatsapp" className="block text-sm font-medium text-slate-400 mb-1">WhatsApp</label>
                        <input id="edit-whatsapp" type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="08..." required className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none" />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-base-300 hover:bg-base-300/80 text-primary-content font-semibold">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-focus text-primary-content font-semibold">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AddSampleModal = ({ onClose, onAdd, affiliates, products }: { onClose: () => void; onAdd: (sample: Omit<Sample, 'id'>) => void; affiliates: Affiliator[], products: Product[] }) => {
    const [affiliateId, setAffiliateId] = useState<string>(affiliates[0]?.id || '');
    const [productName, setProductName] = useState(products[0]?.name || '');
    const [requestDate, setRequestDate] = useState(getCurrentDate());
    const [status, setStatus] = useState<Sample['status']>('Requested');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!affiliateId || !requestDate || !productName) {
            alert('Please fill all fields');
            return;
        }

        const affiliateName = affiliates.find(a => a.id === affiliateId)?.name;
        if (!affiliateName) {
             alert('Selected affiliate not found.');
            return;
        }

        const newSample: Omit<Sample, 'id'> = {
            name: affiliateName,
            product_name: productName,
            request_date: requestDate,
            status,
        };

        onAdd(newSample);
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="bg-base-200 rounded-2xl shadow-xl w-full max-w-md border border-base-300 animate-fade-in-up">
                <div className="p-6 flex justify-between items-center border-b border-base-300">
                    <h2 className="text-xl font-bold text-primary-content">Add New Sample Request</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-base-300 text-slate-400" aria-label="Close modal">
                        <XIcon />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="affiliate" className="block text-sm font-medium text-slate-400 mb-1">Affiliate</label>
                        <select id="affiliate" value={affiliateId} onChange={e => setAffiliateId(e.target.value)} required className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none appearance-none">
                            {affiliates.map(a => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="productName" className="block text-sm font-medium text-slate-400 mb-1">Product Name</label>
                        <select id="productName" value={productName} onChange={e => setProductName(e.target.value)} required className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none appearance-none">
                            {products.map(p => (
                                <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="requestDate" className="block text-sm font-medium text-slate-400 mb-1">Request Date</label>
                        <input id="requestDate" type="date" value={requestDate} onChange={e => setRequestDate(e.target.value)} required className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-slate-400 mb-1">Status</label>
                        <select id="status" value={status} onChange={e => setStatus(e.target.value as Sample['status'])} required className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none appearance-none">
                            <option value="Requested">Requested</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Received">Received</option>
                        </select>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-base-300 hover:bg-base-300/80 text-primary-content font-semibold">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-focus text-primary-content font-semibold">Save Request</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EditSampleModal = ({ onClose, onSave, sample, affiliates, products }: { onClose: () => void; onSave: (sample: Sample) => void; sample: Sample | null, affiliates: Affiliator[], products: Product[] }) => {
    const [affiliateName, setAffiliateName] = useState('');
    const [productName, setProductName] = useState('');
    const [requestDate, setRequestDate] = useState('');
    const [status, setStatus] = useState<Sample['status']>('Requested');

    useEffect(() => {
        if (sample) {
            setAffiliateName(sample.name);
            setProductName(sample.product_name);
            setRequestDate(sample.request_date);
            setStatus(sample.status);
        }
    }, [sample]);

    if (!sample) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!affiliateName || !productName || !requestDate) {
            alert('Please fill all fields');
            return;
        }

        const updatedSample: Sample = {
            ...sample,
            name: affiliateName,
            product_name: productName,
            request_date: requestDate,
            status,
        };

        onSave(updatedSample);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="bg-base-200 rounded-2xl shadow-xl w-full max-w-md border border-base-300 animate-fade-in-up">
                <div className="p-6 flex justify-between items-center border-b border-base-300">
                    <h2 className="text-xl font-bold text-primary-content">Edit Sample Request</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-base-300 text-slate-400" aria-label="Close modal">
                        <XIcon />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="edit-sample-affiliate" className="block text-sm font-medium text-slate-400 mb-1">Affiliate</label>
                        <select id="edit-sample-affiliate" value={affiliateName} onChange={e => setAffiliateName(e.target.value)} required className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none appearance-none">
                             {affiliates.map(a => (
                                <option key={a.id} value={a.name}>{a.name}</option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="edit-sample-productName" className="block text-sm font-medium text-slate-400 mb-1">Product Name</label>
                         <select id="edit-sample-productName" value={productName} onChange={e => setProductName(e.target.value)} required className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none appearance-none">
                            {products.map(p => (
                                <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="edit-sample-requestDate" className="block text-sm font-medium text-slate-400 mb-1">Request Date</label>
                        <input id="edit-sample-requestDate" type="date" value={requestDate} onChange={e => setRequestDate(e.target.value)} required className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                        <label htmlFor="edit-sample-status" className="block text-sm font-medium text-slate-400 mb-1">Status</label>
                        <select id="edit-sample-status" value={status} onChange={e => setStatus(e.target.value as Sample['status'])} required className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none appearance-none">
                            <option value="Requested">Requested</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Received">Received</option>
                        </select>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-base-300 hover:bg-base-300/80 text-primary-content font-semibold">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-focus text-primary-content font-semibold">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const AddProductModal = ({ onClose, onAdd }: { onClose: () => void; onAdd: (product: Omit<Product, 'id'>) => void; }) => {
    const [name, setName] = useState('');
    const [link, setLink] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !link) {
            alert('Please fill all fields');
            return;
        }

        try {
            new URL(link);
        } catch (_) {
            alert('Please enter a valid URL for the product link.');
            return;
        }

        onAdd({ name, link });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="bg-base-200 rounded-2xl shadow-xl w-full max-w-md border border-base-300 animate-fade-in-up">
                <div className="p-6 flex justify-between items-center border-b border-base-300">
                    <h2 className="text-xl font-bold text-primary-content">Add New Product</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-base-300 text-slate-400" aria-label="Close modal">
                        <XIcon />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="productName" className="block text-sm font-medium text-slate-400 mb-1">Product Name</label>
                        <input id="productName" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                        <label htmlFor="productLink" className="block text-sm font-medium text-slate-400 mb-1">Product Link</label>
                        <input id="productLink" type="url" value={link} onChange={e => setLink(e.target.value)} placeholder="https://..." required className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none" />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-base-300 hover:bg-base-300/80 text-primary-content font-semibold">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-focus text-primary-content font-semibold">Save Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children, confirmText = "Ya Delete", cancelText = "Jangan Delete" }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; children?: React.ReactNode; confirmText?: string; cancelText?: string; }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="bg-base-200 rounded-2xl shadow-xl w-full max-w-md border border-base-300 animate-fade-in-up">
                <div className="p-6 flex justify-between items-center border-b border-base-300">
                    <h2 className="text-xl font-bold text-primary-content">{title}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-base-300 text-slate-400" aria-label="Close modal">
                        <XIcon />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
                <div className="p-6 flex justify-end gap-3 border-t border-base-300">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-base-300 hover:bg-base-300/80 text-primary-content font-semibold">{cancelText}</button>
                    <button type="button" onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold">{confirmText}</button>
                </div>
            </div>
        </div>
    );
};

const WhatsappTemplateModal = ({ isOpen, onClose, affiliate, initialMessage }: { isOpen: boolean; onClose: () => void; affiliate: Affiliator | null; initialMessage?: string; }) => {
    const [modalView, setModalView] = useState<'main' | 'greeting' | 'video'>('main');
    const [videoLink, setVideoLink] = useState('');
    const [editableMessage, setEditableMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialMessage) {
                setEditableMessage(initialMessage);
                setModalView('greeting'); // Re-using this view as it's just a textarea and send button
            } else {
                setModalView('main');
                setVideoLink('');
                setEditableMessage('');
            }
        }
    }, [isOpen, initialMessage]);

    if (!isOpen || !affiliate) return null;

    const name = affiliate.name.split(' ')[0];

    const generateWhatsappLink = (message: string) => {
        const cleanWhatsapp = affiliate.whatsapp.replace(/[^0-9]/g, '');
        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${cleanWhatsapp}?text=${encodedMessage}`;
        window.open(url, '_blank');
        onClose();
    };

    const handleOpenGreetingEditor = () => {
        const message = `Halo kak ${name}, semoga sehat selalu ya!`;
        setEditableMessage(message);
        setModalView('greeting');
    };

    const handleOpenVideoEditor = () => {
        const message = `Kak ${name} silahkan download video affiliate kita untuk bahan postingan ya. Berikut link nya : {link}`;
        setEditableMessage(message);
        setModalView('video');
    };

    const handleSendBlank = () => {
        generateWhatsappLink('');
    };

    const handleSendEditedMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editableMessage) return;
        generateWhatsappLink(editableMessage);
    };

    const handleSendVideoLink = (e: React.FormEvent) => {
        e.preventDefault();
        if (!videoLink || !editableMessage) return;
        const finalMessage = editableMessage.replace('{link}', videoLink);
        generateWhatsappLink(finalMessage);
    };

    const renderContent = () => {
        switch (modalView) {
            case 'greeting':
                return (
                    <form onSubmit={handleSendEditedMessage} className="p-6 space-y-4">
                        <h3 className="text-secondary font-semibold">Edit Pesan</h3>
                        <div>
                            <label htmlFor="greetingMessage" className="block text-sm font-medium text-slate-400 mb-1">Teks Pesan</label>
                            <textarea id="greetingMessage" value={editableMessage} onChange={e => setEditableMessage(e.target.value)} rows={4} className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none" />
                        </div>
                        <div className="pt-2 flex justify-end gap-3">
                             <button type="button" onClick={initialMessage ? onClose : () => setModalView('main')} className="px-4 py-2 rounded-lg bg-base-300 hover:bg-base-300/80 text-primary-content font-semibold">
                                {initialMessage ? 'Cancel' : 'Kembali'}
                            </button>
                            <button type="submit" className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-focus text-primary-content font-semibold">Kirim Pesan</button>
                        </div>
                    </form>
                );
            case 'video':
                return (
                    <form onSubmit={handleSendVideoLink} className="p-6 space-y-4">
                        <h3 className="text-secondary font-semibold">Kirim Link Video</h3>
                        <div>
                            <label htmlFor="videoLink" className="block text-sm font-medium text-slate-400 mb-1">Link Video</label>
                            <input id="videoLink" type="url" value={videoLink} onChange={e => setVideoLink(e.target.value)} required className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none" placeholder="https://..." />
                        </div>
                        <div>
                            <label htmlFor="videoMessage" className="block text-sm font-medium text-slate-400 mb-1">Teks Pesan (bisa diedit)</label>
                             <textarea id="videoMessage" value={editableMessage} onChange={e => setEditableMessage(e.target.value)} rows={4} className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none" />
                             <p className="text-xs text-slate-400 mt-1">Gunakan {'{link}'} sebagai placeholder untuk link video.</p>
                        </div>
                        <div className="pt-2 flex justify-end gap-3">
                            <button type="button" onClick={() => setModalView('main')} className="px-4 py-2 rounded-lg bg-base-300 hover:bg-base-300/80 text-primary-content font-semibold">Kembali</button>
                            <button type="submit" className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-focus text-primary-content font-semibold">Kirim Pesan</button>
                        </div>
                    </form>
                );
            case 'main':
            default:
                return (
                     <div className="p-6 space-y-3">
                        <h3 className="text-secondary font-semibold">Pilih Template Pesan:</h3>
                        <button onClick={handleOpenGreetingEditor} className="w-full text-left p-4 rounded-lg bg-base-300 hover:bg-primary/20 transition-colors">1. Salam</button>
                        <button onClick={handleOpenVideoEditor} className="w-full text-left p-4 rounded-lg bg-base-300 hover:bg-primary/20 transition-colors">2. Kirim Link Video</button>
                        <button onClick={handleSendBlank} className="w-full text-left p-4 rounded-lg bg-base-300 hover:bg-primary/20 transition-colors">3. Blank Message</button>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="bg-base-200 rounded-2xl shadow-xl w-full max-w-md border border-base-300 animate-fade-in-up">
                <div className="p-6 flex justify-between items-center border-b border-base-300">
                    <h2 className="text-xl font-bold text-primary-content">Send WhatsApp to {affiliate.name}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-base-300 text-slate-400" aria-label="Close modal">
                        <XIcon />
                    </button>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};


const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Products);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [affiliateToEdit, setAffiliateToEdit] = useState<Affiliator | null>(null);
  const [isAddSampleModalOpen, setIsAddSampleModalOpen] = useState(false);
  const [isEditSampleModalOpen, setIsEditSampleModalOpen] = useState(false);
  const [sampleToEdit, setSampleToEdit] = useState<Sample | null>(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  
  // Delete Modals State
  const [isDeleteAffiliateModalOpen, setIsDeleteAffiliateModalOpen] = useState(false);
  const [affiliateToDelete, setAffiliateToDelete] = useState<Affiliator | null>(null);
  const [isDeleteSampleModalOpen, setIsDeleteSampleModalOpen] = useState(false);
  const [sampleToDelete, setSampleToDelete] = useState<Sample | null>(null);
  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // WhatsApp Modal State
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);
  const [selectedAffiliateForWhatsapp, setSelectedAffiliateForWhatsapp] = useState<Affiliator | null>(null);
  const [whatsappInitialMessage, setWhatsappInitialMessage] = useState('');

  // Broadcast state
  const [selectedAffiliates, setSelectedAffiliates] = useState<string[]>([]);
  const [broadcastMessage, setBroadcastMessage] = useState('Hi {name}, yuk semangat posting konten minggu ini! 🎥');
  const [broadcastSearch, setBroadcastSearch] = useState('');
  const [sentAffiliateIds, setSentAffiliateIds] = useState<string[]>([]);
  const [hideSent, setHideSent] = useState(false);
  
  // Product state
  const [copiedProductId, setCopiedProductId] = useState<string | null>(null);

  // Data State
  const [affiliators, setAffiliators] = usePersistentState<Affiliator[]>('affiliators', INITIAL_AFFILIATORS);
  const [samples, setSamples] = usePersistentState<Sample[]>('samples', INITIAL_SAMPLES);
  const [products, setProducts] = usePersistentState<Product[]>('products', INITIAL_PRODUCTS);
  const [treatments, setTreatments] = usePersistentState<Treatment[]>('treatments', []);


  const handleAddAffiliate = (newAffiliate: Omit<Affiliator, 'id'>) => {
      setAffiliators(prev => [...prev, { ...newAffiliate, id: crypto.randomUUID() }]);
      setIsAddModalOpen(false);
  };
  
  const handleUpdateAffiliate = (updatedAffiliate: Affiliator) => {
    setAffiliators(prev => prev.map(a => a.id === updatedAffiliate.id ? updatedAffiliate : a));
    handleCloseEditModal();
  };
  
  const handleAddSample = (newSample: Omit<Sample, 'id'>) => {
    setSamples(prev => [...prev, { ...newSample, id: crypto.randomUUID() }]);
    setIsAddSampleModalOpen(false);
  };

  const handleUpdateSample = (updatedSample: Sample) => {
    setSamples(prev => prev.map(s => s.id === updatedSample.id ? updatedSample : s));
    handleCloseEditSampleModal();
  };

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { ...newProduct, id: crypto.randomUUID() }]);
    setIsAddProductModalOpen(false);
  };
  
  const handleOpenEditModal = (affiliate: Affiliator) => {
    setAffiliateToEdit(affiliate);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setAffiliateToEdit(null);
    setIsEditModalOpen(false);
  };
  
  const handleOpenEditSampleModal = (sample: Sample) => {
    setSampleToEdit(sample);
    setIsEditSampleModalOpen(true);
  };

  const handleCloseEditSampleModal = () => {
    setSampleToEdit(null);
    setIsEditSampleModalOpen(false);
  };

  const handleOpenDeleteAffiliateModal = (affiliate: Affiliator) => {
    setAffiliateToDelete(affiliate);
    setIsDeleteAffiliateModalOpen(true);
  };

  const handleCloseDeleteAffiliateModal = () => {
    setAffiliateToDelete(null);
    setIsDeleteAffiliateModalOpen(false);
  };

  const handleConfirmDeleteAffiliate = () => {
    if (affiliateToDelete) {
      setAffiliators(prev => prev.filter(a => a.id !== affiliateToDelete.id));
      handleCloseDeleteAffiliateModal();
    }
  };
  
  const handleOpenWhatsappModal = (affiliate: Affiliator) => {
      setSelectedAffiliateForWhatsapp(affiliate);
      setIsWhatsappModalOpen(true);
  };

   const handleOpenSampleReminder = (sample: Sample) => {
        const affiliate = affiliators.find(a => a.name === sample.name);
        if (affiliate) {
            const message = `Halo kak ${affiliate.name.split(' ')[0]}, mau follow up untuk sample produknya ya. Sesuai kesepakatan, ditunggu 5 video TikTok-nya. Semangat! 💪`;
            setWhatsappInitialMessage(message);
            setSelectedAffiliateForWhatsapp(affiliate);
            setIsWhatsappModalOpen(true);
        } else {
            alert(`Affiliate with name "${sample.name}" not found.`);
        }
    };
    
    const handleUpdateSampleStatus = (sampleId: string, status: Sample['status']) => {
        setSamples(prev => prev.map(s => s.id === sampleId ? { ...s, status } : s));
    };

    const handleOpenDeleteSampleModal = (sample: Sample) => {
        setSampleToDelete(sample);
        setIsDeleteSampleModalOpen(true);
    };

    const handleCloseDeleteSampleModal = () => {
        setSampleToDelete(null);
        setIsDeleteSampleModalOpen(false);
    };

    const handleConfirmDeleteSample = () => {
        if (sampleToDelete) {
            setSamples(prev => prev.filter(s => s.id !== sampleToDelete.id));
            handleCloseDeleteSampleModal();
        }
    };
    
    const handleOpenDeleteProductModal = (product: Product) => {
        setProductToDelete(product);
        setIsDeleteProductModalOpen(true);
    };

    const handleCloseDeleteProductModal = () => {
        setProductToDelete(null);
        setIsDeleteProductModalOpen(false);
    };

    const handleConfirmDeleteProduct = () => {
        if (productToDelete) {
            setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
            handleCloseDeleteProductModal();
        }
    };
    
    const handleCopyProductLink = (link: string, productId: string) => {
        navigator.clipboard.writeText(link).then(() => {
            setCopiedProductId(productId);
            setTimeout(() => setCopiedProductId(null), 2000); // Reset after 2 seconds
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy link.');
        });
    };

  const getTierColor = (tier: Affiliator['tier']) => {
    switch (tier) {
      case 'Mega': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Macro': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Mid': return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
      case 'Micro': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };
  
  const getSampleStatusColor = (status: Sample['status']) => {
    switch(status) {
        case 'Shipped': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case 'Received': return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'Processing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'Requested': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
        default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const DashboardView = () => {
    const topAffiliators = useMemo(() => [...affiliators].sort((a, b) => b.followers - a.followers).slice(0, 5), [affiliators]);
    const nicheDistribution = useMemo(() => {
        return affiliators.reduce((acc, curr) => {
            acc[curr.niche] = (acc[curr.niche] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    }, [affiliators]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-primary-content">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-base-200 p-6 rounded-xl border border-base-300">
                    <h2 className="text-xl font-semibold mb-4 text-secondary">Total Affiliators</h2>
                    <p className="text-5xl font-bold text-primary-content">{affiliators.length}</p>
                </div>
                 <div className="bg-base-200 p-6 rounded-xl border border-base-300">
                    <h2 className="text-xl font-semibold mb-4 text-secondary">Active Samples</h2>
                    <p className="text-5xl font-bold text-primary-content">{samples.filter(s => s.status !== 'Received').length}</p>
                </div>
                 <div className="bg-base-200 p-6 rounded-xl border border-base-300">
                    <h2 className="text-xl font-semibold mb-4 text-secondary">Total Products</h2>
                    <p className="text-5xl font-bold text-primary-content">{products.length}</p>
                </div>
                <div className="md:col-span-2 bg-base-200 p-6 rounded-xl border border-base-300">
                    <h2 className="text-xl font-semibold mb-4 text-secondary">Top 5 Affiliators by Followers</h2>
                    <ul className="space-y-3">
                        {topAffiliators.map(a => (
                            <li key={a.id} className="flex justify-between items-center bg-base-300/50 p-3 rounded-lg">
                                <div>
                                    <p className="font-semibold text-primary-content">{a.name}</p>
                                    <p className="text-sm text-base-content">{a.tiktok_account}</p>
                                </div>
                                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getTierColor(a.tier)}`}>
                                    {a.followers.toLocaleString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-base-200 p-6 rounded-xl border border-base-300">
                    <h2 className="text-xl font-semibold mb-4 text-secondary">Niche Distribution</h2>
                    <div className="space-y-3">
                        {Object.entries(nicheDistribution).map(([niche, count]) => (
                            <div key={niche} className="flex justify-between items-center">
                                <span className="text-primary-content">{niche}</span>
                                <span className="font-bold text-secondary">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


  const renderView = () => {
    switch (view) {
      case View.Dashboard:
        return <DashboardView />;
      case View.Affiliates:
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold text-primary-content">Affiliates</h1>
                  <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-focus text-primary-content font-semibold transition-colors">
                      <PlusIcon />
                      <span>Add Affiliate</span>
                  </button>
                </div>
                 <div className="overflow-x-auto bg-base-200 rounded-xl border border-base-300">
                    <table className="w-full text-left">
                        <thead className="border-b border-base-300">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">TikTok</th>
                                <th className="p-4">Followers</th>
                                <th className="p-4">Niche</th>
                                <th className="p-4">Tier</th>
                                <th className="p-4">Nomer Whatsapp</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {affiliators.map(a => (
                                <tr key={a.id} className="border-b border-base-300 last:border-b-0 hover:bg-base-300/50 transition-colors">
                                    <td className="p-4 font-medium text-primary-content">{a.name}</td>
                                    <td className="p-4 text-secondary">{a.tiktok_account}</td>
                                    <td className="p-4">{a.followers.toLocaleString()}</td>
                                    <td className="p-4">{a.niche}</td>
                                    <td className="p-4"><span className={`px-2 py-1 text-xs rounded-full border ${getTierColor(a.tier)}`}>{a.tier}</span></td>
                                    <td className="p-4">{a.whatsapp}</td>
                                    <td className="p-4 flex items-center gap-2">
                                        <button onClick={() => handleOpenEditModal(a)} className="text-slate-500 hover:text-sky-400 p-1 rounded-full hover:bg-sky-500/10" aria-label={`Edit ${a.name}`}>
                                            <EditIcon />
                                        </button>
                                        <button onClick={() => handleOpenWhatsappModal(a)} className="text-slate-500 hover:text-green-400 p-1 rounded-full hover:bg-green-500/10" aria-label={`Send WhatsApp to ${a.name}`}>
                                            <WhatsappIcon />
                                        </button>
                                        <button onClick={() => handleOpenDeleteAffiliateModal(a)} className="text-slate-500 hover:text-red-400 p-1 rounded-full hover:bg-red-500/10" aria-label={`Delete ${a.name}`}>
                                            <TrashIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
        case View.Samples:
            return (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-primary-content">Manage Samples</h1>
                        <button onClick={() => setIsAddSampleModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-focus text-primary-content font-semibold transition-colors">
                           <PlusIcon />
                           <span>Add Sample</span>
                        </button>
                    </div>
                     <div className="overflow-x-auto bg-base-200 rounded-xl border border-base-300">
                        <table className="w-full text-left">
                            <thead className="border-b border-base-300">
                                <tr>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Product Name</th>
                                    <th className="p-4">Request Date</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {samples.map(s => (
                                    <tr key={s.id} className="border-b border-base-300 last:border-b-0 hover:bg-base-300/50 transition-colors">
                                        <td className="p-4 font-medium text-primary-content">{s.name}</td>
                                        <td className="p-4">{s.product_name}</td>
                                        <td className="p-4">{s.request_date}</td>
                                        <td className="p-4">
                                            <select 
                                                value={s.status}
                                                onChange={(e) => handleUpdateSampleStatus(s.id, e.target.value as Sample['status'])}
                                                className={`px-2 py-1 text-xs rounded-full border appearance-none focus:outline-none focus:ring-1 focus:ring-primary ${getSampleStatusColor(s.status)}`}
                                            >
                                                <option value="Requested">Requested</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Received">Received</option>
                                            </select>
                                        </td>
                                        <td className="p-4 flex items-center gap-2">
                                             <button onClick={() => handleOpenEditSampleModal(s)} className="text-slate-500 hover:text-sky-400 p-1 rounded-full hover:bg-sky-500/10" aria-label={`Edit sample for ${s.name}`}>
                                                <EditIcon />
                                            </button>
                                             <button onClick={() => handleOpenSampleReminder(s)} className="text-slate-500 hover:text-green-400 p-1 rounded-full hover:bg-green-500/10" aria-label={`Send reminder for ${s.name}`}>
                                                <WhatsappIcon />
                                            </button>
                                             <button onClick={() => handleOpenDeleteSampleModal(s)} className="text-slate-500 hover:text-red-400 p-1 rounded-full hover:bg-red-500/10" aria-label={`Delete sample for ${s.name}`}>
                                                <TrashIcon />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                 {samples.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center p-8 text-slate-400">No sample requests yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        case View.Products:
            return (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-primary-content">Manage Products</h1>
                        <button onClick={() => setIsAddProductModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-focus text-primary-content font-semibold transition-colors">
                           <PlusIcon />
                           <span>Add Product</span>
                        </button>
                    </div>
                     <div className="overflow-x-auto bg-base-200 rounded-xl border border-base-300">
                        <table className="w-full text-left">
                            <thead className="border-b border-base-300">
                                <tr>
                                    <th className="p-4">Product Name</th>
                                    <th className="p-4">Product Link</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id} className="border-b border-base-300 last:border-b-0 hover:bg-base-300/50 transition-colors">
                                        <td className="p-4 font-medium text-primary-content">{p.name}</td>
                                        <td className="p-4">
                                            <a href={p.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-secondary hover:underline">
                                                <LinkIcon />
                                                <span>{p.link}</span>
                                            </a>
                                        </td>
                                        <td className="p-4 flex items-center gap-2">
                                            <button 
                                                onClick={() => handleCopyProductLink(p.link, p.id)}
                                                className={`p-1 rounded-full transition-colors ${copiedProductId === p.id ? 'text-green-400' : 'text-slate-500 hover:text-sky-400 hover:bg-sky-500/10'}`}
                                                aria-label={`Copy link for ${p.name}`}
                                                disabled={copiedProductId === p.id}
                                            >
                                                {copiedProductId === p.id ? <CheckIcon /> : <CopyIcon />}
                                            </button>
                                             <button onClick={() => handleOpenDeleteProductModal(p)} className="text-slate-500 hover:text-red-400 p-1 rounded-full hover:bg-red-500/10" aria-label={`Delete product ${p.name}`}>
                                                <TrashIcon />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                 {products.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="text-center p-8 text-slate-400">No products added yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        case View.Broadcast: {
            const handleSelectAffiliate = (id: string) => {
                setSelectedAffiliates(prev => 
                    prev.includes(id) ? prev.filter(affId => affId !== id) : [...prev, id]
                );
            };

            const filteredAffiliates = affiliators.filter(a => a.name.toLowerCase().includes(broadcastSearch.toLowerCase()));

            const handleSelectAll = () => {
                 const availableAffiliates = filteredAffiliates.filter(a => !sentAffiliateIds.includes(a.id)).map(a => a.id);
                if (selectedAffiliates.length === availableAffiliates.length) {
                    setSelectedAffiliates([]);
                } else {
                    setSelectedAffiliates(availableAffiliates);
                }
            };
            
            const handleBroadcastSubmit = () => {
                if (selectedAffiliates.length === 0 || !broadcastMessage.trim()) {
                    alert("Please select affiliates and write a message.");
                    return;
                }
                
                const targets = affiliators.filter(a => selectedAffiliates.includes(a.id));
                
                targets.forEach(affiliate => {
                    const personalizedMessage = broadcastMessage.replace(/\{name\}/g, affiliate.name.split(' ')[0]);
                    const cleanWhatsapp = affiliate.whatsapp.replace(/[^0-9]/g, '');
                    const encodedMessage = encodeURIComponent(personalizedMessage);
                    const url = `https://wa.me/${cleanWhatsapp}?text=${encodedMessage}`;
                    window.open(url, '_blank');
                });

                setSentAffiliateIds(prev => [...new Set([...prev, ...selectedAffiliates])]);
                setSelectedAffiliates([]);
            };
            
            const affiliatesToDisplay = filteredAffiliates.filter(a => !(hideSent && sentAffiliateIds.includes(a.id)));

            return (
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold text-primary-content">Broadcast Center</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-250px)]">
                        {/* Left Column: Affiliate Selection */}
                        <div className="bg-base-200 rounded-xl border border-base-300 flex flex-col">
                           <div className="p-4 border-b border-base-300 space-y-3">
                                <input 
                                    type="text"
                                    placeholder="Search affiliate..."
                                    value={broadcastSearch}
                                    onChange={e => setBroadcastSearch(e.target.value)}
                                    className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none"
                                />
                                <div className="flex items-center justify-between text-sm">
                                     <div className="flex items-center gap-2">
                                        <input 
                                            type="checkbox"
                                            id="selectAll"
                                            className="h-4 w-4 rounded bg-base-300 border-slate-500 text-primary focus:ring-primary"
                                            checked={filteredAffiliates.filter(a => !sentAffiliateIds.includes(a.id)).length > 0 && selectedAffiliates.length === filteredAffiliates.filter(a => !sentAffiliateIds.includes(a.id)).length}
                                            onChange={handleSelectAll}
                                        />
                                        <label htmlFor="selectAll" className="font-medium text-slate-300">Select All</label>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" id="hideSent" checked={hideSent} onChange={() => setHideSent(!hideSent)} className="h-4 w-4 rounded bg-base-300 border-slate-500 text-primary focus:ring-primary" />
                                            <label htmlFor="hideSent" className="font-medium text-slate-300">Hide Sent</label>
                                        </div>
                                        <span className="text-secondary">{selectedAffiliates.length} of {filteredAffiliates.length} selected</span>
                                    </div>
                               </div>
                           </div>
                           <ul className="flex-1 overflow-y-auto p-2">
                               {affiliatesToDisplay.map(a => {
                                    const isSent = sentAffiliateIds.includes(a.id);
                                    return (
                                        <li key={a.id} className={isSent ? 'opacity-50' : ''}>
                                            <label htmlFor={`aff-${a.id}`} className={`flex items-center gap-3 p-3 rounded-lg ${isSent ? 'cursor-not-allowed' : 'hover:bg-base-300/50 cursor-pointer'}`}>
                                                <input 
                                                   type="checkbox" 
                                                   id={`aff-${a.id}`}
                                                   className="h-4 w-4 rounded bg-base-300 border-slate-500 text-primary focus:ring-primary disabled:opacity-50"
                                                   checked={selectedAffiliates.includes(a.id)}
                                                   onChange={() => handleSelectAffiliate(a.id)}
                                                   disabled={isSent}
                                                />
                                                <div>
                                                   <p className="font-semibold text-primary-content">{a.name}</p>
                                                   <p className="text-xs text-slate-400">{a.whatsapp}</p>
                                                </div>
                                            </label>
                                        </li>
                                    );
                               })}
                           </ul>
                        </div>
                        {/* Right Column: Message Composer */}
                        <div className="bg-base-200 rounded-xl border border-base-300 p-4 flex flex-col justify-between">
                            <div className="space-y-3">
                                <div>
                                    <label htmlFor="broadcastMessage" className="font-semibold text-secondary">Message Composer</label>
                                    <textarea
                                        id="broadcastMessage"
                                        rows={8}
                                        value={broadcastMessage}
                                        onChange={e => setBroadcastMessage(e.target.value)}
                                        className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none mt-2"
                                    />
                                    <p className="text-xs text-slate-400">Gunakan <code className="bg-base-300 px-1 rounded">{'{name}'}</code> untuk personalisasi nama. Contoh: 'Hi {'{name}'}, ...'</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleBroadcastSubmit}
                                disabled={selectedAffiliates.length === 0 || !broadcastMessage.trim()}
                                className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-3 rounded-lg bg-primary hover:bg-primary-focus text-primary-content font-semibold transition-colors disabled:bg-base-300 disabled:text-slate-500"
                            >
                                Send Message to {selectedAffiliates.length} Affiliate(s)
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
        case View.Treatment:
            return (
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold text-primary-content">Affiliator Treatments</h1>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {treatments.map(t => (
                            <div key={t.id} className="bg-base-200 p-6 rounded-xl border border-base-300 space-y-4">
                                <div>
                                    <h2 className="text-xl font-bold text-primary-content">{t.name}</h2>
                                    <p className="text-sm text-secondary">{t.performance}</p>
                                </div>
                                <p className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white p-4 rounded-lg shadow-lg">✨ {t.ai_message}</p>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-400 mb-1">Reward Suggestion</h3>
                                    <p className="text-primary-content">{t.reward_suggestion}</p>
                                </div>
                            </div>
                        ))}
                         {treatments.length === 0 && (
                           <div className="md:col-span-2 text-center p-8 text-slate-400 bg-base-200 rounded-xl border border-base-300">
                               No special treatments have been generated yet.
                           </div>
                       )}
                    </div>
                </div>
            );
      default:
        return <div>Select a view</div>;
    }
  };


  return (
    <div className="flex h-screen bg-base-100 text-base-content font-sans">
      {isAddModalOpen && <AddAffiliateModal onClose={() => setIsAddModalOpen(false)} onAdd={handleAddAffiliate} />}
      {isEditModalOpen && <EditAffiliateModal onClose={handleCloseEditModal} onSave={handleUpdateAffiliate} affiliate={affiliateToEdit} />}
      {isAddSampleModalOpen && <AddSampleModal onClose={() => setIsAddSampleModalOpen(false)} onAdd={handleAddSample} affiliates={affiliators} products={products} />}
      {isEditSampleModalOpen && <EditSampleModal onClose={handleCloseEditSampleModal} onSave={handleUpdateSample} sample={sampleToEdit} affiliates={affiliators} products={products} />}
      {isAddProductModalOpen && <AddProductModal onClose={() => setIsAddProductModalOpen(false)} onAdd={handleAddProduct} />}
      <ConfirmationModal
        isOpen={isDeleteAffiliateModalOpen}
        onClose={handleCloseDeleteAffiliateModal}
        onConfirm={handleConfirmDeleteAffiliate}
        title="Konfirmasi Hapus"
      >
        <p className="text-base-content">
          Yakin delete <strong className="text-primary-content">{affiliateToDelete?.name}</strong>?
        </p>
      </ConfirmationModal>
       <ConfirmationModal
        isOpen={isDeleteSampleModalOpen}
        onClose={handleCloseDeleteSampleModal}
        onConfirm={handleConfirmDeleteSample}
        title="Konfirmasi Hapus Sample"
      >
        <p className="text-base-content">
          Yakin delete sample <strong className="text-primary-content">{sampleToDelete?.product_name}</strong> untuk <strong className="text-primary-content">{sampleToDelete?.name}</strong>?
        </p>
      </ConfirmationModal>
       <ConfirmationModal
        isOpen={isDeleteProductModalOpen}
        onClose={handleCloseDeleteProductModal}
        onConfirm={handleConfirmDeleteProduct}
        title="Konfirmasi Hapus Product"
      >
        <p className="text-base-content">
          Yakin delete product <strong className="text-primary-content">{productToDelete?.name}</strong>?
        </p>
      </ConfirmationModal>
      <WhatsappTemplateModal 
        isOpen={isWhatsappModalOpen}
        onClose={() => {
            setIsWhatsappModalOpen(false);
            setWhatsappInitialMessage('');
        }}
        affiliate={selectedAffiliateForWhatsapp}
        initialMessage={whatsappInitialMessage}
      />
      {/* Sidebar */}
      <aside className="w-64 bg-base-200/50 border-r border-base-300 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary-content">Affiliate AI</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-left ${
                view === item.id 
                ? 'bg-primary text-primary-content shadow-lg' 
                : 'hover:bg-base-300/50 text-slate-300'
              }`}
            >
              {item.icon}
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
