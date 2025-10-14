// Water sources data based on different locations
export interface WaterSource {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number]; // [latitude, longitude]
  quality: 'safe' | 'attention' | 'critical';
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
  // Major Cities
  'San Francisco': [37.7749, -122.4194],
  'New York': [40.7128, -74.006],
  'Los Angeles': [34.0522, -118.2437],
  Chicago: [41.8781, -87.6298],
  Houston: [29.7604, -95.3698],
  Mumbai: [19.076, 72.8777],
  Delhi: [28.7041, 77.1025],
  Bangalore: [12.9716, 77.5946],
  London: [51.5074, -0.1278],
  Tokyo: [35.6762, 139.6503],
  Sydney: [-33.8688, 151.2093],
  Toronto: [43.6532, -79.3832],

  // Bangalore Neighborhoods
  Whitefield: [12.9698, 77.7499],
  'Electronic City': [12.8395, 77.677],
  Koramangala: [12.9352, 77.6245],
  Indiranagar: [12.9784, 77.6408],
  'JP Nagar': [12.9082, 77.5855],
  Jayanagar: [12.925, 77.5838],
  'BTM Layout': [12.9165, 77.6101],
  'HSR Layout': [12.9121, 77.6446],
  Marathahalli: [12.9591, 77.7012],
  'Sarjapur Road': [12.901, 77.6874],
  Hebbal: [13.0358, 77.597],
  Yelahanka: [13.1007, 77.5963],
  Banashankari: [12.925, 77.5482],
  Rajajinagar: [12.9916, 77.5522],
  Malleshwaram: [13.0033, 77.5703],
  Yeshwanthpur: [13.028, 77.538],
  Peenya: [13.0297, 77.5154],
  Bommanahalli: [12.91, 77.63],
  Mahadevapura: [12.993, 77.6976],
  Dasarahalli: [13.0418, 77.5152],
  'RR Nagar': [12.92, 77.52],
  Kengeri: [12.9077, 77.4854],
  Hennur: [13.0366, 77.6412],
  Bellandur: [12.925, 77.6761],
  'MG Road': [12.975, 77.6068],
};

