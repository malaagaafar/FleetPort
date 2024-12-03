import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Switch } from 'react-native';
import { useState } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function PartnerScreen() {
  const [activeTab, setActiveTab] = useState('Marketplace');
  const [isCarrierModeActive, setIsCarrierModeActive] = useState(false);

    const tabConfig = [
    { id: 'Marketplace', icon: 'storefront', label: 'Market' },
    { id: 'Carriers', icon: 'local-shipping', label: 'Carriers' },
    { id: 'Partners', icon: 'people', label: 'Partners' },
    { id: 'Profile', icon: 'person', label: 'Profile' }
  ];

  // بيانات تجريبية متنوعة للعروض
  const marketplaceData = [
    {
      id: 1,
      company: 'cPORT Corporation',
      rating: 5,
      pickupDate: '20 Oct, 2024',
      pickupLocation: '858 Eglinton Ave East, ON',
      deliveryDate: '20 Oct, 2024',
      deliveryLocation: '180 Malvern St, ON',
      price: 'C$10,582',
      distance: '43km',
      vehicleType: 'Long-haul reefer truck',
    },
    {
      id: 2,
      company: 'FastFreight Ltd',
      rating: 4,
      pickupDate: '21 Oct, 2024',
      pickupLocation: '725 Queen Street West, ON',
      deliveryDate: '21 Oct, 2024',
      deliveryLocation: '445 King Street East, ON',
      price: 'C$8,750',
      distance: '35km',
      vehicleType: 'Box truck',
    },
    {
      id: 3,
      company: 'TransCargo Express',
      rating: 5,
      pickupDate: '22 Oct, 2024',
      pickupLocation: '120 Bloor Street East, ON',
      deliveryDate: '22 Oct, 2024',
      deliveryLocation: '890 Bay Street, ON',
      price: 'C$12,300',
      distance: '50km',
      vehicleType: 'Flatbed truck',
    },
    {
      id: 4,
      company: 'GTA Logistics',
      rating: 4,
      pickupDate: '23 Oct, 2024',
      pickupLocation: '300 Borough Drive, ON',
      deliveryDate: '23 Oct, 2024',
      deliveryLocation: '1 Dundas Street East, ON',
      price: 'C$9,450',
      distance: '28km',
      vehicleType: 'Container truck',
    },
    {
      id: 5,
      company: 'Ontario Express',
      rating: 5,
      pickupDate: '24 Oct, 2024',
      pickupLocation: '220 Yonge Street, ON',
      deliveryDate: '24 Oct, 2024',
      deliveryLocation: '789 Don Mills Road, ON',
      price: 'C$11,800',
      distance: '45km',
      vehicleType: 'Long-haul truck',
    }
  ];

  // بيانات الشركاء
  const partnersData = [
    {
      id: 1,
      name: 'TransCargo Express',
      type: 'Carrier',
      partnerType: 'platform',
      rating: 4.8,
      totalTrips: 156,
      lastTrip: '15 Oct, 2024',
      status: 'Active',
      verified: true,
      contactPerson: 'John Smith',
      phone: '+1 (416) 555-0123',
      email: 'contact@transcargo.com',
      preferredRoutes: ['Toronto-Montreal', 'Toronto-Ottawa'],
      vehicleTypes: ['Reefer', 'Flatbed'],
      contractStatus: 'Valid until Dec 2024',
      paymentTerms: 'Net 30',
      performance: {
        onTime: '95%',
        satisfaction: '4.8',
        reliability: '4.9'
      }
    },
    {
      id: 2,
      name: 'LogiTrade Solutions',
      type: 'Broker',
      partnerType: 'platform',
      rating: 4.9,
      totalTrips: 312,
      lastTrip: '19 Oct, 2024',
      status: 'Active',
      verified: true,
      contactPerson: 'Michael Chen',
      phone: '+1 (416) 555-8899',
      email: 'operations@logitrade.com',
      performance: {
        successfulDeals: 312,
        averageResponse: '30min',
        satisfactionRate: '98%',
        averageSavings: '12%'
      },
      specialties: ['Cross-border', 'Temperature-controlled', 'Expedited'],
      coverage: ['Canada', 'USA'],
      paymentTerms: 'Net 15',
      insuranceCoverage: 'C$5M',
      contractStatus: 'Valid until Dec 2024',
      preferredLanes: [
        'Toronto-Chicago',
        'Montreal-New York',
        'Vancouver-Seattle'
      ]
    },
    {
      id: 3,
      name: 'Custom Partner Co',
      type: 'Carrier',
      partnerType: 'custom',
      addedDate: '10 Oct, 2024',
      contactPerson: 'Sarah Johnson',
      phone: '+1 (416) 555-0456',
      email: 'contact@custompartner.com',
      notes: 'Local carrier, preferred for GTA routes',
    }
  ];

  // بيانات الناقلين المتاحين
  const availableCarriers = [
    {
      id: 1,
      name: 'Elite Transport Co',
      type: 'Carrier',
      status: 'Available',
      rating: 4.9,
      fleetSize: 12,
      vehicleTypes: ['Reefer', 'Flatbed', 'Box'],
      currentLocation: 'Toronto, ON',
      preferredRoutes: ['GTA', 'Toronto-Montreal'],
      ratePerKm: 'C$2.5',
      availability: 'Immediate',
      verificationStatus: 'Verified',
      performance: {
        completedTrips: 234,
        onTimeDelivery: '98%',
        satisfaction: 4.8
      }
    },
    // ... المزيد من الناقلين
  ];

  // حالة التحقق كناقل
  const carrierVerificationStatus = {
    status: 'pending', // 'pending' | 'verified' | 'not_verified'
    fleetSize: 5, // من بيانات الأسطول الحالية
    availableVehicles: 3,
    completedTrips: 125,
    rating: 4.7,
    // يمكن جلب هذه البيانات من حساب المستخدم
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={16}
        color="#FFD700"
      />
    ));
  };

  const renderPartnersList = () => (
    <ScrollView style={styles.listContainer}>
      <TouchableOpacity style={styles.addPartnerButton} onPress={() => {/* إضافة شريك جديد */}}>
        <MaterialIcons name="add-business" size={24} color="#007AFF" />
        <Text style={styles.addPartnerText}>Add New Partner</Text>
      </TouchableOpacity>

      {partnersData.map((partner) => (
        renderPartnerCard(partner)
      ))}
    </ScrollView>
  );

  const renderPartnerCard = (partner) => (
    <TouchableOpacity key={partner.id} style={styles.partnerCard}>
      <View style={styles.partnerHeader}>
        <View style={styles.partnerInfo}>
          <Text style={styles.partnerName}>{partner.name}</Text>
          <View style={[
            styles.partnerType,
            partner.type === 'Broker' && styles.brokerType
          ]}>
            <Text style={[
              styles.partnerTypeText,
              partner.type === 'Broker' && styles.brokerTypeText
            ]}>{partner.type}</Text>
          </View>
          {partner.partnerType === 'platform' && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.verifiedText}>Verified {partner.type}</Text>
            </View>
          )}
        </View>
        
        {partner.partnerType === 'platform' && (
          <View style={styles.statusContainer}>
            <View style={[styles.statusIndicator, 
              { backgroundColor: partner.status === 'Active' ? '#4CAF50' : '#FFA000' }]} />
            <Text style={styles.statusText}>{partner.status}</Text>
          </View>
        )}
      </View>

      {partner.partnerType === 'platform' && partner.type === 'Broker' ? (
        // عرض خاص للوسطاء
        <View style={styles.brokerPerformance}>
          <View style={styles.performanceRow}>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Successful Deals</Text>
              <Text style={styles.performanceValue}>{partner.performance.successfulDeals}</Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Avg. Response</Text>
              <Text style={styles.performanceValue}>{partner.performance.averageResponse}</Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Satisfaction</Text>
              <Text style={styles.performanceValue}>{partner.performance.satisfactionRate}</Text>
            </View>
          </View>
          <View style={styles.specialtiesContainer}>
            {partner.specialties.map((specialty, index) => (
              <View key={index} style={styles.specialtyTag}>
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : partner.partnerType === 'platform' ? (
        // عرض للناقلين المتحقق منهم
        <View style={styles.performanceContainer}>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Total Trips</Text>
            <Text style={styles.performanceValue}>{partner.totalTrips}</Text>
          </View>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>On-Time</Text>
            <Text style={styles.performanceValue}>{partner.performance.onTime}</Text>
          </View>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Rating</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{partner.rating}</Text>
              <Ionicons name="star" size={14} color="#FFD700" />
            </View>
          </View>
        </View>
      ) : (
        // عرض للشركاء المخصصين
        <View style={styles.customPartnerInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Added on:</Text>
            <Text style={styles.infoValue}>{partner.addedDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Contact:</Text>
            <Text style={styles.infoValue}>{partner.contactPerson}</Text>
          </View>
          {partner.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Notes:</Text>
              <Text style={styles.notesText}>{partner.notes}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="call-outline" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="mail-outline" size={20} color="#007AFF" />
        </TouchableOpacity>
        {partner.partnerType === 'platform' ? (
          // أيقونة العقود للشركاء المتحقق منهم
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="document-text-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
        ) : (
          // أيقونة التعديل للشركاء المخصصين
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="create-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.scheduleButton}>
          <Text style={styles.scheduleButtonText}>Schedule Trip</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderCarrierModeCard = () => (
    <View style={styles.carrierModeCard}>
      {!isCarrierModeActive ? (
        // بطاقة تفعيل وضع الناقل
        <TouchableOpacity 
          style={styles.activateCarrierMode}
          onPress={() => setIsCarrierModeActive(true)}
        >
          <View style={styles.activateHeader}>
            <MaterialIcons name="local-shipping" size={24} color="#007AFF" />
            <Text style={styles.activateTitle}>Become a Carrier</Text>
          </View>
          <Text style={styles.activateDescription}>
            Make your fleet available for other businesses. Expand your network and increase revenue.
          </Text>
          <View style={styles.benefitsList}>
            <Text style={styles.benefitItem}>• Receive direct shipping requests</Text>
            <Text style={styles.benefitItem}>• Set your own rates and availability</Text>
            <Text style={styles.benefitItem}>• Manage multiple contracts</Text>
          </View>
          <TouchableOpacity style={styles.activateButton} onPress={() => setIsCarrierModeActive(true)}>
            <Text style={styles.activateButtonText}>Activate Carrier Mode</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ) : (
        // بطاقة إدارة وضع الناقل
        <View style={styles.activeCarrierCard}>
          <View style={styles.statusHeader}>
            <View>
              <Text style={styles.statusTitle}>Carrier Status</Text>
              <View style={styles.verificationStatus}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: carrierVerificationStatus.status === 'verified' ? '#4CAF50' : '#FFA000' }
                ]} />
                <Text style={styles.statusText}>
                  {carrierVerificationStatus.status === 'verified' ? 'Verified Carrier' : 'Verification Pending'}
                </Text>
              </View>
            </View>
            <Switch
              value={isCarrierModeActive}
              onValueChange={setIsCarrierModeActive}
            />
          </View>

          <View style={styles.fleetStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Fleet Size</Text>
              <Text style={styles.statValue}>{carrierVerificationStatus.fleetSize}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Available</Text>
              <Text style={styles.statValue}>{carrierVerificationStatus.availableVehicles}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Rating</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingValue}>{carrierVerificationStatus.rating}</Text>
                <Ionicons name="star" size={14} color="#FFD700" />
              </View>
            </View>
          </View>

          <View style={styles.carrierSettings}>
            <TouchableOpacity style={styles.settingButton}>
              <Text style={styles.settingButtonText}>Set Availability</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingButton}>
              <Text style={styles.settingButtonText}>Update Rates</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingButton}>
              <Text style={styles.settingButtonText}>Manage Requests</Text>
            </TouchableOpacity>
          </View>

          {carrierVerificationStatus.status === 'pending' && (
            <View style={styles.verificationNote}>
              <Ionicons name="information-circle" size={20} color="#FFA000" />
              <Text style={styles.verificationText}>
                Your carrier verification is in progress. We'll notify you once completed.
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderMarketplaceVerificationCard = () => (
    <View style={styles.verificationCard}>
      <View style={styles.verificationHeader}>
        <MaterialIcons name="verified" size={32} color="#007AFF" />
        <Text style={styles.verificationTitle}>Become a Verified Fleet</Text>
      </View>
      <Text style={styles.verificationDescription}>
        Upgrade your account to a verified carrier and get access to:
      </Text>
      <View style={styles.benefitsList}>
        <View style={styles.benefitItem}>
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          <Text style={styles.benefitText}>Exclusive marketplace opportunities</Text>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          <Text style={styles.benefitText}>Direct contracts with major companies</Text>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          <Text style={styles.benefitText}>Priority service listing</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.verificationButton}>
        <Text style={styles.verificationButtonText}>Start Verification</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBusinessProfileCard = () => (
    <View style={styles.businessCard}>
      <View style={styles.businessHeader}>
        <MaterialIcons name="business" size={32} color="#007AFF" />
        <Text style={styles.businessTitle}>Create Business Profile</Text>
      </View>
      <Text style={styles.businessDescription}>
        Leverage your fleet management expertise to start requesting shipping services:
      </Text>
      <View style={styles.benefitsList}>
        <View style={styles.benefitItem}>
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          <Text style={styles.benefitText}>Request shipping for your clients</Text>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          <Text style={styles.benefitText}>Work with trusted carriers</Text>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          <Text style={styles.benefitText}>Integrated shipment management</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.businessButton}>
        <Text style={styles.businessButtonText}>Create Business Profile</Text>
      </TouchableOpacity>
    </View>
  );

  return (
<View style={styles.container}>
      {/* شريط التبويب */}

      <View style={styles.tabContainer}>
        {tabConfig.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
          <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* شريط الفلتر */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterText}>Filter</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      {activeTab === 'Profile' ? (
        <ScrollView style={styles.listContainer}>
          {renderCarrierModeCard()}
        </ScrollView>

      ) : activeTab === 'Marketplace' ? (
        // قائمة العروض
        <ScrollView style={styles.listContainer}>
          {renderMarketplaceVerificationCard()}
          {marketplaceData.map((item) => (
            <View key={item.id} style={styles.card}>
              {/* رأس البطاقة */}
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.companyName}>{item.company}</Text>
                  <View style={styles.ratingContainer}>
                    {renderStars(item.rating)}
                  </View>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>{item.price}</Text>
                  <Text style={styles.priceLabel}>per Load</Text>
                </View>
              </View>

              {/* تفاصيل الرحلة */}
              <View style={styles.tripDetails}>
                {/* نقطة الانطلاق */}
                <View style={styles.locationContainer}>
                  <View style={styles.dateContainer}>
                    <Text style={styles.date}>{item.pickupDate}</Text>
                  </View>
                  <View style={styles.locationInfo}>
                    <Ionicons name="location" size={20} color="#000" />
                    <Text style={styles.location}>{item.pickupLocation}</Text>
                  </View>
                </View>

                {/* نقطة الوصول */}
                <View style={styles.locationContainer}>
                  <View style={styles.dateContainer}>
                    <Text style={styles.date}>{item.deliveryDate}</Text>
                  </View>
                  <View style={styles.locationInfo}>
                    <Ionicons name="location" size={20} color="#000" />
                    <Text style={styles.location}>{item.deliveryLocation}</Text>
                  </View>
                </View>

                {/* معلومات إضافية */}
                <View style={styles.additionalInfo}>
                  <View style={styles.infoItem}>
                    <Ionicons name="navigate" size={16} color="#666" />
                    <Text style={styles.infoText}>{item.distance}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="car" size={16} color="#666" />
                    <Text style={styles.infoText}>{item.vehicleType}</Text>
                  </View>
                </View>

                {/* زر الحجز */}
                <TouchableOpacity style={styles.rideButton}>
                  <Text style={styles.rideButtonText}>Ride</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : activeTab === 'Carriers' ? (
        // قائمة الناقلين المتاحين
        <ScrollView style={styles.listContainer}>
          {renderBusinessProfileCard()}
          {availableCarriers.map((carrier) => (
            <TouchableOpacity key={carrier.id} style={styles.carrierCard}>
              <View style={styles.carrierHeader}>
                <View style={styles.carrierInfo}>
                  <Text style={styles.carrierName}>{carrier.name}</Text>
                  <View style={styles.verificationBadge}>
                    <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
                    <Text style={styles.verifiedText}>Verified Carrier</Text>
                  </View>
                </View>
                <View style={styles.availabilityTag}>
                  <Text style={styles.availabilityText}>{carrier.availability}</Text>
                </View>
              </View>

              <View style={styles.fleetInfo}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Fleet Size</Text>
                  <Text style={styles.infoValue}>{carrier.fleetSize} vehicles</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Rate/Km</Text>
                  <Text style={styles.infoValue}>{carrier.ratePerKm}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Rating</Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingValue}>{carrier.rating}</Text>
                    <Ionicons name="star" size={14} color="#FFD700" />
                  </View>
                </View>
              </View>

              <View style={styles.vehicleTypes}>
                {carrier.vehicleTypes.map((type) => (
                  <View key={type} style={styles.vehicleTag}>
                    <Text style={styles.vehicleTagText}>{type}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.performanceStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Completed Trips</Text>
                  <Text style={styles.statValue}>{carrier.performance.completedTrips}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>On-Time Delivery</Text>
                  <Text style={styles.statValue}>{carrier.performance.onTimeDelivery}</Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.viewProfileButton}>
                  <Text style={styles.buttonText}>View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.requestButton}>
                  <Text style={styles.buttonText}>Request Quote</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        renderPartnersList()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#000',
  },
  tabText: {
    fontSize: 16,
    //fontWeight: '600',
    color: '#000',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterText: {
    fontSize: 16,
    fontWeight: '500',
  },
  filterButton: {
    padding: 5,
  },
  listContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
  },
  tripDetails: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  locationContainer: {
    marginBottom: 15,
  },
  dateContainer: {
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    marginLeft: 5,
  },
  additionalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  rideButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  rideButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  addPartnerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#007AFF',
  },
  addPartnerText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  partnerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  partnerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  partnerType: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  partnerTypeText: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  performanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  performanceItem: {
    alignItems: 'center',
  },
  performanceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  performanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  quickActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    gap: 10,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  scheduleButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 5,
  },
  verifiedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 5,
  },
  customPartnerInfo: {
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notesContainer: {
    marginTop: 10,
  },
  notesLabel: {
    fontSize: 12,
    color: '#666',
  },
  notesText: {
    fontSize: 16,
    color: '#000',
  },
  carrierCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  carrierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  carrierInfo: {
    flex: 1,
  },
  carrierName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 5,
  },
  availabilityTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  availabilityText: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: '500',
  },
  fleetInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  infoItem: {
    alignItems: 'center',
  },
  vehicleTypes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  vehicleTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  vehicleTagText: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: '500',
  },
  performanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  viewProfileButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  requestButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#007AFF',
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  carrierModeCard: {
    margin: 15,
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activateCarrierMode: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#007AFF',
  },
  activateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  activateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#007AFF',
  },
  activateDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  benefitsList: {
    marginBottom: 15,
  },
  benefitItem: {
    fontSize: 14,
    color: '#444',
    marginBottom: 5,
  },
  activateButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  activeCarrierCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  verificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  fleetStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  settingButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  settingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  verificationNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  verificationText: {
    fontSize: 14,
    color: '#666',
  },
  brokerType: {
    backgroundColor: '#E1F5FE',
  },
  brokerTypeText: {
    color: '#0288D1',
  },
  brokerPerformance: {
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specialtyText: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: '500',
  },
  verificationCard: {
    margin: 15,
    marginTop: 5,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  verificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  verificationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#007AFF',
  },
  verificationDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  benefitsList: {
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 15,
    color: '#444',
    marginLeft: 10,
  },
  verificationButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  verificationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  businessCard: {
    margin: 15,
    marginTop: 5,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  businessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  businessTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#007AFF',
  },
  businessDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  businessButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  businessButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});