import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import { FamilyMember, FamilyRole } from '../../types';
import {
  Users,
  Plus,
  Shield,
  Car,
  Mail,
  Phone,
  Trash2,
  CheckCircle2,
  Info,
  X,
  UserCheck,
} from 'lucide-react';

export const FamilyMembersView: React.FC = () => {
  const { familyMembers, vehicles, addFamilyMember, deleteFamilyMember, updateFamilyMember } = useGarage();
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Invite state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<FamilyRole>('conductor');
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>(
    vehicles.map((v) => v.id)
  );

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    addFamilyMember({
      name,
      email,
      phone,
      role,
      assignedVehicleIds: selectedVehicles,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    });
    setShowInviteModal(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  const toggleVehicleAccess = (memberId: string, vehicleId: string) => {
    const mem = familyMembers.find((m) => m.id === memberId);
    if (!mem) return;
    const exists = mem.assignedVehicleIds.includes(vehicleId);
    const newIds = exists
      ? mem.assignedVehicleIds.filter((id) => id !== vehicleId)
      : [...mem.assignedVehicleIds, vehicleId];
    updateFamilyMember(memberId, { assignedVehicleIds: newIds });
  };

  const familyVehicles = vehicles.filter((v) => v.mode === 'family' || v.mode === 'both');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Garage Familiar Compartido
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Compartí tus vehículos con tu familia asignando roles de Propietario, Conductor o Consulta.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold shadow-md shadow-teal-900/20 transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Invitar Familiar</span>
        </button>
      </div>

      {/* Permission Explanation Box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200">
        <div className="space-y-1">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            👑 Propietario
          </span>
          <p className="text-xs text-slate-600 mt-1">
            Acceso completo: editar vehículos, administrar pólizas, documentos, invitar integrantes y gastos.
          </p>
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            🚗 Conductor
          </span>
          <p className="text-xs text-slate-600 mt-1">
            Consultar vehículo, actualizar kilometraje, registrar combustible, avisar siniestros y services.
          </p>
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
            👁️ Consulta
          </span>
          <p className="text-xs text-slate-600 mt-1">
            Solo lectura: consultar datos del seguro, cédula autorizada y próximos vencimientos.
          </p>
        </div>
      </div>

      {/* Members List */}
      <div className="space-y-4">
        {familyMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 hover:border-slate-300 transition shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{member.name}</h3>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold capitalize ${
                        member.role === 'propietario'
                          ? 'bg-emerald-100 text-emerald-800'
                          : member.role === 'conductor'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <span>✉️ {member.email}</span>
                    <span>📞 {member.phone}</span>
                  </div>
                </div>
              </div>

              {member.role !== 'propietario' && (
                <button
                  onClick={() => deleteFamilyMember(member.id)}
                  className="self-end sm:self-center p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                  title="Eliminar acceso de integrante"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Vehicle access check pills */}
            <div className="pt-3 border-t border-slate-100">
              <div className="text-xs font-semibold text-slate-500 mb-2">
                Vehículos con acceso autorizado:
              </div>
              <div className="flex flex-wrap gap-2">
                {familyVehicles.map((v) => {
                  const hasAccess = member.assignedVehicleIds.includes(v.id);
                  return (
                    <button
                      key={v.id}
                      onClick={() => toggleVehicleAccess(member.id, v.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                        hasAccess
                          ? 'bg-teal-50 border-teal-300 text-teal-900'
                          : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <Car className="w-3.5 h-3.5" />
                      <span>{v.brand} {v.model} ({v.plate})</span>
                      {hasAccess && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200">
            <button
              onClick={() => setShowInviteModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">Invitar Familiar</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enviá una invitación para compartir vehículos y tareas del garage.
            </p>

            <form onSubmit={handleInvite} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Juan Perez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="juan.perez@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

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
                <label className="block font-semibold text-slate-700 mb-1">Rol / Permiso</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as FamilyRole)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold capitalize"
                >
                  <option value="conductor">Conductor (Cargar km, combustible y services)</option>
                  <option value="consulta">Consulta (Solo lectura y vencimientos)</option>
                  <option value="propietario">Propietario (Acceso total)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition cursor-pointer shadow-md mt-2"
              >
                Enviar Invitación
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
