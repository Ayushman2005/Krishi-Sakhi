import { createContext, useContext, useState, useEffect } from 'react';

const FarmerContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
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

  const [activities, setActivities] = useState(() => {
    try {
      const saved = localStorage.getItem('farmer_activities');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    if (profile) localStorage.setItem('farmer_profile', JSON.stringify(profile));
    else localStorage.removeItem('farmer_profile');
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('farmer_activities', JSON.stringify(activities));
  }, [activities]);

  const updateProfile = (data) => setProfile(data);

  const clearProfile = () => {
    setProfile(null);
    setActivities([]);
    localStorage.removeItem('farmer_profile');
    localStorage.removeItem('farmer_activities');
  };

  const addActivity = (activity) => {
    setActivities(prev => [
      { id: Date.now(), timestamp: new Date().toISOString(), ...activity },
      ...prev
    ]);
  };

  const getRecentActivities = (limit = 5) => activities.slice(0, limit);

  return (
    <FarmerContext.Provider value={{ profile, updateProfile, clearProfile, activities, addActivity, getRecentActivities }}>
      {children}
    </FarmerContext.Provider>
  );
};
