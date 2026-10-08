import React, { useState } from 'react';
import { GarageProvider, useGarage } from './context/GarageContext';
import { ModeSelectionScreen } from './components/mode-select/ModeSelectionScreen';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/common/ToastContainer';
import { VehicleDetailModal } from './components/family/VehicleDetailModal';
import { VehicleFormModal } from './components/common/VehicleFormModal';
import { QuickLogModal } from './components/common/QuickLogModal';

// Family Views
import { FamilyDashboard } from './components/family/FamilyDashboard';
import { VehiclesView } from './components/family/VehiclesView';
import { RemindersView } from './components/family/RemindersView';
import { MaintenanceView } from './components/family/MaintenanceView';
import { DocumentsView } from './components/family/DocumentsView';
import { InsuranceView } from './components/family/InsuranceView';
import { ExpensesFuelView } from './components/family/ExpensesFuelView';
import { IncidentsView } from './components/family/IncidentsView';
import { FamilyMembersView } from './components/family/FamilyMembersView';

// Enterprise Views
import { EnterpriseDashboard } from './components/enterprise/EnterpriseDashboard';
import { FleetView } from './components/enterprise/FleetView';
import { DriversView } from './components/enterprise/DriversView';
import { EnterpriseMaintenanceView } from './components/enterprise/EnterpriseMaintenanceView';
import { ReportsView } from './components/enterprise/ReportsView';

// Settings
import { SettingsView } from './components/settings/SettingsView';

const MainAppContent: React.FC = () => {
  const {
    mode,
    showModeSelector,
    currentTab,
    setCurrentTab,
    selectedVehicleId,
    setSelectedVehicleId,
  } = useGarage();

  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [quickActionType, setQuickActionType] = useState<
    'mantenimiento' | 'combustible' | 'recordatorio' | 'siniestro' | 'vehiculo' | null
  >(null);

  // If initial mode selector screen is requested
  if (showModeSelector) {
    return <ModeSelectionScreen />;
  }

  const handleOpenQuickAction = (
    type: 'mantenimiento' | 'combustible' | 'recordatorio' | 'siniestro' | 'vehiculo' = 'mantenimiento'
  ) => {
    if (type === 'vehiculo') {
      setShowVehicleModal(true);
    } else {
      setQuickActionType(type);
    }
  };

  const renderActiveView = () => {
    if (mode === 'family') {
      switch (currentTab) {
        case 'inicio':
          return (
            <FamilyDashboard
              onOpenVehicleModal={() => setShowVehicleModal(true)}
              onOpenQuickAction={handleOpenQuickAction}
              onSelectVehicle={(id) => setSelectedVehicleId(id)}
            />
          );
        case 'vehiculos':
          return (
            <VehiclesView
              onOpenVehicleModal={() => setShowVehicleModal(true)}
              onSelectVehicle={(id) => setSelectedVehicleId(id)}
            />
          );
        case 'recordatorios':
          return <RemindersView onOpenQuickAction={() => handleOpenQuickAction('recordatorio')} />;
        case 'mantenimiento':
          return (
            <MaintenanceView onOpenQuickAction={() => handleOpenQuickAction('mantenimiento')} />
          );
        case 'documentos':
          return <DocumentsView />;
        case 'seguros':
          return <InsuranceView />;
        case 'gastos':
          return (
            <ExpensesFuelView
              onOpenQuickAction={(t) => handleOpenQuickAction(t)}
            />
          );
        case 'siniestros':
          return <IncidentsView onOpenQuickAction={() => handleOpenQuickAction('siniestro')} />;
        case 'familia':
          return <FamilyMembersView />;
        case 'configuracion':
          return <SettingsView />;
        default:
          return (
            <FamilyDashboard
              onOpenVehicleModal={() => setShowVehicleModal(true)}
              onOpenQuickAction={handleOpenQuickAction}
              onSelectVehicle={(id) => setSelectedVehicleId(id)}
            />
          );
      }
    } else {
      // Enterprise Mode
      switch (currentTab) {
        case 'inicio':
          return <EnterpriseDashboard />;
        case 'flota':
          return (
            <FleetView
              onOpenVehicleModal={() => setShowVehicleModal(true)}
              onSelectVehicle={(id) => setSelectedVehicleId(id)}
            />
          );
        case 'conductores':
          return <DriversView />;
        case 'mantenimiento':
          return (
            <EnterpriseMaintenanceView
              onOpenQuickAction={() => handleOpenQuickAction('mantenimiento')}
            />
          );
        case 'combustible':
        case 'gastos':
          return (
            <ExpensesFuelView
              onOpenQuickAction={(t) => handleOpenQuickAction(t)}
            />
          );
        case 'seguros':
          return <InsuranceView />;
        case 'documentos':
          return <DocumentsView />;
        case 'siniestros':
          return <IncidentsView onOpenQuickAction={() => handleOpenQuickAction('siniestro')} />;
        case 'informes':
          return <ReportsView />;
        case 'configuracion':
          return <SettingsView />;
        default:
          return <EnterpriseDashboard />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Header */}
      <Header onOpenQuickAction={() => handleOpenQuickAction('mantenimiento')} />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Dynamic Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12 overflow-x-hidden min-w-0">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Toast Notifications */}
      <ToastContainer />

      {/* Vehicle Ficha Detail Modal */}
      {selectedVehicleId && (
        <VehicleDetailModal
          vehicleId={selectedVehicleId}
          onClose={() => setSelectedVehicleId(null)}
          onOpenQuickAction={(action) => handleOpenQuickAction(action)}
        />
      )}

      {/* Add Vehicle Modal */}
      {showVehicleModal && (
        <VehicleFormModal onClose={() => setShowVehicleModal(false)} />
      )}

      {/* Quick Action Logging Modal */}
      {quickActionType && (
        <QuickLogModal
          initialAction={quickActionType}
          onClose={() => setQuickActionType(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <GarageProvider>
      <MainAppContent />
    </GarageProvider>
  );
}
