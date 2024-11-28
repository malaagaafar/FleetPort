const axios = require('axios');

// Replace with your actual API token
const API_TOKEN = 'RzBFAiBRLX2KIkqzFPgO-upMIL2nvqKRsiHfDI2Q7VmkE1HxxAIhAPQVqkU43zSH5YhVGfOXOve6tkVAPm56w_aICIcawZoKeyJ1Ijo2Mzg2MiwiZSI6IjIwMjUtMTItMDRUMDU6MDA6MDAuMDAwKzAwOjAwIn0';

// Example of getting device data from Traccar
axios.get('https://demo.traccar.org/api/devices', {
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`
  }
})
.then(response => {
  console.log('Device Data:', response.data);
})
.catch(error => {
  console.error('Error fetching data:', error);
});
