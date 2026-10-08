import React from 'react';
import { useGarage } from '../../context/GarageContext';
import {
  Home,
  Car,
  Bell,
  Wrench,
  FileText,
  Shield,
  Coins,
  AlertTriangle,
  Users,
  Settings,
  Truck,
  Fuel,
  BarChart3,
  Building2,
  ChevronRight,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { mode, currentTab, setCurrentTab, reminders, incidents, vehicles, drivers, unreadAlertsCount } = useGarage();

  const activeRemindersCount = Math.max(
    reminders.filter((r) => !r.completed).length,
    unreadAlertsCount
  );
  const activeIncidentsCount = incidents.filter(
    (i) => i.status !== 'resuelto' && i.status !== 'rechazado'
  ).length;

  const familyNav = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    {
      id: 'vehiculos',
      label: 'Mis vehículos',
      icon: Car,
      badge: vehicles.filter((v) => v.mode === 'family' || v.mode === 'both').length,
    },
    {
      id: 'recordatorios',
      label: 'Recordatorios',
      icon: Bell,
      badge: activeRemindersCount > 0 ? activeRemindersCount : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    { id: 'mantenimiento', label: 'Mantenimiento', icon: Wrench },
    { id: 'documentos', label: 'Documentación', icon: FileText },
    { id: 'seguros', label: 'Seguros', icon: Shield },
    { id: 'gastos', label: 'Gastos & Combustible', icon: Coins },
    {
      id: 'siniestros',
      label: 'Siniestros',
      icon: AlertTriangle,
      badge: activeIncidentsCount > 0 ? activeIncidentsCount : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    },
    { id: 'familia', label: 'Familia', icon: Users },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
  ];

  const enterpriseNav = [
    { id: 'inicio', label: 'Dashboard', icon: Home },
    {
      id: 'flota',
      label: 'Flota',
      icon: Truck,
      badge: vehicles.filter((v) => v.mode === 'enterprise' || v.mode === 'both').length,
    },
    { id: 'conductores', label: 'Conductores', icon: Users, badge: drivers.length },
    { id: 'mantenimiento', label: 'Mantenimiento Flota', icon: Wrench },
    { id: 'combustible', label: 'Combustible', icon: Fuel },
    { id: 'gastos', label: 'Gastos & Centros', icon: Coins },
    { id: 'seguros', label: 'Seguros Corporativos', icon: Shield },
    { id: 'documentos', label: 'Documentación & RUTA', icon: FileText },
    {
      id: 'siniestros',
      label: 'Siniestros',
      icon: AlertTriangle,
      badge: activeIncidentsCount > 0 ? activeIncidentsCount : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    },
    { id: 'informes', label: 'Informes & KPIs', icon: BarChart3 },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
  ];

  const navItems = mode === 'family' ? familyNav : enterpriseNav;

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-slate-900 border-r border-slate-800 text-slate-300 min-h-[calc(100vh-4rem)] p-4 select-none">
      {/* Mode Indicator Banner */}
      <div
        className={`mb-4 px-3.5 py-3 rounded-2xl border flex items-center justify-between text-xs font-semibold ${
          mode === 'family'
            ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300'
            : 'bg-teal-950/40 border-teal-800/40 text-teal-300'
        }`}
      >
        <div className="flex items-center gap-2">
          {mode === 'family' ? (
            <Car className="w-4 h-4 text-emerald-400" />
          ) : (
            <Building2 className="w-4 h-4 text-teal-400" />
          )}
          <span>{mode === 'family' ? 'Garage Familiar' : 'Gestión de Flota'}</span>
        </div>
        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
          Activo
        </span>
      </div>

      {/* Navigation List */}
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                isActive
                  ? mode === 'family'
                    ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-900/30'
                    : 'bg-teal-600 text-white font-semibold shadow-md shadow-teal-900/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? 'text-white'
                      : mode === 'family'
                      ? 'text-emerald-400'
                      : 'text-teal-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border ${
                    isActive
                      ? 'bg-white/20 text-white border-white/30'
                      : item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Footer hint */}
      <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Modo {mode === 'family' ? 'Familiar' : 'Empresa'}</span>
        <button
          onClick={() => setCurrentTab('configuracion')}
          className="text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Ajustes</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </aside>
  );
};
