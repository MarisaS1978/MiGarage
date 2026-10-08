import React from 'react';
import { useGarage } from '../../context/GarageContext';
import {
  Car,
  Home,
  Building2,
  Wrench,
  Bell,
  FileText,
  Shield,
  Coins,
  AlertTriangle,
  Users,
  Truck,
  BarChart3,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const ModeSelectionScreen: React.FC = () => {
  const { setMode } = useGarage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-teal-950 to-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-10">
      {/* Brand Header */}
      <div className="max-w-4xl mx-auto w-full pt-4 md:pt-8 text-center">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-teal-800/40 border border-teal-600/30 text-teal-300 text-xs sm:text-sm font-semibold tracking-wide mb-4">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Tu asistente vehicular integral</span>
        </div>

        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <Car className="w-7 h-7 sm:w-8 sm:h-8 text-slate-950" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            MiGarage
          </h1>
        </div>

        <p className="text-teal-200/90 text-lg sm:text-xl font-medium">
          Todo tu garage en un solo lugar.
        </p>

        <div className="mt-8 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
            ¿Cómo vas a utilizar MiGarage?
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Podés alternar entre ambos modos en cualquier momento desde Configuración.
          </p>
        </div>
      </div>

      {/* Mode Choice Cards */}
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 my-auto">
        {/* Card: Modo Familiar */}
        <div className="relative group bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 shadow-xl shadow-black/40">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Home className="w-7 h-7" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                Personal & Familia
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              Modo Familiar
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              "Administrá tus vehículos y compartilos con tu familia."
            </p>

            <div className="space-y-2.5 mb-8">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Incluye:
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Vehículos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Mantenimiento</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Recordatorios</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Documentación</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Seguros</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Gastos</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Siniestros</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Usuarios familiares</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setMode('family')}
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-semibold text-base shadow-lg shadow-emerald-700/30 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Ingresar al modo familiar</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          </button>
        </div>

        {/* Card: Modo Empresa */}
        <div className="relative group bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-teal-400/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 shadow-xl shadow-black/40">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Building2 className="w-7 h-7" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-teal-950 text-teal-300 border border-teal-700/50">
                Flotas & Negocios
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              Modo Empresa
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              "Gestioná tu flota, conductores, costos y mantenimiento."
            </p>

            <div className="space-y-2.5 mb-8">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Incluye:
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Flota comercial</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Conductores</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Mantenimiento</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Gastos & Combustible</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Seguros & R.U.T.A.</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Siniestros & Costos</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Informes & Export</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Centros de costo</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setMode('enterprise')}
            className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-500 active:scale-[0.99] text-white font-semibold text-base shadow-lg shadow-teal-700/30 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Ingresar al modo empresa</span>
            <CheckCircle2 className="w-5 h-5 text-teal-200" />
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-4xl mx-auto w-full text-center pb-2 pt-6">
        <p className="text-xs text-slate-500">
          Ambos modos comparten la misma base de datos con visualizaciones optimizadas para cada necesidad.
        </p>
      </div>
    </div>
  );
};
