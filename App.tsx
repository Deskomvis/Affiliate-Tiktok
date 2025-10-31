
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Affiliator, Sample, Broadcast, Reminder, Treatment } from './types';
import { NAV_ITEMS, INITIAL_AFFILIATORS, INITIAL_SAMPLES, INITIAL_REMINDERS } from './constants';
import { processCommand } from './services/geminiService';
import { SendIcon, LoaderIcon } from './components/Icons';

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

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Dashboard);
  const [command, setCommand] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [affiliators, setAffiliators] = usePersistentState<Affiliator[]>('affiliators', INITIAL_AFFILIATORS);
  const [samples, setSamples] = usePersistentState<Sample[]>('samples', INITIAL_SAMPLES);
  const [broadcasts, setBroadcasts] = usePersistentState<Broadcast[]>('broadcasts', []);
  const [reminders, setReminders] = usePersistentState<Reminder[]>('reminders', INITIAL_REMINDERS);
  const [treatments, setTreatments] = usePersistentState<Treatment[]>('treatments', []);

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    const response = await processCommand(command);
    setCommand('');
    setIsLoading(false);

    if (response.action === 'error') {
      setError(response.message);
      return;
    }

    // Process valid actions
    switch (response.action) {
      case 'add_affiliator':
        setAffiliators(prev => [...prev, ...response.data.map((a: Omit<Affiliator, 'id'>) => ({ ...a, id: crypto.randomUUID() }))]);
        setView(View.Affiliates);
        break;
      case 'broadcast_message':
        setBroadcasts(prev => [...prev, { ...response.data, id: crypto.randomUUID() }]);
        setView(View.Broadcast);
        break;
      case 'manage_sample':
        // This can either add a new sample or update an existing one. For simplicity, we'll just add.
        setSamples(prev => [...prev, ...response.data.map((s: Omit<Sample, 'id'>) => ({ ...s, id: crypto.randomUUID() }))]);
        setView(View.Samples);
        break;
      case 'treatment_affiliator':
        setTreatments(prev => [...prev, { ...response.data, id: crypto.randomUUID() }]);
        setView(View.Treatment);
        break;
      case 'smart_reminder':
        setReminders(prev => [...prev, { ...response.data, id: crypto.randomUUID() }]);
        setView(View.Reminders);
        break;
      default:
        setError('Received an unknown action from the AI.');
    }
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
                <h1 className="text-3xl font-bold text-primary-content">Affiliates</h1>
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
        case View.Broadcast:
             return (
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold text-primary-content">Broadcast Messages</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {broadcasts.map(b => (
                             <div key={b.id} className="bg-base-200 p-6 rounded-xl border border-base-300 space-y-3">
                                <div className="flex justify-between items-center">
                                    <h2 className="font-semibold text-secondary">{b.target_affiliators}</h2>
                                    <span className="text-xs text-slate-400">{b.delivery_schedule}</span>
                                </div>
                                <p className="text-primary-content bg-base-300 p-4 rounded-lg italic">"{b.message_template}"</p>
                                <span className="text-xs font-medium bg-primary/20 text-primary px-2 py-1 rounded-full">{b.broadcast_type}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
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
        
        {/* Command Bar */}
        <div className="p-4 border-t border-base-300 bg-base-200/50">
          {error && <div className="text-red-400 text-sm mb-2 px-2">{error}</div>}
          <form onSubmit={handleCommandSubmit} className="relative">
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Add affiliator, create broadcast, manage sample..."
              className="w-full pl-4 pr-12 py-3 bg-base-300 text-primary-content rounded-lg border-2 border-transparent focus:border-primary focus:outline-none transition-colors"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary hover:bg-primary-focus disabled:bg-base-300 disabled:text-slate-500 text-primary-content transition-all"
              disabled={isLoading || !command.trim()}
            >
              {isLoading ? <LoaderIcon /> : <SendIcon />}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default App;
