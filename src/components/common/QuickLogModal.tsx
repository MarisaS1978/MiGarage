import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import { MaintenanceType, FuelType, IncidentType } from '../../types';
import {
  Wrench,
  Fuel,
  Coins,
  Bell,
  AlertTriangle,
  X,
  Plus,
} from 'lucide-react';

interface QuickLogModalProps {
  initialAction?: 'mantenimiento' | 'combustible' | 'recordatorio' | 'siniestro' | 'vehiculo';
  onClose: () => void;
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({
  initialAction = 'mantenimiento',
  onClose,
}) => {
  const {
    vehicles,
    mode,
    addMaintenanceRecord,
    addFuelLog,
    addExpense,
    addReminder,
    addIncident,
    drivers,
    showToast,
  } = useGarage();

  const [activeTab, setActiveTab] = useState<'mantenimiento' | 'combustible' | 'recordatorio' | 'siniestro'>(
    initialAction === 'vehiculo' ? 'mantenimiento' : initialAction
  );

  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || '');
  const activeVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  // 1. Maintenance form state
  const [maintType, setMaintType] = useState<MaintenanceType>('cambio de aceite');
  const [maintDescription, setMaintDescription] = useState('Cambio de aceite sintético y filtros');
  const [maintMileage, setMaintMileage] = useState(activeVehicle ? activeVehicle.currentMileage + 500 : 85000);
  const [maintWorkshop, setMaintWorkshop] = useState('Taller Mecánico Especializado');
  const [maintCost, setMaintCost] = useState(85000);
  const [maintIsPreventive, setMaintIsPreventive] = useState(true);

  // 2. Fuel form state
  const [fuelLiters, setFuelLiters] = useState(40);
  const [fuelTotal, setFuelTotal] = useState(48000);
  const [fuelStation, setFuelStation] = useState('YPF');
  const [fuelMileage, setFuelMileage] = useState(activeVehicle ? activeVehicle.currentMileage + 350 : 83000);

  // 3. Reminder form state
  const [remTitle, setRemTitle] = useState('');
  const [remCategory, setRemCategory] = useState<'mantenimiento' | 'seguro' | 'documentación' | 'neumáticos'>('mantenimiento');
  const [remDueDate, setRemDueDate] = useState('');
  const [remDueMileage, setRemDueMileage] = useState<number | undefined>(undefined);

  // 4. Incident form state
  const [incType, setIncType] = useState<IncidentType>('choque');
  const [incLocation, setIncLocation] = useState('');
  const [incDescription, setIncDescription] = useState('');
  const [incThirdName, setIncThirdName] = useState('');
  const [incThirdPhone, setIncThirdPhone] = useState('');
  const [incThirdPlate, setIncThirdPlate] = useState('');
  const [incThirdInsurance, setIncThirdInsurance] = useState('');

