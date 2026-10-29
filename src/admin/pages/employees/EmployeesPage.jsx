import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  ShieldCheck, 
  UserPlus,
  Trash2,
  Edit2,
  Calendar,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import { employees as employeeApi } from '../../../lib/api';
import { toast } from 'sonner';

const EmployeesPage = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', role: 'Content Editor', email: '', password: '', phone: '', status: 'Active' });

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeApi.list({ search: query });
      setEmployeeList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch Employees Error:', error);
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [query]);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await employeeApi.create(newEmployee);
      toast.success('Employee onboarded successfully');
      setNewEmployee({ name: '', role: 'Content Editor', email: '', password: '', phone: '', status: 'Active' });
      setShowAddForm(false);
      fetchEmployees();
    } catch (error) {
      toast.error(error.message || 'Failed to onboard employee');
    }
  };

  const deleteEmployee = async (id) => {
    if (!confirm('Are you sure you want to remove this employee?')) return;
    try {
      await employeeApi.delete(id);
      toast.success('Employee removed');
      fetchEmployees();
    } catch (error) {
      toast.error(error.message || 'Failed to remove employee');
    }
  };

  const filteredEmployees = useMemo(() => {
    return employeeList.filter(emp => {
      const matchesStatus = statusFilter === 'All Status' || emp.status === statusFilter;
      return matchesStatus;
    });
  }, [employeeList, statusFilter]);

  const columns = [
    {
      key: 'name',
      label: 'Employee Information',
      render: (row) => (
        <div className="flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-admin-primary-50 dark:bg-admin-primary-900/20 flex items-center justify-center text-admin-primary-600 font-black text-sm shadow-inner transition-transform group-hover:scale-110">
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="font-black text-surface-900 dark:text-white uppercase tracking-wider text-xs">{row.name}</p>
            <p className="text-[10px] text-surface-400 font-black tracking-widest">{row.id}</p>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role & Responsibility',
      render: (row) => (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-50 dark:bg-surface-900 rounded-xl w-fit border border-surface-100 dark:border-surface-700">
          <ShieldCheck size={14} className="text-admin-primary-500" />
          <span className="text-[10px] font-black text-surface-700 dark:text-surface-300 uppercase tracking-widest">{row.role}</span>
        </div>
      )
    },
    {
      key: 'contact',
      label: 'Contact Details',
      render: (row) => (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] font-bold text-surface-400 uppercase tracking-widest hover:text-admin-primary-500 transition-colors cursor-pointer">
            <Mail size={12} className="opacity-60" />
            {row.email}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-surface-400 uppercase tracking-widest">
            <Phone size={12} className="opacity-60" />
            {row.phone}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Availability',
      render: (row) => (
        <Badge variant={row.status === 'Active' ? 'success' : row.status === 'Inactive' ? 'warning' : 'danger'}>
          {row.status}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Management',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button className="p-2.5 hover:bg-white dark:hover:bg-surface-700 rounded-xl text-surface-400 hover:text-admin-primary-600 transition-all shadow-sm border border-surface-100 dark:border-surface-700">
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => deleteEmployee(row.rawId)}
            className="p-2.5 hover:bg-white dark:hover:bg-surface-700 rounded-xl text-surface-400 hover:text-red-500 transition-all shadow-sm border border-surface-100 dark:border-surface-700"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 text-[10px] font-black tracking-[0.3em] uppercase">
             People & Content
          </div>
          <h1 className="text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight leading-none">Team <span className="text-admin-primary-600">Directory</span></h1>
          <p className="text-sm text-surface-500 max-w-lg">Manage organizational access and employee records with precision.</p>
        </div>
        <Button 
          variant="primary" 
          icon={showAddForm ? Trash2 : UserPlus} 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`shadow-xl transition-all ${showAddForm ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'shadow-admin-primary-500/20'}`}
        >
          {showAddForm ? 'Cancel Onboarding' : 'Onboard Employee'}
        </Button>
      </div>

      {showAddForm && (
        <section className="bg-surface-900 rounded-[2.5rem] p-10 text-white animate-slide-up shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-admin-primary-600/10 blur-[100px] rounded-full -mr-32 -mt-32" />
           <form onSubmit={handleAddEmployee} className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Full Name</label>
                 <input 
                    required
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                    placeholder="John Wick" 
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-admin-primary-500 transition-all font-bold text-sm" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Email Address</label>
                 <input 
                    required
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                    placeholder="john@royalvirtus.com" 
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-admin-primary-500 transition-all font-bold text-sm" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Password</label>
                 <input 
                    required
                    type="password"
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                    placeholder="********" 
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-admin-primary-500 transition-all font-bold text-sm" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Assigned Role</label>
                 <select 
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-admin-primary-500 transition-all font-bold text-sm appearance-none"
                 >
                    <option value="admin" className="bg-surface-900">Admin</option>
                    <option value="staff" className="bg-surface-900">Staff</option>
                    <option value="inventory_manager" className="bg-surface-900">Inventory Manager</option>
                    <option value="support" className="bg-surface-900">Support Lead</option>
                    <option value="content_editor" className="bg-surface-900">Content Editor</option>
                 </select>
              </div>
              <Button type="submit" variant="primary" className="py-4 shadow-xl shadow-admin-primary-500/20" icon={CheckCircle}>Complete Onboarding</Button>
           </form>
        </section>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Team', value: employeeList.length, icon: Users, color: 'primary' },
          { label: 'Active Now', value: employeeList.filter(e => e.status === 'Active').length, icon: ShieldCheck, color: 'success' },
          { label: 'On Leave', value: '0', icon: Calendar, color: 'warning' },
          { label: 'Pending', value: '0', icon: Clock, color: 'info' }
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-[2rem] shadow-card group hover:scale-[1.02] transition-transform duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-surface-50 dark:bg-surface-900 flex items-center justify-center text-admin-primary-600 transition-colors group-hover:bg-admin-primary-600 group-hover:text-white">
                <stat.icon size={22} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-surface-400">{stat.label}</p>
            </div>
            <p className="text-3xl font-black text-surface-900 dark:text-white uppercase tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-[2.5rem] shadow-card overflow-hidden transition-all duration-500">
        <div className="p-8 border-b border-surface-100 dark:border-surface-700 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="relative flex-1 w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-admin-primary-600 transition-colors" size={20} />
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Instant search by name, ID or email..." 
              className="w-full pl-12 pr-6 py-4 rounded-[1.25rem] border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 focus:outline-none focus:ring-4 focus:ring-admin-primary-500/10 focus:border-admin-primary-500 text-sm font-bold transition-all shadow-inner"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 md:flex-none px-6 py-3.5 rounded-[1.25rem] border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-[10px] font-black uppercase tracking-widest text-surface-600 dark:text-surface-300 outline-none hover:bg-white transition-all cursor-pointer shadow-sm"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Suspended</option>
            </select>
            <Button variant="secondary" icon={Filter} className="shadow-sm">Advanced Search</Button>
          </div>
        </div>
        <Table columns={columns} data={filteredEmployees} isLoading={loading} />
      </div>
    </div>
  );
};

export default EmployeesPage;
