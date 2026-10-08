import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import {
  Wrench,
  Plus,
  Calendar,
  Gauge,
  DollarSign,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

interface MaintenanceViewProps {
  onOpenQuickAction: (actionType: 'mantenimiento') => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({ onOpenQuickAction }) => {
  const { maintenance, vehicles, deleteMaintenanceRecord } = useGarage();
  const [filterType, setFilterType] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = maintenance.filter((rec) => {
    const matchesSearch =
      rec.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.workshop.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'todos' || rec.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalSpent = maintenance.reduce((sum, m) => sum + m.cost, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Mantenimiento
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Historial de services, cambios de aceite, frenos, repuestos y talleres.
          </p>
        </div>

        <button
          onClick={() => onOpenQuickAction('mantenimiento')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold shadow-md shadow-teal-900/20 transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Service</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Total Servicios Realizados</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">{maintenance.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Inversión Total en Mantenimiento</div>
          <div className="text-2xl font-bold text-teal-700 mt-1 font-mono">
            ${totalSpent.toLocaleString('es-AR')}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Mantenimientos Preventivos</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1 font-mono">
            {maintenance.filter((m) => m.isPreventive).length} de {maintenance.length}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por taller, repuesto o vehículo..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {['todos', 'cambio de aceite', 'frenos', 'batería', 'service general'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer capitalize ${
                filterType === t
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Maintenance List */}
      <div className="space-y-3">
        {filtered.map((rec) => (
          <div
            key={rec.id}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-teal-500/60 transition shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                  {rec.vehicleName}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {rec.type}
                </span>
                <span className="text-xs text-slate-400">· {rec.date}</span>
                <span className="text-xs font-mono font-medium text-slate-600">
                  ({rec.mileage.toLocaleString('es-AR')} km)
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{rec.description}</h3>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span>📍 Taller: <strong>{rec.workshop}</strong></span>
                {rec.invoiceNumber && <span>🧾 Comprobante: {rec.invoiceNumber}</span>}
              </div>

              {rec.parts && (
                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <strong>Repuestos utilizados:</strong> {rec.parts}
                </div>
              )}
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <div className="text-base sm:text-lg font-extrabold text-slate-900 font-mono">
                ${rec.cost.toLocaleString('es-AR')}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {rec.isPreventive ? 'Preventivo' : 'Correctivo'}
                </span>

                <button
                  onClick={() => deleteMaintenanceRecord(rec.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                  title="Eliminar registro"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
