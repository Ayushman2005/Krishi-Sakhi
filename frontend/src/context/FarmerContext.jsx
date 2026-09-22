import { createContext, useContext, useState, useEffect } from 'react';
import {
  IMMUTABLE_ADMIN,
  saveFarmerProfileToFirestore,
  logActivityToFirestore,
  verifyAndLogAdminLogin,
  getFarmerDocId,
} from '../services/firebaseService';
import { isFirebaseConfigured } from '../config/firebase';

// Re-export immutable admin credentials
export const ADMIN_CREDENTIALS = IMMUTABLE_ADMIN;

const FarmerContext = createContext();

export const useFarmer = () => {
  const context = useContext(FarmerContext);
  if (!context) throw new Error('useFarmer must be used within FarmerProvider');
  return context;
};

export const FarmerProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('farmer_profile');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [authRole, setAuthRole] = useState(() => {
    try {
      const savedRole = localStorage.getItem('krishi_auth_role');
      if (savedRole === 'admin') return 'admin';
      if (savedRole === 'farmer') return 'farmer';
      const savedProfile = localStorage.getItem('farmer_profile');
      return savedProfile ? 'farmer' : null;
    } catch { return null; }
  });

  const [activities, setActivities] = useState(() => {
    try {
      const saved = localStorage.getItem('farmer_activities');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [cloudSyncStatus, setCloudSyncStatus] = useState(
    isFirebaseConfigured ? 'cloud_active' : 'local_storage'
  );

  useEffect(() => {
    if (profile) localStorage.setItem('farmer_profile', JSON.stringify(profile));
    else localStorage.removeItem('farmer_profile');
  }, [profile]);

  useEffect(() => {
    if (authRole) localStorage.setItem('krishi_auth_role', authRole);
    else localStorage.removeItem('krishi_auth_role');
  }, [authRole]);

  useEffect(() => {
    localStorage.setItem('farmer_activities', JSON.stringify(activities));
  }, [activities]);

  const loginAsFarmer = async (profileData) => {
    const docId = getFarmerDocId(profileData);
    const enriched = { ...profileData, id: docId };
    setProfile(enriched);
    setAuthRole('farmer');

    // Async sync to Cloud Firestore
    try {
      const res = await saveFarmerProfileToFirestore(enriched);
      if (res.mode === 'firestore') {
        setCloudSyncStatus('cloud_synced');
      }
      // Record login/session activity
      await logActivityToFirestore(docId, {
        type: 'Farm Portal Login',
        note: `Farmer ${enriched.name} accessed Krishi Sakhi dashboard for ${enriched.crop} crop in ${enriched.location}.`,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Background sync error:', err);
    }
  };

  const loginAsAdmin = async (username, password) => {
    const result = await verifyAndLogAdminLogin(username, password);
    if (result.success) {
      setAuthRole('admin');
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const logout = () => {
    setAuthRole(null);
    localStorage.removeItem('krishi_auth_role');
  };

  const updateProfile = async (data) => {
    const updated = { ...(profile || {}), ...data };
    setProfile(updated);

    // Sync to Cloud Firestore in background
    try {
      await saveFarmerProfileToFirestore(updated);
    } catch (err) {
      console.warn('Profile sync failed:', err);
    }
  };

  const clearProfile = () => {
    setProfile(null);
    setActivities([]);
    setAuthRole(null);
    localStorage.removeItem('farmer_profile');
    localStorage.removeItem('farmer_activities');
    localStorage.removeItem('krishi_auth_role');
  };

  const addActivity = async (activity) => {
    const newActivity = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...activity
    };

    setActivities(prev => [newActivity, ...prev]);

    // Sync activity to Cloud Firestore in background
    try {
      const farmerId = profile ? getFarmerDocId(profile) : 'anonymous_farmer';
      await logActivityToFirestore(farmerId, newActivity);
    } catch (err) {
      console.warn('Activity sync failed:', err);
    }
  };

  const getRecentActivities = (limit = 5) => activities.slice(0, limit);

  return (
    <FarmerContext.Provider value={{ 
      profile, 
      authRole,
      setAuthRole,
      loginAsFarmer,
      loginAsAdmin,
      logout,
      updateProfile, 
      clearProfile, 
      activities, 
      addActivity, 
      getRecentActivities,
      adminCredentials: ADMIN_CREDENTIALS,
      isFirebaseConfigured,
      cloudSyncStatus
    }}>
      {children}
    </FarmerContext.Provider>
  );
};
