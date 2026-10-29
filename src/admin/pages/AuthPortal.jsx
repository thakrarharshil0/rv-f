import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Database, 
  Globe, 
  Store,
  Shield,
  Zap,
  LayoutDashboard
} from 'lucide-react';
import Button from '../components/ui/Button';

const AuthPortal = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('admin@royalvirtus.com');
  const [password, setPassword] = useState('••••••••');

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      setIsLoading(false);
      navigate('/admin');
    }, 1500);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-surface-950 overflow-hidden font-inter selection:bg-admin-primary-500/30">
      {/* Left Side - Visual Branding */}
      <div className="hidden lg:flex relative flex-col justify-between p-16 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,#4F46E5_0%,transparent_40%),radial-gradient(circle_at_70%_60%,#7C3AED_0%,transparent_50%)] opacity-20 pointer-events-none" />
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-admin-primary-600/10 blur-[120px] rounded-full animate-pulse-soft" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[80%] h-[80%] bg-indigo-600/10 blur-[150px] rounded-full" />
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-100" />
        
        <div className="relative z-10 animate-reveal">
          <div className="flex items-center gap-3 mb-20 transition-all duration-700 hover:translate-x-1">
            <div className="w-16 h-16 flex items-center justify-center transform -rotate-6 group transition-all duration-500 hover:rotate-0 hover:scale-110">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain dark:brightness-0 dark:invert" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white">
              Royal<span className="text-admin-primary-500">Virtus</span>
            </span>
          </div>

          <div className="space-y-6 max-w-lg">
            <h1 className="text-6xl font-black text-white leading-[1.1] tracking-tight">
              Command Your <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-admin-primary-400 via-indigo-400 to-purple-400">Digital Empire.</span>
            </h1>
            <p className="text-xl text-surface-400 font-medium leading-relaxed">
              Experience the next generation of e-commerce administration with ultra-high fidelity controls.
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 xl:grid-cols-2 gap-4 animate-reveal" style={{ animationDelay: '0.2s' }}>
          <div className="glass-panel p-6 rounded-[2.5rem] border-white/5 shadow-2xl transition-transform hover:scale-[1.02]">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-4 text-admin-primary-400">
              <Shield size={20} />
            </div>
            <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Enterprise Grade</h4>
            <p className="text-surface-500 text-[10px] font-bold uppercase tracking-[0.2em]">End-to-end Encryption</p>
          </div>
          <div className="glass-panel p-6 rounded-[2.5rem] border-white/5 shadow-2xl transition-transform hover:scale-[1.02]">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-4 text-amber-400">
              <Zap size={20} />
            </div>
            <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Instant Sync</h4>
            <p className="text-surface-500 text-[10px] font-bold uppercase tracking-[0.2em]">Edge Node Acceleration</p>
          </div>
        </div>

        {/* Decorative Quote */}
        <div className="relative z-10 flex flex-col items-end text-right animate-fade-in" style={{ animationDelay: '0.5s' }}>
           <div className="flex gap-1 mb-2">
              {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-1 bg-admin-primary-500 rounded-full" />)}
           </div>
           <p className="text-[10px] font-black text-surface-500 uppercase tracking-[0.4em] mb-1">Authenticated Access Only</p>
           <p className="text-[8px] font-bold text-surface-600 uppercase tracking-widest">Protocol V4.2.0-Production</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-8 lg:p-24 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-admin-primary-600/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="w-full max-w-md relative z-10 animate-reveal" style={{ animationDelay: '0.3s' }}>
          <div className="mb-12">
            <h2 className="text-4xl font-black text-white tracking-tight mb-3">Welcome Back</h2>
            <p className="text-surface-500 font-medium">Please enter your administrative credentials.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-surface-400 uppercase tracking-[0.3em] pl-1">Admin Email</label>
              <div className="relative group overflow-hidden">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-600 group-focus-within:text-admin-primary-500 transition-colors z-20" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-surface-900/50 border border-surface-800 rounded-[2rem] outline-none focus:ring-2 focus:ring-admin-primary-500/20 focus:border-admin-primary-500/50 text-white font-bold transition-all placeholder:text-surface-700 relative z-10"
                  placeholder="name@company.com"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-admin-primary-500/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-surface-400 uppercase tracking-[0.3em]">Access Code</label>
                <button type="button" className="text-[10px] font-black text-admin-primary-500 uppercase tracking-[0.2em] hover:text-admin-primary-400 transition-colors">Forgot?</button>
              </div>
              <div className="relative group overflow-hidden">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-600 group-focus-within:text-admin-primary-500 transition-colors z-20" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-14 py-5 bg-surface-900/50 border border-surface-800 rounded-[2rem] outline-none focus:ring-2 focus:ring-admin-primary-500/20 focus:border-admin-primary-500/50 text-white font-bold transition-all relative z-10"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 p-1 text-surface-600 hover:text-white transition-colors z-20"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <div className="absolute inset-0 bg-gradient-to-r from-admin-primary-500/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-3 px-1 py-1">
               <button type="button" className="w-5 h-5 rounded-lg border-2 border-surface-800 bg-surface-900 flex items-center justify-center text-admin-primary-500 hover:border-admin-primary-500 transition-all group">
                  <div className="w-2 h-2 bg-admin-primary-500 rounded-sm opacity-100" />
               </button>
               <span className="text-[10px] font-black text-surface-500 uppercase tracking-widest">Maintain Active Session</span>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full py-6 rounded-[2rem] bg-gradient-to-r from-admin-primary-600 to-indigo-600 hover:from-admin-primary-500 hover:to-indigo-500 shadow-2xl shadow-admin-primary-500/25 group overflow-hidden relative"
              disabled={isLoading}
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="text-xs font-black uppercase tracking-[0.3em]">Initialize Control</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </Button>
          </form>

          {/* Primary auth entry only */}
        </div>
      </div>
    </div>
  );
};

export default AuthPortal;
