// Water sources data based on different locations
export interface WaterSource {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number]; // [latitude, longitude]
  quality: "safe" | "attention" | "critical";
  metrics: {
    turbidity: number; // NTU
    pH: number;
    cod: number; // mg/L
    tds: number; // mg/L
    nitrogen: number; // mg/L
    phosphorus: number; // mg/L
  };
  lastUpdated: string;
}

// Location coordinates for different cities/regions
export const locationCoordinates: Record<string, [number, number]> = {
  "San Francisco": [37.7749, -122.4194],
  "New York": [40.7128, -74.0060],
  "Los Angeles": [34.0522, -118.2437],
  "Chicago": [41.8781, -87.6298],
  "Houston": [29.7604, -95.3698],
  "Mumbai": [19.0760, 72.8777],
  "Delhi": [28.7041, 77.1025],
  "Bangalore": [12.9716, 77.5946],
  "London": [51.5074, -0.1278],
  "Tokyo": [35.6762, 139.6503],
  "Sydney": [-33.8688, 151.2093],
  "Toronto": [43.6532, -79.3832],
};

// Generate water sources for a given location
export const waterSourcesByLocation: Record<string, WaterSource[]> = {
  "San Francisco": [
    {
      id: "sf-001",
      name: "Harbor Lake",
      location: "San Francisco",
      coordinates: [37.7749, -122.4194],
      quality: "safe",
      metrics: {
        turbidity: 64,
        pH: 7.2,
        cod: 180,
        tds: 700,
        nitrogen: 18,
        phosphorus: 4.2,
      },
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "sf-002",
      name: "Mission Bay Reservoir",
      location: "San Francisco",
      coordinates: [37.7699, -122.3922],
      quality: "safe",
      metrics: {
        turbidity: 45,
        pH: 7.5,
        cod: 120,
        tds: 580,
        nitrogen: 15,
        phosphorus: 3.8,
      },
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "sf-003",
      name: "Golden Gate Park Lake",
      location: "San Francisco",
      coordinates: [37.7694, -122.4862],
      quality: "attention",
      metrics: {
        turbidity: 120,
        pH: 6.8,
        cod: 350,
        tds: 920,
        nitrogen: 28,
        phosphorus: 7.5,
      },
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "sf-004",
      name: "Lake Merced",
      location: "San Francisco",
      coordinates: [37.7280, -122.4850],
      quality: "safe",
      metrics: {
        turbidity: 38,
        pH: 7.3,
        cod: 95,
        tds: 520,
        nitrogen: 12,
        phosphorus: 3.2,
      },
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "sf-005",
      name: "Sutro Baths Water Source",
      location: "San Francisco",
      coordinates: [37.7804, -122.5138],
      quality: "attention",
      metrics: {
        turbidity: 95,
        pH: 7.0,
        cod: 280,
        tds: 850,
        nitrogen: 22,
        phosphorus: 6.0,
      },
      lastUpdated: new Date().toISOString(),
    },
  ],
  "New York": [
    {
      id: "ny-001",
      name: "Central Park Reservoir",
      location: "New York",
      coordinates: [40.7829, -73.9654],
      quality: "safe",
      metrics: {
        turbidity: 52,
        pH: 7.4,
        cod: 150,
        tds: 620,
        nitrogen: 16,
        phosphorus: 4.0,
      },
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "ny-002",
      name: "Jamaica Bay",
      location: "New York",
      coordinates: [40.6195, -73.8234],
      quality: "attention",
      metrics: {
        turbidity: 140,
        pH: 6.9,
        cod: 380,
        tds: 980,
        nitrogen: 32,
        phosphorus: 8.2,
      },
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "ny-003",
      name: "Hudson River Point",
      location: "New York",
      coordinates: [40.7489, -73.9680],
      quality: "safe",
      metrics: {
        turbidity: 48,
        pH: 7.6,
        cod: 110,
        tds: 550,
        nitrogen: 14,
        phosphorus: 3.5,
      },
      lastUpdated: new Date().toISOString(),
    },
  ],
  "Mumbai": [
    {
      id: "mum-001",
      name: "Powai Lake",
      location: "Mumbai",
      coordinates: [19.1197, 72.9059],
      quality: "attention",
      metrics: {
        turbidity: 180,
        pH: 6.7,
        cod: 420,
        tds: 1050,
        nitrogen: 38,
        phosphorus: 9.5,
      },
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "mum-002",
      name: "Vihar Lake",
      location: "Mumbai",
      coordinates: [19.1136, 72.9153],
      quality: "safe",
      metrics: {
        turbidity: 68,
        pH: 7.1,
        cod: 195,
        tds: 720,
        nitrogen: 19,
        phosphorus: 4.8,
      },
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "mum-003",
      name: "Tulsi Lake",
      location: "Mumbai",
      coordinates: [19.1580, 72.8814],
      quality: "safe",
      metrics: {
        turbidity: 55,
        pH: 7.3,
        cod: 165,
        tds: 680,
        nitrogen: 17,
        phosphorus: 4.3,
      },
      lastUpdated: new Date().toISOString(),
    },
  ],
  Delhi: [
    {
      id: "del-001",
      name: "Yamuna River Point",
      location: "Delhi",
      coordinates: [28.6139, 77.2090],
      quality: "attention",
      metrics: {
        turbidity: 220,
        pH: 6.5,
        cod: 520,
        tds: 1200,
        nitrogen: 45,
        phosphorus: 11.2,
      },
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "del-002",
      name: "Hauz Khas Lake",
      location: "Delhi",
      coordinates: [28.5494, 77.1925],
      quality: "safe",
      metrics: {
        turbidity: 72,
        pH: 7.2,
        cod: 210,
        tds: 750,
        nitrogen: 20,
        phosphorus: 5.2,
      },
      lastUpdated: new Date().toISOString(),
    },
  ],
  Bangalore: [
    {
      id: "blr-001",
      name: "Bellandur Lake",
      location: "Bangalore",
      coordinates: [12.9250, 77.6761],
      quality: "attention",
      metrics: {
        turbidity: 195,
        pH: 6.6,
        cod: 480,
        tds: 1100,
        nitrogen: 42,
        phosphorus: 10.5,
      },
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "blr-002",
      name: "Ulsoor Lake",
      location: "Bangalore",
      coordinates: [12.9810, 77.6220],
      quality: "safe",
      metrics: {
        turbidity: 60,
        pH: 7.4,
        cod: 175,
        tds: 690,
        nitrogen: 18,
        phosphorus: 4.5,
      },
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "blr-003",
      name: "Sankey Tank",
      location: "Bangalore",
      coordinates: [12.9988, 77.5632],
      quality: "safe",
      metrics: {
        turbidity: 42,
        pH: 7.6,
        cod: 135,
        tds: 610,
        nitrogen: 15,
        phosphorus: 3.9,
      },
      lastUpdated: new Date().toISOString(),
    },
  ],
};

// Helper function to get water sources by location
export const getWaterSourcesByLocation = (
  location: string
): WaterSource[] => {
  return waterSourcesByLocation[location] || [];
};

// Helper function to get all water sources
export const getAllWaterSources = (): WaterSource[] => {
  return Object.values(waterSourcesByLocation).flat();
};

