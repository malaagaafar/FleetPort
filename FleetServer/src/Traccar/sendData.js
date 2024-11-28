const simulatedData = {
    deviceId: 123,  // The ID of the device you just added (replace with the actual ID)
    timestamp: new Date().toISOString(),
    latitude: 51.5074,
    longitude: -0.1278,
    speed: 60,
    altitude: 50,
    course: 180,
  };
  
  axios.post('https://demo.traccar.org/api/positions', simulatedData, {
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      console.log('Simulated data sent successfully');
    })
    .catch(error => {
      console.error('Error sending simulated data', error);
    });
  