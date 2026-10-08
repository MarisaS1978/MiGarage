import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppMode,
  Vehicle,
  FamilyMember,
  Driver,
  Reminder,
  MaintenanceRecord,
  VehicleDocument,
  InsurancePolicy,
  Expense,
  FuelLog,
  Incident,
  VehicleStatus,
  ExpirationAlert,
  NotificationSettings,
} from '../types';
import {
  INITIAL_VEHICLES,
  INITIAL_FAMILY_MEMBERS,
  INITIAL_DRIVERS,
  INITIAL_REMINDERS,
  INITIAL_MAINTENANCE,
  INITIAL_DOCUMENTS,
  INITIAL_INSURANCE,
  INITIAL_EXPENSES,
  INITIAL_FUEL_LOGS,
  INITIAL_INCIDENTS,
} from '../data/mockData';
import {
  computeExpirationAlerts,
  getBrowserNotificationStatus,
  requestWebNotificationPermission,
  sendBrowserNotification,
  playNotificationChime,
} from '../services/notificationService';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface GarageContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  showModeSelector: boolean;
  setShowModeSelector: (show: boolean) => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedVehicleId: string | null;
  setSelectedVehicleId: (id: string | null) => void;

  // Data
  vehicles: Vehicle[];
  familyMembers: FamilyMember[];
  drivers: Driver[];
  reminders: Reminder[];
  maintenance: MaintenanceRecord[];
  documents: VehicleDocument[];
  insurance: InsurancePolicy[];
  expenses: Expense[];
  fuelLogs: FuelLog[];
  incidents: Incident[];

  // CRUD actions
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  updateFleetStatus: (id: string, status: VehicleStatus) => void;

  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt'>) => void;
  toggleReminderComplete: (id: string) => void;
  snoozeReminder: (id: string, days?: number, km?: number) => void;
  deleteReminder: (id: string) => void;

  addMaintenanceRecord: (record: Omit<MaintenanceRecord, 'id'>) => void;
  deleteMaintenanceRecord: (id: string) => void;

  addDocument: (doc: Omit<VehicleDocument, 'id' | 'createdAt'>) => void;
  deleteDocument: (id: string) => void;

  addInsurancePolicy: (policy: Omit<InsurancePolicy, 'id'>) => void;
  updateInsurancePolicy: (id: string, updates: Partial<InsurancePolicy>) => void;

  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;

  addFuelLog: (log: Omit<FuelLog, 'id'>) => void;
  deleteFuelLog: (id: string) => void;

  addIncident: (incident: Omit<Incident, 'id'>) => void;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
  deleteIncident: (id: string) => void;

  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void;
  deleteFamilyMember: (id: string) => void;

  addDriver: (driver: Omit<Driver, 'id'>) => void;
  updateDriver: (id: string, updates: Partial<Driver>) => void;
  deleteDriver: (id: string) => void;

  // Notifications & Expiration Alerts
  alerts: ExpirationAlert[];
  unreadAlertsCount: number;
  notificationSettings: NotificationSettings;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  markAlertAsRead: (alertId: string) => void;
  markAllAlertsAsRead: () => void;
  requestNotificationPermission: () => Promise<boolean>;
  sendTestNotification: () => void;
  checkUpcomingExpirationsNow: (notifyUser?: boolean) => void;

  // Utilities
  resetToDemoData: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  toasts: ToastNotification[];
}

const GarageContext = createContext<GarageContextType | undefined>(undefined);

