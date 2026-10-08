import { ExpirationAlert, NotificationSettings, InsurancePolicy, VehicleDocument, Reminder, Vehicle, Driver } from '../types';

// Web Audio API gentle notification sound generator
export const playNotificationChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Play warm dual-tone chime
    const now = ctx.currentTime;
    
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    osc1.start(now);
    osc1.stop(now + 0.4);
  } catch {
    // Audio might be blocked until user gesture, safely ignore
  }
};

// Check browser Notification support and current status
export const getBrowserNotificationStatus = (): 'default' | 'granted' | 'denied' | 'unsupported' => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
};

// Request Web Push / Notification permission
export const requestWebNotificationPermission = async (): Promise<'default' | 'granted' | 'denied' | 'unsupported'> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return 'denied';
  }
};

// Send browser notification
export const sendBrowserNotification = (
  title: string,
  options?: {
    body?: string;
    icon?: string;
    badge?: string;
    tag?: string;
    requireInteraction?: boolean;
    data?: any;
  }
) => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    try {
      const notif = new Notification(title, {
        body: options?.body,
        icon: options?.icon || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=128&q=80',
        badge: options?.badge,
        tag: options?.tag || 'migarage-alert',
        requireInteraction: options?.requireInteraction || false,
      });

      notif.onclick = () => {
        window.focus();
        notif.close();
      };
      return true;
    } catch {
      return false;
    }
  }
  return false;
};

