import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Check } from 'lucide-react';

export const presets = [
  { label: 'Today', days: 0 },
  { label: 'Yesterday', days: 1, isYesterday: true },
  { label: 'Last 7 Days', days: 7 },
  { label: 'Last 30 Days', days: 30 },
  { label: 'This Month', isThisMonth: true },
  { label: 'All Time', isAllTime: true },
];

const formatDateForInput = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const formatDisplayDate = (d) => {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const AdminDateRangePicker = ({ value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Default to Last 7 Days if not specified
  const now = new Date();
  const defaultStart = new Date();
  defaultStart.setDate(now.getDate() - 7);

  const [startDate, setStartDate] = useState(value?.startDate || formatDateForInput(defaultStart));
  const [endDate, setEndDate] = useState(value?.endDate || formatDateForInput(now));
  const [activeLabel, setActiveLabel] = useState(value?.label || 'Last 7 Days');

  // Sync external changes
  useEffect(() => {
    if (value?.startDate) setStartDate(value.startDate);
    if (value?.endDate) setEndDate(value.endDate);
    if (value?.label) setActiveLabel(value.label);
  }, [value]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const applyPreset = (preset) => {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    if (preset.isAllTime) {
      start = new Date('2020-01-01');
    } else if (preset.isYesterday) {
      start.setDate(today.getDate() - 1);
      end.setDate(today.getDate() - 1);
    } else if (preset.isThisMonth) {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (preset.days === 0) {
      // today
      start = today;
      end = today;
    } else {
      start.setDate(today.getDate() - preset.days);
    }

    const startStr = formatDateForInput(start);
    const endStr = formatDateForInput(end);

    setStartDate(startStr);
    setEndDate(endStr);
    setActiveLabel(preset.label);
    setIsOpen(false);

    if (onChange) {
      onChange({ startDate: startStr, endDate: endStr, label: preset.label });
    }
  };

  const handleCustomApply = () => {
    if (!startDate || !endDate) return;
    setActiveLabel('Custom');
    setIsOpen(false);
    if (onChange) {
      onChange({ startDate, endDate, label: 'Custom' });
    }
  };

  const displayString = () => {
    try {
      const s = new Date(startDate);
      const e = new Date(endDate);
      if (startDate === endDate) {
        return formatDisplayDate(s);
      }
      return `${s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${formatDisplayDate(e)}`;
    } catch {
      return `${startDate} - ${endDate}`;
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-2.5 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 hover:border-admin-primary-500 rounded-xl shadow-sm text-sm font-medium text-surface-700 dark:text-surface-200 transition-all duration-200 group active:scale-[0.98]"
      >
        <Calendar size={16} className="text-admin-primary-500 transition-transform group-hover:scale-110" />
        <span className="whitespace-nowrap font-semibold">{displayString()}</span>
        <ChevronDown size={14} className={`text-surface-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-surface-100 dark:border-surface-800 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-surface-400">Filter By Date</span>
            {activeLabel && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-admin-primary-50 dark:bg-admin-primary-900/30 text-admin-primary-600">
                {activeLabel}
              </span>
            )}
          </div>

          {/* Quick presets */}
          <div className="grid grid-cols-2 gap-1.5 mb-4">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors ${
                  activeLabel === preset.label
                    ? 'bg-admin-primary-50 dark:bg-admin-primary-900/30 text-admin-primary-600 font-bold'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                }`}
              >
                <span>{preset.label}</span>
                {activeLabel === preset.label && <Check size={14} className="text-admin-primary-600" />}
              </button>
            ))}
          </div>

          {/* Custom Date Range Inputs */}
          <div className="space-y-2 pt-2 border-t border-surface-100 dark:border-surface-800">
            <div className="text-[11px] font-semibold text-surface-500">Custom Range</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-surface-400 block mb-1">Start</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg text-surface-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-admin-primary-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-surface-400 block mb-1">End</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg text-surface-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-admin-primary-500"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleCustomApply}
              className="w-full mt-2 py-2 bg-admin-primary-600 hover:bg-admin-primary-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDateRangePicker;
