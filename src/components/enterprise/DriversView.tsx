import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import { Driver } from '../../types';
import {
  Users,
  Plus,
  Calendar,
  AlertTriangle,
  Phone,
  Mail,
  Truck,
  Trash2,
  CheckCircle2,
  X,
  CreditCard,
  Clock,
} from 'lucide-react';

export const DriversView: React.FC = () => {
  const { drivers, vehicles, addDriver, deleteDriver, showToast } = useGarage();
  const [showAddModal, setShowAddModal] = useState(false);

  // New driver form
  const [name, setName] = useState('');
  const [dni, setDni] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseCategory, setLicenseCategory] = useState('E1 (Cargas Pesadas y Acoplados)');
  const [licenseExpiry, setLicenseExpiry] = useState('2027-10-01');
  const [assignedVehicleId, setAssignedVehicleId] = useState(vehicles[0]?.id || '');
  const [notes, setNotes] = useState('');

  const today = new Date('2026-10-08');

  const handleCreateDriver = (e: React.FormEvent) => {
    e.preventDefault();
    addDriver({
      name,
      dni,
      phone,
      email,
      licenseNumber,
      licenseCategory,
      licenseExpiry,
      assignedVehicleId: assignedVehicleId || undefined,
      status: 'activo',
      notes,
    });
    setShowAddModal(false);
    setName('');
    setDni('');
    setPhone('');
    setEmail('');
    setLicenseNumber('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Conductores de Flota
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Gestión de choferes asignados, categorías de licencia profesional y alertas de renovación.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold shadow-md shadow-teal-900/20 transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Conductor</span>
        </button>
      </div>

      {/* Driver Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {drivers.map((driver) => {
          const expDate = new Date(driver.licenseExpiry);
          const daysToExpiry = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
          const isExpiringSoon = daysToExpiry <= 30;

          const assignedVehicle = vehicles.find((v) => v.id === driver.assignedVehicleId);

          return (
            <div
              key={driver.id}
              className={`bg-white rounded-3xl p-5 border transition shadow-xs flex flex-col justify-between space-y-4 ${
                isExpiringSoon ? 'border-amber-300 ring-2 ring-amber-400/20' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center font-bold text-teal-800 text-lg shrink-0">
                      {driver.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{driver.name}</h3>
                      <div className="text-xs text-slate-500 font-mono">DNI: {driver.dni}</div>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Activo
                  </span>
                </div>

                {/* License and contact */}
                <div className="space-y-2 py-3 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Licencia:</span>
                    <span className="font-bold text-slate-800 font-mono">{driver.licenseNumber}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Categoría:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                      {driver.licenseCategory}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Vencimiento:</span>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">{driver.licenseExpiry}</span>
                      {isExpiringSoon && (
                        <span className="block text-[11px] font-bold text-amber-700">
                          ⚠️ Vence en {daysToExpiry} días
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-3 text-slate-500">
                    <span>📞 {driver.phone}</span>
                    <span>✉️ {driver.email}</span>
                  </div>

                  {assignedVehicle && (
                    <div className="mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-teal-600 shrink-0" />
                      <span className="text-slate-700">
                        Unidad asignada: <strong>{assignedVehicle.brand} {assignedVehicle.model} ({assignedVehicle.plate})</strong>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {driver.notes || 'Conductor habilitado'}
                </span>

                <button
                  onClick={() => deleteDriver(driver.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                  title="Eliminar conductor"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-200">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">Registrar Conductor</h3>
            <p className="text-xs text-slate-500 mb-4">Cargá la información del chofer y su licencia.</p>

            <form onSubmit={handleCreateDriver} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Marcelo Gómez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">DNI</label>
                  <input
                    type="text"
                    required
                    placeholder="34.123.456"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    placeholder="+54 9 11 ..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="chofer@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">N° de Licencia</label>
                  <input
                    type="text"
                    required
                    placeholder="B-34123456"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Categoría</label>
                  <select
                    value={licenseCategory}
                    onChange={(e) => setLicenseCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="B1 (Automóviles y utilitarios hasta 3500kg)">B1 (Liviano)</option>
                    <option value="C (Camiones sin acoplado)">C (Camiones)</option>
                    <option value="E1 (Cargas Pesadas y Acoplados)">E1 (Cargas pesadas)</option>
                    <option value="D1 (Transporte de pasajeros)">D1 (Pasajeros)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vencimiento Licencia</label>
                  <input
                    type="date"
                    required
                    value={licenseExpiry}
                    onChange={(e) => setLicenseExpiry(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vehículo Asignado</label>
                  <select
                    value={assignedVehicleId}
                    onChange={(e) => setAssignedVehicleId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="">(Sin asignar)</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.brand} {v.model} ({v.plate})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition cursor-pointer shadow-md mt-2"
              >
                Guardar Conductor
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
