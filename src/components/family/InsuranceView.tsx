import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import {
  Shield,
  Phone,
  Calendar,
  AlertTriangle,
  Plus,
  ExternalLink,
  Car,
  FileCheck,
  CheckCircle2,
  X,
} from 'lucide-react';

export const InsuranceView: React.FC = () => {
  const { insurance, vehicles, addInsurancePolicy, showToast } = useGarage();
  const [showAddModal, setShowAddModal] = useState(false);

  const [vehId, setVehId] = useState(vehicles[0]?.id || '');
  const [company, setCompany] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [coverageType, setCoverageType] = useState('Terceros Completo con Granizo');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [expiryDate, setExpiryDate] = useState('2027-01-01');
  const [assistancePhone, setAssistancePhone] = useState('0800-888-0099');
  const [emergencyPhone, setEmergencyPhone] = useState('0800-444-5222');
  const [monthlyPremium, setMonthlyPremium] = useState(45000);
  const [notes, setNotes] = useState('');

  const handleCreatePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    const veh = vehicles.find((v) => v.id === vehId);
    addInsurancePolicy({
      vehicleId: vehId,
      vehicleName: veh ? `${veh.brand} ${veh.model}` : 'Vehículo',
      company,
      policyNumber,
      coverageType,
      startDate,
      expiryDate,
      assistancePhone,
      emergencyPhone,
      monthlyPremium: Number(monthlyPremium),
      notes,
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Seguros
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Pólizas vigentes, coberturas y teléfonos de auxilio mecánico con discado rápido.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold shadow-md shadow-teal-900/20 transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Póliza</span>
        </button>
      </div>

      {/* Insurance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {insurance.map((policy) => (
          <div
            key={policy.id}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 hover:border-teal-500/70 transition shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Header card */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {policy.vehicleName}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">{policy.company}</h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    Póliza Activa
                  </span>
                  <div className="text-xs text-slate-400 font-mono mt-1">{policy.policyNumber}</div>
                </div>
              </div>

              {/* Coverage and details */}
              <div className="space-y-2.5 py-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Tipo de Cobertura:</span>
                  <span className="font-bold text-slate-800">{policy.coverageType}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Vigencia:</span>
                  <span className="font-semibold text-slate-800">
                    {policy.startDate} al <strong>{policy.expiryDate}</strong>
                  </span>
                </div>

                {policy.monthlyPremium && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Cuota Mensual:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      ${policy.monthlyPremium.toLocaleString('es-AR')}
                    </span>
                  </div>
                )}

                {policy.notes && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                    {policy.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Quick dial actions */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
              <a
                href={`tel:${policy.assistancePhone}`}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold border border-blue-200 transition"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Auxilio / Grúa</span>
              </a>

              <a
                href={`tel:${policy.emergencyPhone}`}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-bold border border-rose-200 transition"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Emergencias</span>
              </a>
            </div>
          </div>
        ))}
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

            <h3 className="text-xl font-bold text-slate-900 mb-1">Registrar Póliza de Seguro</h3>
            <p className="text-xs text-slate-500 mb-4">Ingresá los datos de tu compañía aseguradora.</p>

            <form onSubmit={handleCreatePolicy} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vehículo Asegurado</label>
                <select
                  value={vehId}
                  onChange={(e) => setVehId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.brand} {v.model} ({v.plate})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Compañía</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Sancor, La Segunda, Rivadavia"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Número de Póliza</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 9912-4412"
                    value={policyNumber}
                    onChange={(e) => setPolicyNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tipo de Cobertura</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Terceros Completo con Granizo / Todo Riesgo con Franquicia"
                  value={coverageType}
                  onChange={(e) => setCoverageType(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vence en fecha</label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cuota mensual ($)</label>
                  <input
                    type="number"
                    value={monthlyPremium}
                    onChange={(e) => setMonthlyPremium(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Teléfono Auxilio Mecánico</label>
                  <input
                    type="text"
                    value={assistancePhone}
                    onChange={(e) => setAssistancePhone(e.target.value)}
                    placeholder="0800-888-0099"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Teléfono Emergencias 24h</label>
                  <input
                    type="text"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="0800-444-5222"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition cursor-pointer shadow-md"
              >
                Guardar Póliza
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
