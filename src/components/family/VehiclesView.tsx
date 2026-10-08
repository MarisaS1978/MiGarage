import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import {
  Car,
  Plus,
  Search,
  Filter,
  Gauge,
  Fuel,
  Calendar,
  ChevronRight,
  Shield,
  Wrench,
} from 'lucide-react';

interface VehiclesViewProps {
  onOpenVehicleModal: () => void;
  onSelectVehicle: (id: string) => void;
}

export const VehiclesView: React.FC<VehiclesViewProps> = ({
  onOpenVehicleModal,
  onSelectVehicle,
}) => {
  const { vehicles } = useGarage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('todos');

  // Filter family vehicles
  const familyVehicles = vehicles.filter(
    (v) => v.mode === 'family' || v.mode === 'both'
  );

  const filtered = familyVehicles.filter((v) => {
    const matchesSearch =
      v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.plate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'todos' || v.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Mis Vehículos
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Administrá todos los autos, camionetas y motos de tu garage familiar.
          </p>
        </div>

        <button
          onClick={onOpenVehicleModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-md shadow-emerald-900/20 transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar vehículo</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por marca, modelo o patente (ej: Etios, AB 123 CD)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {['todos', 'automóvil', 'camioneta', 'motocicleta', 'utilitario'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer capitalize ${
                filterType === type
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicles Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
          <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No se encontraron vehículos</h3>
          <p className="text-sm text-slate-500 mt-1">Intentá cambiar los términos de búsqueda o agregá uno nuevo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((vehicle) => {
            const statusBadge = {
              optimo: { label: '🟢 Todo en orden', style: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
              atencion: { label: '🟡 Requiere atención', style: 'bg-amber-50 text-amber-800 border-amber-200' },
              urgente: { label: '🔴 Vencimiento urgente', style: 'bg-rose-50 text-rose-800 border-rose-200' },
            }[vehicle.generalStatus];

            return (
              <div
                key={vehicle.id}
                onClick={() => onSelectVehicle(vehicle.id)}
                className="group bg-white rounded-3xl border border-slate-200 hover:border-emerald-500/70 p-5 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Photo Banner with Plate */}
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-100 mb-4 border border-slate-100">
                    {vehicle.photoUrl ? (
                      <img
                        src={vehicle.photoUrl}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Car className="w-16 h-16" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-slate-900/90 text-white tracking-widest backdrop-blur border border-slate-700 shadow-md">
                        {vehicle.plate}
                      </span>
                    </div>
                  </div>

                  {/* Title and version */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      {vehicle.version && (
                        <p className="text-xs text-slate-500 font-medium">
                          {vehicle.version}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Key specs row */}
                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs py-2.5 border-y border-slate-100 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Gauge className="w-4 h-4 text-teal-600 shrink-0" />
                      <span className="font-mono font-bold text-slate-800">
                        {vehicle.currentMileage.toLocaleString('es-AR')} km
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Fuel className="w-4 h-4 text-teal-600 shrink-0" />
                      <span className="capitalize">{vehicle.fuelType}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>Año {vehicle.year}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full border border-slate-300 inline-block bg-slate-300" />
                      <span>{vehicle.color}</span>
                    </div>
                  </div>
                </div>

                {/* Status badge & View link */}
                <div className="mt-4 pt-2 flex items-center justify-between gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${statusBadge.style}`}>
                    {statusBadge.label}
                  </span>

                  <span className="text-xs font-bold text-teal-700 group-hover:translate-x-1 transition flex items-center gap-0.5">
                    <span>Ficha</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
