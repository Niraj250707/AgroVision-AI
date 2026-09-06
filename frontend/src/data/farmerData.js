// Mock farmer/profile data. In production this comes from the Auth/Farmer API.
export const currentFarmer = {
  id: 'farmer-001',
  name: 'Ramesh Patel',
  role: 'Farmer',
  village: 'Anand',
  district: 'Anand',
  state: 'Gujarat',
  location: 'Anand, Gujarat',
  phone: '+91 98XXX XX412',
  language: 'Gujarati',
  farmSizeAcres: 6.5,
  joinedOn: '2024-01-12',
  preferredUnits: 'Quintal (kg)',
  avatarInitials: 'RP',
};

export const weatherToday = {
  date: '29 May 2025',
  tempC: 32,
  condition: 'Partly Cloudy',
  humidity: 58,
  windKmph: 12,
};

export const farmInfo = {
  totalLandAcres: 6.5,
  irrigatedAcres: 5.2,
  soilType: 'Black Cotton Soil',
  primaryCrops: ['Cotton', 'Groundnut', 'Wheat'],
};
