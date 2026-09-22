import { db, isFirebaseConfigured } from '../config/firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';

// Root immutable admin definition (Credentials loaded securely from environment / Firestore)
export const IMMUTABLE_ADMIN = Object.freeze({
  username: import.meta.env.VITE_ADMIN_USERNAME || 'admin',
  password: import.meta.env.VITE_ADMIN_PASSWORD || '',
  displayName: 'System Admin',
  role: 'AI & Systems Administrator',
  badge: 'Root Access',
  securityLevel: 'Database Authenticated (Stored in Cloud Firestore)',
  immutable: true
});

/**
 * Generate a consistent document ID for a farmer
 */
export const getFarmerDocId = (farmerData) => {
  if (farmerData?.id) return farmerData.id;
  const namePart = (farmerData?.name || 'farmer').toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
  const locPart = (farmerData?.location || 'in').toLowerCase().trim().split(',')[0].replace(/[^a-z0-9]/g, '_');
  return `${namePart}_${locPart}`;
};

/**
 * Save or update a farmer profile in Cloud Firestore
 */
export const saveFarmerProfileToFirestore = async (farmerData) => {
  const docId = getFarmerDocId(farmerData);
  const payload = {
    ...farmerData,
    id: docId,
    updatedAt: new Date().toISOString(),
    _syncedAt: new Date().toISOString(),
  };

  if (!isFirebaseConfigured || !db) {
    // Save to local storage cache
    const existing = JSON.parse(localStorage.getItem('cached_farmers') || '{}');
    existing[docId] = payload;
    localStorage.setItem('cached_farmers', JSON.stringify(existing));
    return { success: true, mode: 'local', id: docId, data: payload };
  }

  try {
    const farmerRef = doc(db, 'farmers', docId);
    await setDoc(farmerRef, {
      ...payload,
      firestoreTimestamp: serverTimestamp()
    }, { merge: true });

    // Also update local cache
    const existing = JSON.parse(localStorage.getItem('cached_farmers') || '{}');
    existing[docId] = payload;
    localStorage.setItem('cached_farmers', JSON.stringify(existing));

    return { success: true, mode: 'firestore', id: docId, data: payload };
  } catch (error) {
    console.warn('Firestore write failed, falling back to local cache:', error);
    const existing = JSON.parse(localStorage.getItem('cached_farmers') || '{}');
    existing[docId] = payload;
    localStorage.setItem('cached_farmers', JSON.stringify(existing));
    return { success: true, mode: 'local_fallback', id: docId, data: payload, error: error.message };
  }
};

/**
 * Fetch all registered farmers for Admin inspection
 */
export const fetchAllFarmers = async () => {
  if (!isFirebaseConfigured || !db) {
    const localFarmers = JSON.parse(localStorage.getItem('cached_farmers') || '{}');
    return Object.values(localFarmers);
  }

  try {
    const farmersCol = collection(db, 'farmers');
    const snapshot = await getDocs(farmersCol);
    const farmersList = [];
    snapshot.forEach(docSnap => {
      farmersList.push({ id: docSnap.id, ...docSnap.data() });
    });

    if (farmersList.length === 0) {
      const localFarmers = JSON.parse(localStorage.getItem('cached_farmers') || '{}');
      return Object.values(localFarmers);
    }

    return farmersList;
  } catch (error) {
    console.warn('Failed to fetch farmers from Firestore, using local cache:', error);
    const localFarmers = JSON.parse(localStorage.getItem('cached_farmers') || '{}');
    return Object.values(localFarmers);
  }
};

/**
 * Log a farm activity (disease scan, yield forecast, market check, advisory)
 */
export const logActivityToFirestore = async (farmerId, activity) => {
  const activityPayload = {
    ...activity,
    farmerId: farmerId || 'anonymous_farmer',
    timestamp: activity.timestamp || new Date().toISOString(),
  };

  if (!isFirebaseConfigured || !db) {
    const localActivities = JSON.parse(localStorage.getItem('all_cached_activities') || '[]');
    localActivities.unshift(activityPayload);
    localStorage.setItem('all_cached_activities', JSON.stringify(localActivities.slice(0, 100)));
    return { success: true, mode: 'local' };
  }

  try {
    const activitiesCol = collection(db, 'farm_activities');
    await addDoc(activitiesCol, {
      ...activityPayload,
      firestoreTimestamp: serverTimestamp()
    });
    return { success: true, mode: 'firestore' };
  } catch (error) {
    console.warn('Firestore activity log failed, saving to local cache:', error);
    const localActivities = JSON.parse(localStorage.getItem('all_cached_activities') || '[]');
    localActivities.unshift(activityPayload);
    localStorage.setItem('all_cached_activities', JSON.stringify(localActivities.slice(0, 100)));
    return { success: true, mode: 'local_fallback' };
  }
};

/**
 * Fetch all recent farm activities for Admin telemetry
 */
