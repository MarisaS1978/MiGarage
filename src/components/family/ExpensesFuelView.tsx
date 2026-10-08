import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import {
  Coins,
  Fuel,
  Plus,
  Calendar,
  DollarSign,
  TrendingUp,
  Gauge,
  Trash2,
  Filter,
} from 'lucide-react';

interface ExpensesFuelViewProps {
  onOpenQuickAction: (actionType: 'combustible' | 'mantenimiento') => void;
}

export const ExpensesFuelView: React.FC<ExpensesFuelViewProps> = ({ onOpenQuickAction }) => {
  const { expenses, fuelLogs, deleteExpense, deleteFuelLog } = useGarage();
  const [subTab, setSubTab] = useState<'gastos' | 'combustible'>('gastos');

  // Compute expenses total
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Compute fuel totals & metrics
  const totalFuelLiters = fuelLogs.reduce((sum, f) => sum + f.liters, 0);
  const totalFuelSpent = fuelLogs.reduce((sum, f) => sum + f.totalPrice, 0);
  const avgPricePerLiter = totalFuelLiters > 0 ? totalFuelSpent / totalFuelLiters : 0;

  // Approximate cost per km based on logged distance
  const sortedFuelLogs = [...fuelLogs].sort((a, b) => b.mileage - a.mileage);
  const maxKm = sortedFuelLogs[0]?.mileage || 0;
  const minKm = sortedFuelLogs[sortedFuelLogs.length - 1]?.mileage || 0;
  const totalKmDiff = maxKm > minKm ? maxKm - minKm : 500;
  const costPerKm = totalKmDiff > 0 ? totalFuelSpent / totalKmDiff : 85;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Gastos & Combustible
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Control de gastos periódicos, cargas de nafta/diésel y costo estimado por kilómetro.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenQuickAction('combustible')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-900/20 transition cursor-pointer"
          >
            <Fuel className="w-4 h-4" />
            <span>Cargar Combustible</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Gastos Acumulados Registrados</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
            ${totalExpense.toLocaleString('es-AR')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Incluye nafta, seguro, services y peajes</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Gasto Total en Combustible</div>
          <div className="text-2xl font-bold text-blue-700 font-mono mt-1">
            ${totalFuelSpent.toLocaleString('es-AR')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{totalFuelLiters.toFixed(1)} litros cargados</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Costo Promedio por Km</div>
          <div className="text-2xl font-bold text-emerald-700 font-mono mt-1">
            ${costPerKm.toFixed(1)} / km
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Estimado según consumo real registrado</div>
        </div>
      </div>

      {/* Switcher Tab */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setSubTab('gastos')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-2 ${
            subTab === 'gastos'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Todos los Gastos ({expenses.length})</span>
        </button>

        <button
          onClick={() => setSubTab('combustible')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-2 ${
            subTab === 'combustible'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Fuel className="w-4 h-4" />
          <span>Cargas de Combustible ({fuelLogs.length})</span>
        </button>
      </div>

      {/* Tab 1: Gastos */}
      {subTab === 'gastos' && (
        <div className="space-y-3">
          {expenses.map((exp) => (
            <div
              key={exp.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-slate-300 transition shadow-xs flex items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {exp.category}
                  </span>
                  <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                    {exp.vehicleName}
                  </span>
                  <span className="text-xs text-slate-400">· {exp.date}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{exp.description}</h3>
                {exp.vendor && <span className="text-xs text-slate-500">📍 {exp.vendor}</span>}
              </div>

              <div className="flex items-center gap-3">
                <div className="text-base font-extrabold text-slate-900 font-mono">
                  ${exp.amount.toLocaleString('es-AR')}
                </div>
                <button
                  onClick={() => deleteExpense(exp.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                  title="Eliminar gasto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Combustible */}
      {subTab === 'combustible' && (
        <div className="space-y-3">
          {fuelLogs.map((log) => (
            <div
              key={log.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-blue-400 transition shadow-xs flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    ⛽ {log.station}
                  </span>
                  <span className="text-xs font-bold text-slate-800">{log.vehicleName}</span>
                  <span className="text-xs text-slate-400">· {log.date}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span className="font-mono font-semibold">{log.liters} Litros</span>
                  <span>(${log.pricePerLiter.toFixed(0)}/L)</span>
                  <span className="capitalize">{log.fuelType}</span>
                  <span className="font-mono text-slate-500">Odo: {log.mileage.toLocaleString('es-AR')} km</span>
                </div>

                {log.notes && <p className="text-xs text-slate-500 italic">{log.notes}</p>}
              </div>

              <div className="flex items-center gap-3">
                <div className="text-base font-extrabold text-blue-900 font-mono">
                  ${log.totalPrice.toLocaleString('es-AR')}
                </div>
                <button
                  onClick={() => deleteFuelLog(log.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                  title="Eliminar carga"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
