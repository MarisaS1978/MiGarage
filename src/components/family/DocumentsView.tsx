import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import { DocumentType } from '../../types';
import {
  FileText,
  Plus,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Trash2,
  Upload,
  FileCheck,
  Search,
  X,
} from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const { documents, vehicles, addDocument, deleteDocument, showToast } = useGarage();
  const [filterType, setFilterType] = useState<string>('todos');
  const [showAddModal, setShowAddModal] = useState(false);

  // New doc form state
  const [docVehicleId, setDocVehicleId] = useState(vehicles[0]?.id || '');
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState<DocumentType>('cédula');
  const [docExpiryDate, setDocExpiryDate] = useState('');
  const [docDescription, setDocDescription] = useState('');

  const today = new Date('2026-10-08');

  const filtered = documents.filter((doc) => {
    if (filterType === 'todos') return true;
    return doc.type === filterType;
  });

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle) {
      showToast('Por favor completá el título del documento', 'warning');
      return;
    }
    const veh = vehicles.find((v) => v.id === docVehicleId);
    addDocument({
      vehicleId: docVehicleId,
      vehicleName: veh ? `${veh.brand} ${veh.model}` : 'Vehículo',
      title: docTitle,
      type: docType,
      expiryDate: docExpiryDate || undefined,
      description: docDescription || undefined,
      fileName: `${docTitle.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      fileSize: '1.4 MB',
    });
    setShowAddModal(false);
    setDocTitle('');
    setDocExpiryDate('');
    setDocDescription('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Documentación
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Almacená cédulas, pólizas, obleas VTV y licencias con control de vencimiento.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold shadow-md shadow-teal-900/20 transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Subir Documento</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {['todos', 'cédula', 'seguro', 'vtv', 'licencia', 'factura', 'comprobante'].map((type) => (
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

      {/* Documents List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((doc) => {
          let statusLabel = 'Al día';
          let statusBadge = 'bg-emerald-100 text-emerald-800 border-emerald-200';
          let isExpiringSoon = false;

          if (doc.expiryDate) {
            const expDate = new Date(doc.expiryDate);
            const daysDiff = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
            if (daysDiff < 0) {
              statusLabel = `Vencido hace ${Math.abs(daysDiff)} días`;
              statusBadge = 'bg-rose-100 text-rose-800 border-rose-300';
            } else if (daysDiff <= 30) {
              statusLabel = `Vence en ${daysDiff} días`;
              statusBadge = 'bg-amber-100 text-amber-800 border-amber-300';
              isExpiringSoon = true;
            } else {
              statusLabel = `Vence en ${daysDiff} días`;
            }
          }

          return (
            <div
              key={doc.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-teal-400 transition shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {doc.type}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1">{doc.title}</h3>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 shrink-0">
                    {doc.vehicleName}
                  </span>
                </div>

                {doc.description && (
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    {doc.description}
                  </p>
                )}

                {doc.expiryDate && (
                  <div className="flex items-center justify-between text-xs py-2 border-t border-slate-100">
                    <span className="text-slate-500">Fecha de Vencimiento:</span>
                    <span className="font-semibold text-slate-800">{doc.expiryDate}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${statusBadge}`}>
                  {statusLabel}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast(`Abriendo archivo digital: ${doc.fileName || doc.title}`)}
                    className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Ver</span>
                  </button>

                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                    title="Eliminar documento"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-200">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">Subir Documento</h3>
            <p className="text-xs text-slate-500 mb-4">
              Cargá el comprobante o archivo PDF/imagen de tu vehículo.
            </p>

            <form onSubmit={handleCreateDocument} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vehículo</label>
                <select
                  value={docVehicleId}
                  onChange={(e) => setDocVehicleId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.brand} {v.model} ({v.plate})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Título del Documento</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Cédula Verde DNRPA / Oblea VTV 2026"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipo de Documento</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as DocumentType)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold capitalize"
                  >
                    <option value="cédula">Cédula</option>
                    <option value="seguro">Seguro</option>
                    <option value="vtv">VTV</option>
                    <option value="licencia">Licencia</option>
                    <option value="factura">Factura</option>
                    <option value="comprobante">Comprobante</option>
                    <option value="manual">Manual</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fecha de Vencimiento (opcional)</label>
                  <input
                    type="date"
                    value={docExpiryDate}
                    onChange={(e) => setDocExpiryDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Descripción / Observaciones</label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre radicación, emisor o condiciones..."
                  value={docDescription}
                  onChange={(e) => setDocDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center bg-slate-50">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-slate-600 font-semibold">Adjuntar archivo digital</p>
                <p className="text-[10px] text-slate-400 mt-0.5">PDF, PNG o JPG hasta 10MB</p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition cursor-pointer shadow-md"
              >
                Guardar Documento
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
