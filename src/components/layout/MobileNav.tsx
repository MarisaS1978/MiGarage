import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import {
  Home,
  Car,
  Bell,
  AlertTriangle,
  Menu,
  X,
  Wrench,
  FileText,
  Shield,
  Coins,
  Users,
  Settings,
  Truck,
  Fuel,
  BarChart3,
  Building2,
  ChevronRight,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { mode, currentTab, setCurrentTab, reminders, incidents, setMode, unreadAlertsCount } = useGarage();
  const [showMoreDrawer, setShowMoreDrawer] = useState(false);

  const activeRemindersCount = Math.max(
    reminders.filter((r) => !r.completed).length,
    unreadAlertsCount
  );
  const activeIncidentsCount = incidents.filter(
    (i) => i.status !== 'resuelto' && i.status !== 'rechazado'
  ).length;

  const handleSelectTab = (tabId: string) => {
    setCurrentTab(tabId);
    setShowMoreDrawer(false);
  };

  // Primary bottom tab buttons
  const isFamily = mode === 'family';

  return (
    <>
      {/* "Más" Bottom Drawer Modal */}
      {showMoreDrawer && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setShowMoreDrawer(false)}
          />
          <div className="relative bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 pb-8 shadow-2xl z-10 max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Menu className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-base text-white">Menú Completo</h3>
              </div>
              <button
                onClick={() => setShowMoreDrawer(false)}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher Banner in Drawer */}
            <div className="p-3 mb-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Modo activo</div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                  {isFamily ? (
                    <>
                      <Home className="w-4 h-4 text-emerald-400" />
                      <span>Modo Familiar</span>
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4 text-teal-400" />
                      <span>Modo Empresa</span>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setMode(isFamily ? 'enterprise' : 'family');
                  setShowMoreDrawer(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Cambiar a {isFamily ? 'Empresa' : 'Familiar'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Grid of Sections */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleSelectTab('mantenimiento')}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-left cursor-pointer border border-slate-700/50"
              >
                <Wrench className="w-5 h-5 text-teal-400 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-white">Mantenimiento</div>
                  <div className="text-[11px] text-slate-400">Services e historial</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('documentos')}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-left cursor-pointer border border-slate-700/50"
              >
                <FileText className="w-5 h-5 text-teal-400 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-white">Documentación</div>
                  <div className="text-[11px] text-slate-400">Cédula, VTV, licencias</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('seguros')}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-left cursor-pointer border border-slate-700/50"
              >
                <Shield className="w-5 h-5 text-teal-400 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-white">Seguros</div>
                  <div className="text-[11px] text-slate-400">Pólizas y auxilio 24h</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab(isFamily ? 'gastos' : 'combustible')}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-left cursor-pointer border border-slate-700/50"
              >
                {isFamily ? (
                  <Coins className="w-5 h-5 text-teal-400 shrink-0" />
                ) : (
                  <Fuel className="w-5 h-5 text-teal-400 shrink-0" />
                )}
                <div>
                  <div className="text-sm font-semibold text-white">
                    {isFamily ? 'Gastos' : 'Combustible'}
                  </div>
                  <div className="text-[11px] text-slate-400">Consumos y costos</div>
                </div>
              </button>

              {isFamily ? (
                <button
                  onClick={() => handleSelectTab('familia')}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-left cursor-pointer border border-slate-700/50"
                >
                  <Users className="w-5 h-5 text-teal-400 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-white">Familia</div>
                    <div className="text-[11px] text-slate-400">Garage compartido</div>
                  </div>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleSelectTab('gastos')}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-left cursor-pointer border border-slate-700/50"
                  >
                    <Coins className="w-5 h-5 text-teal-400 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-white">Gastos & Centros</div>
                      <div className="text-[11px] text-slate-400">Costos operativos</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectTab('informes')}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-left cursor-pointer border border-slate-700/50"
                  >
                    <BarChart3 className="w-5 h-5 text-teal-400 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-white">Informes & KPIs</div>
                      <div className="text-[11px] text-slate-400">Estadísticas y CSV</div>
                    </div>
                  </button>
                </>
              )}

              <button
                onClick={() => handleSelectTab('configuracion')}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-left cursor-pointer border border-slate-700/50"
              >
                <Settings className="w-5 h-5 text-teal-400 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-white">Configuración</div>
                  <div className="text-[11px] text-slate-400">Ajustes generales</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900/98 backdrop-blur border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl safe-bottom">
        {/* Tab 1: Inicio */}
        <button
          onClick={() => handleSelectTab('inicio')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer min-w-[56px] ${
            currentTab === 'inicio' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1">Inicio</span>
        </button>

        {/* Tab 2: Vehículos o Flota */}
        <button
          onClick={() => handleSelectTab(isFamily ? 'vehiculos' : 'flota')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer min-w-[56px] ${
            currentTab === 'vehiculos' || currentTab === 'flota'
              ? 'text-teal-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {isFamily ? <Car className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
          <span className="text-[10px] mt-1">{isFamily ? 'Vehículos' : 'Flota'}</span>
        </button>

        {/* Tab 3: Recordatorios o Conductores */}
        {isFamily ? (
          <button
            onClick={() => handleSelectTab('recordatorios')}
            className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer min-w-[56px] ${
              currentTab === 'recordatorios' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-5 h-5" />
            {activeRemindersCount > 0 && (
              <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-amber-400" />
            )}
            <span className="text-[10px] mt-1">Avisos</span>
          </button>
        ) : (
          <button
            onClick={() => handleSelectTab('conductores')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer min-w-[56px] ${
              currentTab === 'conductores' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] mt-1">Choferes</span>
          </button>
        )}

        {/* Tab 4: Siniestros (Critical in both modes!) */}
        <button
          onClick={() => handleSelectTab('siniestros')}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer min-w-[56px] ${
            currentTab === 'siniestros' ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
          {activeIncidentsCount > 0 && (
            <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
          <span className="text-[10px] mt-1">Siniestros</span>
        </button>

        {/* Tab 5: Más */}
        <button
          onClick={() => setShowMoreDrawer(true)}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-400 hover:text-white transition cursor-pointer min-w-[56px]"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-1">Más</span>
        </button>
      </nav>
    </>
  );
};
