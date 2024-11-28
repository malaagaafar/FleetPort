const axios = require('axios');

// Replace with your actual API token from demo.traccar.org
const API_TOKEN = 'SDBGAiEAtOZWhrZ208FrSf_Xn8vJ6i5dZ9QVonRnNEDk6CLqIC0CIQCKsJTuYixPZjwqQmKZW4v367ZojByJprZkhuNhE-Pk-nsidSI6NjM4NjIsImUiOiIyMDI0LTEyLTA0VDA1OjAwOjAwLjAwMCswMDowMCJ9';

// Function to add a new device
async function addDevice() {
  const newDevice = {
    name: 'Simulated Device 1',  // Name of the device
    uniqueId: 'SIM123456',  // Unique ID for the device
  };

  try {
    const response = await axios.post('https://demo.traccar.org/api/devices', newDevice, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Device added successfully:', response.data);
    return response.data.id;  // Returning the newly created device ID
  } catch (error) {
    console.error('Error adding device:', error);
    throw error;  // Throw error to stop further execution if the device creation fails
  }
}

// ... existing code ...
async function sendSimulatedData(deviceId) {
    const simulatedData = {
      deviceId: deviceId,  // Use the device ID we just created
      timestamp: new Date().toISOString(),  // Current timestamp
      latitude: 51.5074,  // Example latitude (London)
      longitude: -0.1278,  // Example longitude (London)
      speed: 60,  // Speed in km/h
      altitude: 50,  // Altitude in meters
      course: 180,  // Heading in degrees
    };
  
    try {
      const response = await axios.post('https://demo.traccar.org/api/positions', simulatedData, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Simulated data sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending simulated data:', error.response ? error.response.data : error.message);
    }
  }
  // ... existing code ...
  async function getDeviceData(deviceId) {
    try {
      const response = await axios.get(`https://demo.traccar.org/api/positions`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
        },
        params: {
          deviceId: deviceId,  // Pass the deviceId as a query parameter
          limit: 10,  // Limit the number of positions retrieved (for testing)
          orderBy: 'desc',  // Order by latest first
        },
      });
  
      console.log('Device position data retrieved successfully:', response.data);
      return response.data;  // Return the positions data
    } catch (error) {
      console.error('Error retrieving device data:', error.response ? error.response.data : error.message);
    }
  }
  // ... existing code ...

// Main function to orchestrate the device creation, data sending, and data retrieval
async function main() {
  try {
    //const deviceId = await addDevice();  // Add the device and get the ID
    const deviceId = 'SIM123456'
    await sendSimulatedData(deviceId);  // Send simulated data to the newly created device

    // Wait a few seconds for the data to appear and then fetch the data
    setTimeout(async () => {
      const positions = await getDeviceData(deviceId);  // Get the positions for the device
      console.log('Latest positions:', positions);
    }, 5000);  // 5 seconds delay (to ensure the data has time to be processed)
  } catch (error) {
    console.error('Error in main process:', error);
  }
}

// Execute the script
main();
