import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import { VehicleStatus, Vehicle } from '../../types';
import {
  Truck,
  Plus,
  Search,
  Filter,
  User,
  Gauge,
  Calendar,
  Building2,
  Trash2,
  ChevronRight,
  Shield,
  Clock,
} from 'lucide-react';

interface FleetViewProps {
  onOpenVehicleModal: () => void;
  onSelectVehicle: (id: string) => void;
}

export const FleetView: React.FC<FleetViewProps> = ({
  onOpenVehicleModal,
  onSelectVehicle,
}) => {
  const { vehicles, updateFleetStatus, deleteVehicle } = useGarage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  // Enterprise vehicles
  const fleet = vehicles.filter((v) => v.mode === 'enterprise' || v.mode === 'both');

  const filtered = fleet.filter((v) => {
    const matchesSearch =
      v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.assignedDriverName && v.assignedDriverName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (v.costCenter && v.costCenter.toLowerCase().includes(searchTerm.toLowerCase()));

    const currentStatus = v.fleetStatus || 'disponible';
    const matchesStatus = statusFilter === 'todos' || currentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status?: VehicleStatus) => {
    switch (status) {
      case 'disponible':
        return { label: '🟢 Disponible', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'en_uso':
        return { label: '🔵 En uso', bg: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'mantenimiento':
        return { label: '🟡 Mantenimiento', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'fuera_de_servicio':
        return { label: '🔴 Fuera de servicio', bg: 'bg-rose-50 text-rose-800 border-rose-200' };
      default:
        return { label: '🟢 Disponible', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Flota Empresarial
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Administración integral de unidades comerciales, choferes asignados y centros de costo.
          </p>
        </div>

        <button
          onClick={onOpenVehicleModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold shadow-md shadow-teal-900/20 transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Unidad a Flota</span>
        </button>
      </div>

      {/* Search and Status Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por patente, marca, chofer o centro de costo..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'disponible', label: '🟢 Disponibles' },
            { id: 'en_uso', label: '🔵 En uso' },
            { id: 'mantenimiento', label: '🟡 Mantenimiento' },
            { id: 'fuera_de_servicio', label: '🔴 Fuera servicio' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                statusFilter === st.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fleet Table / Cards */}
      <div className="space-y-3">
        {filtered.map((veh) => {
          const currentStatus = veh.fleetStatus || 'disponible';
          const badge = getStatusBadge(currentStatus);

          return (
            <div
              key={veh.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-teal-500/70 transition shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
            >
              {/* Left Details */}
              <div
                onClick={() => onSelectVehicle(veh.id)}
                className="flex items-start sm:items-center gap-4 cursor-pointer flex-1 min-w-0"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  {veh.photoUrl ? (
                    <img
                      src={veh.photoUrl}
                      alt={veh.model}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Truck className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-900 text-white tracking-wider">
                      {veh.plate}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {veh.year} · {veh.type} · {veh.color}
                    </span>
                    {veh.costCenter && (
                      <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        🏢 {veh.costCenter}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 truncate">
                    {veh.brand} {veh.model} {veh.version && <span className="text-xs text-slate-500 font-normal">{veh.version}</span>}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <div className="flex items-center gap-1 font-mono font-bold text-slate-800">
                      <Gauge className="w-3.5 h-3.5 text-teal-600" />
                      <span>{veh.currentMileage.toLocaleString('es-AR')} km</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>Chofer: <strong>{veh.assignedDriverName || 'Sin asignar'}</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Quick Status Changer & Actions */}
              <div className="flex flex-wrap items-center gap-3 self-stretch lg:self-center justify-between lg:justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                {/* Status Switcher Select */}
                <div>
                  <select
                    value={currentStatus}
                    onChange={(e) => updateFleetStatus(veh.id, e.target.value as VehicleStatus)}
                    className={`text-xs font-bold py-2 px-3 rounded-xl border cursor-pointer focus:outline-hidden ${badge.bg}`}
                  >
                    <option value="disponible">🟢 Disponible</option>
                    <option value="en_uso">🔵 En uso</option>
                    <option value="mantenimiento">🟡 Mantenimiento</option>
                    <option value="fuera_de_servicio">🔴 Fuera de servicio</option>
                  </select>
                </div>

                {/* View Details */}
                <button
                  onClick={() => onSelectVehicle(veh.id)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                >
                  <span>Ver Ficha</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
