// Mock alerts data. In production this is served by the Alerts/Notification API.

export const alerts = [
  {
    id: 'alert-1',
    type: 'Price Alert',
    severity: 'positive',
    title: 'Anand Market price increased by 5%',
    detail: 'Cotton price rose from ₹7,050 to ₹7,450 per quintal in the last 3 days.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 'alert-2',
    type: 'Demand Alert',
    severity: 'positive',
    title: 'High demand detected for Cotton',
    detail: 'Anand and Vadodara markets are both reporting high buyer demand this week.',
    time: '5 hours ago',
    read: false,
  },
  {
    id: 'alert-3',
    type: 'Selling Window Alert',
    severity: 'warning',
    title: 'Recommended selling window ends in 2 days',
    detail: 'Sell your Cotton allocation before 1 June 2025 to capture the current price trend.',
    time: '1 day ago',
    read: true,
  },
  {
    id: 'alert-4',
    type: 'Weather Alert',
    severity: 'warning',
    title: 'Light rainfall expected on 31 May',
    detail: 'Plan transport and storage ahead of expected showers in Anand district.',
    time: '1 day ago',
    read: true,
  },
  {
    id: 'alert-5',
    type: 'Storage Alert',
    severity: 'neutral',
    title: 'Groundnut storage crossing 20 days',
    detail: 'Extended storage is reducing expected margin — review the Storage Planner.',
    time: '2 days ago',
    read: true,
  },
  {
    id: 'alert-6',
    type: 'Recommendation Alert',
    severity: 'neutral',
    title: 'New AI recommendation available for Wheat',
    detail: 'Selling now at Ahmedabad Market is projected to give the best net return.',
    time: '3 days ago',
    read: true,
  },
];

export const alertCategories = ['All', 'Price Alert', 'Demand Alert', 'Weather Alert', 'Storage Alert', 'Selling Window Alert', 'Recommendation Alert'];
