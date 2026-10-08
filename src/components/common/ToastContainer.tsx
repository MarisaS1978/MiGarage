import React from 'react';
import { useGarage } from '../../context/GarageContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useGarage();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        let bg = 'bg-slate-900 border-slate-700 text-white';
        let Icon = Info;

        if (toast.type === 'success') {
          bg = 'bg-emerald-950 border-emerald-700/60 text-emerald-200';
          Icon = CheckCircle2;
        } else if (toast.type === 'warning') {
          bg = 'bg-amber-950 border-amber-700/60 text-amber-200';
          Icon = AlertTriangle;
        } else if (toast.type === 'error') {
          bg = 'bg-rose-950 border-rose-700/60 text-rose-200';
          Icon = AlertCircle;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur text-sm font-medium transition animate-in fade-in slide-in-from-bottom-2 ${bg}`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <p className="flex-1 leading-snug">{toast.message}</p>
          </div>
        );
      })}
    </div>
  );
};
