import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import { Incident } from '../../types';
import { IncidentShareModal } from './IncidentShareModal';
import {
  AlertTriangle,
  Plus,
  Share2,
  Calendar,
  MapPin,
  Clock,
  Shield,
  User,
  Phone,
  FileText,
  DollarSign,
  Truck,
  CheckCircle2,
  Trash2,
  Car,
} from 'lucide-react';

interface IncidentsViewProps {
  onOpenQuickAction: (actionType: 'siniestro') => void;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({ onOpenQuickAction }) => {
  const { incidents, vehicles, insurance, mode, deleteIncident, updateIncident } = useGarage();
  const [selectedIncidentForShare, setSelectedIncidentForShare] = useState<Incident | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const filteredIncidents = incidents.filter((inc) => {
    if (statusFilter === 'todos') return true;
    return inc.status === statusFilter;
  });

  const getStatusBadge = (status: Incident['status']) => {
    switch (status) {
      case 'pendiente':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'denunciado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'en investigación':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'en reparación':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'resuelto':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'rechazado':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Gestión de Accidentes & Choques</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Siniestros
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Registro cronológico, datos de terceros, números de denuncia y generación de ficha segura.
          </p>
        </div>

        <button
          onClick={() => onOpenQuickAction('siniestro')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold shadow-md shadow-rose-900/30 transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Siniestro</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {['todos', 'denunciado', 'en reparación', 'en investigación', 'resuelto'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer capitalize ${
              statusFilter === st
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Incidents List */}
      {filteredIncidents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
          <Shield className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No hay siniestros en este estado</h3>
          <p className="text-sm text-slate-500 mt-1">
            ¡Excelente noticia! No se registran incidentes pendientes o activos.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIncidents.map((incident) => {
            const veh = vehicles.find((v) => v.id === incident.vehicleId);
            const vehInsurance = insurance.find((i) => i.vehicleId === incident.vehicleId);

            return (
              <div
                key={incident.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-rose-300 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 space-y-4"
              >
                {/* Top Row: Type & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200">
                      🚨 {incident.type}
                    </span>
                    <span className="text-xs font-semibold text-slate-900 font-mono">
                      {incident.vehicleName}
                    </span>
                    {incident.claimNumber && (
                      <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Denuncia: {incident.claimNumber}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold border capitalize ${getStatusBadge(
                        incident.status
                      )}`}
                    >
                      {incident.status}
                    </span>
                  </div>
                </div>

                {/* Main description and location */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1 font-medium text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" />
                      <span>{incident.date}</span>
                    </div>
                    <div className="flex items-center gap-1 font-medium text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span>{incident.time} hs</span>
                    </div>
                    <div className="flex items-center gap-1 font-medium text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{incident.location}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-800 font-medium leading-relaxed">
                    {incident.description}
                  </p>
                </div>

                {/* Third Party Box */}
                {incident.thirdParty && (
                  <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/90 text-xs text-slate-700 space-y-1.5">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                      <User className="w-3.5 h-3.5 text-slate-600" />
                      <span>Datos del Tercero Involucrado:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <div>
                        <strong>Nombre:</strong> {incident.thirdParty.name}
                      </div>
                      <div>
                        <strong>Teléfono:</strong> {incident.thirdParty.phone}
                      </div>
                      <div>
                        <strong>Vehículo:</strong> {incident.thirdParty.vehicleModel} (
                        {incident.thirdParty.plate})
                      </div>
                      <div>
                        <strong>Aseguradora:</strong> {incident.thirdParty.insuranceCompany} (Póliza:{' '}
                        {incident.thirdParty.policyNumber})
                      </div>
                    </div>
                  </div>
                )}

                {/* Enterprise Additional Details */}
                {mode === 'enterprise' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="text-slate-400 block text-[10px] uppercase">Conductor</span>
                      <span className="font-bold text-slate-800">{incident.driverName || 'Sin asignar'}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="text-slate-400 block text-[10px] uppercase">Costo Estimado</span>
                      <span className="font-bold text-slate-800 font-mono">
                        ${(incident.estimatedCost || 0).toLocaleString('es-AR')}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="text-slate-400 block text-[10px] uppercase">Días en Taller</span>
                      <span className="font-bold text-slate-800">{incident.daysOutOfService || 0} días</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="text-slate-400 block text-[10px] uppercase">Taller</span>
                      <span className="font-bold text-slate-800 truncate block">
                        {incident.repairWorkshop || 'En peritaje'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Bottom Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <select
                      value={incident.status}
                      onChange={(e) =>
                        updateIncident(incident.id, {
                          status: e.target.value as Incident['status'],
                        })
                      }
                      className="text-xs py-1.5 px-3 rounded-xl bg-slate-100 border border-slate-200 font-semibold cursor-pointer"
                    >
                      <option value="pendiente">Estado: Pendiente</option>
                      <option value="denunciado">Estado: Denunciado</option>
                      <option value="en investigación">Estado: En investigación</option>
                      <option value="en reparación">Estado: En reparación</option>
                      <option value="resuelto">Estado: Resuelto</option>
                      <option value="rechazado">Estado: Rechazado</option>
                    </select>

                    <button
                      onClick={() => deleteIncident(incident.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Eliminar registro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Crucial Share Button */}
                  <button
                    onClick={() => setSelectedIncidentForShare(incident)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-md shadow-teal-900/30 transition cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Compartir datos del vehículo</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Share Modal Trigger */}
      {selectedIncidentForShare && (
        <IncidentShareModal
          incident={selectedIncidentForShare}
          vehicle={
            vehicles.find((v) => v.id === selectedIncidentForShare.vehicleId) || vehicles[0]
          }
          insurancePolicy={insurance.find(
            (i) => i.vehicleId === selectedIncidentForShare.vehicleId
          )}
          onClose={() => setSelectedIncidentForShare(null)}
        />
      )}
    </div>
  );
};
