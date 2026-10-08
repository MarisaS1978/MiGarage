import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import {
  Car,
  X,
  Wrench,
  Bell,
  Shield,
  FileText,
  Coins,
  Fuel,
  AlertTriangle,
  Users,
  Phone,
  Calendar,
  Gauge,
  Plus,
  ExternalLink,
  ChevronRight,
  Clock,
  Trash2,
  FileCheck,
} from 'lucide-react';

interface VehicleDetailModalProps {
  vehicleId: string;
  onClose: () => void;
  onOpenQuickAction: (actionType: 'mantenimiento' | 'combustible' | 'recordatorio' | 'siniestro') => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicleId,
  onClose,
  onOpenQuickAction,
}) => {
  const {
    vehicles,
    maintenance,
    reminders,
    insurance,
    documents,
    expenses,
    fuelLogs,
    incidents,
    familyMembers,
    deleteVehicle,
  } = useGarage();

  const [activeTab, setActiveTab] = useState<
    'mantenimiento' | 'recordatorios' | 'seguro' | 'documentos' | 'gastos' | 'combustible' | 'siniestros' | 'familia'
  >('mantenimiento');

  const vehicle = vehicles.find((v) => v.id === vehicleId);
  if (!vehicle) return null;

  // Filter records specifically for this vehicle
  const vehMaintenance = maintenance.filter((m) => m.vehicleId === vehicle.id);
  const vehReminders = reminders.filter((r) => r.vehicleId === vehicle.id);
  const vehInsurance = insurance.find((i) => i.vehicleId === vehicle.id);
  const vehDocs = documents.filter((d) => d.vehicleId === vehicle.id);
  const vehExpenses = expenses.filter((e) => e.vehicleId === vehicle.id);
  const vehFuel = fuelLogs.filter((f) => f.vehicleId === vehicle.id);
  const vehIncidents = incidents.filter((i) => i.vehicleId === vehicle.id);

  // Calculate fuel stats
  const totalFuelLiters = vehFuel.reduce((sum, f) => sum + f.liters, 0);
  const totalFuelSpent = vehFuel.reduce((sum, f) => sum + f.totalPrice, 0);
  const avgCostPerLiter = totalFuelLiters > 0 ? totalFuelSpent / totalFuelLiters : 0;

  // Family members who have access to this vehicle
  const assignedMembers = familyMembers.filter((m) =>
    m.assignedVehicleIds.includes(vehicle.id)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Top Header with Vehicle Cover */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-800 shrink-0 border-2 border-slate-700">
              {vehicle.photoUrl ? (
                <img
                  src={vehicle.photoUrl}
                  alt={vehicle.model}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <Car className="w-10 h-10" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-teal-300">
                  {vehicle.plate}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold">
                  🟢 En buen estado
                </span>
                <span className="text-xs text-slate-400">
                  {vehicle.year} · {vehicle.color} · {vehicle.fuelType.toUpperCase()}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight truncate text-white">
                {vehicle.brand} {vehicle.model} {vehicle.version && <span className="text-base text-slate-400 font-normal">{vehicle.version}</span>}
              </h2>

              <div className="flex items-center gap-4 mt-2 text-xs sm:text-sm text-slate-300 font-mono">
                <div className="flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-teal-400" />
                  <span>{vehicle.currentMileage.toLocaleString('es-AR')} km</span>
                </div>
                {vehicle.notes && (
                  <span className="text-slate-400 font-sans truncate max-w-xs">
                    {vehicle.notes}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto mt-6 pt-2 border-t border-slate-800 scrollbar-none text-xs font-semibold">
            <button
              onClick={() => setActiveTab('mantenimiento')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'mantenimiento'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Mantenimiento</span>
            </button>

            <button
              onClick={() => setActiveTab('recordatorios')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'recordatorios'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Recordatorios ({vehReminders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('seguro')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'seguro'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Seguro</span>
            </button>

            <button
              onClick={() => setActiveTab('documentos')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'documentos'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Documentos ({vehDocs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('gastos')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'gastos'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Gastos ({vehExpenses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('combustible')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'combustible'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Fuel className="w-3.5 h-3.5" />
              <span>Combustible</span>
            </button>

            <button
              onClick={() => setActiveTab('siniestros')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'siniestros'
                  ? 'bg-rose-700 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Siniestros ({vehIncidents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('familia')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'familia'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Familia ({assignedMembers.length})</span>
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50">
          {/* TAB 1: MANTENIMIENTO */}
          {activeTab === 'mantenimiento' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Historial de Mantenimiento</h3>
                  <p className="text-xs text-slate-500">Últimos services, talleres y repuestos cambiados</p>
                </div>
                <button
                  onClick={() => onOpenQuickAction('mantenimiento')}
                  className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nuevo Service</span>
                </button>
              </div>

              {vehMaintenance.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 p-6">
                  <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Sin mantenimientos registrados</p>
                  <p className="text-xs text-slate-500 mt-1">Registrá el primer cambio de aceite o service.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {vehMaintenance.map((rec) => (
                    <div
                      key={rec.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                            {rec.type}
                          </span>
                          <span className="text-xs font-semibold text-slate-600 font-mono">
                            {rec.mileage.toLocaleString('es-AR')} km
                          </span>
                          <span className="text-xs text-slate-400">· {rec.date}</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900">{rec.description}</p>
                        <div className="text-xs text-slate-500 flex items-center gap-3">
                          <span>📍 {rec.workshop}</span>
                          {rec.invoiceNumber && <span>🧾 {rec.invoiceNumber}</span>}
                        </div>
                        {rec.parts && (
                          <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <strong>Repuestos:</strong> {rec.parts}
                          </p>
                        )}
                      </div>

                      <div className="sm:text-right shrink-0">
                        <div className="text-sm font-extrabold text-slate-900 font-mono">
                          ${rec.cost.toLocaleString('es-AR')}
                        </div>
                        <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
                          {rec.isPreventive ? 'Preventivo' : 'Correctivo'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RECORDATORIOS */}
          {activeTab === 'recordatorios' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Recordatorios y Alertas</h3>
                  <p className="text-xs text-slate-500">Vencimientos programados por fecha o kilometraje</p>
                </div>
                <button
                  onClick={() => onOpenQuickAction('recordatorio')}
                  className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nuevo Aviso</span>
                </button>
              </div>

              {vehReminders.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 p-6">
                  <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No hay recordatorios pendientes</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {vehReminders.map((rem) => (
                    <div
                      key={rem.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                            {rem.category}
                          </span>
                          {rem.dueDate && (
                            <span className="text-xs font-medium text-amber-700 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{rem.dueDate}</span>
                            </span>
                          )}
                          {rem.dueMileage && (
                            <span className="text-xs font-mono font-medium text-slate-600">
                              a los {rem.dueMileage.toLocaleString('es-AR')} km
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{rem.title}</h4>
                        {rem.notes && <p className="text-xs text-slate-500">{rem.notes}</p>}
                      </div>

                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold shrink-0 ${
                          rem.completed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rem.completed ? 'Completado' : 'Pendiente'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SEGURO */}
          {activeTab === 'seguro' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Póliza de Seguro</h3>
                  <p className="text-xs text-slate-500">Datos de contacto para asistencia mecánica y emergencias</p>
                </div>
              </div>

              {vehInsurance ? (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Compañía Aseguradora
                      </span>
                      <h4 className="text-xl font-bold text-slate-900">{vehInsurance.company}</h4>
                      <p className="text-xs font-mono text-slate-600 mt-0.5">
                        Póliza: <strong>{vehInsurance.policyNumber}</strong>
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                        {vehInsurance.coverageType}
                      </span>
                      <div className="text-xs text-slate-500 mt-2">
                        Vigencia: {vehInsurance.startDate} al <strong>{vehInsurance.expiryDate}</strong>
                      </div>
                    </div>
                  </div>

                  {/* 1-Tap Emergency Phone Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <a
                      href={`tel:${vehInsurance.assistancePhone}`}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 font-semibold text-sm transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="text-xs text-blue-700">Auxilio & Grúa</div>
                          <div className="font-bold">{vehInsurance.assistancePhone}</div>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-200/60 text-blue-900">Llamar</span>
                    </a>

                    <a
                      href={`tel:${vehInsurance.emergencyPhone}`}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 font-semibold text-sm transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <div>
                          <div className="text-xs text-rose-700">Emergencias 24h</div>
                          <div className="font-bold">{vehInsurance.emergencyPhone}</div>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded bg-rose-200/60 text-rose-900">Llamar</span>
                    </a>
                  </div>

                  {vehInsurance.notes && (
                    <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 border border-slate-100">
                      <strong>Observaciones:</strong> {vehInsurance.notes}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 p-6">
                  <Shield className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Sin póliza configurada</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DOCUMENTACIÓN */}
          {activeTab === 'documentos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Documentación Digital</h3>
                  <p className="text-xs text-slate-500">Cédula verde, seguro, VTV, comprobantes</p>
                </div>
              </div>

              {vehDocs.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 p-6">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No hay documentos cargados</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {vehDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {doc.type}
                            </span>
                            {doc.expiryDate && (
                              <span className="text-xs font-semibold text-amber-700">
                                Vence: {doc.expiryDate}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-0.5">{doc.title}</h4>
                          {doc.fileName && (
                            <span className="text-xs text-slate-400 font-mono">
                              {doc.fileName} ({doc.fileSize})
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => alert(`Visualizando documento: ${doc.title}`)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Ver</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: GASTOS */}
          {activeTab === 'gastos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Gastos del Vehículo</h3>
                  <p className="text-xs text-slate-500">Historial de gastos, repuestos, combustible y seguro</p>
                </div>
              </div>

              {vehExpenses.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 p-6">
                  <Coins className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Sin gastos cargados</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {vehExpenses.map((exp) => (
                    <div
                      key={exp.id}
                      className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {exp.category}
                          </span>
                          <span className="text-xs text-slate-400">{exp.date}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 mt-0.5">{exp.description}</h4>
                        {exp.vendor && <span className="text-xs text-slate-500">📍 {exp.vendor}</span>}
                      </div>
                      <div className="text-sm font-bold text-slate-900 font-mono">
                        ${exp.amount.toLocaleString('es-AR')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: COMBUSTIBLE */}
          {activeTab === 'combustible' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Cargas y Rendimiento</h3>
                  <p className="text-xs text-slate-500">Consumo promedio y costo por litro</p>
                </div>
                <button
                  onClick={() => onOpenQuickAction('combustible')}
                  className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Carga</span>
                </button>
              </div>

              {/* Stats Card */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                  <div className="text-xs text-slate-500">Litros cargados</div>
                  <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                    {totalFuelLiters.toFixed(1)} L
                  </div>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                  <div className="text-xs text-slate-500">Total invertido</div>
                  <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                    ${totalFuelSpent.toLocaleString('es-AR')}
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1 bg-white p-3.5 rounded-2xl border border-slate-200">
                  <div className="text-xs text-slate-500">Precio prom. x litro</div>
                  <div className="text-lg font-bold text-teal-700 font-mono mt-0.5">
                    ${avgCostPerLiter.toFixed(0)}
                  </div>
                </div>
              </div>

              {/* List */}
              <div className="space-y-2">
                {vehFuel.map((f) => (
                  <div
                    key={f.id}
                    className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">{f.station}</span>
                        <span className="text-xs text-slate-500">· {f.date}</span>
                        <span className="text-xs font-mono text-slate-600">
                          {f.mileage.toLocaleString('es-AR')} km
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {f.liters} L (${f.pricePerLiter}/L) · {f.fuelType}
                      </div>
                      {f.notes && <p className="text-xs text-slate-400 mt-1">{f.notes}</p>}
                    </div>

                    <div className="text-sm font-bold text-slate-900 font-mono">
                      ${f.totalPrice.toLocaleString('es-AR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: SINIESTROS */}
          {activeTab === 'siniestros' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Historial de Siniestros</h3>
                  <p className="text-xs text-slate-500">Incidentes registrados con este vehículo</p>
                </div>
                <button
                  onClick={() => onOpenQuickAction('siniestro')}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Reportar Choque</span>
                </button>
              </div>

              {vehIncidents.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 p-6">
                  <Shield className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Sin antecedentes de siniestros</p>
                  <p className="text-xs text-slate-500 mt-1">Este vehículo no posee ningún incidente registrado.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {vehIncidents.map((inc) => (
                    <div
                      key={inc.id}
                      className="bg-white rounded-2xl p-4 border border-rose-200 shadow-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                            {inc.type}
                          </span>
                          <span className="text-xs text-slate-500">
                            {inc.date} a las {inc.time}
                          </span>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                          {inc.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">{inc.location}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{inc.description}</p>

                      {inc.thirdParty && (
                        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-xs text-slate-600">
                          <strong>Tercero involucrado:</strong> {inc.thirdParty.name} (
                          {inc.thirdParty.vehicleModel} · Patente: {inc.thirdParty.plate}) · Seg: {inc.thirdParty.insuranceCompany}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: FAMILIA */}
          {activeTab === 'familia' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Personas con Acceso</h3>
                  <p className="text-xs text-slate-500">
                    Miembros de la familia que pueden ver o gestionar este vehículo
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {assignedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{member.name}</h4>
                        <div className="text-xs text-slate-500">
                          {member.email} · {member.phone}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold capitalize ${
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
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm(`¿Estás seguro de eliminar el vehículo ${vehicle.brand} ${vehicle.model}?`)) {
                deleteVehicle(vehicle.id);
                onClose();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Eliminar vehículo</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition cursor-pointer"
          >
            Cerrar ficha
          </button>
        </div>
      </div>
    </div>
  );
};
