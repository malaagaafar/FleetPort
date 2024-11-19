const axios = require('axios');
const polyline = require('@mapbox/polyline');
const turf = require('@turf/turf');
const redis = require('../config/redis');
const config = require('../config/maps');
const logger = require('../utils/logger');

class AdvancedMapService {
  constructor() {
    this.googleMapsClient = axios.create({
      baseURL: 'https://maps.googleapis.com/maps/api',
      params: {
        key: config.googleMapsApiKey
      }
    });
  }

  async optimizeRoute(waypoints) {
    try {
      const cacheKey = `route:${this.generateWaypointsHash(waypoints)}`;
      const cachedRoute = await redis.get(cacheKey);

      if (cachedRoute) {
        return JSON.parse(cachedRoute);
      }

      const response = await this.googleMapsClient.get('/directions/json', {
        params: {
          origin: this.formatLatLng(waypoints[0]),
          destination: this.formatLatLng(waypoints[waypoints.length - 1]),
          waypoints: `optimize:true|${waypoints.slice(1, -1).map(this.formatLatLng).join('|')}`,
          mode: 'driving'
        }
      });

      const optimizedRoute = this.processDirectionsResponse(response.data);
      await redis.setex(cacheKey, 3600, JSON.stringify(optimizedRoute)); // تخزين مؤقت لمدة ساعة

      return optimizedRoute;
    } catch (error) {
      logger.error('Route optimization failed:', error);
      throw new Error('فشل في تحسين المسار');
    }
  }

  async calculateETA(origin, destination, departureTime) {
    try {
      const response = await this.googleMapsClient.get('/distancematrix/json', {
        params: {
          origins: this.formatLatLng(origin),
          destinations: this.formatLatLng(destination),
          departure_time: departureTime.getTime() / 1000,
          traffic_model: 'best_guess'
        }
      });

      return this.processDistanceMatrixResponse(response.data);
    } catch (error) {
      logger.error('ETA calculation failed:', error);
      throw new Error('فشل في حساب وقت الوصول المتوقع');
    }
  }

  async createGeofence(center, radius, options = {}) {
    try {
      const circle = turf.circle(
        [center.longitude, center.latitude],
        radius / 1000, // تحويل إلى كيلومترات
        {
          steps: 64,
          units: 'kilometers',
          properties: options
        }
      );

      return {
        type: 'geofence',
        geometry: circle.geometry,
        properties: {
          ...options,
          radius,
          center
        }
      };
    } catch (error) {
      logger.error('Geofence creation failed:', error);
      throw new Error('فشل في إنشاء السياج الجغرافي');
    }
  }

  async checkGeofenceViolation(position, geofence) {
    const point = turf.point([position.longitude, position.latitude]);
    const polygon = turf.polygon(geofence.geometry.coordinates);

    return {
      isInside: turf.booleanPointInPolygon(point, polygon),
      distance: turf.distance(
        point,
        turf.center(polygon),
        { units: 'meters' }
      )
    };
  }

  async reverseGeocode(location) {
    try {
      const cacheKey = `geocode:${location.latitude},${location.longitude}`;
      const cachedResult = await redis.get(cacheKey);

      if (cachedResult) {
        return JSON.parse(cachedResult);
      }

      const response = await this.googleMapsClient.get('/geocode/json', {
        params: {
          latlng: `${location.latitude},${location.longitude}`,
          language: 'ar'
        }
      });

      const result = this.processGeocodeResponse(response.data);
      await redis.setex(cacheKey, 86400, JSON.stringify(result)); // تخزين مؤقت لمدة يوم

      return result;
    } catch (error) {
      logger.error('Reverse geocoding failed:', error);
      throw new Error('فشل في تحديد العنوان');
    }
  }

  async calculateTrafficDensity(bounds) {
    try {
      const response = await this.googleMapsClient.get('/trafficinfo/json', {
        params: {
          bounds: `${bounds.south},${bounds.west}|${bounds.north},${bounds.east}`
        }
      });

      return this.processTrafficResponse(response.data);
    } catch (error) {
      logger.error('Traffic density calculation failed:', error);
      throw new Error('فشل في حساب كثافة المرور');
    }
  }

  processDirectionsResponse(data) {
    if (!data.routes || !data.routes.length) {
      throw new Error('لم يتم العثور على مسار');
    }

    const route = data.routes[0];
    return {
      distance: route.legs.reduce((sum, leg) => sum + leg.distance.value, 0),
      duration: route.legs.reduce((sum, leg) => sum + leg.duration.value, 0),
      polyline: route.overview_polyline.points,
      waypoints: route.legs.map(leg => ({
        location: {
          latitude: leg.start_location.lat,
          longitude: leg.start_location.lng
        },
        address: leg.start_address
      }))
    };
  }

  processDistanceMatrixResponse(data) {
    if (!data.rows || !data.rows[0].elements) {
      throw new Error('لم يتم العثور على نتائج');
    }

    const element = data.rows[0].elements[0];
    return {
      distance: element.distance.value,
      duration: element.duration.value,
      durationInTraffic: element.duration_in_traffic?.value
    };
  }

  processGeocodeResponse(data) {
    if (!data.results || !data.results.length) {
      throw new Error('لم يتم العثور على عنوان');
    }

    const result = data.results[0];
    return {
      formattedAddress: result.formatted_address,
      components: this.extractAddressComponents(result.address_components),
      placeId: result.place_id
    };
  }

  extractAddressComponents(components) {
    const result = {};
    components.forEach(component => {
      component.types.forEach(type => {
        result[type] = component.long_name;
      });
    });
    return result;
  }

  formatLatLng(location) {
    return `${location.latitude},${location.longitude}`;
  }

  generateWaypointsHash(waypoints) {
    return waypoints
      .map(wp => this.formatLatLng(wp))
      .join('|');
  }
}

module.exports = new AdvancedMapService();