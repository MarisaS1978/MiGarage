import React from 'react';
import { useGarage } from '../../context/GarageContext';
import {
  Car,
  Shield,
  FileText,
  Wrench,
  Plus,
  Fuel,
  Bell,
  AlertTriangle,
  ChevronRight,
  Clock,
  Sparkles,
  Users,
} from 'lucide-react';

interface FamilyDashboardProps {
  onOpenVehicleModal: () => void;
  onOpenQuickAction: (actionType?: 'mantenimiento' | 'combustible' | 'recordatorio' | 'siniestro' | 'vehiculo') => void;
  onSelectVehicle: (id: string) => void;
}

export const FamilyDashboard: React.FC<FamilyDashboardProps> = ({
  onOpenVehicleModal,
  onOpenQuickAction,
  onSelectVehicle,
}) => {
  const { vehicles, reminders, insurance, setCurrentTab } = useGarage();

  // Filter family vehicles
  const familyVehicles = vehicles.filter((v) => v.mode === 'family' || v.mode === 'both');

  // Compute upcoming expirations & services
  const today = new Date('2026-10-08');

  // Next insurance expiration
  const sortedInsurance = [...insurance].sort(
    (a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
  );
  const nextInsurance = sortedInsurance[0];
  const insuranceDaysDiff = nextInsurance
    ? Math.ceil((new Date(nextInsurance.expiryDate).getTime() - today.getTime()) / (1000 * 3600 * 24))
    : null;

  // Next VTV reminder / documentation
  const vtvReminder = reminders.find(
    (r) => !r.completed && r.category === 'documentación' && r.title.toLowerCase().includes('vtv')
  );
  const vtvDaysDiff = vtvReminder && vtvReminder.dueDate
    ? Math.ceil((new Date(vtvReminder.dueDate).getTime() - today.getTime()) / (1000 * 3600 * 24))
    : 12;

  // Next service reminder
  const serviceReminder = reminders.find(
    (r) => !r.completed && r.category === 'mantenimiento'
  );
  const kmRemaining = serviceReminder && serviceReminder.dueMileage
    ? Math.max(0, serviceReminder.dueMileage - 82450)
    : 800;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-5 sm:p-7 border border-teal-800/40 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-radial from-teal-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Garage Familiar Activo</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Mi Garage
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Todos tus vehículos bajo control: services, seguros, vencimientos y gastos.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentTab('familia')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition cursor-pointer"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Mi Familia</span>
            </button>
            <button
              onClick={onOpenVehicleModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-900/40 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Vehículo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mis Vehículos Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Mis vehículos
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab('vehiculos')}
            className="text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Ver todos ({familyVehicles.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {familyVehicles.map((vehicle) => {
            const statusConfig = {
              optimo: {
                label: '🟢 Todo en orden',
                bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
              },
              atencion: {
                label: '🟡 Requiere atención',
                bg: 'bg-amber-50 text-amber-800 border-amber-200',
              },
              urgente: {
                label: '🔴 Vencimiento urgente',
                bg: 'bg-rose-50 text-rose-800 border-rose-200',
              },
            }[vehicle.generalStatus];

            return (
              <div
                key={vehicle.id}
                onClick={() => onSelectVehicle(vehicle.id)}
                className="group bg-white rounded-2xl border border-slate-200/90 hover:border-teal-500/60 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Photo or Car Icon Thumbnail */}
                  <div className="relative h-36 rounded-xl overflow-hidden bg-slate-100 mb-4 border border-slate-100">
                    {vehicle.photoUrl ? (
                      <img
                        src={vehicle.photoUrl}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                        <Car className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-900/80 text-white tracking-wider backdrop-blur font-mono border border-slate-700">
                        {vehicle.plate}
                      </span>
                    </div>
                  </div>

                  {/* Vehicle Name & Details */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {vehicle.year} · {vehicle.color} · {vehicle.type}
                      </p>
                    </div>
                  </div>

                  {/* Mileage */}
                  <div className="mt-3 flex items-center justify-between text-xs py-2 border-t border-slate-100">
                    <span className="text-slate-500">Kilometraje actual:</span>
                    <span className="font-bold text-slate-800 font-mono">
                      {vehicle.currentMileage.toLocaleString('es-AR')} km
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-3 pt-2">
                  <div
                    className={`w-full py-1.5 px-3 rounded-xl border text-xs font-semibold text-center transition ${statusConfig.bg}`}
                  >
                    {statusConfig.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Próximos Vencimientos Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Próximos vencimientos
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab('recordatorios')}
            className="text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Ver recordatorios</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Seguro */}
          <div
            onClick={() => setCurrentTab('seguros')}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-teal-400/60 transition cursor-pointer flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Seguro
              </div>
              <div className="text-sm font-bold text-slate-900 truncate">
                {nextInsurance?.vehicleName || 'Toyota Etios'}
              </div>
              <div className="text-xs font-medium text-emerald-700 flex items-center gap-1 mt-0.5">
                <span>Vence en {insuranceDaysDiff || 32} días</span>
              </div>
            </div>
          </div>

          {/* Card 2: VTV */}
          <div
            onClick={() => setCurrentTab('documentos')}
            className="bg-white rounded-2xl border border-amber-200/80 bg-gradient-to-br from-white to-amber-50/30 p-4 shadow-sm hover:border-amber-400 transition cursor-pointer flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                VTV
              </div>
              <div className="text-sm font-bold text-slate-900 truncate">
                {vtvReminder?.vehicleName || 'Volkswagen Gol Trend'}
              </div>
              <div className="text-xs font-bold text-amber-700 flex items-center gap-1 mt-0.5">
                <span>Vence en {vtvDaysDiff} días</span>
              </div>
            </div>
          </div>

          {/* Card 3: Service */}
          <div
            onClick={() => setCurrentTab('mantenimiento')}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-teal-400/60 transition cursor-pointer flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 shrink-0">
              <Wrench className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Service
              </div>
              <div className="text-sm font-bold text-slate-900 truncate">
                {serviceReminder?.vehicleName || 'Toyota Etios'}
              </div>
              <div className="text-xs font-medium text-teal-700 flex items-center gap-1 mt-0.5">
                <span>Faltan {kmRemaining} km</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas Section */}
      <div className="bg-slate-100/90 rounded-3xl p-5 sm:p-6 border border-slate-200">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 mb-3.5">
          Acciones rápidas
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
          <button
            onClick={onOpenVehicleModal}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 p-3 sm:py-3.5 sm:px-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-800 text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>Agregar vehículo</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('mantenimiento')}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 p-3 sm:py-3.5 sm:px-4 rounded-xl bg-white border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 text-slate-800 text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs"
          >
            <Wrench className="w-4 h-4 text-teal-600" />
            <span>Registrar service</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('combustible')}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 p-3 sm:py-3.5 sm:px-4 rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-slate-800 text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs"
          >
            <Fuel className="w-4 h-4 text-blue-600" />
            <span>Combustible</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('recordatorio')}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 p-3 sm:py-3.5 sm:px-4 rounded-xl bg-white border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 text-slate-800 text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs"
          >
            <Bell className="w-4 h-4 text-amber-600" />
            <span>Recordatorio</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('siniestro')}
            className="col-span-2 sm:col-span-1 flex flex-col sm:flex-row items-center justify-center gap-2 p-3 sm:py-3.5 sm:px-4 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-800 text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs"
          >
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Registrar siniestro</span>
          </button>
        </div>
      </div>
    </div>
  );
};
