import React, { useState } from 'react';
import { 
  Shield, 
  Plus, 
  Check, 
  Search, 
  Edit3, 
  Trash2, 
  Save, 
  Download,
  Users,
  CheckSquare,
  Square,
  ShieldCheck
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const initialRoles = [
  { 
    id: 1, 
    name: 'Super Admin', 
    modules: 'All Modules',
    status: true 
  },
  { 
    id: 2, 
    name: 'Product Manager', 
    modules: 'Dashboard, Catalog, Orders',
    status: true 
  }
];

const EmployeeRolePage = () => {
  const [roles, setRoles] = useState(initialRoles);
  const [searchQuery, setSearchQuery] = useState('');
  const [newRoleName, setNewRoleName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const permissions = [
    'Dashboard', 'Order Management', 'Catalog Management', 
    'Marketing & Offers', 'Communication', 'Reports & Analytics', 
    'User Management', 'System Settings'
  ];

  const handleCreateRole = (e) => {
    e.preventDefault();
    if (!newRoleName) return;
    const id = Date.now();
    const modulesText = selectedPermissions.length > 0 
      ? selectedPermissions.slice(0, 3).join(', ') + (selectedPermissions.length > 3 ? '...' : '')
      : 'No access';
    setRoles([{ id, name: newRoleName, modules: modulesText, status: true }, ...roles]);
    setNewRoleName('');
    setSelectedPermissions([]);
    setShowAddForm(false);
  };

  const deleteRole = (id) => {
    setRoles(roles.filter(r => r.id !== id));
  };

  const toggleStatus = (id) => {
    setRoles(prev => prev.map(role => 
      role.id === id ? { ...role, status: !role.status } : role
    ));
  };

  const togglePermission = (perm) => {
    setSelectedPermissions(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const filteredRoles = roles.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 text-[10px] font-black tracking-[0.3em] uppercase">
             Access Control
          </div>
          <h1 className="text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight leading-none">Role <span className="text-admin-primary-600">Permissions</span></h1>
          <p className="text-sm text-surface-500 font-medium">Define administrative boundaries and access protocols.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setShowAddForm(!showAddForm)}>{showAddForm ? 'Close Form' : 'Setup New Role'}</Button>
      </div>

      {showAddForm && (
        <section className="bg-surface-900 rounded-[2.5rem] p-10 text-white animate-slide-up shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-admin-primary-600/20 blur-[120px] rounded-full -mr-48 -mt-48" />
           <div className="relative z-10">
              <div className="mb-10">
                <h2 className="text-xl font-bold uppercase tracking-tight">Role Architecture Workspace</h2>
                <p className="text-xs text-white/40 font-black uppercase tracking-widest mt-2">Design a new administrative persona with specific data access.</p>
              </div>

              <form onSubmit={handleCreateRole} className="space-y-10">
                <div className="space-y-2 max-w-md">
                   <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Role Designation</label>
                   <input 
                      required
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      placeholder="e.g. Senior Inventory Analyst" 
                      className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-[1.25rem] outline-none focus:border-admin-primary-500 transition-all font-bold text-sm" 
                   />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Module Permission Matrix</label>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {permissions.map(perm => (
                      <label key={perm} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${selectedPermissions.includes(perm) ? 'bg-admin-primary-600 border-admin-primary-500 shadow-lg' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={selectedPermissions.includes(perm)}
                          onChange={() => togglePermission(perm)}
                        />
                        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${selectedPermissions.includes(perm) ? 'bg-white border-white text-admin-primary-600' : 'border-white/20'}`}>
                           {selectedPermissions.includes(perm) && <ShieldCheck size={12} />}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">{perm}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button type="submit" variant="primary" icon={Save} className="bg-white text-surface-900 hover:bg-surface-100 py-5 px-12 uppercase">Activate Role</Button>
              </form>
           </div>
        </section>
      )}

      {/* Role List */}
      <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-[2.5rem] shadow-card overflow-hidden transition-all duration-500">
        <div className="p-8 pb-0 flex flex-col md:flex-row justify-between items-center gap-6">
           <h3 className="text-xl font-bold text-surface-900 dark:text-white tracking-tight">Active Role Registry</h3>
           <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-admin-primary-600 transition-colors" size={20} />
              <input 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search registry..." 
                 className="w-full pl-12 pr-6 py-3.5 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 focus:outline-none focus:ring-4 focus:ring-admin-primary-500/10 text-xs font-bold transition-all shadow-inner"
              />
           </div>
        </div>

        <div className="p-8">
           <div className="overflow-x-auto rounded-[1.25rem] border border-surface-100 dark:border-surface-700 shadow-sm transition-all duration-500">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-50/50 dark:bg-surface-900/50">
                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">SL</th>
                    <th className="px-4 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Designation</th>
                    <th className="px-4 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Access Scope</th>
                    <th className="px-4 py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Permission Status</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-700/50">
                  {filteredRoles.map((role, idx) => (
                    <tr key={role.id} className="group hover:bg-surface-25 dark:hover:bg-surface-900/10 transition-colors">
                      <td className="px-8 py-6 font-black text-surface-400 text-xs">{idx + 1}</td>
                      <td className="px-4 py-6 font-black text-surface-900 dark:text-white uppercase tracking-wider text-xs">
                        {role.name}
                      </td>
                      <td className="px-4 py-6">
                         <div className="bg-surface-50 dark:bg-surface-900 px-3 py-1.5 rounded-xl border border-surface-100 dark:border-surface-700 w-fit">
                            <span className="text-[10px] font-bold text-surface-500 leading-none">{role.modules}</span>
                         </div>
                      </td>
                      <td className="px-4 py-6 text-center">
                        <button 
                          onClick={() => toggleStatus(role.id)}
                          className="relative rounded-full transition-all duration-300 focus:outline-none shadow-sm mx-auto flex items-center justify-center p-0"
                          style={{ width: '50px', height: '28px', backgroundColor: role.status ? '#4F46E5' : '#D1D5DB' }}
                        >
                          <div 
                            className="absolute bg-white rounded-full shadow-md transition-all duration-300 ease-&lsqb;cubic-bezier(0.4,0,0.2,1)&rsqb; flex items-center justify-center"
                            style={{ 
                              width: '24px', 
                              height: '24px', 
                              top: '2px', 
                              left: '2px',
                              position: 'absolute',
                              transform: role.status ? 'translateX(22px)' : 'translateX(0)' 
                            }}
                          >
                            <div 
                              className="rounded-full transition-all duration-300" 
                              style={{ 
                                width: '6px', 
                                height: '6px', 
                                backgroundColor: role.status ? '#4F46E5' : 'transparent',
                                transform: role.status ? 'scale(1)' : 'scale(0)'
                              }} 
                            />
                          </div>
                          {role.status && (
                            <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.4)] pointer-events-none" />
                          )}
                        </button>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                           <button className="p-2.5 hover:bg-white dark:hover:bg-surface-700 rounded-xl text-surface-300 hover:text-admin-primary-600 transition-all border border-transparent shadow-sm">
                              <Edit3 size={18} />
                           </button>
                           <button onClick={() => deleteRole(role.id)} className="p-2.5 hover:bg-white dark:hover:bg-surface-700 rounded-xl text-surface-300 hover:text-red-500 transition-all border border-transparent shadow-sm">
                              <Trash2 size={18} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredRoles.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-xs font-black uppercase text-surface-300 tracking-[0.3em]">No roles detected in registry</td>
                    </tr>
                  )}
                </tbody>
              </table>
           </div>
        </div>
      </section>
    </div>
  );
};

export default EmployeeRolePage;
