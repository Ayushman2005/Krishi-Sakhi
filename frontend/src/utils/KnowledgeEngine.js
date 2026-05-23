const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const generateAdvisory = async (profile) => {
  if (!profile) return [];
  try {
    const response = await fetch(`${API_BASE_URL}/advisories?crop=${profile.crop}&location=${profile.location}`);
    if (!response.ok) throw new Error('Backend failed');
    return response.json();
  } catch (error) {
    console.error('Advisory Fetch Error:', error);

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

export const getWeather = async (location, lat = null, lon = null) => {
  try {

    let url;
    if (lat && lon) {
      url = `${API_BASE_URL}/weather/live?lat=${lat}&lon=${lon}`;
    } else {

      url = `${API_BASE_URL}/weather/live?q=${encodeURIComponent(location)}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather API failed');
    const data = await response.json();

    return {
      main: { temp: data.temperature, humidity: data.humidity },
      wind: { speed: data.wind_speed },
      weather: [{ description: data.description, main: data.description.includes('Rain') ? 'Rain' : data.description.includes('Clear') ? 'Clear' : 'Clouds' }],
      name: data.location,
      isSimulated: data.source?.includes('Simulation'),
    };
  } catch (error) {
    console.error("Weather proxy error:", error);
    return { error: "Sync Error" };
  }
};
