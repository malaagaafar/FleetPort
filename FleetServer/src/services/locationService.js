const axios = require('axios');

class LocationService {
    async getAddressFromCoordinates(latitude, longitude) {
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
            , {
                headers: {
                    'User-Agent': 'FleetServer/1.0'
                }
            });

            if (response.data) {
                const address = response.data.address;
                const parts = [];

                if (address.city || address.town || address.village) {
                    parts.push(address.city || address.town || address.village);
                }
                if (address.suburb) {
                    parts.push(address.suburb);
                }
                if (address.road) {
                    parts.push(address.road);
                }
                if (address.neighbourhood) {
                    parts.push(address.neighbourhood);
                }

                return parts.join('، ') || 'عنوان غير معروف';
            }
            return 'عنوان غير معروف';
        } catch (error) {
            console.error('Error getting address:', error);
            return 'عنوان غير معروف';
        }
    }
}

module.exports = new LocationService(); 