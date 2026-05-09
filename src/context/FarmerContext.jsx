import React, { createContext, useContext, useState, useEffect } from 'react';

const FarmerContext = createContext();

export const useFarmer = () => {
  const context = useContext(FarmerContext);
  if (!context) throw new Error('useFarmer must be used within FarmerProvider');
  return context;
};

export const FarmerProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('farmer_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('farmer_activities');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (profile) localStorage.setItem('farmer_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('farmer_activities', JSON.stringify(activities));
  }, [activities]);

  const updateProfile = (data) => setProfile(data);
  
  const addActivity = (activity) => {
    setActivities(prev => [
      { id: Date.now(), timestamp: new Date().toISOString(), ...activity },
      ...prev
    ]);
  };

  const getRecentActivities = (limit = 5) => activities.slice(0, limit);

  return (
    <FarmerContext.Provider value={{ profile, updateProfile, activities, addActivity, getRecentActivities }}>
      {children}
    </FarmerContext.Provider>
  );
};