  // Submit handlers
  const handleSaveMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVehicle) return;
    addMaintenanceRecord({
      vehicleId: activeVehicle.id,
      vehicleName: `${activeVehicle.brand} ${activeVehicle.model}`,
      date: new Date().toISOString().split('T')[0],
      mileage: Number(maintMileage),
      type: maintType,
      description: maintDescription,
      workshop: maintWorkshop,
      cost: Number(maintCost),
      isPreventive: maintIsPreventive,
    });
    onClose();
  };

  const handleSaveFuel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVehicle) return;
    const pricePerL = fuelLiters > 0 ? fuelTotal / fuelLiters : 1200;
    addFuelLog({
      vehicleId: activeVehicle.id,
      vehicleName: `${activeVehicle.brand} ${activeVehicle.model}`,
      date: new Date().toISOString().split('T')[0],
      mileage: Number(fuelMileage),
      liters: Number(fuelLiters),
      totalPrice: Number(fuelTotal),
      pricePerLiter: pricePerL,
      station: fuelStation,
      fuelType: activeVehicle.fuelType,
      fullTank: true,
    });
    onClose();
  };

  const handleSaveReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVehicle || !remTitle) return;
    addReminder({
      vehicleId: activeVehicle.id,
      vehicleName: `${activeVehicle.brand} ${activeVehicle.model}`,
      title: remTitle,
      category: remCategory,
      dueDate: remDueDate || undefined,
      dueMileage: remDueMileage || undefined,
      completed: false,
      priority: 'alta',
    });
    onClose();
  };

  const handleSaveIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVehicle) return;
    addIncident({
      vehicleId: activeVehicle.id,
      vehicleName: `${activeVehicle.brand} ${activeVehicle.model}`,
      date: new Date().toISOString().split('T')[0],
      time: '14:30',
      location: incLocation || 'Intersección urbana',
      type: incType,
      description: incDescription,
      status: 'denunciado',
      photosCount: 2,
      thirdParty: incThirdName
        ? {
            name: incThirdName,
            phone: incThirdPhone,
            plate: incThirdPlate,
            insuranceCompany: incThirdInsurance,
          }
        : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-white rounded-3xl w-full max-w-xl p-5 sm:p-6 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Vehicle Selector */}
        <div className="pb-3 border-b border-slate-100">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Seleccionar Vehículo
          </label>
          <select
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 cursor-pointer"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.brand} {v.model} ({v.plate}) · {v.currentMileage.toLocaleString('es-AR')} km
              </option>
            ))}
          </select>
        </div>

        {/* Action Tabs Bar */}
        <div className="flex items-center gap-1.5 my-3 p-1 rounded-2xl bg-slate-100 overflow-x-auto scrollbar-none text-xs font-bold">
          <button
            onClick={() => setActiveTab('mantenimiento')}
            className={`flex-1 py-2 px-3 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'mantenimiento' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-teal-600" />
            <span>Service</span>
          </button>

          <button
            onClick={() => setActiveTab('combustible')}
            className={`flex-1 py-2 px-3 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'combustible' ? 'bg-white text-blue-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Fuel className="w-3.5 h-3.5 text-blue-600" />
            <span>Combustible</span>
          </button>

          <button
            onClick={() => setActiveTab('recordatorio')}
            className={`flex-1 py-2 px-3 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'recordatorio' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-amber-600" />
            <span>Recordatorio</span>
          </button>

          <button
            onClick={() => setActiveTab('siniestro')}
            className={`flex-1 py-2 px-3 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'siniestro' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Siniestro</span>
          </button>
        </div>

        {/* Tab Content Form */}
        <div className="overflow-y-auto flex-1 pr-1">
          {/* TAB 1: MANTENIMIENTO */}
          {activeTab === 'mantenimiento' && (
            <form onSubmit={handleSaveMaintenance} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipo de Intervención</label>
                  <select
                    value={maintType}
                    onChange={(e) => setMaintType(e.target.value as MaintenanceType)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 capitalize font-semibold"
                  >
                    <option value="cambio de aceite">Cambio de aceite</option>
                    <option value="filtros">Filtros</option>
                    <option value="frenos">Frenos</option>
                    <option value="neumáticos">Neumáticos</option>
                    <option value="batería">Batería</option>
                    <option value="distribución">Distribución</option>
                    <option value="suspensión">Suspensión</option>
                    <option value="service general">Service general</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kilometraje al realizarlo</label>
                  <input
                    type="number"
                    required
                    value={maintMileage}
                    onChange={(e) => setMaintMileage(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Descripción del Trabajo</label>
                <input
                  type="text"
                  required
                  placeholder="Detalle de tareas realizadas..."
                  value={maintDescription}
                  onChange={(e) => setMaintDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Taller / Concesionario</label>
                  <input
                    type="text"
                    required
                    value={maintWorkshop}
                    onChange={(e) => setMaintWorkshop(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Costo Total ($)</label>
                  <input
                    type="number"
                    required
                    value={maintCost}
                    onChange={(e) => setMaintCost(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="preventive"
                  checked={maintIsPreventive}
                  onChange={(e) => setMaintIsPreventive(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="preventive" className="text-slate-700 font-semibold cursor-pointer">
                  Mantenimiento programado / preventivo
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition cursor-pointer shadow-md mt-2"
              >
                Guardar Registro de Mantenimiento
              </button>
            </form>
          )}

          {/* TAB 2: COMBUSTIBLE */}
          {activeTab === 'combustible' && (
            <form onSubmit={handleSaveFuel} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Litros Cargados</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={fuelLiters}
                    onChange={(e) => setFuelLiters(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monto Total ($)</label>
                  <input
                    type="number"
                    required
                    value={fuelTotal}
                    onChange={(e) => setFuelTotal(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estación de Servicio</label>
                  <select
                    value={fuelStation}
                    onChange={(e) => setFuelStation(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="YPF">YPF</option>
                    <option value="Shell">Shell</option>
                    <option value="Axion Energy">Axion Energy</option>
                    <option value="Puma Energy">Puma Energy</option>
                    <option value="Dapsa">Dapsa</option>
                    <option value="Otra">Otra</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Odómetro (Km Actual)</label>
                  <input
                    type="number"
                    required
                    value={fuelMileage}
                    onChange={(e) => setFuelMileage(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition cursor-pointer shadow-md mt-2"
              >
                Registrar Carga de Combustible
              </button>
            </form>
          )}

          {/* TAB 3: RECORDATORIO */}
          {activeTab === 'recordatorio' && (
            <form onSubmit={handleSaveReminder} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Título del Aviso</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Cambio de pastillas de freno / VTV / Póliza"
                  value={remTitle}
                  onChange={(e) => setRemTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Categoría</label>
                  <select
                    value={remCategory}
                    onChange={(e) => setRemCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 capitalize font-semibold"
                  >
                    <option value="mantenimiento">Mantenimiento</option>
                    <option value="seguro">Seguro</option>
                    <option value="documentación">Documentación</option>
                    <option value="neumáticos">Neumáticos</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fecha Límite</label>
                  <input
                    type="date"
                    value={remDueDate}
                    onChange={(e) => setRemDueDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">O por Kilometraje (Opcional)</label>
                <input
                  type="number"
                  placeholder="Ej: 90000"
                  value={remDueMileage || ''}
                  onChange={(e) => setRemDueMileage(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm transition cursor-pointer shadow-md mt-2"
              >
                Crear Recordatorio
              </button>
            </form>
          )}

          {/* TAB 4: SINIESTRO */}
          {activeTab === 'siniestro' && (
            <form onSubmit={handleSaveIncident} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipo de Incidente</label>
                  <select
                    value={incType}
                    onChange={(e) => setIncType(e.target.value as IncidentType)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 capitalize font-semibold"
                  >
                    <option value="choque">Choque</option>
                    <option value="accidente">Accidente</option>
                    <option value="daño estacionado">Daño estacionado</option>
                    <option value="robo">Robo o intento</option>
                    <option value="daño climático">Daño climático / granizo</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lugar del Hecho</label>
                  <input
                    type="text"
                    required
                    placeholder="Calle, intersección o autopista"
                    value={incLocation}
                    onChange={(e) => setIncLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Relato del Hecho</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Descripción concisa de cómo sucedió..."
                  value={incDescription}
                  onChange={(e) => setIncDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 block">Tercero involucrado (opcional)</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    value={incThirdName}
                    onChange={(e) => setIncThirdName(e.target.value)}
                    className="p-2 rounded-lg bg-white border border-slate-200"
                  />
                  <input
                    type="text"
                    placeholder="Teléfono"
                    value={incThirdPhone}
                    onChange={(e) => setIncThirdPhone(e.target.value)}
                    className="p-2 rounded-lg bg-white border border-slate-200"
                  />
                  <input
                    type="text"
                    placeholder="Patente del tercero"
                    value={incThirdPlate}
                    onChange={(e) => setIncThirdPlate(e.target.value)}
                    className="p-2 rounded-lg bg-white border border-slate-200 font-mono uppercase"
                  />
                  <input
                    type="text"
                    placeholder="Aseguradora del tercero"
                    value={incThirdInsurance}
                    onChange={(e) => setIncThirdInsurance(e.target.value)}
                    className="p-2 rounded-lg bg-white border border-slate-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition cursor-pointer shadow-md mt-2"
              >
                Registrar Siniestro
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