// Generate water sources for a given location
export const waterSourcesByLocation: Record<string, WaterSource[]> = {
  'San Francisco': [
    {
      id: 'sf-001',
      name: 'Harbor Lake',
      location: 'San Francisco',
      coordinates: [37.7749, -122.4194],
      quality: 'safe',
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
      id: 'sf-002',
      name: 'Mission Bay Reservoir',
      location: 'San Francisco',
      coordinates: [37.7699, -122.3922],
      quality: 'safe',
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
      id: 'sf-003',
      name: 'Golden Gate Park Lake',
      location: 'San Francisco',
      coordinates: [37.7694, -122.4862],
      quality: 'attention',
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
      id: 'sf-004',
      name: 'Lake Merced',
      location: 'San Francisco',
      coordinates: [37.728, -122.485],
      quality: 'safe',
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
      id: 'sf-005',
      name: 'Sutro Baths Water Source',
      location: 'San Francisco',
      coordinates: [37.7804, -122.5138],
      quality: 'attention',
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
  'New York': [
    {
      id: 'ny-001',
      name: 'Central Park Reservoir',
      location: 'New York',
      coordinates: [40.7829, -73.9654],
      quality: 'safe',
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
      id: 'ny-002',
      name: 'Jamaica Bay',
      location: 'New York',
      coordinates: [40.6195, -73.8234],
      quality: 'attention',
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
      id: 'ny-003',
      name: 'Hudson River Point',
      location: 'New York',
      coordinates: [40.7489, -73.968],
      quality: 'safe',
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
  Mumbai: [
    {
      id: 'mum-001',
      name: 'Powai Lake',
      location: 'Mumbai',
      coordinates: [19.1197, 72.9059],
      quality: 'attention',
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
      id: 'mum-002',
      name: 'Vihar Lake',
      location: 'Mumbai',
      coordinates: [19.1136, 72.9153],
      quality: 'safe',
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
      id: 'mum-003',
      name: 'Tulsi Lake',
      location: 'Mumbai',
      coordinates: [19.158, 72.8814],
      quality: 'safe',
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
      id: 'del-001',
      name: 'Yamuna River Point',
      location: 'Delhi',
      coordinates: [28.6139, 77.209],
      quality: 'attention',
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
      id: 'del-002',
      name: 'Hauz Khas Lake',
      location: 'Delhi',
      coordinates: [28.5494, 77.1925],
      quality: 'safe',
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
      id: 'blr-001',
      name: 'Bellandur Lake',
      location: 'Bangalore',
      coordinates: [12.925, 77.6761],
      quality: 'attention',
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
      id: 'blr-002',
      name: 'Ulsoor Lake',
      location: 'Bangalore',
      coordinates: [12.981, 77.622],
      quality: 'safe',
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
      id: 'blr-003',
      name: 'Sankey Tank',
      location: 'Bangalore',
      coordinates: [12.9988, 77.5632],
      quality: 'safe',
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
  // Bangalore Neighborhoods
  Whitefield: [
    {
      id: 'wf-001',
      name: 'Whitefield Lake',
      location: 'Whitefield',
      coordinates: [12.9698, 77.7499],
      quality: 'safe',
      metrics: {
        turbidity: 58,
        pH: 7.3,
        cod: 170,
        tds: 685,
        nitrogen: 17,
        phosphorus: 4.4,
      },
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'wf-002',
      name: 'ITPL Water Treatment Plant',
      location: 'Whitefield',
      coordinates: [12.985, 77.737],
      quality: 'attention',
      metrics: {
        turbidity: 110,
        pH: 6.9,
        cod: 320,
        tds: 890,
        nitrogen: 25,
        phosphorus: 6.8,
      },
      lastUpdated: new Date().toISOString(),
    },
  ],
  'Electronic City': [
    {
      id: 'ec-001',
      name: 'Electronic City Lake',
      location: 'Electronic City',
      coordinates: [12.8395, 77.677],
      quality: 'safe',
      metrics: {
        turbidity: 65,
        pH: 7.2,
        cod: 185,
        tds: 710,
        nitrogen: 19,
        phosphorus: 4.7,
      },
      lastUpdated: new Date().toISOString(),
    },
  ],
  Koramangala: [
    {
      id: 'kr-001',
      name: 'Koramangala Valley',
      location: 'Koramangala',
      coordinates: [12.9352, 77.6245],
      quality: 'attention',
      metrics: {
        turbidity: 125,
        pH: 6.8,
        cod: 355,
        tds: 925,
        nitrogen: 29,
        phosphorus: 7.2,
      },
      lastUpdated: new Date().toISOString(),
    },
  ],
  'HSR Layout': [
    {
      id: 'hsr-001',
      name: 'HSR Lake',
      location: 'HSR Layout',
      coordinates: [12.9121, 77.6446],
      quality: 'safe',
      metrics: {
        turbidity: 52,
        pH: 7.5,
        cod: 160,
        tds: 665,
        nitrogen: 16,
        phosphorus: 4.2,
      },
      lastUpdated: new Date().toISOString(),
    },
  ],
  Bellandur: [
    {
      id: 'bel-001',
      name: 'Bellandur Lake',
      location: 'Bellandur',
      coordinates: [12.925, 77.6761],
      quality: 'attention',
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
      id: 'bel-002',
      name: 'Kaikondrahalli Lake',
      location: 'Bellandur',
      coordinates: [12.93, 77.66],
      quality: 'safe',
      metrics: {
        turbidity: 70,
        pH: 7.1,
        cod: 190,
        tds: 720,
        nitrogen: 20,
        phosphorus: 5.0,
      },
      lastUpdated: new Date().toISOString(),
    },
  ],
  Marathahalli: [
    {
      id: 'mar-001',
      name: 'Marathahalli Water Source',
      location: 'Marathahalli',
      coordinates: [12.9591, 77.7012],
      quality: 'safe',
      metrics: {
        turbidity: 62,
        pH: 7.4,
        cod: 175,
        tds: 695,
        nitrogen: 18,
        phosphorus: 4.6,
      },
      lastUpdated: new Date().toISOString(),
    },
  ],
  Indiranagar: [
    {
      id: 'ind-001',
      name: 'Indiranagar Tank',
      location: 'Indiranagar',
      coordinates: [12.9784, 77.6408],
      quality: 'safe',
      metrics: {
        turbidity: 48,
        pH: 7.6,
        cod: 155,
        tds: 650,
        nitrogen: 15,
        phosphorus: 4.0,
      },
      lastUpdated: new Date().toISOString(),
    },
  ],
  Hebbal: [
    {
      id: 'heb-001',
      name: 'Hebbal Lake',
      location: 'Hebbal',
      coordinates: [13.0358, 77.597],
      quality: 'attention',
      metrics: {
        turbidity: 135,
        pH: 6.7,
        cod: 385,
        tds: 950,
        nitrogen: 31,
        phosphorus: 8.0,
      },
      lastUpdated: new Date().toISOString(),
    },
  ],
};

// Helper function to get water sources by location
export const getWaterSourcesByLocation = (location: string): WaterSource[] => {
  // If exact location has water sources, return them
  if (waterSourcesByLocation[location]) {
    return waterSourcesByLocation[location];
  }

  // Fallback: If it's a Bangalore neighborhood without specific data,
  // return all Bangalore water sources
  const bangaloreNeighborhoods = [
    'Whitefield',
    'Electronic City',
    'Koramangala',
    'Indiranagar',
    'JP Nagar',
    'Jayanagar',
    'BTM Layout',
    'HSR Layout',
    'Marathahalli',
    'Sarjapur Road',
    'Hebbal',
    'Yelahanka',
    'Banashankari',
    'Rajajinagar',
    'Malleshwaram',
    'Yeshwanthpur',
    'Peenya',
    'Bommanahalli',
    'Mahadevapura',
    'Dasarahalli',
    'RR Nagar',
    'Kengeri',
    'Hennur',
    'Bellandur',
    'MG Road',
  ];

  if (bangaloreNeighborhoods.includes(location)) {
    // Return all Bangalore area water sources
    return Object.entries(waterSourcesByLocation)
      .filter(
        ([key]) => bangaloreNeighborhoods.includes(key) || key === 'Bangalore'
      )
      .flatMap(([_, sources]) => sources);
  }

  return [];
};

// Helper function to get all water sources
export const getAllWaterSources = (): WaterSource[] => {
  return Object.values(waterSourcesByLocation).flat();
};