export const GarageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load mode from storage or start with mode selector
  const [mode, setModeState] = useState<AppMode>(() => {
    const saved = localStorage.getItem('migarage_mode');
    return (saved as AppMode) || 'family';
  });

  const [showModeSelector, setShowModeSelector] = useState<boolean>(() => {
    return !localStorage.getItem('migarage_mode');
  });

  const [currentTab, setCurrentTab] = useState<string>('inicio');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Local storage synced states
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('migarage_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    const saved = localStorage.getItem('migarage_family');
    return saved ? JSON.parse(saved) : INITIAL_FAMILY_MEMBERS;
  });

  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem('migarage_drivers');
    return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('migarage_reminders');
    return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
  });

  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>(() => {
    const saved = localStorage.getItem('migarage_maintenance');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE;
  });

  const [documents, setDocuments] = useState<VehicleDocument[]>(() => {
    const saved = localStorage.getItem('migarage_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [insurance, setInsurance] = useState<InsurancePolicy[]>(() => {
    const saved = localStorage.getItem('migarage_insurance');
    return saved ? JSON.parse(saved) : INITIAL_INSURANCE;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('migarage_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(() => {
    const saved = localStorage.getItem('migarage_fuel');
    return saved ? JSON.parse(saved) : INITIAL_FUEL_LOGS;
  });

  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem('migarage_incidents');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('migarage_notification_settings');
    const initialPerm = getBrowserNotificationStatus();
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, permissionStatus: initialPerm };
      } catch {
        // Fallback below
      }
    }
    return {
      webPushEnabled: true,
      soundEnabled: true,
      notifyInsurance: true,
      notifyVtv: true,
      notifyMaintenance: true,
      notifyDriverLicenses: true,
      alertDaysAdvance: 30,
      permissionStatus: initialPerm,
    };
  });

  // Read alert IDs
  const [readAlertIds, setReadAlertIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('migarage_read_alerts');
    return saved ? JSON.parse(saved) : [];
  });

  // Compute alerts dynamically from vehicles, insurance, docs, reminders & drivers
  const alerts: ExpirationAlert[] = React.useMemo(() => {
    const allAlerts = computeExpirationAlerts(vehicles, insurance, documents, reminders, drivers);
    return allAlerts.map((a) => ({
      ...a,
      read: readAlertIds.includes(a.id),
    }));
  }, [vehicles, insurance, documents, reminders, drivers, readAlertIds]);

  const unreadAlertsCount = alerts.filter((a) => !a.read && a.urgency !== 'optimo').length;

  useEffect(() => {
    localStorage.setItem('migarage_notification_settings', JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  useEffect(() => {
    localStorage.setItem('migarage_read_alerts', JSON.stringify(readAlertIds));
  }, [readAlertIds]);

  const updateNotificationSettings = (updates: Partial<NotificationSettings>) => {
    setNotificationSettings((prev) => ({ ...prev, ...updates }));
    showToast('Preferencias de notificaciones guardadas');
  };

  const markAlertAsRead = (alertId: string) => {
    setReadAlertIds((prev) => (prev.includes(alertId) ? prev : [...prev, alertId]));
  };

  const markAllAlertsAsRead = () => {
    const allIds = alerts.map((a) => a.id);
    setReadAlertIds(allIds);
    showToast('Todas las alertas marcadas como leídas');
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    const res = await requestWebNotificationPermission();
    setNotificationSettings((prev) => ({ ...prev, permissionStatus: res }));
    if (res === 'granted') {
      showToast('¡Notificaciones Web y Push activadas con éxito!', 'success');
      if (notificationSettings.soundEnabled) playNotificationChime();
      sendBrowserNotification('🚗 MiGarage — Notificaciones Activadas', {
        body: 'Te avisaremos a tiempo antes del vencimiento de tus seguros, VTV y services.',
      });
      return true;
    } else if (res === 'denied') {
      showToast('Permiso de notificaciones bloqueado en el navegador', 'warning');
      return false;
    } else {
      showToast('Notificaciones no soportadas en este entorno', 'info');
      return false;
    }
  };

  const sendTestNotification = () => {
    if (notificationSettings.soundEnabled) {
      playNotificationChime();
    }
    const sent = sendBrowserNotification('🔔 MiGarage — Prueba de Alerta', {
      body: '🚗 Toyota Etios: VTV próxima a vencer en 12 días. Tu sistema de alertas está 100% operativo.',
    });
    if (sent) {
      showToast('Notificación web enviada a tu dispositivo');
    } else {
      showToast('Alerta de prueba emitida (en pantalla). Activá notificaciones en el navegador para ver banners de escritorio.', 'info');
    }
  };

  const checkUpcomingExpirationsNow = (notifyUser = true) => {
    const urgentAlerts = alerts.filter((a) => a.urgency === 'critico' || a.urgency === 'urgente');
    if (notificationSettings.soundEnabled && urgentAlerts.length > 0) {
      playNotificationChime();
    }

    if (urgentAlerts.length > 0) {
      const topAlert = urgentAlerts[0];
      sendBrowserNotification(`⚠️ Alerta MiGarage: ${topAlert.title}`, {
        body: `${topAlert.vehicleName}: ${topAlert.detail}`,
      });
      if (notifyUser) {
        showToast(`Se detectaron ${urgentAlerts.length} vencimientos prioritarios (Seguro / VTV / Service)`, 'warning');
      }
    } else if (notifyUser) {
      showToast('Todos los seguros, VTV y services se encuentran al día', 'success');
    }
  };

  // Run initial check on app load after a brief delay
  useEffect(() => {
    const timer = setTimeout(() => {
      // Background check without interrupting user
      checkUpcomingExpirationsNow(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('migarage_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);
  useEffect(() => {
    localStorage.setItem('migarage_family', JSON.stringify(familyMembers));
  }, [familyMembers]);
  useEffect(() => {
    localStorage.setItem('migarage_drivers', JSON.stringify(drivers));
  }, [drivers]);
  useEffect(() => {
    localStorage.setItem('migarage_reminders', JSON.stringify(reminders));
  }, [reminders]);
  useEffect(() => {
    localStorage.setItem('migarage_maintenance', JSON.stringify(maintenance));
  }, [maintenance]);
  useEffect(() => {
    localStorage.setItem('migarage_documents', JSON.stringify(documents));
  }, [documents]);
  useEffect(() => {
    localStorage.setItem('migarage_insurance', JSON.stringify(insurance));
  }, [insurance]);
  useEffect(() => {
    localStorage.setItem('migarage_expenses', JSON.stringify(expenses));
  }, [expenses]);
  useEffect(() => {
    localStorage.setItem('migarage_fuel', JSON.stringify(fuelLogs));
  }, [fuelLogs]);
  useEffect(() => {
    localStorage.setItem('migarage_incidents', JSON.stringify(incidents));
  }, [incidents]);

  const setMode = (newMode: AppMode) => {
    setModeState(newMode);
    localStorage.setItem('migarage_mode', newMode);
    setShowModeSelector(false);
    setCurrentTab('inicio');
    showToast(`Modo cambiado a: ${newMode === 'family' ? '🏠 Modo Familiar' : '🏢 Modo Empresa'}`);
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Vehicle Actions
  const addVehicle = (veh: Omit<Vehicle, 'id' | 'createdAt'>) => {
    const newVeh: Vehicle = {
      ...veh,
      id: 'veh-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setVehicles((prev) => [newVeh, ...prev]);
    showToast(`Vehículo ${newVeh.brand} ${newVeh.model} agregado con éxito`);
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
    showToast('Vehículo actualizado');
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    if (selectedVehicleId === id) setSelectedVehicleId(null);
    showToast('Vehículo eliminado del garage', 'info');
  };

  const updateFleetStatus = (id: string, status: VehicleStatus) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              fleetStatus: status,
              generalStatus: status === 'disponible' || status === 'en_uso' ? 'optimo' : status === 'mantenimiento' ? 'atencion' : 'urgente',
            }
          : v
      )
    );
    showToast('Estado de unidad actualizado');
  };

  // Reminder Actions
  const addReminder = (rem: Omit<Reminder, 'id' | 'createdAt'>) => {
    const newRem: Reminder = {
      ...rem,
      id: 'rem-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setReminders((prev) => [newRem, ...prev]);
    showToast('Recordatorio creado');
  };

  const toggleReminderComplete = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const next = !r.completed;
          showToast(next ? 'Recordatorio marcado como completado' : 'Recordatorio reactivado');
          return { ...r, completed: next };
        }
        return r;
      })
    );
  };

  const snoozeReminder = (id: string, days = 7, km = 1000) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const newDate = r.dueDate
            ? new Date(new Date(r.dueDate).getTime() + days * 86400000).toISOString().split('T')[0]
            : undefined;
          const newKm = r.dueMileage ? r.dueMileage + km : undefined;
          return { ...r, dueDate: newDate, dueMileage: newKm };
        }
        return r;
      })
    );
    showToast(`Recordatorio pospuesto (+${days} días / +${km} km)`);
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    showToast('Recordatorio eliminado', 'info');
  };

  // Maintenance Actions
  const addMaintenanceRecord = (rec: Omit<MaintenanceRecord, 'id'>) => {
    const newRec: MaintenanceRecord = {
      ...rec,
      id: 'maint-' + Date.now(),
    };
    setMaintenance((prev) => [newRec, ...prev]);

    // Also update vehicle mileage if this maintenance was at a higher mileage
    const veh = vehicles.find((v) => v.id === rec.vehicleId);
    if (veh && rec.mileage > veh.currentMileage) {
      updateVehicle(veh.id, { currentMileage: rec.mileage });
    }

    // Auto add an expense if cost > 0
    if (rec.cost > 0) {
      addExpense({
        vehicleId: rec.vehicleId,
        vehicleName: rec.vehicleName,
        date: rec.date,
        category: 'mantenimiento',
        description: `${rec.type.toUpperCase()}: ${rec.description}`,
        amount: rec.cost,
        vendor: rec.workshop,
      });
    }

    showToast('Servicio de mantenimiento registrado');
  };

  const deleteMaintenanceRecord = (id: string) => {
    setMaintenance((prev) => prev.filter((m) => m.id !== id));
    showToast('Registro de mantenimiento eliminado', 'info');
  };

  // Document Actions
  const addDocument = (doc: Omit<VehicleDocument, 'id' | 'createdAt'>) => {
    const newDoc: VehicleDocument = {
      ...doc,
      id: 'doc-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDocuments((prev) => [newDoc, ...prev]);
    showToast('Documento guardado');
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    showToast('Documento eliminado', 'info');
  };

  // Insurance Actions
  const addInsurancePolicy = (pol: Omit<InsurancePolicy, 'id'>) => {
    const newPol: InsurancePolicy = {
      ...pol,
      id: 'ins-' + Date.now(),
    };
    setInsurance((prev) => [newPol, ...prev]);
    showToast('Póliza de seguro registrada');
  };

  const updateInsurancePolicy = (id: string, updates: Partial<InsurancePolicy>) => {
    setInsurance((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Póliza actualizada');
  };

  // Expense Actions
  const addExpense = (exp: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...exp,
      id: 'exp-' + Date.now(),
    };
    setExpenses((prev) => [newExp, ...prev]);
    showToast('Gasto registrado');
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showToast('Gasto eliminado', 'info');
  };

  // Fuel Actions
  const addFuelLog = (log: Omit<FuelLog, 'id'>) => {
    const newLog: FuelLog = {
      ...log,
      id: 'fuel-' + Date.now(),
    };
    setFuelLogs((prev) => [newLog, ...prev]);

    // Also update vehicle mileage if log is higher
    const veh = vehicles.find((v) => v.id === log.vehicleId);
    if (veh && log.mileage > veh.currentMileage) {
      updateVehicle(veh.id, { currentMileage: log.mileage });
    }

    // Auto record expense
    addExpense({
      vehicleId: log.vehicleId,
      vehicleName: log.vehicleName,
      date: log.date,
      category: 'combustible',
      description: `Carga ${log.fuelType} (${log.liters} L en ${log.station})`,
      amount: log.totalPrice,
      vendor: log.station,
    });

    showToast('Carga de combustible registrada');
  };

  const deleteFuelLog = (id: string) => {
    setFuelLogs((prev) => prev.filter((f) => f.id !== id));
    showToast('Registro de combustible eliminado', 'info');
  };

  // Incident Actions
  const addIncident = (inc: Omit<Incident, 'id'>) => {
    const newInc: Incident = {
      ...inc,
      id: 'inc-' + Date.now(),
    };
    setIncidents((prev) => [newInc, ...prev]);
    showToast('Siniestro registrado en el sistema', 'warning');
  };

  const updateIncident = (id: string, updates: Partial<Incident>) => {
    setIncidents((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
    showToast('Siniestro actualizado');
  };

  const deleteIncident = (id: string) => {
    setIncidents((prev) => prev.filter((i) => i.id !== id));
    showToast('Registro de siniestro eliminado', 'info');
  };

  // Family Member Actions
  const addFamilyMember = (mem: Omit<FamilyMember, 'id'>) => {
    const newMem: FamilyMember = {
      ...mem,
      id: 'fam-' + Date.now(),
    };
    setFamilyMembers((prev) => [...prev, newMem]);
    showToast(`Integrante ${newMem.name} agregado`);
  };

  const updateFamilyMember = (id: string, updates: Partial<FamilyMember>) => {
    setFamilyMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    showToast('Integrante actualizado');
  };

  const deleteFamilyMember = (id: string) => {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
    showToast('Integrante eliminado', 'info');
  };

  // Driver Actions
  const addDriver = (drv: Omit<Driver, 'id'>) => {
    const newDrv: Driver = {
      ...drv,
      id: 'drv-' + Date.now(),
    };
    setDrivers((prev) => [...prev, newDrv]);
    showToast(`Conductor ${newDrv.name} registrado`);
  };

  const updateDriver = (id: string, updates: Partial<Driver>) => {
    setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    showToast('Conductor actualizado');
  };

  const deleteDriver = (id: string) => {
    setDrivers((prev) => prev.filter((d) => d.id !== id));
    showToast('Conductor eliminado', 'info');
  };

  // Reset to demo
  const resetToDemoData = () => {
    setVehicles(INITIAL_VEHICLES);
    setFamilyMembers(INITIAL_FAMILY_MEMBERS);
    setDrivers(INITIAL_DRIVERS);
    setReminders(INITIAL_REMINDERS);
    setMaintenance(INITIAL_MAINTENANCE);
    setDocuments(INITIAL_DOCUMENTS);
    setInsurance(INITIAL_INSURANCE);
    setExpenses(INITIAL_EXPENSES);
    setFuelLogs(INITIAL_FUEL_LOGS);
    setIncidents(INITIAL_INCIDENTS);
    localStorage.clear();
    localStorage.setItem('migarage_mode', mode);
    showToast('Datos de demostración restaurados correctamente', 'info');
  };

  return (
    <GarageContext.Provider
      value={{
        mode,
        setMode,
        showModeSelector,
        setShowModeSelector,
        currentTab,
        setCurrentTab,
        selectedVehicleId,
        setSelectedVehicleId,

        vehicles,
        familyMembers,
        drivers,
        reminders,
        maintenance,
        documents,
        insurance,
        expenses,
        fuelLogs,
        incidents,

        addVehicle,
        updateVehicle,
        deleteVehicle,
        updateFleetStatus,

        addReminder,
        toggleReminderComplete,
        snoozeReminder,
        deleteReminder,

        addMaintenanceRecord,
        deleteMaintenanceRecord,

        addDocument,
        deleteDocument,

        addInsurancePolicy,
        updateInsurancePolicy,

        addExpense,
        deleteExpense,

        addFuelLog,
        deleteFuelLog,

        addIncident,
        updateIncident,
        deleteIncident,

        addFamilyMember,
        updateFamilyMember,
        deleteFamilyMember,

        addDriver,
        updateDriver,
        deleteDriver,

        // Notifications & Expirations
        alerts,
        unreadAlertsCount,
        notificationSettings,
        updateNotificationSettings,
        markAlertAsRead,
        markAllAlertsAsRead,
        requestNotificationPermission,
        sendTestNotification,
        checkUpcomingExpirationsNow,

        resetToDemoData,
        showToast,
        toasts,
      }}
    >
      {children}
    </GarageContext.Provider>
  );
};

export const useGarage = () => {
  const context = useContext(GarageContext);
  if (!context) {
    throw new Error('useGarage must be used within a GarageProvider');
  }
  return context;
};
