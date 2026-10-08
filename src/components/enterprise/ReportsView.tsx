import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import {
  BarChart3,
  Download,
  Printer,
  Filter,
  Coins,
  Fuel,
  Wrench,
  AlertTriangle,
  Calendar,
  Truck,
  User,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { vehicles, expenses, fuelLogs, maintenance, incidents, drivers, showToast } = useGarage();

  const [filterPeriod, setFilterPeriod] = useState('mes');
  const [filterVehicle, setFilterVehicle] = useState('todos');
  const [filterCostCenter, setFilterCostCenter] = useState('todos');

  // Enterprise vehicles
  const enterpriseVehicles = vehicles.filter((v) => v.mode === 'enterprise' || v.mode === 'both');

  // Calculations
  const totalFleetCost = 4900000;
  const maintenanceCost = 1280000;
  const fuelCost = 2450000;
  const insuranceAndTolls = totalFleetCost - maintenanceCost - fuelCost;

  // CSV Export handler
  const handleExportCSV = () => {
    let csv = 'ID,Vehiculo,Fecha,Categoria,Descripcion,Monto,CentroCosto\n';
    expenses.forEach((e) => {
      csv += `"${e.id}","${e.vehicleName}","${e.date}","${e.category}","${e.description}",${e.amount},"${e.costCenter || 'General'}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MiGarage_Informe_Flota_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Informe CSV descargado con éxito');
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto print:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Informes & Auditoría de Flota
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Análisis de costos totales, combustible, siniestralidad y reportes ejecutivos exportables.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 text-xs no-print">
        <div className="flex items-center gap-2 text-slate-600 font-bold">
          <Filter className="w-4 h-4 text-teal-600" />
          <span>Filtros:</span>
        </div>

        <select
          value={filterPeriod}
          onChange={(e) => setFilterPeriod(e.target.value)}
          className="p-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
        >
          <option value="mes">Mes actual (Octubre 2026)</option>
          <option value="trimestre">Tercer Trimestre 2026</option>
          <option value="anio">Año 2026 Completo</option>
        </select>

        <select
          value={filterVehicle}
          onChange={(e) => setFilterVehicle(e.target.value)}
          className="p-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
        >
          <option value="todos">Todos los vehículos (10 unidades)</option>
          {enterpriseVehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.brand} {v.model} ({v.plate})
            </option>
          ))}
        </select>

        <select
          value={filterCostCenter}
          onChange={(e) => setFilterCostCenter(e.target.value)}
          className="p-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
        >
          <option value="todos">Todos los centros de costo</option>
          <option value="logistica">Operaciones Logística</option>
          <option value="distribucion">Distribución Mayorista</option>
          <option value="campo">Campo y Obras</option>
          <option value="comercial">Dirección Comercial</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Costo Operativo Total</div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">
            ${totalFleetCost.toLocaleString('es-AR')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Flota activa completa</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Costo Promedio / Km</div>
          <div className="text-2xl font-black text-teal-700 font-mono mt-1">
            $245.50
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Basado en 19.950 km recorridos</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Costo Promedio / Unidad</div>
          <div className="text-2xl font-black text-blue-700 font-mono mt-1">
            ${(totalFleetCost / 25).toLocaleString('es-AR')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Total 25 vehículos corporativos</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Siniestros del Periodo</div>
          <div className="text-2xl font-black text-rose-700 font-mono mt-1">
            7 casos
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Costo recuperable: $710.000</div>
        </div>
      </div>

      {/* Detailed Report Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Cost Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">Desglose de Costos por Categoría</h3>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Combustible y Cargas</span>
                <span className="font-mono">${fuelCost.toLocaleString('es-AR')} (50%)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '50%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Mantenimiento y Reparaciones</span>
                <span className="font-mono">${maintenanceCost.toLocaleString('es-AR')} (26%)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '26%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Seguros Corporativos Flota</span>
                <span className="font-mono">${(insuranceAndTolls * 0.7).toLocaleString('es-AR')} (17%)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-teal-600 rounded-full" style={{ width: '17%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Peajes y Documentación (R.U.T.A.)</span>
                <span className="font-mono">${(insuranceAndTolls * 0.3).toLocaleString('es-AR')} (7%)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '7%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Top Maintenance Vehicles */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-base">Unidades con Mayor Costo de Taller</h3>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <div className="font-bold text-slate-900">Ford Ranger (AD 672 TR)</div>
                <div className="text-slate-500">Amortiguadores y suspensión</div>
              </div>
              <div className="font-bold text-amber-900 font-mono text-sm">$645.000</div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <div className="font-bold text-slate-900">Toyota Hilux (AF 342 OP)</div>
                <div className="text-slate-500">Service oficial 90.000 km</div>
              </div>
              <div className="font-bold text-teal-900 font-mono text-sm">$345.000</div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <div className="font-bold text-slate-900">Mercedes-Benz Sprinter (AE 889 KL)</div>
                <div className="text-slate-500">Frenos y sensores</div>
              </div>
              <div className="font-bold text-blue-900 font-mono text-sm">$290.000</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
