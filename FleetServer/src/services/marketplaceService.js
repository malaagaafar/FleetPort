const MarketplaceListing = require('../models/Marketplace');
const Vehicle = require('../models/Vehicle');
const NotificationService = require('./notificationService');

class MarketplaceService {
  async createListing(listingData) {
    try {
      const listing = new MarketplaceListing({
        ...listingData,
        status: 'active'
      });

      await listing.save();
      await this.notifyRelevantCompanies(listing);
      return listing;
    } catch (error) {
      throw new Error('Failed to create marketplace listing: ' + error.message);
    }
  }

  async searchListings(filters) {
    try {
      const query = {
        status: 'active'
      };

      if (filters.type) {
        query.type = filters.type;
      }

      if (filters.location) {
        query.location = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [filters.location.longitude, filters.location.latitude]
            },
            $maxDistance: filters.radius || 50000 // 50km default radius
          }
        };
      }

      if (filters.priceRange) {
        query['price.amount'] = {
          $gte: filters.priceRange.min,
          $lte: filters.priceRange.max
        };
      }

      const listings = await MarketplaceListing.find(query)
        .populate('company', 'name email phone')
        .sort('-createdAt');

      return listings;
    } catch (error) {
      throw new Error('Failed to search listings: ' + error.message);
    }
  }

  async matchVehicleToListings(vehicleId) {
    try {
      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }

      const matchingListings = await MarketplaceListing.find({
        status: 'active',
        'requirements.vehicleType': vehicle.type,
        'requirements.minCapacity': { $lte: vehicle.capacity }
      });

      return matchingListings;
    } catch (error) {
      throw new Error('Failed to match vehicle to listings: ' + error.message);
    }
  }

  async notifyRelevantCompanies(listing) {
    try {
      // البحث عن الشركات التي لديها مركبات تتناسب مع متطلبات القائمة
      const matchingVehicles = await Vehicle.find({
        type: listing.requirements.vehicleType,
        capacity: { $gte: listing.requirements.minCapacity }
      }).distinct('company');

      // إرسال إشعارات للشركات المطابقة
      for (const companyId of matchingVehicles) {
        await NotificationService.sendAlert({
          type: 'marketplace',
          severity: 'low',
          company: companyId,
          message: `New matching listing available: ${listing.title}`,
          metadata: {
            listingId: listing._id,
            type: listing.type,
            price: listing.price
          }
        });
      }
    } catch (error) {
      console.error('Failed to notify companies:', error);
    }
  }

  async updateListingStatus(listingId, status, metadata = {}) {
    try {
      const listing = await MarketplaceListing.findByIdAndUpdate(
        listingId,
        {
          status,
          ...metadata
        },
        { new: true }
      );

      if (!listing) {
        throw new Error('Listing not found');
      }

      // إشعار صاحب القائمة بالتحديث
      await NotificationService.sendAlert({
        type: 'marketplace',
        severity: 'low',
        company: listing.company,
        message: `Listing status updated to ${status}`,
        metadata: {
          listingId: listing._id,
          status
        }
      });

      return listing;
    } catch (error) {
      throw new Error('Failed to update listing status: ' + error.message);
    }
  }
}

module.exports = new MarketplaceService();