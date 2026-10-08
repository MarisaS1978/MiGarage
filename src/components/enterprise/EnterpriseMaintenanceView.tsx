import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import {
  Wrench,
  Plus,
  Clock,
  Gauge,
  Calendar,
  DollarSign,
  User,
  Trash2,
  CheckCircle2,
  Filter,
} from 'lucide-react';

interface EnterpriseMaintenanceProps {
  onOpenQuickAction: (actionType: 'mantenimiento') => void;
}

export const EnterpriseMaintenanceView: React.FC<EnterpriseMaintenanceProps> = ({
  onOpenQuickAction,
}) => {
  const { maintenance, vehicles, deleteMaintenanceRecord } = useGarage();
  const [filterType, setFilterType] = useState('todos');

  const filtered = maintenance.filter((m) => {
    if (filterType === 'todos') return true;
    if (filterType === 'preventivo') return m.isPreventive;
    if (filterType === 'correctivo') return !m.isPreventive;
    return true;
  });

  const totalDowntime = maintenance.reduce((sum, m) => sum + (m.downtimeHours || 0), 0);
  const totalCost = maintenance.reduce((sum, m) => sum + m.cost, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Mantenimiento de Flota
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Gestión técnica de intervenciones preventivas, correctivas, costos de mano de obra y horas de parada.
          </p>
        </div>

        <button
          onClick={() => onOpenQuickAction('mantenimiento')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold shadow-md shadow-teal-900/20 transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Intervención Técnica</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Costo Total Mantenimiento</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
            ${totalCost.toLocaleString('es-AR')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Repuestos + Mano de obra</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Horas Totales Fuera de Servicio</div>
          <div className="text-2xl font-bold text-amber-800 font-mono mt-1">
            {totalDowntime} hs
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Tiempo de parada acumulado</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Ratio Preventivo / Correctivo</div>
          <div className="text-2xl font-bold text-emerald-700 font-mono mt-1">
            {Math.round((maintenance.filter((m) => m.isPreventive).length / Math.max(1, maintenance.length)) * 100)}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Meta corporativa: &gt; 70%</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['todos', 'preventivo', 'correctivo'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition cursor-pointer ${
              filterType === t
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Maintenance List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-teal-500 transition shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black font-mono px-2 py-0.5 rounded bg-slate-900 text-white">
                  {item.vehicleName}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                  {item.type}
                </span>
                <span className="text-xs text-slate-500">· {item.date}</span>
                <span className="text-xs font-mono font-bold text-slate-700">
                  {item.mileage.toLocaleString('es-AR')} km
                </span>
              </div>

              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold self-start sm:self-auto ${
                  item.isPreventive
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {item.isPreventive ? 'Mantenimiento Preventivo' : 'Mantenimiento Correctivo'}
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-900 leading-relaxed">
              {item.description}
            </p>

            {/* Enterprise Detailed Grid: Parts, Labor, Downtime, Responsible */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Taller / Proveedor</span>
                <span className="font-bold text-slate-800">{item.workshop}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Mano de Obra</span>
                <span className="font-bold text-slate-800 font-mono">
                  ${(item.laborCost || Math.round(item.cost * 0.4)).toLocaleString('es-AR')}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Repuestos OEM</span>
                <span className="font-bold text-slate-800 font-mono">
                  ${(item.partsCost || Math.round(item.cost * 0.6)).toLocaleString('es-AR')}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Horas Parada</span>
                <span className="font-bold text-amber-800 font-mono">
                  {item.downtimeHours || 4} hs fuera de servicio
                </span>
              </div>
            </div>

            {item.responsible && (
              <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Responsable interno: <strong>{item.responsible}</strong></span>
                </div>
                {item.nextInterventionKm && (
                  <span className="text-teal-700 font-semibold font-mono">
                    Próxima intervención: a los {item.nextInterventionKm.toLocaleString('es-AR')} km
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
