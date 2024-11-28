const axios = require('axios');

// Replace with your actual API token
const API_TOKEN = 'SDBGAiEAtOZWhrZ208FrSf_Xn8vJ6i5dZ9QVonRnNEDk6CLqIC0CIQCKsJTuYixPZjwqQmKZW4v367ZojByJprZkhuNhE-Pk-nsidSI6NjM4NjIsImUiOiIyMDI0LTEyLTA0VDA1OjAwOjAwLjAwMCswMDowMCJ9';

// Device data (adjust fields as necessary)
const newDevice = {
  name: 'Simulated Device 1',  // Name of the device
  uniqueId: 'SIM123456',  // Unique ID for the device, it can be any string
  deviceType: 'generic',  // Device type, e.g., "generic", or a specific tracker type
  // You can also include additional fields like:
  // "status": "active",
  // "model": "GPS Tracker",
};

// Send the POST request to add the device
axios.post('https://demo.traccar.org/api/devices', newDevice, {
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
})
  .then(response => {
    console.log('Device added successfully:', response.data);
  })
  .catch(error => {
    console.error('Error adding device:', error);
  });
