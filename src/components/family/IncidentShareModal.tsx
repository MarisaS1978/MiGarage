import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import { Incident, Vehicle, InsurancePolicy, IncidentShareConfig } from '../../types';
import {
  X,
  Share2,
  Shield,
  Car,
  User,
  Phone,
  FileText,
  Lock,
  Clock,
  Send,
  Copy,
  Check,
  Eye,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

interface IncidentShareModalProps {
  incident: Incident;
  vehicle: Vehicle;
  insurancePolicy?: InsurancePolicy;
  onClose: () => void;
}

export const IncidentShareModal: React.FC<IncidentShareModalProps> = ({
  incident,
  vehicle,
  insurancePolicy,
  onClose,
}) => {
  const { showToast } = useGarage();

  const [config, setConfig] = useState<IncidentShareConfig>({
    includeVehicle: true,
    includeInsurance: true,
    includeOwner: true,
    includePhone: true,
    includeDni: false,
    includeAddress: false,
    includeDocs: false,
    includePhotos: false,
    expirationHours: 24,
    pinCode: '',
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Generate safe shareable summary
  const generateSharePayload = () => {
    let lines = [`🚨 *FICHA DE SINIESTRO & DATOS DE VEHÍCULO*`];
    lines.push(`📅 *Fecha:* ${incident.date} a las ${incident.time}`);
    lines.push(`📍 *Lugar:* ${incident.location}`);
    lines.push(`--------------------------------`);

    if (config.includeVehicle) {
      lines.push(`🚗 *DATOS DEL VEHÍCULO*`);
      lines.push(`• Marca/Modelo: ${vehicle.brand} ${vehicle.model} (${vehicle.year})`);
      lines.push(`• Patente / Dominio: ${vehicle.plate}`);
      lines.push(`• Color: ${vehicle.color}`);
    }

    if (config.includeInsurance && insurancePolicy) {
      lines.push(`🛡️ *DATOS DEL SEGURO*`);
      lines.push(`• Compañía: ${insurancePolicy.company}`);
      lines.push(`• Póliza N°: ${insurancePolicy.policyNumber}`);
      lines.push(`• Cobertura: ${insurancePolicy.coverageType}`);
      lines.push(`• Auxilio / Grúa: ${insurancePolicy.assistancePhone}`);
      lines.push(`• Siniestros 24h: ${insurancePolicy.emergencyPhone}`);
    }

    if (config.includeOwner) {
      lines.push(`👤 *DATOS DEL TITULAR*`);
      lines.push(`• Titular: Marisa Gómez`);
    }

    if (config.includePhone) {
      lines.push(`📞 *Teléfono de contacto:* +54 9 11 4512-8890`);
    }

    if (config.includeDni) {
      lines.push(`🪪 *DNI:* 31.849.201`);
    }

    if (config.includeAddress) {
      lines.push(`🏠 *Dirección:* Av. Libertador 4200, CABA`);
    }

    if (config.includeDocs) {
      lines.push(`📄 *Documentos adjuntos:* Cédula Verde DNRPA y Póliza certificada.`);
    }

    if (config.includePhotos) {
      lines.push(`📸 *Fotografías:* ${incident.photosCount} fotos disponibles en enlace.`);
    }

    lines.push(`--------------------------------`);
    lines.push(`⏱️ *Ficha temporal válida por ${config.expirationHours} horas.*`);
    if (config.pinCode) {
      lines.push(`🔒 *Código PIN de acceso requerido:* ${config.pinCode}`);
    }
    lines.push(`🔗 *Ver ficha digital de solo lectura:* https://migarage.app/s/${incident.id}?exp=${config.expirationHours}h`);

    return lines.join('\n');
  };

  const shareText = generateSharePayload();

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
    showToast('Abriendo WhatsApp con ficha protegida...');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopiedLink(true);
    showToast('Ficha para compartir copiada al portapapeles');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ficha de Siniestro - MiGarage',
          text: shareText,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold mb-1 border border-rose-500/30">
              <Shield className="w-3.5 h-3.5" />
              <span>Privacidad & Seguridad Garantizada</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Compartir datos del vehículo en un siniestro
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Generá una ficha temporal seleccionando únicamente los datos necesarios.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50">
          {/* Mode Switcher: Configurator vs Live Preview */}
          <div className="flex items-center justify-between bg-slate-200/70 p-1 rounded-2xl">
            <button
              onClick={() => setPreviewMode(false)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                !previewMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Seleccionar datos a compartir
            </button>
            <button
              onClick={() => setPreviewMode(true)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                previewMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-teal-600" />
              <span>2. Vista previa de la ficha</span>
            </button>
          </div>

          {!previewMode ? (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">¿Qué querés compartir?</h3>
                <p className="text-xs text-slate-500 mb-3">
                  Los datos sensibles están desactivados por defecto para tu tranquilidad.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Option 1: Vehicle */}
                  <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 cursor-pointer hover:border-teal-500 transition">
                    <input
                      type="checkbox"
                      checked={config.includeVehicle}
                      onChange={(e) => setConfig({ ...config, includeVehicle: e.target.checked })}
                      className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">Datos del vehículo</div>
                      <div className="text-slate-500">{vehicle.brand} {vehicle.model} · {vehicle.plate}</div>
                    </div>
                  </label>

                  {/* Option 2: Insurance */}
                  <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 cursor-pointer hover:border-teal-500 transition">
                    <input
                      type="checkbox"
                      checked={config.includeInsurance}
                      onChange={(e) => setConfig({ ...config, includeInsurance: e.target.checked })}
                      className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">Datos del seguro</div>
                      <div className="text-slate-500">
                        {insurancePolicy ? `${insurancePolicy.company} · ${insurancePolicy.policyNumber}` : 'Póliza y auxilio'}
                      </div>
                    </div>
                  </label>

                  {/* Option 3: Owner */}
                  <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 cursor-pointer hover:border-teal-500 transition">
                    <input
                      type="checkbox"
                      checked={config.includeOwner}
                      onChange={(e) => setConfig({ ...config, includeOwner: e.target.checked })}
                      className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">Datos del titular</div>
                      <div className="text-slate-500">Nombre del conductor / titular</div>
                    </div>
                  </label>

                  {/* Option 4: Phone */}
                  <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 cursor-pointer hover:border-teal-500 transition">
                    <input
                      type="checkbox"
                      checked={config.includePhone}
                      onChange={(e) => setConfig({ ...config, includePhone: e.target.checked })}
                      className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">Teléfono de contacto</div>
                      <div className="text-slate-500">Línea directa para peritaje</div>
                    </div>
                  </label>

                  {/* Sensitive 5: DNI */}
                  <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-rose-200/80 cursor-pointer hover:border-rose-400 transition">
                    <input
                      type="checkbox"
                      checked={config.includeDni}
                      onChange={(e) => setConfig({ ...config, includeDni: e.target.checked })}
                      className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900 flex items-center gap-1">
                        <span>DNI / Documento</span>
                        <span className="text-[10px] text-rose-600 bg-rose-50 px-1 rounded">Privado</span>
                      </div>
                      <div className="text-slate-500">Solo si la policía o seguro lo exige</div>
                    </div>
                  </label>

                  {/* Sensitive 6: Address */}
                  <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-rose-200/80 cursor-pointer hover:border-rose-400 transition">
                    <input
                      type="checkbox"
                      checked={config.includeAddress}
                      onChange={(e) => setConfig({ ...config, includeAddress: e.target.checked })}
                      className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900 flex items-center gap-1">
                        <span>Dirección particular</span>
                        <span className="text-[10px] text-rose-600 bg-rose-50 px-1 rounded">Privado</span>
                      </div>
                      <div className="text-slate-500">Domicilio legal de radicación</div>
                    </div>
                  </label>

                  {/* Option 7: Docs */}
                  <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 cursor-pointer hover:border-teal-500 transition">
                    <input
                      type="checkbox"
                      checked={config.includeDocs}
                      onChange={(e) => setConfig({ ...config, includeDocs: e.target.checked })}
                      className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">Documentación digital</div>
                      <div className="text-slate-500">Cédula verde y certificado PDF</div>
                    </div>
                  </label>

                  {/* Option 8: Photos */}
                  <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 cursor-pointer hover:border-teal-500 transition">
                    <input
                      type="checkbox"
                      checked={config.includePhotos}
                      onChange={(e) => setConfig({ ...config, includePhotos: e.target.checked })}
                      className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">Fotos del choque</div>
                      <div className="text-slate-500">({incident.photosCount} fotos disponibles)</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Security parameters */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Lock className="w-4 h-4 text-teal-600" />
                  <span>Seguridad del enlace temporal</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Caducidad automática</label>
                    <select
                      value={config.expirationHours}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          expirationHours: Number(e.target.value) as 1 | 24 | 168,
                        })
                      }
                      className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                    >
                      <option value={1}>1 hora (inmediato en el lugar)</option>
                      <option value={24}>24 horas (recomendado)</option>
                      <option value={168}>7 días (peritaje extendido)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">
                      Código PIN de 4 dígitos (Opcional)
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="Ej: 4892"
                      value={config.pinCode || ''}
                      onChange={(e) => setConfig({ ...config, pinCode: e.target.value })}
                      className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono tracking-widest text-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Live Preview Box */
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Ficha que visualizará el tercero en su celular:
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-300 shadow-md space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                      M
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-slate-900">MiGarage Emergency Card</div>
                      <div className="text-[10px] text-emerald-700 font-medium">● Documento verificado de solo lectura</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    Expira en {config.expirationHours}h
                  </span>
                </div>

                <div className="text-xs text-slate-600">
                  <strong>Incidente:</strong> {incident.date} · {incident.location}
                </div>

                {config.includeVehicle && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-slate-800">🚗 Vehículo Asegurado</div>
                    <div>{vehicle.brand} {vehicle.model} ({vehicle.year}) - {vehicle.color}</div>
                    <div className="font-mono font-bold text-teal-800">Patente: {vehicle.plate}</div>
                  </div>
                )}

                {config.includeInsurance && insurancePolicy && (
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-xs space-y-1 text-blue-900">
                    <div className="font-bold">🛡️ Compañía de Seguros</div>
                    <div className="text-sm font-extrabold">{insurancePolicy.company}</div>
                    <div>Póliza: <strong>{insurancePolicy.policyNumber}</strong></div>
                    <div>Auxilio: {insurancePolicy.assistancePhone} · Siniestros: {insurancePolicy.emergencyPhone}</div>
                  </div>
                )}

                {config.includeOwner && (
                  <div className="text-xs text-slate-700">
                    <strong>Titular:</strong> Marisa Gómez
                  </div>
                )}

                {config.includePhone && (
                  <div className="text-xs text-slate-700">
                    <strong>Teléfono:</strong> +54 9 11 4512-8890
                  </div>
                )}

                {config.includeDni && (
                  <div className="text-xs text-slate-700">
                    <strong>DNI:</strong> 31.849.201
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            🔒 Solo se compartirán los campos marcados.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleShareWhatsApp}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-900/30 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleNativeShare}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Copiado' : 'Copiar enlace'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
