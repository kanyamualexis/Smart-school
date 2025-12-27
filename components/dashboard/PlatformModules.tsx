import React, { useState, useEffect } from 'react';
import { User, AuditLog, SchoolData, Announcement, Plan, Coupon } from '../../types';
import { db } from '../../services/db';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { formatCurrency } from '../../utils/formatters';
import { 
  Users, Search, Shield, Trash2, Mail, CreditCard, CheckCircle, 
  Clock, Activity, AlertTriangle, Lock, Smartphone, Globe, Plus, Megaphone,
  Tag, Edit3, Save, X, TicketPercent, TrendingUp, Layers, Calendar, RefreshCcw, Copy, AlertCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';

// --- PLATFORM USERS MODULE ---
export const PlatformUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const data = await db.getAllUsers();
      setUsers(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-gray-900">Platform Users</h2>
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
             <input 
               type="text" 
               placeholder="Search users..." 
               className="pl-10 pr-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none w-64"
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
             />
          </div>
       </div>

       <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
             <thead className="bg-gray-50 text-gray-500 border-b">
                <tr className="text-xs font-black uppercase tracking-widest">
                   <th className="p-4">User</th>
                   <th className="p-4">Role</th>
                   <th className="p-4">School ID</th>
                   <th className="p-4">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y text-sm">
                {filteredUsers.map(u => (
                   <tr key={u.id} className="hover:bg-gray-50">
                      <td className="p-4">
                         <div className="font-bold text-gray-900">{u.full_name}</div>
                         <div className="text-xs text-gray-500">{u.email}</div>
                      </td>
                      <td className="p-4">
                         <span className={cn(
                           "px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter",
                           u.role === 'platform_admin' ? "bg-purple-100 text-purple-700" :
                           u.role === 'school_admin' ? "bg-blue-100 text-blue-700" :
                           "bg-gray-100 text-gray-700"
                         )}>
                            {u.role.replace('_', ' ')}
                         </span>
                      </td>
                      <td className="p-4 font-mono text-gray-500 text-xs">{u.school_id}</td>
                      <td className="p-4 flex gap-2">
                         <button className="p-2 text-gray-400 hover:text-brand-600 hover:bg-gray-100 rounded" title="Send Email"><Mail size={16}/></button>
                         <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded" title="Delete User"><Trash2 size={16}/></button>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
};

// --- PLATFORM BILLING MODULE ---

interface CouponCardProps {
  coupon: Coupon;
  onEdit: () => void;
  onDelete: () => void;
}

const CouponCard: React.FC<CouponCardProps> = ({ coupon, onEdit, onDelete }) => {
   const { theme, discount_value, discount_type, code, campaign_name } = coupon;
   
   // Theme configurations
   const themes: any = {
      'red_dawn': {
         container: 'bg-white border-2 border-red-50',
         left: 'bg-white text-gray-900',
         right: 'bg-red-600 text-white',
         textAccent: 'text-red-600',
         badge: 'bg-black text-white',
         pattern: 'radial-gradient(circle, #fecaca 1px, transparent 1px)'
      },
      'midnight_sale': {
         container: 'bg-black border-2 border-gray-800',
         left: 'bg-black text-white border-r border-dashed border-gray-700',
         right: 'bg-white text-black',
         textAccent: 'text-red-600',
         badge: 'bg-red-600 text-white',
         pattern: 'radial-gradient(circle, #e5e5e5 1px, transparent 1px)'
      },
      'royal_blue': {
         container: 'bg-white border-2 border-blue-50',
         left: 'bg-white text-gray-900',
         right: 'bg-blue-600 text-white',
         textAccent: 'text-blue-600',
         badge: 'bg-orange-400 text-white',
         pattern: 'radial-gradient(circle, #bfdbfe 1px, transparent 1px)'
      },
      'emerald_green': {
         container: 'bg-emerald-50 border-2 border-emerald-100',
         left: 'bg-emerald-50 text-emerald-900',
         right: 'bg-emerald-600 text-white',
         textAccent: 'text-emerald-700',
         badge: 'bg-yellow-400 text-black',
         pattern: 'radial-gradient(circle, #a7f3d0 1px, transparent 1px)'
      }
   };

   const t = themes[theme || 'red_dawn'] || themes['red_dawn'];
   const isModern = theme === 'midnight_sale';

   return (
      <div className={cn("relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex min-h-[160px] group", t.container)}>
         {/* Action Buttons (Hidden by default, visible on hover) */}
         <div className="absolute top-2 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="p-1.5 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white shadow-sm"><Edit3 size={14}/></button>
            <button onClick={onDelete} className="p-1.5 bg-white/20 hover:bg-red-500/80 backdrop-blur-sm rounded-full text-white shadow-sm"><Trash2 size={14}/></button>
         </div>

         {/* Left Section: Main Info */}
         <div 
             className={cn("flex-1 p-6 flex flex-col justify-center relative", t.left)}
             style={{ backgroundImage: isModern ? 'none' : t.pattern, backgroundSize: '12px 12px' }}
         >
            {!isModern && (
               <div className="absolute top-0 right-0 bottom-0 w-4 overflow-hidden">
                  <div className="w-8 h-full bg-transparent border-l-2 border-dashed border-gray-300/50"></div>
               </div>
            )}
            
            <div className={cn("text-[10px] font-black uppercase tracking-[0.3em] mb-1", isModern ? "text-gray-400" : "text-gray-400")}>
               Discount
            </div>
            <div className={cn("text-5xl font-black leading-none mb-2 tracking-tighter", t.textAccent)}>
               {discount_type === 'percent' ? `${discount_value}%` : formatCurrency(discount_value).split('.')[0]}
               <span className="text-lg align-top ml-1">OFF</span>
            </div>
            <div className="text-xs font-bold opacity-60 uppercase tracking-widest truncate max-w-[180px]">
               {campaign_name || 'Special Offer'}
            </div>
         </div>

         {/* Right Section: Code Stub */}
         <div className={cn("w-32 flex flex-col items-center justify-center relative p-2", t.right)}>
             {/* Notches for ticket effect */}
             <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 z-10"></div>
             
             <div className="h-full w-full border-2 border-white/20 rounded-lg flex flex-col items-center justify-center py-2 relative">
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2 vertical-rl" style={{ writingMode: 'vertical-rl' }}>
                   COUPON CODE
                </div>
                <div className="bg-white text-black px-1 py-3 font-mono font-bold text-lg rounded tracking-wider shadow-sm w-full text-center rotate-90 whitespace-nowrap">
                   {code}
                </div>
             </div>
         </div>
      </div>
   );
};

export const PlatformBilling = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'coupons'>('overview');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  // Plans State
  const [plans, setPlans] = useState<Plan[]>([]);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Partial<Plan>>({});
  
  // Coupons State
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon>>({ theme: 'red_dawn' });

  // Confirmation State
  const [confirmDelete, setConfirmDelete] = useState<{open: boolean, type: 'plan' | 'coupon' | null, id: string | null}>({
      open: false, type: null, id: null
  });

  useEffect(() => {
    db.getRecentTransactions().then(setTransactions);
    fetchPlans();
    fetchCoupons();
  }, []);

  const fetchPlans = async () => {
    const data = await db.getPlans();
    setPlans(data);
  };

  const fetchCoupons = async () => {
    const data = await db.getCoupons();
    setCoupons(data);
  };

  const handleSavePlan = async () => {
    if (!editingPlan.name || !editingPlan.price_monthly || !editingPlan.price_yearly) return;
    
    // Convert features text to array if string
    let featuresArray: string[] = [];
    if (typeof editingPlan.features === 'string') {
        featuresArray = (editingPlan.features as string).split('\n').filter(f => f.trim() !== '');
    } else {
        featuresArray = editingPlan.features || [];
    }

    const planToSave: Plan = {
      id: editingPlan.id || `plan_${Date.now()}`,
      name: editingPlan.name!,
      price_monthly: Number(editingPlan.price_monthly),
      price_yearly: Number(editingPlan.price_yearly),
      description: editingPlan.description || '',
      features: featuresArray,
      is_popular: editingPlan.is_popular || false,
      color: editingPlan.color || 'from-gray-500 to-gray-700'
    };
    
    await db.savePlan(planToSave);
    await fetchPlans();
    setPlanModalOpen(false);
    setEditingPlan({});
  };

  const triggerDeletePlan = (id: string) => {
      setConfirmDelete({ open: true, type: 'plan', id });
  };

  const triggerDeleteCoupon = (id: string) => {
      setConfirmDelete({ open: true, type: 'coupon', id });
  };

  const confirmDeletion = async () => {
      if (confirmDelete.type === 'plan' && confirmDelete.id) {
          await db.deletePlan(confirmDelete.id);
          await fetchPlans();
      } else if (confirmDelete.type === 'coupon' && confirmDelete.id) {
          await db.deleteCoupon(confirmDelete.id);
          await fetchCoupons();
      }
      setConfirmDelete({ open: false, type: null, id: null });
  };

  const handleSaveCoupon = async () => {
    if (!editingCoupon.code || !editingCoupon.discount_value) return;
    
    const couponToSave: Coupon = {
      id: editingCoupon.id || `c_${Date.now()}`,
      code: editingCoupon.code!.toUpperCase(),
      discount_type: editingCoupon.discount_type || 'percent',
      discount_value: Number(editingCoupon.discount_value),
      max_uses: editingCoupon.max_uses ? Number(editingCoupon.max_uses) : undefined,
      used_count: editingCoupon.used_count || 0,
      expires_at: editingCoupon.expires_at || undefined,
      status: editingCoupon.status || 'active',
      campaign_name: editingCoupon.campaign_name || '',
      theme: editingCoupon.theme as any || 'red_dawn'
    };

    await db.saveCoupon(couponToSave);
    await fetchCoupons();
    setCouponModalOpen(false);
    setEditingCoupon({ theme: 'red_dawn' });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-black text-gray-900">Billing & Subscriptions</h2>
          
          <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex">
             {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'plans', label: 'Manage Plans', icon: Layers },
                { id: 'coupons', label: 'Coupons', icon: TicketPercent }
             ].map(tab => (
                <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={cn(
                      "px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all",
                      activeTab === tab.id 
                         ? "bg-gray-900 text-white shadow-md" 
                         : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                   )}
                >
                   <tab.icon size={16} /> {tab.label}
                </button>
             ))}
          </div>
       </div>

       {activeTab === 'overview' && (
         <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-20"><CreditCard size={64}/></div>
                  <div className="text-emerald-100 text-sm font-bold uppercase tracking-widest mb-2">Total MRR</div>
                  <div className="text-3xl font-black">{formatCurrency(450000)}</div>
                  <div className="text-xs bg-white/20 inline-block px-2 py-1 rounded mt-2 font-bold">+12% vs last month</div>
               </div>
               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Pending Payments</div>
                  <div className="text-3xl font-black text-amber-600">{formatCurrency(260000)}</div>
                  <div className="text-xs text-amber-600 font-bold mt-1">1 Invoice Overdue</div>
               </div>
               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Active Subs</div>
                  <div className="text-3xl font-black text-blue-600">852</div>
                  <div className="text-xs text-gray-400 font-bold mt-1">Schools subscribed</div>
               </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
               <h3 className="font-bold text-xl text-gray-900 mb-6">Recent Transactions</h3>
               <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 border-b">
                     <tr className="text-xs font-black uppercase tracking-widest">
                        <th className="p-4">School</th>
                        <th className="p-4">Plan</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y text-sm">
                     {transactions.map(t => (
                        <tr key={t.id} className="hover:bg-gray-50">
                           <td className="p-4 font-bold text-gray-900">{t.school}</td>
                           <td className="p-4 text-gray-600">{t.plan}</td>
                           <td className="p-4 text-gray-500">{t.date}</td>
                           <td className="p-4 font-mono font-medium">{formatCurrency(t.amount)}</td>
                           <td className="p-4">
                              {t.status === 'completed' ? (
                                 <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase"><CheckCircle size={12}/> Paid</span>
                              ) : (
                                 <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold uppercase"><Clock size={12}/> Pending</span>
                              )}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
       )}

       {activeTab === 'plans' && (
         <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
               <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                  <button onClick={() => setBillingCycle('monthly')} className={cn("px-4 py-2 rounded-md text-sm font-bold transition-all", billingCycle === 'monthly' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500")}>Monthly</button>
                  <button onClick={() => setBillingCycle('yearly')} className={cn("px-4 py-2 rounded-md text-sm font-bold transition-all", billingCycle === 'yearly' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500")}>Yearly</button>
               </div>
               <Button onClick={() => { setEditingPlan({ color: 'from-blue-500 to-blue-700', features: [] }); setPlanModalOpen(true); }}><Plus size={16}/> Add Plan</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {plans.map(plan => (
                  <div key={plan.id} className="relative group">
                     <div className={cn("h-full rounded-3xl p-8 text-white shadow-xl flex flex-col bg-gradient-to-br transition-all hover:scale-[1.02]", plan.color)}>
                        {plan.is_popular && <div className="absolute top-4 right-4 bg-white/20 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-sm">Popular</div>}
                        
                        <div className="flex justify-between items-start mb-6">
                           <h3 className="text-xl font-black tracking-tight">{plan.name}</h3>
                           <button 
                             onClick={() => { setEditingPlan({...plan, features: plan.features.join('\n') as any}); setPlanModalOpen(true); }} 
                             className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                           >
                             <Edit3 size={16}/>
                           </button>
                        </div>
                        
                        <div className="text-3xl font-black mb-1">
                           {formatCurrency(billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly).split('.')[0]}
                        </div>
                        <div className="text-sm font-medium opacity-80 mb-8 uppercase tracking-wider">{billingCycle}</div>
                        
                        <p className="text-sm font-medium opacity-90 mb-6 min-h-[40px]">{plan.description}</p>

                        <ul className="space-y-3 flex-1 mb-6">
                           {plan.features.map((f, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm font-medium opacity-90">
                                 <CheckCircle size={16} className="shrink-0 mt-0.5" /> 
                                 <span className="leading-tight">{f}</span>
                              </li>
                           ))}
                        </ul>

                        <button onClick={() => triggerDeletePlan(plan.id)} className="w-full py-2 rounded-lg bg-black/20 hover:bg-red-500/80 text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                           <Trash2 size={14} /> Delete Plan
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
       )}

       {activeTab === 'coupons' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
             <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                   <div>
                      <h3 className="font-bold text-gray-900 text-xl leading-tight">Campaigns & Coupons</h3>
                      <p className="text-sm text-gray-500 mt-1">Manage discount codes and promotional events</p>
                   </div>
                   <Button onClick={() => { setEditingCoupon({ theme: 'red_dawn' }); setCouponModalOpen(true); }} size="lg" className="shadow-lg shadow-brand-100">
                      <Plus size={18}/> Create Campaign
                   </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {coupons.map(coupon => (
                      <CouponCard 
                        key={coupon.id} 
                        coupon={coupon} 
                        onEdit={() => { setEditingCoupon(coupon); setCouponModalOpen(true); }}
                        onDelete={() => triggerDeleteCoupon(coupon.id)}
                      />
                   ))}
                   {coupons.length === 0 && (
                      <div className="col-span-full py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50">
                         <TicketPercent className="mx-auto text-gray-300 mb-4" size={48} />
                         <p className="text-gray-400 font-bold">No active coupons found.</p>
                         <p className="text-xs text-gray-400 mt-1">Create a new campaign to get started.</p>
                      </div>
                   )}
                </div>
             </div>
          </div>
       )}

       {/* --- MODALS --- */}
       
       {planModalOpen && (
          <Modal title={editingPlan.id ? "Edit Plan Details" : "Create New Plan"} onClose={() => setPlanModalOpen(false)}>
             <div className="space-y-4">
                <Input label="Plan Name" value={editingPlan.name || ''} onChange={(e:any) => setEditingPlan({...editingPlan, name: e.target.value})} placeholder="e.g. Gold Tier" />
                
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Pricing Configuration</h4>
                    <div className="grid grid-cols-2 gap-4">
                       <Input label="Monthly Price (RWF)" type="number" value={editingPlan.price_monthly || ''} onChange={(e:any) => setEditingPlan({...editingPlan, price_monthly: e.target.value})} placeholder="e.g. 50000" />
                       <Input label="Yearly Price (RWF)" type="number" value={editingPlan.price_yearly || ''} onChange={(e:any) => setEditingPlan({...editingPlan, price_yearly: e.target.value})} placeholder="e.g. 500000" />
                    </div>
                </div>

                <Input label="Short Description" value={editingPlan.description || ''} onChange={(e:any) => setEditingPlan({...editingPlan, description: e.target.value})} />
                
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">Features (One per line)</label>
                   <textarea 
                     className="w-full p-3 border rounded-lg h-32 text-sm focus:ring-2 focus:ring-brand-500 outline-none" 
                     placeholder="- Feature 1&#10;- Feature 2"
                     value={typeof editingPlan.features === 'string' ? editingPlan.features : (editingPlan.features as string[])?.join('\n') || ''}
                     onChange={e => setEditingPlan({...editingPlan, features: e.target.value as any})}
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">Theme Gradient</label>
                       <select 
                         className="w-full p-3 border rounded-lg bg-gray-50 text-sm"
                         value={editingPlan.color || ''}
                         onChange={e => setEditingPlan({...editingPlan, color: e.target.value})}
                       >
                          <option value="from-blue-500 to-blue-700">Blue Ocean</option>
                          <option value="from-purple-500 to-pink-600">Purple Haze</option>
                          <option value="from-emerald-500 to-emerald-700">Emerald City</option>
                          <option value="from-orange-500 to-red-600">Sunset Fire</option>
                          <option value="from-gray-800 to-black">Midnight Dark</option>
                       </select>
                    </div>
                    <div className="flex items-center h-full pt-6">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" className="w-5 h-5 accent-brand-600" checked={editingPlan.is_popular || false} onChange={e => setEditingPlan({...editingPlan, is_popular: e.target.checked})} />
                            <span className="text-sm font-bold text-gray-700">Mark as Popular</span>
                        </label>
                    </div>
                </div>

                <div className="flex gap-4 mt-6 pt-4 border-t border-gray-100">
                    <Button variant="secondary" className="flex-1 border-gray-300" onClick={() => setPlanModalOpen(false)}>Cancel</Button>
                    <Button className="flex-1" onClick={handleSavePlan}>Save Plan</Button>
                </div>
             </div>
          </Modal>
       )}

       {couponModalOpen && (
          <Modal title={editingCoupon.id ? "Edit Campaign" : "New Campaign"} onClose={() => setCouponModalOpen(false)}>
             <div className="space-y-4">
                <Input label="Campaign Name" placeholder="e.g. End of Year Sale" value={editingCoupon.campaign_name || ''} onChange={(e:any) => setEditingCoupon({...editingCoupon, campaign_name: e.target.value})} />
                
                <div className="grid grid-cols-2 gap-4">
                   <Input label="Coupon Code" placeholder="SALE2024" value={editingCoupon.code || ''} onChange={(e:any) => setEditingCoupon({...editingCoupon, code: e.target.value})} className="font-mono uppercase" />
                   <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">Visual Theme</label>
                       <select className="w-full p-3 border rounded-lg bg-gray-50 text-sm" value={editingCoupon.theme || 'red_dawn'} onChange={e => setEditingCoupon({...editingCoupon, theme: e.target.value as any})}>
                          <option value="red_dawn">Red Dawn (White/Red)</option>
                          <option value="midnight_sale">Midnight Sale (Black/Red)</option>
                          <option value="royal_blue">Royal Blue (White/Blue)</option>
                          <option value="emerald_green">Emerald Green (Green/White)</option>
                       </select>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">Discount Type</label>
                       <select className="w-full p-3 border rounded-lg bg-gray-50 text-sm" value={editingCoupon.discount_type || 'percent'} onChange={e => setEditingCoupon({...editingCoupon, discount_type: e.target.value as any})}>
                          <option value="percent">Percentage (%)</option>
                          <option value="fixed">Fixed Amount</option>
                       </select>
                   </div>
                   <Input label="Value" type="number" placeholder="50" value={editingCoupon.discount_value || ''} onChange={(e:any) => setEditingCoupon({...editingCoupon, discount_value: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <Input label="Max Uses (Optional)" type="number" placeholder="Unlimited" value={editingCoupon.max_uses || ''} onChange={(e:any) => setEditingCoupon({...editingCoupon, max_uses: e.target.value})} />
                   <Input label="Expiry Date" type="date" value={editingCoupon.expires_at || ''} onChange={(e:any) => setEditingCoupon({...editingCoupon, expires_at: e.target.value})} />
                </div>

                <div className="flex gap-4 mt-6 pt-4 border-t border-gray-100">
                    <Button variant="secondary" className="flex-1 border-gray-300" onClick={() => setCouponModalOpen(false)}>Cancel</Button>
                    <Button className="flex-1" onClick={handleSaveCoupon}>Publish Campaign</Button>
                </div>
             </div>
          </Modal>
       )}

       {/* Custom Confirmation Modal */}
       {confirmDelete.open && (
           <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 border-2 border-red-100 relative">
                 <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="text-red-500" size={32} />
                 </div>
                 <h3 className="text-xl font-black text-center text-gray-900 mb-2">Confirm Deletion</h3>
                 <p className="text-center text-gray-500 text-sm mb-8">
                    Are you sure you want to delete this {confirmDelete.type}? This action cannot be undone.
                 </p>
                 <div className="flex gap-3">
                    <Button variant="secondary" className="flex-1 border-gray-300" onClick={() => setConfirmDelete({open: false, type: null, id: null})}>Cancel</Button>
                    <Button variant="danger" className="flex-1 shadow-red-200 shadow-lg" onClick={confirmDeletion}>Yes, Delete</Button>
                 </div>
              </div>
           </div>
       )}
    </div>
  );
};

// --- PLATFORM AUDIT LOGS MODULE ---
export const PlatformAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    db.getAuditLogs().then(setLogs);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in">
       <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-gray-900">System Audit Logs</h2>
          <Button variant="outline" size="sm">Export CSV</Button>
       </div>
       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 divide-y divide-gray-100">
             {logs.map(log => (
                <div key={log.id} className="p-6 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                   <div className="p-2 bg-gray-100 rounded-lg text-gray-500 shrink-0">
                      <Activity size={20} />
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between items-start">
                         <h4 className="font-bold text-gray-900 text-sm">{log.action.replace('_', ' ')}</h4>
                         <span className="text-xs text-gray-400 font-mono">{new Date(log.date).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                      <div className="mt-2 text-xs font-bold bg-blue-50 text-blue-600 inline-block px-2 py-1 rounded">User: {log.user}</div>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

// --- PLATFORM SECURITY MODULE ---
export const PlatformSecurity = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
       <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Lock size={24} className="text-brand-600"/> Security Configuration</h3>
          
          <div className="space-y-6">
             <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-white rounded-lg border shadow-sm"><Globe size={20}/></div>
                   <div>
                      <div className="font-bold text-gray-900">Force HTTPS</div>
                      <div className="text-xs text-gray-500">Ensure all connections are encrypted</div>
                   </div>
                </div>
                <div className="w-12 h-6 bg-brand-600 rounded-full relative cursor-pointer"><div className="w-6 h-6 bg-white rounded-full shadow-sm absolute right-0 top-0 border border-gray-200"></div></div>
             </div>

             <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-white rounded-lg border shadow-sm"><Smartphone size={20}/></div>
                   <div>
                      <div className="font-bold text-gray-900">Require 2FA for Admins</div>
                      <div className="text-xs text-gray-500">Mandatory two-factor auth for all school admins</div>
                   </div>
                </div>
                <div className="w-12 h-6 bg-gray-300 rounded-full relative cursor-pointer"><div className="w-6 h-6 bg-white rounded-full shadow-sm absolute left-0 top-0 border border-gray-200"></div></div>
             </div>

             <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-white rounded-lg border shadow-sm"><AlertTriangle size={20}/></div>
                   <div>
                      <div className="font-bold text-gray-900">System Lockdown</div>
                      <div className="text-xs text-gray-500">Prevent all non-admin logins during maintenance</div>
                   </div>
                </div>
                <div className="w-12 h-6 bg-gray-300 rounded-full relative cursor-pointer"><div className="w-6 h-6 bg-white rounded-full shadow-sm absolute left-0 top-0 border border-gray-200"></div></div>
             </div>
          </div>
       </div>
    </div>
  );
};

// --- PLATFORM ANNOUNCEMENTS MODULE ---
export const PlatformAnnouncements = ({ user }: { user: User }) => {
   const [announcements, setAnnouncements] = useState<Announcement[]>([]);
   const [modalOpen, setModalOpen] = useState(false);
   const [newAnn, setNewAnn] = useState({ title: '', content: '' });

   const fetchData = async () => {
      // Mock fetching platform announcements
      const data = await db.getAnnouncements(user.school_id);
      setAnnouncements(data);
   };

   useEffect(() => { fetchData(); }, []);

   const handleAdd = async () => {
      if(!newAnn.title) return;
      await db.addAnnouncement({
         title: newAnn.title,
         content: newAnn.content,
         target_role: 'all',
         school_id: user.school_id
      });
      await fetchData();
      setModalOpen(false);
      setNewAnn({ title: '', content: '' });
   };

   return (
      <div className="space-y-6 animate-in fade-in">
         <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-xl font-bold">System-Wide Announcements</h2>
               <Button onClick={() => setModalOpen(true)}><Plus size={16}/> New Broadcast</Button>
            </div>
            <div className="space-y-4">
               {announcements.map(a => (
                  <div key={a.id} className="p-6 bg-purple-50/50 rounded-2xl border border-purple-100">
                     <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                           <Megaphone size={16} className="text-purple-600" />
                           <span className="text-xs font-black uppercase tracking-widest text-purple-600 bg-purple-100 px-2 py-1 rounded">Global</span>
                        </div>
                        <span className="text-xs font-bold text-gray-400">{a.date}</span>
                     </div>
                     <h3 className="font-bold text-gray-900 mb-2">{a.title}</h3>
                     <p className="text-sm text-gray-600 leading-relaxed">{a.content}</p>
                  </div>
               ))}
               {announcements.length === 0 && <p className="text-gray-400 text-center py-8">No announcements broadcasted.</p>}
            </div>
         </div>
         {modalOpen && (
            <Modal title="Broadcast System Message" onClose={() => setModalOpen(false)}>
               <div className="space-y-4">
                   <Input label="Title" value={newAnn.title} onChange={(e:any) => setNewAnn({...newAnn, title: e.target.value})} placeholder="Maintenance Alert" />
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                      <textarea className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-brand-500 outline-none" value={newAnn.content} onChange={e => setNewAnn({...newAnn, content: e.target.value})} placeholder="System will be down for..."></textarea>
                   </div>
                   <Button className="w-full" onClick={handleAdd}>Broadcast to All Schools</Button>
               </div>
            </Modal>
         )}
      </div>
   );
};