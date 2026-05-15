const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const generateAdvisory = async (profile) => {
  if (!profile) return [];
  try {
    const response = await fetch(`${API_BASE_URL}/advisories?crop=${profile.crop}&location=${profile.location}`);
    if (!response.ok) throw new Error('Backend failed');
    return await response.ok ? response.json() : [];
  } catch (error) {
    console.error('Advisory Fetch Error:', error);
    // Fallback to basic logic if backend is down
    return [
      {
        id: 'fallback-1',
        type: 'weather',
        title: 'Local Weather Advisory',
        content: 'Unable to reach backend. Please check your internet connection.',
        priority: 'medium',
        icon: 'CloudRain'
      }
    ];
  }
};

export const getAIResponse = async (query, profile, activities) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: query, profile, activities })
    });
    
    if (!response.ok) throw new Error('Chat API failed');
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('AI Response Error:', error);
    return "I'm having trouble connecting to my brain right now. Please try again later.";
  }
};

export const getMarketTrends = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/market-trends`);
    return await response.json();
  } catch (error) {
    console.error('Market Trends Error:', error);
    return [];
  }
};

export const getWeather = async (location) => {
  try {
    const response = await fetch(`${API_BASE_URL}/weather/live?q=${encodeURIComponent(location)}`);
    if (!response.ok) throw new Error('Weather API failed');
    const data = await response.json();
    
    // Map backend response back to the format Dashboard expects if needed
    // The backend already returns temperature, humidity, etc.
    // Dashboard uses weatherData.main.temp, weatherData.weather[0].description, etc.
    // So let's normalize it for the Dashboard component.
    
    if (data.source === "Simulation (Missing/Failed API Key)") {
      // If it's simulated, we should still provide the nested structure the Dashboard expects
      return {
        main: { temp: data.temperature, humidity: data.humidity },
        wind: { speed: data.wind_speed },
        weather: [{ description: data.description, main: 'Clouds' }],
        name: data.location,
        isSimulated: true
      };
    }
    
    // If it's real data from OpenWeather via backend, it might already have the nested structure
    // But our backend live_weather function flattens it. Let's re-nest it for compatibility.
    return {
      main: { temp: data.temperature, humidity: data.humidity },
      wind: { speed: data.wind_speed },
      weather: [{ description: data.description, main: 'Clouds' }], // Simplified
      name: data.location
    };
  } catch (error) {
    console.error("Weather proxy error:", error);
    return { error: "Sync Error" };
  }
};
