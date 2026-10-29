import React, { useState } from 'react';
import {
  LogIn,
  Save,
  ShieldCheck,
  Smartphone,
  Mail,
  Globe,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Zap,
  Clock,
  Settings2
} from 'lucide-react';
import Button from '../../components/ui/Button';

const Toggle = ({ label, subtitle, icon: Icon, active, onToggle }) => (
  <div className="flex items-center justify-between p-7 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-[2.5rem] group hover:border-admin-primary-300 dark:hover:border-admin-primary-800 transition-all duration-500 shadow-sm hover:shadow-md">
    <div className="flex items-start gap-5">
      <div className={`w-14 h-14 flex-shrink-0 rounded-2xl flex items-center justify-center transition-all duration-500 ${active ? 'bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 shadow-inner' : 'bg-surface-50 dark:bg-surface-900 text-surface-400 opacity-60'}`}>
        <Icon size={28} />
      </div>
      <div className="space-y-1.5 pt-1">
        <h4 className="text-[15px] font-black text-surface-900 dark:text-white uppercase tracking-tight leading-none">{label}</h4>
        <p className="text-xs text-surface-500 dark:text-surface-400 font-medium leading-relaxed max-w-[22rem]">{subtitle}</p>
      </div>
    </div>
    <button
      onClick={onToggle}
      className={`relative rounded-full transition-all duration-300 focus:outline-none shadow-sm`}
      style={{ width: '80px', height: '28px', backgroundColor: active ? '#4F46E5' : '#D1D5DB' }}
    >
      <div
        className="absolute bg-white rounded-full shadow-md transition-all duration-300 ease-&lsqb;cubic-bezier(0.4,0,0.2,1)&rsqb; flex items-center justify-center"
        style={{
          width: '24px',
          height: '24px',
          top: '2px',
          left: '2px',
          transform: active ? 'translateX(22px)' : 'translateX(0)'
        }}
      >
        <div
          className="rounded-full transition-all duration-300"
          style={{
            width: '6px',
            height: '6px',
            backgroundColor: active ? '#4F46E5' : 'transparent',
            transform: active ? 'scale(1)' : 'scale(0)'
          }}
        />
      </div>
      {active && (
        <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.4)] pointer-events-none" />
      )}
    </button>
  </div>
);

const LoginSettingsPage = () => {
  const [settings, setSettings] = useState({
    otpLogin: true,
    socialLogin: true,
    mfa: false,
    emailVerification: true,
    sessionPersistence: true,
    biometric: false,
  });

  const [isApplying, setIsApplying] = useState(false);

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => setIsApplying(false), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 text-[10px] font-black tracking-[0.3em] uppercase">
            25 System Setup
          </div>
          <h1 className="text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight">Security <span className="text-admin-primary-600">& Auth</span></h1>
          <p className="text-sm text-surface-500 max-w-lg">Guard your workspace by configuring authentication workflows and security access points.</p>
        </div>
        <Button 
          variant="primary" 
          icon={isApplying ? Zap : Save} 
          onClick={handleApply}
          className={`${isApplying ? 'bg-green-600 h-auto' : ''} shadow-lg shadow-admin-primary-500/20 px-8 py-4`}
        >
          {isApplying ? 'Settings Synchronized' : 'Apply Global Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-8">
        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Toggle
              label="OTP Login"
              subtitle="Enable passwordless login via mobile one-time passwords."
              icon={Smartphone}
              active={settings.otpLogin}
              onToggle={() => toggle('otpLogin')}
            />
            <Toggle
              label="Social Gateway"
              subtitle="Allow customers to sign up using Google, Apple, or Facebook."
              icon={Globe}
              active={settings.socialLogin}
              onToggle={() => toggle('socialLogin')}
            />
            <Toggle
              label="Two-Factor (MFA)"
              subtitle="High-security layer requiring secondary device confirmation."
              icon={ShieldCheck}
              active={settings.mfa}
              onToggle={() => toggle('mfa')}
            />
            <Toggle
              label="Email Guard"
              subtitle="Force email verification before allowing dashboard access."
              icon={Mail}
              active={settings.emailVerification}
              onToggle={() => toggle('emailVerification')}
            />
            <Toggle
              label="Session Lock"
              subtitle="Automatically persist session data for returning users."
              icon={Clock}
              active={settings.sessionPersistence}
              onToggle={() => toggle('sessionPersistence')}
            />
            <Toggle
              label="Biometric Link"
              subtitle="Support FaceID and Fingerprint API for mobile device app."
              icon={Zap}
              active={settings.biometric}
              onToggle={() => toggle('biometric')}
            />
          </div>

          <div className="p-10 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-[3rem] space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white dark:bg-surface-800 rounded-2xl shadow-sm text-admin-primary-600">
                <UserCheck size={28} />
              </div>
              <div>
                <h3 className="text-lg font-black text-surface-900 dark:text-white uppercase tracking-tight">Session Parameters</h3>
                <p className="text-xs text-surface-400 font-bold uppercase tracking-widest mt-1">Control active user sessions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">Inactivity Timeout (Minutes)</label>
                <input type="number" defaultValue="30" className="w-full px-5 py-4 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl outline-none focus:ring-2 focus:ring-admin-primary-500/20 font-bold transition-all text-sm dark:text-white" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">Max Login Attempts</label>
                <input type="number" defaultValue="5" className="w-full px-5 py-4 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl outline-none focus:ring-2 focus:ring-admin-primary-500/20 font-bold transition-all text-sm dark:text-white" />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="p-10 bg-admin-primary-600 rounded-[3rem] text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full" />
            <div className="relative z-10">
              <Lock size={40} className="mb-6 opacity-80" />
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4 leading-tight">Master Auth<br />Protocol</h2>
              <p className="text-sm text-white/80 leading-relaxed font-medium mb-8">All authentication flows are encrypted using AES-256 and compliant with OWASP security standards.</p>
              <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-white/20 px-6 py-3 rounded-xl hover:bg-white/30 transition-all">
                System Audit Logs
              </button>
            </div>
          </div>

          <div className="p-8 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-[3rem] shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600">
                <Settings2 size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-surface-900 dark:text-white">API Integration</h3>
                <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Connect external auth</p>
              </div>
            </div>
            <p className="text-xs text-surface-500 leading-relaxed font-medium mb-6">Want to use Firebase or Auth0 instead of native authentication? Connect via the developer portal.</p>
            <button className="flex items-center justify-between w-full px-5 py-4 bg-surface-50 dark:bg-surface-900 rounded-2xl transition-all group">
              <span className="text-[10px] font-black uppercase tracking-widest text-surface-600 dark:text-surface-300">Open Portal</span>
              <LogIn size={18} className="text-surface-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginSettingsPage;
