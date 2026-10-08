import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import { ExpirationAlert, ExpirationAlertType } from '../../types';
import {
  Bell,
  X,
  Shield,
  FileText,
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Send,
  ExternalLink,
  Volume2,
  VolumeX,
  Smartphone,
  RefreshCw,
  Sparkles,
  Settings,
  Sliders,
} from 'lucide-react';

interface NotificationCenterModalProps {
  onClose: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({ onClose }) => {
  const {
    alerts,
    unreadAlertsCount,
    notificationSettings,
    updateNotificationSettings,
    markAlertAsRead,
    markAllAlertsAsRead,
    requestNotificationPermission,
    sendTestNotification,
    checkUpcomingExpirationsNow,
    setCurrentTab,
    showToast,
  } = useGarage();

  const [activeFilter, setActiveFilter] = useState<'todas' | ExpirationAlertType>('todas');
  const [showConfig, setShowConfig] = useState(false);

  const filteredAlerts = alerts.filter((alert) => {
    if (activeFilter === 'todas') return true;
    return alert.type === activeFilter;
  });

  const handleGoToSection = (alert: ExpirationAlert) => {
    if (alert.actionTab) {
      setCurrentTab(alert.actionTab);
      markAlertAsRead(alert.id);
      onClose();
    }
  };

  const handleShareAlert = (alert: ExpirationAlert) => {
    const text = encodeURIComponent(
      `🔔 *Alerta de Vencimiento MiGarage*\n🚗 *${alert.vehicleName}*\n📌 *${alert.title}*\n⏱️ *${alert.detail}*\n\nVerificado en MiGarage: https://migarage.app`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    showToast('Abriendo WhatsApp...');
  };

  const getUrgencyConfig = (urgency: ExpirationAlert['urgency']) => {
    switch (urgency) {
      case 'critico':
        return {
          label: 'Vencimiento Crítico',
          bg: 'bg-rose-50 border-rose-200 text-rose-900',
          badge: 'bg-rose-600 text-white',
          dot: 'bg-rose-500',
        };
      case 'urgente':
        return {
          label: 'Próximo a Vencer (< 15 días)',
          bg: 'bg-amber-50 border-amber-200 text-amber-900',
          badge: 'bg-amber-600 text-white',
          dot: 'bg-amber-500',
        };
      case 'aviso':
        return {
          label: 'Aviso Preventivo (< 35 días)',
          bg: 'bg-teal-50/70 border-teal-200 text-teal-900',
          badge: 'bg-teal-700 text-white',
          dot: 'bg-teal-500',
        };
      default:
        return {
          label: 'Al día',
          bg: 'bg-slate-50 border-slate-200 text-slate-800',
          badge: 'bg-slate-600 text-white',
          dot: 'bg-slate-400',
        };
    }
  };

  const getCategoryIcon = (type: ExpirationAlertType) => {
    switch (type) {
      case 'seguro':
        return <Shield className="w-4 h-4 text-blue-600" />;
      case 'vtv':
        return <FileText className="w-4 h-4 text-amber-600" />;
      case 'mantenimiento':
        return <Wrench className="w-4 h-4 text-teal-600" />;
      case 'licencia':
        return <AlertTriangle className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                  Centro de Notificaciones & Vencimientos
                </h2>
                {unreadAlertsCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500 text-white font-extrabold font-mono">
                    {unreadAlertsCount}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Alertas automáticas de pólizas de seguros, obleas de VTV y services de mantenimiento.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer shrink-0 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Web Push Banner */}
        <div className="bg-slate-100 p-4 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-teal-700 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">
                  {notificationSettings.permissionStatus === 'granted'
                    ? '🟢 Notificaciones Web / Push Activadas'
                    : notificationSettings.permissionStatus === 'denied'
                    ? '⚠️ Notificaciones bloqueadas en el navegador'
                    : '🔔 Activá las alertas automáticas en tu dispositivo'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {notificationSettings.permissionStatus === 'granted'
                    ? 'Recibirás avisos en pantalla incluso con la pestaña en segundo plano.'
                    : 'Permití el aviso del navegador para enterarte antes de que venza tu seguro o VTV.'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              {notificationSettings.permissionStatus !== 'granted' && (
                <button
                  onClick={requestNotificationPermission}
                  className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  Activar Notificaciones
                </button>
              )}

              <button
                onClick={sendTestNotification}
                className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition cursor-pointer"
                title="Probar sonido y notificación"
              >
                Probar
              </button>

              <button
                onClick={() => checkUpcomingExpirationsNow(true)}
                className="p-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 transition cursor-pointer"
                title="Escanear vencimientos ahora"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowConfig(!showConfig)}
                className={`p-1.5 rounded-xl border transition cursor-pointer ${
                  showConfig
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300'
                }`}
                title="Ajustar preferencias de alerta"
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Preferences Drawer */}
          {showConfig && (
            <div className="mt-3 pt-3 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-700">
              <label className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.notifyInsurance}
                  onChange={(e) =>
                    updateNotificationSettings({ notifyInsurance: e.target.checked })
                  }
                  className="rounded text-teal-600"
                />
                <span className="font-semibold">Seguros (30 días)</span>
              </label>

              <label className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.notifyVtv}
                  onChange={(e) => updateNotificationSettings({ notifyVtv: e.target.checked })}
                  className="rounded text-teal-600"
                />
                <span className="font-semibold">VTV & Obleas</span>
              </label>

              <label className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.soundEnabled}
                  onChange={(e) => updateNotificationSettings({ soundEnabled: e.target.checked })}
                  className="rounded text-teal-600"
                />
                <span className="font-semibold">Sonido de alerta</span>
              </label>
            </div>
          )}
        </div>

        {/* Filter Pills & Actions */}
        <div className="px-5 pt-3 pb-2 flex items-center justify-between gap-2 overflow-x-auto border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <button
              onClick={() => setActiveFilter('todas')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                activeFilter === 'todas'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todas ({alerts.length})
            </button>
            <button
              onClick={() => setActiveFilter('seguro')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                activeFilter === 'seguro'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Seguros</span>
            </button>
            <button
              onClick={() => setActiveFilter('vtv')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                activeFilter === 'vtv'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>VTV</span>
            </button>
            <button
              onClick={() => setActiveFilter('mantenimiento')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                activeFilter === 'mantenimiento'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Services</span>
            </button>
          </div>

          {unreadAlertsCount > 0 && (
            <button
              onClick={markAllAlertsAsRead}
              className="text-xs text-teal-700 hover:text-teal-800 font-bold whitespace-nowrap cursor-pointer"
            >
              Marcar leídas
            </button>
          )}
        </div>

        {/* Alerts Content List */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3 flex-1 bg-slate-50">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">
                ¡Todo al día en tu garage!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                No hay vencimientos de seguros, VTV ni services pendientes en esta categoría.
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const urgencyConfig = getUrgencyConfig(alert.urgency);

              return (
                <div
                  key={alert.id}
                  className={`bg-white rounded-2xl p-4 border transition-all duration-200 shadow-xs space-y-3 ${
                    !alert.read
                      ? 'border-slate-300 ring-1 ring-teal-500/30'
                      : 'border-slate-200 opacity-90'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        {getCategoryIcon(alert.type)}
                      </div>
                      <span className="font-bold text-xs text-slate-900 font-mono">
                        {alert.vehicleName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${urgencyConfig.badge}`}
                      >
                        {urgencyConfig.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      {alert.daysRemaining !== undefined && (
                        <span className="font-bold font-mono text-slate-700">
                          {alert.daysRemaining <= 0
                            ? 'Vencido'
                            : `Vence en ${alert.daysRemaining} días`}
                        </span>
                      )}
                      {alert.kmRemaining !== undefined && (
                        <span className="font-mono text-slate-700">
                          (Faltan ~{alert.kmRemaining.toLocaleString('es-AR')} km)
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{alert.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {alert.detail}
                    </p>
                  </div>

                  {/* Actions per alert */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleGoToSection(alert)}
                        className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold transition cursor-pointer flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Ver en {alert.actionTab}</span>
                      </button>

                      <button
                        onClick={() => handleShareAlert(alert)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer flex items-center gap-1"
                        title="Enviar recordatorio por WhatsApp"
                      >
                        <Send className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Compartir</span>
                      </button>
                    </div>

                    {!alert.read && (
                      <button
                        onClick={() => markAlertAsRead(alert.id)}
                        className="text-[11px] text-slate-400 hover:text-slate-700 font-semibold cursor-pointer"
                      >
                        Descartar
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Sistema inteligente de alertas tempranas MiGarage</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
