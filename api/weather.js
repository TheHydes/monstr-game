const API_BASE = 'https://api.weatherapi.com/v1';

export default async function handler(req, res) {
  const apiKey = process.env.WEATHER_API_KEY;
  const { location } = req.query;
  const q = location || 'Budapest';

  if (!apiKey) {
    return res.status(500).json({ error: 'WEATHER_API_KEY is not set on the server' });
  }

  try {
    const url = `${API_BASE}/current.json?key=${encodeURIComponent(
      apiKey
    )}&q=${encodeURIComponent(q)}&aqi=no`;

    const response = await fetch(url);
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `WeatherAPI error: ${response.status} ${response.statusText}` });
    }

    const data = await response.json();
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(data);
  } catch (err) {
    console.error('Weather proxy error:', err);
    return res.status(500).json({ error: 'Internal weather proxy error' });
  }
}
