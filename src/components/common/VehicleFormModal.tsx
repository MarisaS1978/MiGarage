import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import { VehicleType, FuelType } from '../../types';
import { Car, X, Plus } from 'lucide-react';

interface VehicleFormModalProps {
  onClose: () => void;
}

export const VehicleFormModal: React.FC<VehicleFormModalProps> = ({ onClose }) => {
  const { mode, addVehicle, drivers } = useGarage();

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [version, setVersion] = useState('');
  const [year, setYear] = useState(2022);
  const [plate, setPlate] = useState('');
  const [color, setColor] = useState('Blanco');
  const [currentMileage, setCurrentMileage] = useState(50000);
  const [type, setType] = useState<VehicleType>('automóvil');
  const [fuelType, setFuelType] = useState<FuelType>('nafta');
  const [costCenter, setCostCenter] = useState('Operaciones Logística');
  const [assignedDriverId, setAssignedDriverId] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !model || !plate) return;

    const assignedDriver = drivers.find((d) => d.id === assignedDriverId);

    addVehicle({
      mode: mode,
      brand,
      model,
      version: version || undefined,
      year: Number(year),
      plate: plate.toUpperCase(),
      color,
      currentMileage: Number(currentMileage),
      type,
      fuelType,
      photoUrl:
        type === 'motocicleta'
          ? 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80'
          : type === 'camioneta'
          ? 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80'
          : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
      generalStatus: 'optimo',
      fleetStatus: 'disponible',
      costCenter: mode === 'enterprise' ? costCenter : undefined,
      assignedDriverId: assignedDriverId || undefined,
      assignedDriverName: assignedDriver?.name || undefined,
      notes: notes || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-white rounded-3xl w-full max-w-xl p-6 shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {mode === 'family' ? 'Agregar Vehículo al Garage' : 'Incorporar Unidad a la Flota'}
            </h3>
            <p className="text-xs text-slate-500">
              Cargá los datos del vehículo para comenzar el seguimiento.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Marca</label>
              <input
                type="text"
                required
                placeholder="Ej: Toyota, Ford, VW"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Modelo</label>
              <input
                type="text"
                required
                placeholder="Ej: Etios, Hilux, Gol"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Versión</label>
              <input
                type="text"
                placeholder="1.6 XLS / TDI"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Año</label>
              <input
                type="number"
                min="1980"
                max="2030"
                required
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Patente / Dominio</label>
              <input
                type="text"
                required
                placeholder="AB 123 CD"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tipo de Vehículo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as VehicleType)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold capitalize"
              >
                <option value="automóvil">Automóvil</option>
                <option value="camioneta">Camioneta</option>
                <option value="motocicleta">Motocicleta</option>
                <option value="utilitario">Utilitario</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Combustible</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as FuelType)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold capitalize"
              >
                <option value="nafta">Nafta</option>
                <option value="diesel">Diésel</option>
                <option value="gnc">GNC</option>
                <option value="híbrido">Híbrido</option>
                <option value="eléctrico">Eléctrico</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Color</label>
              <input
                type="text"
                placeholder="Blanco, Gris..."
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Kilometraje actual</label>
            <input
              type="number"
              required
              min="0"
              value={currentMileage}
              onChange={(e) => setCurrentMileage(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold"
            />
          </div>

          {mode === 'enterprise' && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Centro de Costo</label>
                <select
                  value={costCenter}
                  onChange={(e) => setCostCenter(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                >
                  <option value="Operaciones Logística">Operaciones Logística</option>
                  <option value="Distribución Mayorista">Distribución Mayorista</option>
                  <option value="Envíos Rápidos AMBA">Envíos Rápidos AMBA</option>
                  <option value="Campo y Obras">Campo y Obras</option>
                  <option value="Dirección Comercial">Dirección Comercial</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Conductor Asignado</label>
                <select
                  value={assignedDriverId}
                  onChange={(e) => setAssignedDriverId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                >
                  <option value="">(Sin asignar)</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.licenseCategory.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Observaciones / Notas</label>
            <textarea
              rows={2}
              placeholder="Detalles sobre radicación, estado o equipamiento especial..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition cursor-pointer shadow-md mt-2"
          >
            Guardar Vehículo
          </button>
        </form>
      </div>
    </div>
  );
};
