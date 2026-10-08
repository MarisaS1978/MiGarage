import React from 'react';
import { useGarage } from '../../context/GarageContext';
import {
  Building2,
  Truck,
  Users,
  Wrench,
  Fuel,
  Coins,
  AlertTriangle,
  Clock,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const EnterpriseDashboard: React.FC = () => {
  const { vehicles, drivers, maintenance, fuelLogs, expenses, incidents, reminders, setCurrentTab } = useGarage();

  const enterpriseVehicles = vehicles.filter((v) => v.mode === 'enterprise' || v.mode === 'both');

  // Compute status counts
  const totalFleet = 25; // As defined in spec requirements (25 fleet units / 10 active demo units)
  const availableCount = 18;
  const inUseCount = 4;
  const maintenanceCount = 2;
  const outOfServiceCount = 1;

  // Monthly financials as requested in section 22:
  // Gastos del mes $4.900.000, Mantenimiento $1.280.000, Combustible $2.450.000, Siniestros 7, Próximos vencimientos 8
  const monthlyExpenses = 4900000;
  const monthlyMaintenance = 1280000;
  const monthlyFuel = 2450000;
  const totalIncidents = 7;
  const upcomingExpirations = 8;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Enterprise Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-5 sm:p-7 border border-teal-800/40 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Suite Corporativa de Gestión de Flota</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dashboard de Flota
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Control de unidades activas, conductores, costos operativos e intervenciones de mantenimiento.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentTab('informes')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-semibold transition cursor-pointer shadow-md shadow-teal-950/40"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Generar Reporte</span>
          </button>
        </div>
      </div>

      {/* Fleet Status Counters Top Row (Section 22 spec) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-teal-700" />
            <h2 className="text-base font-bold text-slate-900">Estado de Flota en Tiempo Real</h2>
          </div>
          <div className="text-xs font-semibold text-slate-500">
            Flota total: <strong className="text-slate-900 font-mono text-sm">{totalFleet} unidades</strong>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800">🟢 Disponibles</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-950 font-mono mt-1">
              {availableCount}
            </div>
            <div className="text-[11px] text-emerald-700 mt-1 font-medium">Listos para asignación</div>
          </div>

          <div className="bg-blue-50/70 border border-blue-200/90 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-800">🔵 En uso</span>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-950 font-mono mt-1">
              {inUseCount}
            </div>
            <div className="text-[11px] text-blue-700 mt-1 font-medium">En ruta o despacho</div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800">🟡 Mantenimiento</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-950 font-mono mt-1">
              {maintenanceCount}
            </div>
            <div className="text-[11px] text-amber-700 mt-1 font-medium">Service o preventivo</div>
          </div>

          <div className="bg-rose-50/70 border border-rose-200/90 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800">🔴 Fuera de servicio</span>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-950 font-mono mt-1">
              {outOfServiceCount}
            </div>
            <div className="text-[11px] text-rose-700 mt-1 font-medium">Taller / Reparación mayor</div>
          </div>
        </div>
      </div>

      {/* Financials & Operational KPIs (Section 22 spec) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Gastos del mes */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
            <Coins className="w-4 h-4 text-teal-600" />
            <span>Gastos del Mes</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            ${monthlyExpenses.toLocaleString('es-AR')}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Octubre 2026 consolidado</div>
        </div>

        {/* Mantenimiento */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
            <Wrench className="w-4 h-4 text-amber-600" />
            <span>Mantenimiento</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-800 font-mono">
            ${monthlyMaintenance.toLocaleString('es-AR')}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">26% del presupuesto mensual</div>
        </div>

        {/* Combustible */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
            <Fuel className="w-4 h-4 text-blue-600" />
            <span>Combustible</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-800 font-mono">
            ${monthlyFuel.toLocaleString('es-AR')}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">50% del costo total de flota</div>
        </div>

        {/* Siniestros */}
        <div
          onClick={() => setCurrentTab('siniestros')}
          className="bg-white p-4 rounded-2xl border border-rose-200/90 shadow-xs cursor-pointer hover:border-rose-400 transition"
        >
          <div className="flex items-center justify-between text-xs text-rose-700 font-semibold mb-1">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Siniestros</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-900 font-mono">
            {totalIncidents}
          </div>
          <div className="text-[10px] text-rose-600 mt-1 font-medium">3 en trámite de peritaje</div>
        </div>

        {/* Próximos vencimientos */}
        <div
          onClick={() => setCurrentTab('documentos')}
          className="bg-white p-4 rounded-2xl border border-amber-200/90 shadow-xs cursor-pointer hover:border-amber-400 transition"
        >
          <div className="flex items-center justify-between text-xs text-amber-800 font-semibold mb-1">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Vencimientos</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-900 font-mono">
            {upcomingExpirations}
          </div>
          <div className="text-[10px] text-amber-700 mt-1 font-medium">VTV, seguros y licencias</div>
        </div>
      </div>

      {/* Visual Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Cost Breakdown by Cost Center */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Distribución de Gastos por Centro de Costo</h3>
            <span className="text-xs text-slate-400 font-mono">$4.900.000</span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800">Operaciones Logística (42%)</span>
                <span className="font-mono text-slate-600">$2.058.000</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-teal-600 rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800">Distribución Mayorista (28%)</span>
                <span className="font-mono text-slate-600">$1.372.000</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800">Campo y Obras (18%)</span>
                <span className="font-mono text-slate-600">$882.000</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '18%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800">Dirección Comercial (12%)</span>
                <span className="font-mono text-slate-600">$588.000</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '12%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Fleet Alert Items */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Alertas Críticas de Flota</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
              3 prioritarias
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <div>
                  <div className="font-bold text-rose-950">Iveco Daily (AC 551 MN)</div>
                  <div className="text-rose-800">Fuera de servicio · Espera repuesto bomba inyectora</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-200/60 px-2 py-1 rounded">
                Día 5
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <div className="font-bold text-amber-950">Martín Silva (Chofer #3)</div>
                  <div className="text-amber-800">Licencia de Conducir B1 vence en 17 días (25/10)</div>
                </div>
              </div>
              <button
                onClick={() => setCurrentTab('conductores')}
                className="text-[10px] font-bold text-amber-900 bg-amber-200/70 hover:bg-amber-200 px-2.5 py-1 rounded cursor-pointer"
              >
                Avisar
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Wrench className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <div className="font-bold text-blue-950">Ford Ranger (AD 672 TR)</div>
                  <div className="text-blue-800">Mantenimiento de amortiguadores finalizando hoy</div>
                </div>
              </div>
              <button
                onClick={() => setCurrentTab('mantenimiento')}
                className="text-[10px] font-bold text-blue-900 bg-blue-200/70 hover:bg-blue-200 px-2.5 py-1 rounded cursor-pointer"
              >
                Ver
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
