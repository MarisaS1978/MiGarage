import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import {
  Car,
  Home,
  Building2,
  Plus,
  RefreshCw,
  Sparkles,
  ChevronDown,
  Bell,
} from 'lucide-react';

interface HeaderProps {
  onOpenQuickAction: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuickAction, onOpenNotifications }) => {
  const { mode, setMode, setShowModeSelector, resetToDemoData, unreadAlertsCount } = useGarage();
  const [showModeDropdown, setShowModeDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-md shadow-teal-500/20 shrink-0">
            <Car className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">MiGarage</span>
              <span className="hidden sm:inline-block text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 border border-teal-800/40">
                v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden xs:block truncate">
              Todo tu garage en un solo lugar.
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mode Switcher pill dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowModeDropdown(!showModeDropdown)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-semibold transition cursor-pointer ${
                mode === 'family'
                  ? 'bg-emerald-950/70 border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/80'
                  : 'bg-teal-950/70 border-teal-700/60 text-teal-300 hover:bg-teal-900/80'
              }`}
              title="Cambiar modo de uso"
            >
              {mode === 'family' ? (
                <>
                  <Home className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Modo Familiar</span>
                  <span className="sm:hidden">Familiar</span>
                </>
              ) : (
                <>
                  <Building2 className="w-4 h-4 text-teal-400" />
                  <span className="hidden sm:inline">Modo Empresa</span>
                  <span className="sm:hidden">Empresa</span>
                </>
              )}
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* Dropdown Menu */}
            {showModeDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowModeDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl p-2 z-50 text-slate-200">
                  <div className="text-[11px] font-semibold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                    Cambiar modo de uso
                  </div>
                  <button
                    onClick={() => {
                      setMode('family');
                      setShowModeDropdown(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition cursor-pointer ${
                      mode === 'family'
                        ? 'bg-emerald-600/20 text-emerald-300 font-semibold border border-emerald-500/30'
                        : 'hover:bg-slate-700/60 text-slate-300'
                    }`}
                  >
                    <Home className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div>Modo Familiar</div>
                      <div className="text-[10px] text-slate-400 font-normal">Vehículos personales y familia</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setMode('enterprise');
                      setShowModeDropdown(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition cursor-pointer mt-1 ${
                      mode === 'enterprise'
                        ? 'bg-teal-600/20 text-teal-300 font-semibold border border-teal-500/30'
                        : 'hover:bg-slate-700/60 text-slate-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-teal-400" />
                    <div>
                      <div>Modo Empresa</div>
                      <div className="text-[10px] text-slate-400 font-normal">Flota, conductores y reportes</div>
                    </div>
                  </button>

                  <div className="border-t border-slate-700 my-1.5 pt-1.5">
                    <button
                      onClick={() => {
                        setShowModeSelector(true);
                        setShowModeDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg cursor-pointer transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Pantalla de bienvenida</span>
                    </button>
                    <button
                      onClick={() => {
                        resetToDemoData();
                        setShowModeDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg cursor-pointer transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                      <span>Restaurar datos demo</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Notifications Bell Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white transition cursor-pointer border border-slate-700/60"
            title="Centro de Notificaciones & Vencimientos"
            aria-label="Notificaciones"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center font-mono animate-pulse shadow-xs">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Quick Action Button */}
          <button
            onClick={onOpenQuickAction}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-teal-600 hover:bg-teal-500 active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-md shadow-teal-900/40 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Registrar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
