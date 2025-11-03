
import React, { useState, useEffect, useMemo } from 'react';
import { View, Affiliator, Sample, Broadcast, Reminder, Treatment } from './types';
import { NAV_ITEMS, INITIAL_AFFILIATORS, INITIAL_SAMPLES, INITIAL_REMINDERS } from './constants';
import { PlusIcon, TrashIcon, XIcon, WhatsappIcon } from './components/Icons';

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

        const newAffiliator: Omit<Affiliator, 'id'> = {
            name,
            tiktok_account: tiktok.startsWith('@') ? tiktok : `@${tiktok}`,
            followers,
            niche,
            whatsapp,
            tier: calculateTier(followers),
            last_activity: getCurrentDate(),
        };

        onAdd(newAffiliator);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
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
                        <input id="whatsapp" type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+62..." required className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none" />
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

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; children?: React.ReactNode }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
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
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-base-300 hover:bg-base-300/80 text-primary-content font-semibold">Jangan Delete</button>
                    <button type="button" onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold">Ya Delete</button>
                </div>
            </div>
        </div>
    );
};

const WhatsappTemplateModal = ({ isOpen, onClose, affiliate }: { isOpen: boolean; onClose: () => void; affiliate: Affiliator | null }) => {
    if (!isOpen || !affiliate) return null;

    const handleTemplateClick = (template: 'greeting' | 'video' | 'image' | 'blank') => {
        let message = '';
        const name = affiliate.name.split(' ')[0]; // Use first name

        switch (template) {
            case 'greeting':
                message = `Halo kak ${name}, semoga sehat selalu ya!`;
                break;
            case 'video':
                const videoUrl = prompt("Masukkan URL video yang ingin dikirim:");
                if (videoUrl) {
                    message = `Halo kak ${name}, jangan lupa cek video terbaru kita ya! Ini linknya: ${videoUrl}`;
                } else return; // User cancelled
                break;
            case 'image':
                const imageUrl = prompt("Masukkan URL gambar:");
                if (!imageUrl) return; // User cancelled
                const text = prompt("Masukkan teks untuk gambar:");
                if (text === null) return; // User cancelled
                message = `${text} ${imageUrl}`;
                break;
            case 'blank':
                message = '';
                break;
        }

        const cleanWhatsapp = affiliate.whatsapp.replace(/[^0-9]/g, '');
        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${cleanWhatsapp}?text=${encodedMessage}`;
        
        window.open(url, '_blank');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div className="bg-base-200 rounded-2xl shadow-xl w-full max-w-md border border-base-300 animate-fade-in-up">
                <div className="p-6 flex justify-between items-center border-b border-base-300">
                    <h2 className="text-xl font-bold text-primary-content">Send WhatsApp to {affiliate.name}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-base-300 text-slate-400" aria-label="Close modal">
                        <XIcon />
                    </button>
                </div>
                <div className="p-6 space-y-3">
                    <h3 className="text-secondary font-semibold">Pilih Template Pesan:</h3>
                    <button onClick={() => handleTemplateClick('greeting')} className="w-full text-left p-4 rounded-lg bg-base-300 hover:bg-primary/20 transition-colors">1. Salam</button>
                    <button onClick={() => handleTemplateClick('video')} className="w-full text-left p-4 rounded-lg bg-base-300 hover:bg-primary/20 transition-colors">2. Kirim Link Video</button>
                    <button onClick={() => handleTemplateClick('image')} className="w-full text-left p-4 rounded-lg bg-base-300 hover:bg-primary/20 transition-colors">3. Kirim Gambar dan Teks</button>
                    <button onClick={() => handleTemplateClick('blank')} className="w-full text-left p-4 rounded-lg bg-base-300 hover:bg-primary/20 transition-colors">4. Blank Message</button>
                </div>
            </div>
        </div>
    );
};


const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Dashboard);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [affiliateToDelete, setAffiliateToDelete] = useState<Affiliator | null>(null);
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);
  const [selectedAffiliateForWhatsapp, setSelectedAffiliateForWhatsapp] = useState<Affiliator | null>(null);


  // Broadcast state
  const [selectedAffiliates, setSelectedAffiliates] = useState<string[]>([]);
  const [broadcastMessage, setBroadcastMessage] = useState('Hi {name}, yuk semangat posting konten minggu ini! 🎥');
  const [broadcastSearch, setBroadcastSearch] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [schedule, setSchedule] = useState('');
  const [useSmartSending, setUseSmartSending] = useState(false);
  const [randomDelay, setRandomDelay] = useState({ min: 1, max: 30 });
  const [batchConfig, setBatchConfig] = useState({ size: 5, delayMin: 1, delayMax: 2 });


  const [affiliators, setAffiliators] = usePersistentState<Affiliator[]>('affiliators', INITIAL_AFFILIATORS);
  const [samples, setSamples] = usePersistentState<Sample[]>('samples', INITIAL_SAMPLES);
  const [broadcasts, setBroadcasts] = usePersistentState<Broadcast[]>('broadcasts', []);
  const [reminders, setReminders] = usePersistentState<Reminder[]>('reminders', INITIAL_REMINDERS);
  const [treatments, setTreatments] = usePersistentState<Treatment[]>('treatments', []);

  const handleAddAffiliate = (newAffiliate: Omit<Affiliator, 'id'>) => {
      setAffiliators(prev => [...prev, { ...newAffiliate, id: crypto.randomUUID() }]);
      setIsAddModalOpen(false);
  };
  
  const handleOpenDeleteModal = (affiliate: Affiliator) => {
    setAffiliateToDelete(affiliate);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setAffiliateToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (affiliateToDelete) {
      setAffiliators(prev => prev.filter(a => a.id !== affiliateToDelete.id));
      handleCloseDeleteModal();
    }
  };
  
  const handleOpenWhatsappModal = (affiliate: Affiliator) => {
      setSelectedAffiliateForWhatsapp(affiliate);
      setIsWhatsappModalOpen(true);
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
        case 'Shipped': return 'bg-blue-500/20 text-blue-400';
        case 'Received': return 'bg-green-500/20 text-green-400';
        case 'Processing': return 'bg-yellow-500/20 text-yellow-400';
        case 'Requested': return 'bg-slate-500/20 text-slate-400';
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
                    <h2 className="text-xl font-semibold mb-4 text-secondary">Scheduled Reminders</h2>
                    <p className="text-5xl font-bold text-primary-content">{reminders.length}</p>
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
                                <th className="p-4">Last Activity</th>
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
                                    <td className="p-4">{a.last_activity}</td>
                                    <td className="p-4 flex items-center gap-2">
                                        <button onClick={() => handleOpenWhatsappModal(a)} className="text-slate-500 hover:text-green-400 p-1 rounded-full hover:bg-green-500/10" aria-label={`Send WhatsApp to ${a.name}`}>
                                            <WhatsappIcon />
                                        </button>
                                        <button onClick={() => handleOpenDeleteModal(a)} className="text-slate-500 hover:text-red-400 p-1 rounded-full hover:bg-red-500/10" aria-label={`Delete ${a.name}`}>
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
                    <h1 className="text-3xl font-bold text-primary-content">Manage Samples</h1>
                     <div className="overflow-x-auto bg-base-200 rounded-xl border border-base-300">
                        <table className="w-full text-left">
                            <thead className="border-b border-base-300">
                                <tr>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Request Date</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Reminder Message</th>
                                </tr>
                            </thead>
                            <tbody>
                                {samples.map(s => (
                                    <tr key={s.id} className="border-b border-base-300 last:border-b-0 hover:bg-base-300/50 transition-colors">
                                        <td className="p-4 font-medium text-primary-content">{s.name}</td>
                                        <td className="p-4">{s.request_date}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${getSampleStatusColor(s.status)}`}>{s.status}</span>
                                        </td>
                                        <td className="p-4 text-sm">{s.reminder_message}</td>
                                    </tr>
                                ))}
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
                if (selectedAffiliates.length === filteredAffiliates.length) {
                    setSelectedAffiliates([]);
                } else {
                    setSelectedAffiliates(filteredAffiliates.map(a => a.id));
                }
            };
            
            const handleBroadcastSubmit = () => {
                if (selectedAffiliates.length === 0 || !broadcastMessage.trim()) {
                    alert("Please select affiliates and write a message.");
                    return;
                }
                setIsBroadcasting(true);

                // Simulate API call to Fonnte
                setTimeout(() => {
                    const targets = affiliators.filter(a => selectedAffiliates.includes(a.id));
                    const newBroadcast: Broadcast = {
                        id: crypto.randomUUID(),
                        broadcast_type: 'Manual',
                        message_template: broadcastMessage,
                        delivery_schedule: schedule.trim() ? new Date(schedule).toLocaleString() : 'Immediately',
                        target_affiliators: targets.map(t => t.name)
                    };

                    if (useSmartSending) {
                        newBroadcast.sending_options = {
                            random_delay: { min: randomDelay.min, max: randomDelay.max },
                            batching: { size: batchConfig.size, delay_minutes: { min: batchConfig.delayMin, max: batchConfig.delayMax } }
                        };
                    }

                    setBroadcasts(prev => [newBroadcast, ...prev]);
                    setIsBroadcasting(false);
                    setSelectedAffiliates([]);
                    setBroadcastMessage('Hi {name}, yuk semangat posting konten minggu ini! 🎥');
                    setSchedule('');
                    setUseSmartSending(false);
                    alert(`Broadcast scheduled/sent to ${targets.length} affiliates!`);
                }, 1500);
            };

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
                                            checked={filteredAffiliates.length > 0 && selectedAffiliates.length === filteredAffiliates.length}
                                            onChange={handleSelectAll}
                                        />
                                        <label htmlFor="selectAll" className="font-medium text-slate-300">Select All</label>
                                    </div>
                                    <span className="text-secondary">{selectedAffiliates.length} of {filteredAffiliates.length} selected</span>
                               </div>
                           </div>
                           <ul className="flex-1 overflow-y-auto p-2">
                               {filteredAffiliates.map(a => (
                                   <li key={a.id}>
                                       <label htmlFor={`aff-${a.id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-300/50 cursor-pointer">
                                           <input 
                                               type="checkbox" 
                                               id={`aff-${a.id}`}
                                               className="h-4 w-4 rounded bg-base-300 border-slate-500 text-primary focus:ring-primary"
                                               checked={selectedAffiliates.includes(a.id)}
                                               onChange={() => handleSelectAffiliate(a.id)}
                                           />
                                           <div>
                                               <p className="font-semibold text-primary-content">{a.name}</p>
                                               <p className="text-xs text-slate-400">{a.whatsapp}</p>
                                           </div>
                                       </label>
                                   </li>
                               ))}
                           </ul>
                        </div>
                        {/* Right Column: Message Composer */}
                        <div className="bg-base-200 rounded-xl border border-base-300 p-4 flex flex-col justify-between">
                            <div className="space-y-3 overflow-y-auto pr-2">
                                <div>
                                    <label htmlFor="broadcastMessage" className="font-semibold text-secondary">Message Composer</label>
                                    <textarea
                                        id="broadcastMessage"
                                        rows={5}
                                        value={broadcastMessage}
                                        onChange={e => setBroadcastMessage(e.target.value)}
                                        className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none mt-2"
                                    />
                                    <p className="text-xs text-slate-400">Gunakan <code className="bg-base-300 px-1 rounded">{'{name}'}</code> untuk personalisasi nama. Contoh: 'Hi {'{name}'}, ...'</p>
                                </div>
                                
                                <div className="pt-2">
                                     <label htmlFor="schedule" className="text-sm font-medium text-slate-400 mb-1 block">Schedule (Optional)</label>
                                     <input id="schedule" type="datetime-local" value={schedule} onChange={e => setSchedule(e.target.value)} className="w-full bg-base-300 text-primary-content rounded-lg p-3 border-2 border-transparent focus:border-primary focus:outline-none" />
                                     <p className="text-xs text-slate-500 mt-1">Jika kosong, broadcast akan dikirim segera.</p>
                                </div>

                                <div className="pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={useSmartSending} onChange={() => setUseSmartSending(!useSmartSending)} className="h-4 w-4 rounded bg-base-300 border-slate-500 text-primary focus:ring-primary"/>
                                        <span className="font-medium text-slate-300">Enable Smart Sending Options</span>
                                    </label>
                                </div>

                                {useSmartSending && (
                                    <div className="p-4 bg-base-300/50 rounded-lg space-y-4 border border-base-300 animate-fade-in-up">
                                        <div>
                                            <label className="text-sm font-medium text-slate-400 mb-1 block">Jeda acak antar pesan (detik)</label>
                                            <div className="flex items-center gap-2">
                                                <input type="number" value={randomDelay.min} onChange={e => setRandomDelay(p => ({...p, min: Number(e.target.value)}))} className="w-full bg-base-100 p-2 rounded-md" />
                                                <span>to</span>
                                                <input type="number" value={randomDelay.max} onChange={e => setRandomDelay(p => ({...p, max: Number(e.target.value)}))} className="w-full bg-base-100 p-2 rounded-md" />
                                            </div>
                                        </div>
                                         <div>
                                            <label className="text-sm font-medium text-slate-400 mb-1 block">Jeda setelah mengirim</label>
                                            <div className="flex items-center gap-2">
                                                <input type="number" value={batchConfig.size} onChange={e => setBatchConfig(p => ({...p, size: Number(e.target.value)}))} className="w-1/2 bg-base-100 p-2 rounded-md" />
                                                <span className="text-sm">nomor</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-400 mb-1 block">Selama (menit)</label>
                                            <div className="flex items-center gap-2">
                                                 <input type="number" value={batchConfig.delayMin} onChange={e => setBatchConfig(p => ({...p, delayMin: Number(e.target.value)}))} className="w-full bg-base-100 p-2 rounded-md" />
                                                 <span>to</span>
                                                 <input type="number" value={batchConfig.delayMax} onChange={e => setBatchConfig(p => ({...p, delayMax: Number(e.target.value)}))} className="w-full bg-base-100 p-2 rounded-md" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button 
                                onClick={handleBroadcastSubmit}
                                disabled={isBroadcasting || selectedAffiliates.length === 0 || !broadcastMessage.trim()}
                                className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-3 rounded-lg bg-primary hover:bg-primary-focus text-primary-content font-semibold transition-colors disabled:bg-base-300 disabled:text-slate-500"
                            >
                                {isBroadcasting ? `Sending...` : `Send Broadcast to ${selectedAffiliates.length} Affiliate(s)`}
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
         case View.Reminders:
            return (
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold text-primary-content">Smart Reminders</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {reminders.map(r => (
                           <div key={r.id} className="bg-base-200 p-6 rounded-xl border border-base-300 space-y-3">
                                <h2 className="text-lg font-bold text-primary-content">{r.reminder_type}</h2>
                                <p className="text-secondary">{r.frequency} ({r.day})</p>
                                <p className="text-sm text-base-content bg-base-300 p-3 rounded-lg italic">"{r.message_template}"</p>
                            </div>
                       ))}
                    </div>
                </div>
            );
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
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
      >
        <p className="text-base-content">
          Yakin delete <strong className="text-primary-content">{affiliateToDelete?.name}</strong>?
        </p>
      </ConfirmationModal>
      <WhatsappTemplateModal 
        isOpen={isWhatsappModalOpen}
        onClose={() => setIsWhatsappModalOpen(false)}
        affiliate={selectedAffiliateForWhatsapp}
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