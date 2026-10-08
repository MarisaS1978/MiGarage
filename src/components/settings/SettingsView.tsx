import React from 'react';
import { useGarage } from '../../context/GarageContext';
import {
  Settings,
  Home,
  Building2,
  RefreshCw,
  Download,
  Shield,
  CheckCircle2,
  Lock,
  Sparkles,
  Smartphone,
  Info,
  Bell,
  Volume2,
  Sliders,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    mode,
    setMode,
    setShowModeSelector,
    resetToDemoData,
    vehicles,
    reminders,
    incidents,
    notificationSettings,
    updateNotificationSettings,
    requestNotificationPermission,
    sendTestNotification,
    checkUpcomingExpirationsNow,
    showToast,
  } = useGarage();

  const handleExportJSON = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      mode,
      vehicles,
      reminders,
      incidents,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MiGarage_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Copia de respaldo JSON descargada');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Configuración
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Ajustes de la aplicación, selector de modo de uso, privacidad y respaldos.
        </p>
      </div>

      {/* Mode Switcher Block */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Modo de Uso de MiGarage</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Elegí cómo querés navegar la aplicación. Ambos modos utilizan la misma base de datos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Option: Family */}
          <div
            onClick={() => setMode('family')}
            className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
              mode === 'family'
                ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Home className="w-5 h-5" />
                </div>
                {mode === 'family' && (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Activo</span>
                  </span>
                )}
              </div>
              <h3 className="font-bold text-slate-900 text-base">🏠 Modo Familiar</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                "Administrá tus vehículos y compartilos con tu familia."
              </p>
              <div className="text-[11px] text-slate-500 mt-2 font-medium">
                Vehículos personales, services, gastos y miembros familiares.
              </div>
            </div>

            <button
              onClick={() => setMode('family')}
              className={`w-full mt-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                mode === 'family'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {mode === 'family' ? 'Modo actual' : 'Activar Modo Familiar'}
            </button>
          </div>

          {/* Option: Enterprise */}
          <div
            onClick={() => setMode('enterprise')}
            className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
              mode === 'enterprise'
                ? 'border-teal-500 bg-teal-50/50 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                {mode === 'enterprise' && (
                  <span className="text-xs font-bold text-teal-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Activo</span>
                  </span>
                )}
              </div>
              <h3 className="font-bold text-slate-900 text-base">🏢 Modo Empresa</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                "Gestioná tu flota, conductores, costos y mantenimiento."
              </p>
              <div className="text-[11px] text-slate-500 mt-2 font-medium">
                Flota comercial, choferes, centros de costo, auditoría y reportes.
              </div>
            </div>

            <button
              onClick={() => setMode('enterprise')}
              className={`w-full mt-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                mode === 'enterprise'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {mode === 'enterprise' ? 'Modo actual' : 'Activar Modo Empresa'}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => setShowModeSelector(true)}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Volver a ver la pantalla inicial de bienvenida</span>
          </button>
        </div>
      </div>

      {/* Sistema de Notificaciones Web & Push */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-teal-600" />
              <h2 className="text-base font-bold text-slate-900">
                Notificaciones Web & Push de Vencimientos
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Alertas anticipadas para renovar seguros, realizar la VTV y servicios de mantenimiento.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {notificationSettings.permissionStatus !== 'granted' ? (
              <button
                onClick={requestNotificationPermission}
                className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                Activar Notificaciones Web
              </button>
            ) : (
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                🟢 Activadas en navegador
              </span>
            )}
            <button
              onClick={sendTestNotification}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition cursor-pointer"
            >
              Probar Alerta
            </button>
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.notifyInsurance}
              onChange={(e) => updateNotificationSettings({ notifyInsurance: e.target.checked })}
              className="mt-0.5 rounded text-teal-600"
            />
            <div>
              <div className="font-bold text-slate-900">🛡️ Vencimientos de Seguros</div>
              <div className="text-slate-500 text-[11px]">Aviso 30 y 7 días antes de la caducidad de la póliza</div>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.notifyVtv}
              onChange={(e) => updateNotificationSettings({ notifyVtv: e.target.checked })}
              className="mt-0.5 rounded text-teal-600"
            />
            <div>
              <div className="font-bold text-slate-900">📄 VTV y Documentación Obligatoria</div>
              <div className="text-slate-500 text-[11px]">Aviso preventivo de oblea técnica e inspecciones</div>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.notifyMaintenance}
              onChange={(e) => updateNotificationSettings({ notifyMaintenance: e.target.checked })}
              className="mt-0.5 rounded text-teal-600"
            />
            <div>
              <div className="font-bold text-slate-900">🔧 Services de Mantenimiento</div>
              <div className="text-slate-500 text-[11px]">Alertas por kilometraje (a 1.000 km) y por fecha prevista</div>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.soundEnabled}
              onChange={(e) => updateNotificationSettings({ soundEnabled: e.target.checked })}
              className="mt-0.5 rounded text-teal-600"
            />
            <div>
              <div className="font-bold text-slate-900">🔊 Alerta Sonora Agradable</div>
              <div className="text-slate-500 text-[11px]">Tono suave Web Audio al recibir un aviso importante</div>
            </div>
          </label>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
          <span>Anticipación de alertas: 30 días, 15 días y en la semana del vencimiento.</span>
          <button
            onClick={() => checkUpcomingExpirationsNow(true)}
            className="text-teal-700 font-bold hover:underline cursor-pointer"
          >
            Escanear ahora
          </button>
        </div>
      </div>

      {/* Data & Backup */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">Datos y Respaldos</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <button
            onClick={handleExportJSON}
            className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold cursor-pointer transition text-left"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-teal-600 shrink-0" />
              <div>
                <div className="font-bold">Exportar Copia JSON</div>
                <div className="text-slate-500 font-normal mt-0.5">Descargá todos tus datos a tu dispositivo</div>
              </div>
            </div>
          </button>

          <button
            onClick={resetToDemoData}
            className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold cursor-pointer transition text-left"
          >
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <div className="font-bold">Restaurar Datos de Demostración</div>
                <div className="text-slate-500 font-normal mt-0.5">Recargá los 3 autos familiares y 10 unidades de flota</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Privacy & Security Statement */}
      <div className="bg-slate-900 text-slate-200 rounded-3xl p-6 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2.5 text-teal-300 font-bold text-sm">
          <Shield className="w-5 h-5 text-teal-400" />
          <span>Privacidad & Seguridad de tus Datos</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          MiGarage no comparte públicamente tus datos personales, números de póliza ni DNI salvo que explícitamente decidas generar una ficha de siniestro temporal. Todos tus registros se almacenan y procesan de forma local y segura.
        </p>
      </div>
    </div>
  );
};