// Compute all expiration alerts across the whole garage
export const computeExpirationAlerts = (
  vehicles: Vehicle[],
  insurance: InsurancePolicy[],
  documents: VehicleDocument[],
  reminders: Reminder[],
  drivers: Driver[],
  referenceDate: Date = new Date('2026-10-08')
): ExpirationAlert[] => {
  const alerts: ExpirationAlert[] = [];

  // 1. SCAN SEGUROS
  insurance.forEach((pol) => {
    if (!pol.expiryDate) return;
    const expDate = new Date(pol.expiryDate);
    const diffDays = Math.ceil((expDate.getTime() - referenceDate.getTime()) / (1000 * 3600 * 24));

    let urgency: ExpirationAlert['urgency'] = 'optimo';
    if (diffDays <= 0) urgency = 'critico';
    else if (diffDays <= 15) urgency = 'urgente';
    else if (diffDays <= 35) urgency = 'aviso';

    if (diffDays <= 45) {
      alerts.push({
        id: `alert-ins-${pol.id}`,
        type: 'seguro',
        title: `Póliza ${pol.company} por vencer`,
        vehicleName: pol.vehicleName,
        vehicleId: pol.vehicleId,
        dueDate: pol.expiryDate,
        daysRemaining: diffDays,
        urgency,
        detail: `Póliza N° ${pol.policyNumber} (${pol.coverageType}). Vence ${diffDays <= 0 ? 'hoy o ya vencida' : `en ${diffDays} días`}.`,
        read: false,
        createdAt: pol.startDate,
        actionTab: 'seguros',
      });
    }
  });

  // 2. SCAN VTV & DOCUMENTOS
  documents.forEach((doc) => {
    if (!doc.expiryDate) return;
    const expDate = new Date(doc.expiryDate);
    const diffDays = Math.ceil((expDate.getTime() - referenceDate.getTime()) / (1000 * 3600 * 24));

    let urgency: ExpirationAlert['urgency'] = 'optimo';
    if (diffDays <= 0) urgency = 'critico';
    else if (diffDays <= 15) urgency = 'urgente';
    else if (diffDays <= 35) urgency = 'aviso';

    const isVtv = doc.type === 'vtv' || doc.title.toLowerCase().includes('vtv');

    if (diffDays <= 45) {
      alerts.push({
        id: `alert-doc-${doc.id}`,
        type: isVtv ? 'vtv' : 'vtv',
        title: isVtv ? `VTV Oblea por vencer` : `Vencimiento de ${doc.title}`,
        vehicleName: doc.vehicleName,
        vehicleId: doc.vehicleId,
        dueDate: doc.expiryDate,
        daysRemaining: diffDays,
        urgency,
        detail: `${doc.title}. ${diffDays <= 0 ? 'Vencida' : `Faltan ${diffDays} días para renovar.`}`,
        read: false,
        createdAt: doc.createdAt,
        actionTab: 'documentos',
      });
    }
  });

  // 3. SCAN SERVICIOS & MANTENIMIENTOS EN REMINDERS
  reminders
    .filter((r) => !r.completed && (r.category === 'mantenimiento' || r.category === 'neumáticos'))
    .forEach((rem) => {
      let diffDays: number | undefined = undefined;
      let diffKm: number | undefined = undefined;

      const veh = vehicles.find((v) => v.id === rem.vehicleId);
      if (rem.dueMileage && veh) {
        diffKm = Math.max(0, rem.dueMileage - veh.currentMileage);
      }

      if (rem.dueDate) {
        const expDate = new Date(rem.dueDate);
        diffDays = Math.ceil((expDate.getTime() - referenceDate.getTime()) / (1000 * 3600 * 24));
      }

      let urgency: ExpirationAlert['urgency'] = 'aviso';
      if ((diffDays !== undefined && diffDays <= 7) || (diffKm !== undefined && diffKm <= 500)) {
        urgency = 'urgente';
      }
      if ((diffDays !== undefined && diffDays <= 0) || (diffKm !== undefined && diffKm === 0)) {
        urgency = 'critico';
      }

      alerts.push({
        id: `alert-rem-${rem.id}`,
        type: 'mantenimiento',
        title: rem.title,
        vehicleName: rem.vehicleName,
        vehicleId: rem.vehicleId,
        dueDate: rem.dueDate,
        daysRemaining: diffDays,
        kmRemaining: diffKm,
        urgency,
        detail: diffKm !== undefined ? `Faltan aproximadamente ${diffKm.toLocaleString('es-AR')} km para el service.` : `Programado para ${rem.dueDate}.`,
        read: false,
        createdAt: rem.createdAt,
        actionTab: 'mantenimiento',
      });
    });

  // 4. SCAN LICENCIAS DE CHOFERES (MODO EMPRESA)
  drivers.forEach((drv) => {
    if (!drv.licenseExpiry) return;
    const expDate = new Date(drv.licenseExpiry);
    const diffDays = Math.ceil((expDate.getTime() - referenceDate.getTime()) / (1000 * 3600 * 24));

    if (diffDays <= 45) {
      let urgency: ExpirationAlert['urgency'] = 'optimo';
      if (diffDays <= 0) urgency = 'critico';
      else if (diffDays <= 15) urgency = 'urgente';
      else if (diffDays <= 35) urgency = 'aviso';

      alerts.push({
        id: `alert-lic-${drv.id}`,
        type: 'licencia',
        title: `Licencia de Conducir (${drv.name})`,
        vehicleName: drv.assignedVehicleId ? 'Chofer asignado' : 'Flota',
        vehicleId: drv.assignedVehicleId || '',
        dueDate: drv.licenseExpiry,
        daysRemaining: diffDays,
        urgency,
        detail: `Licencia ${drv.licenseCategory}. Vence en ${diffDays} días (${drv.licenseExpiry}).`,
        read: false,
        createdAt: drv.licenseExpiry,
        actionTab: 'conductores',
      });
    }
  });

  // Sort by urgency: critico first, then urgente, then aviso, then days
  return alerts.sort((a, b) => {
    const order = { critico: 0, urgente: 1, aviso: 2, optimo: 3 };
    if (order[a.urgency] !== order[b.urgency]) {
      return order[a.urgency] - order[b.urgency];
    }
    return (a.daysRemaining ?? 999) - (b.daysRemaining ?? 999);
  });
};
