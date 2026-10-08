import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import { Reminder, ReminderCategory } from '../../types';
import {
  Bell,
  Plus,
  CheckCircle2,
  Clock,
  Calendar,
  Gauge,
  Share2,
  Trash2,
  Filter,
  Car,
  Wrench,
  Shield,
  FileText,
  Copy,
  Check,
  Send,
  X,
} from 'lucide-react';

interface RemindersViewProps {
  onOpenQuickAction: (actionType: 'recordatorio') => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({ onOpenQuickAction }) => {
  const {
    reminders,
    toggleReminderComplete,
    snoozeReminder,
    deleteReminder,
    showToast,
  } = useGarage();

  const [filterCategory, setFilterCategory] = useState<string>('todas');
  const [sharingReminder, setSharingReminder] = useState<Reminder | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const categories: { id: string; label: string; icon: any }[] = [
    { id: 'todas', label: 'Todas', icon: Bell },
    { id: 'mantenimiento', label: 'Mantenimiento', icon: Wrench },
    { id: 'seguro', label: 'Seguro', icon: Shield },
    { id: 'documentación', label: 'Documentación', icon: FileText },
    { id: 'neumáticos', label: 'Neumáticos', icon: Car },
    { id: 'combustible', label: 'Combustible', icon: Bell },
    { id: 'otro', label: 'Otro', icon: Bell },
  ];

  const filtered = reminders.filter((r) => {
    if (filterCategory === 'todas') return true;
    return r.category === filterCategory;
  });

  const generateShareText = (r: Reminder) => {
    let detail = '';
    if (r.dueMileage) detail += `\n🎯 Kilometraje previsto: a los ${r.dueMileage.toLocaleString('es-AR')} km`;
    if (r.dueDate) detail += `\n📅 Fecha límite: ${r.dueDate}`;
    if (r.notes) detail += `\n📝 Nota: ${r.notes}`;

    return `🔔 *Recordatorio MiGarage*\n🚗 *${r.vehicleName}*\n📌 *${r.title}*${detail}\n\nGestión integral de vehículos: https://migarage.app/r/${r.id}`;
  };

  const handleShareWhatsApp = (r: Reminder) => {
    const text = encodeURIComponent(generateShareText(r));
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    showToast('Abriendo WhatsApp...');
  };

  const handleCopyText = (r: Reminder) => {
    navigator.clipboard.writeText(generateShareText(r));
    setCopiedLink(true);
    showToast('Enlace y recordatorio copiado al portapapeles');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleNativeShare = async (r: Reminder) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `MiGarage: ${r.title}`,
          text: generateShareText(r),
        });
      } catch {
        handleCopyText(r);
      }
    } else {
      handleCopyText(r);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Recordatorios
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Programá avisos de service, VTV, seguros y mantenimientos por fecha o kilometraje.
          </p>
        </div>

        <button
          onClick={() => onOpenQuickAction('recordatorio')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold shadow-md shadow-teal-900/20 transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Recordatorio</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              filterCategory === cat.id
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No hay recordatorios en esta categoría</h3>
          <p className="text-sm text-slate-500 mt-1">Creá un aviso para mantener todo al día.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((rem) => {
            const isCompleted = rem.completed;

            return (
              <div
                key={rem.id}
                className={`group bg-white rounded-2xl border p-4 sm:p-5 transition-all duration-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'border-slate-200 bg-slate-50/60 opacity-70'
                    : 'border-slate-200 hover:border-teal-500/60'
                }`}
              >
                {/* Left check and info */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <button
                    onClick={() => toggleReminderComplete(rem.id)}
                    className={`mt-0.5 w-6 h-6 rounded-full border flex items-center justify-center transition cursor-pointer shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 hover:border-emerald-600 text-transparent'
                    }`}
                    title={isCompleted ? 'Desmarcar' : 'Completar recordatorio'}
                  >
                    <CheckCircle2 className="w-4 h-4 fill-current" />
                  </button>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                        {rem.vehicleName}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        {rem.category}
                      </span>
                    </div>

                    <h3
                      className={`text-base font-bold text-slate-900 ${
                        isCompleted ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {rem.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                      {rem.dueDate && (
                        <span className="flex items-center gap-1 font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Vence: {rem.dueDate}</span>
                        </span>
                      )}
                      {rem.dueMileage && (
                        <span className="flex items-center gap-1 font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          <Gauge className="w-3.5 h-3.5 text-teal-600" />
                          <span>A los {rem.dueMileage.toLocaleString('es-AR')} km</span>
                        </span>
                      )}
                    </div>

                    {rem.notes && (
                      <p className="text-xs text-slate-500 italic mt-1 leading-relaxed">
                        {rem.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Actions: Snooze, Share, Delete */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  {/* Snooze button */}
                  {!isCompleted && (
                    <button
                      onClick={() => snoozeReminder(rem.id, 7, 1000)}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition cursor-pointer flex items-center gap-1"
                      title="Posponer 7 días y 1.000 km"
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Posponer</span>
                    </button>
                  )}

                  {/* Share button */}
                  <button
                    onClick={() => setSharingReminder(rem)}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-teal-700 hover:text-teal-800 hover:bg-teal-50 border border-teal-200 transition cursor-pointer flex items-center gap-1"
                    title="Compartir recordatorio"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Compartir</span>
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => deleteReminder(rem.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Eliminar recordatorio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Share Modal */}
      {sharingReminder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200">
            <button
              onClick={() => setSharingReminder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
              <Share2 className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">Compartir Recordatorio</h3>
            <p className="text-xs text-slate-500 mt-1">
              Compartí este aviso con integrantes de la familia o conductores.
            </p>

            {/* Preview Box */}
            <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 whitespace-pre-line font-mono">
              {generateShareText(sharingReminder)}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={() => handleShareWhatsApp(sharingReminder)}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition"
              >
                <Send className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => handleNativeShare(sharingReminder)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? '¡Copiado!' : 'Copiar enlace'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