export const fetchRecentActivities = async (limitCount = 20) => {
  if (!isFirebaseConfigured || !db) {
    const localActivities = JSON.parse(localStorage.getItem('all_cached_activities') || '[]');
    return localActivities.slice(0, limitCount);
  }

  try {
    const activitiesCol = collection(db, 'farm_activities');
    const q = query(activitiesCol, orderBy('timestamp', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    const items = [];
    snapshot.forEach(docSnap => {
      items.push({ id: docSnap.id, ...docSnap.data() });
    });
    return items.length > 0 ? items : JSON.parse(localStorage.getItem('all_cached_activities') || '[]').slice(0, limitCount);
  } catch (error) {
    console.warn('Firestore activities fetch failed, using local cache:', error);
    return JSON.parse(localStorage.getItem('all_cached_activities') || '[]').slice(0, limitCount);
  }
};

/**
 * Synchronize and ensure admin credentials exist in Cloud Firestore
 */
export const syncAdminCredentialsToFirestore = async () => {
  const adminPayload = {
    username: IMMUTABLE_ADMIN.username,
    password: IMMUTABLE_ADMIN.password,
    displayName: IMMUTABLE_ADMIN.displayName,
    role: IMMUTABLE_ADMIN.role,
    badge: IMMUTABLE_ADMIN.badge,
    securityLevel: IMMUTABLE_ADMIN.securityLevel,
    immutable: true,
    storageLocation: 'Cloud Firestore /system_admins/admin_root',
    updatedAt: new Date().toISOString(),
    systemNotice: 'Root administrator record secured in Cloud Firestore.'
  };

  // Local storage mirror
  localStorage.setItem('cached_admin_record', JSON.stringify(adminPayload));

  if (!isFirebaseConfigured || !db) {
    return { success: true, mode: 'local', data: adminPayload };
  }

  try {
    const adminRef = doc(db, 'system_admins', 'admin_root');
    await setDoc(adminRef, {
      ...adminPayload,
      firestoreTimestamp: serverTimestamp()
    }, { merge: true });
    return { success: true, mode: 'firestore', data: adminPayload };
  } catch (error) {
    console.warn('Failed to sync admin credentials to Firestore:', error);
    return { success: false, mode: 'local_fallback', data: adminPayload, error: error.message };
  }
};

/**
 * Fetch Admin Credential Record from Cloud Firestore
 */
export const fetchFirestoreAdminDoc = async () => {
  if (!isFirebaseConfigured || !db) {
    const cached = localStorage.getItem('cached_admin_record');
    return cached ? JSON.parse(cached) : IMMUTABLE_ADMIN;
  }

  try {
    const adminRef = doc(db, 'system_admins', 'admin_root');
    const docSnap = await getDoc(adminRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      // Auto-seed if not yet in Firestore
      await syncAdminCredentialsToFirestore();
      return IMMUTABLE_ADMIN;
    }
  } catch (err) {
    console.warn('Error reading admin doc from Firestore:', err);
    return IMMUTABLE_ADMIN;
  }
};

/**
 * Verify immutable admin credentials (checking Firestore first) and record an audit entry
 */
export const verifyAndLogAdminLogin = async (username, password) => {
  let targetAdmin = IMMUTABLE_ADMIN;

  if (isFirebaseConfigured && db) {
    try {
      const adminRef = doc(db, 'system_admins', 'admin_root');
      const docSnap = await getDoc(adminRef);
      if (docSnap.exists()) {
        const firestoreData = docSnap.data();
        if (firestoreData.username && firestoreData.password) {
          targetAdmin = firestoreData;
        }
      } else {
        // Document does not exist yet in Firestore: seed it now
        await syncAdminCredentialsToFirestore();
      }
    } catch (e) {
      console.warn('Could not read admin doc from Firestore during auth, using secure local config:', e);
    }
  }

  const isMatch = username.trim() === targetAdmin.username && password === targetAdmin.password;

  const auditEntry = {
    action: isMatch ? 'ADMIN_AUTH_SUCCESS' : 'ADMIN_AUTH_FAILURE',
    attemptedUser: username,
    timestamp: new Date().toISOString(),
    ip: '127.0.0.1 (Local Client)',
    role: isMatch ? (targetAdmin.role || IMMUTABLE_ADMIN.role) : 'UNAUTHORIZED'
  };

  // Log to local storage audit cache
  const localAudit = JSON.parse(localStorage.getItem('admin_audit_logs') || '[]');
  localAudit.unshift(auditEntry);
  localStorage.setItem('admin_audit_logs', JSON.stringify(localAudit.slice(0, 50)));

  if (isFirebaseConfigured && db) {
    try {
      // Update lastLogin on the admin document in Firestore
      if (isMatch) {
        const adminRef = doc(db, 'system_admins', 'admin_root');
        await setDoc(adminRef, {
          lastLogin: new Date().toISOString(),
          lastLoginStatus: 'SUCCESS',
          firestoreTimestamp: serverTimestamp()
        }, { merge: true });
      }

      // Record audit log
      const auditCol = collection(db, 'admin_audit_logs');
      await addDoc(auditCol, {
        ...auditEntry,
        firestoreTimestamp: serverTimestamp()
      });
    } catch (error) {
      console.warn('Could not write admin audit record to Firestore:', error);
    }
  }

  if (isMatch) {
    return { success: true, admin: targetAdmin };
  } else {
    return { success: false, error: 'Invalid admin username or password.' };
  }
};

/**
 * Fetch Admin Audit Logs from Firestore
 */
export const fetchAdminAuditLogs = async (limitCount = 15) => {
  if (!isFirebaseConfigured || !db) {
    return JSON.parse(localStorage.getItem('admin_audit_logs') || '[]');
  }

  try {
    const auditCol = collection(db, 'admin_audit_logs');
    const q = query(auditCol, orderBy('timestamp', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    const logs = [];
    snapshot.forEach(docSnap => {
      logs.push({ id: docSnap.id, ...docSnap.data() });
    });
    return logs.length > 0 ? logs : JSON.parse(localStorage.getItem('admin_audit_logs') || '[]');
  } catch (error) {
    console.warn('Could not fetch admin audit logs from Firestore:', error);
    return JSON.parse(localStorage.getItem('admin_audit_logs') || '[]');
  }
};
