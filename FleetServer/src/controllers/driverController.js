// src/controllers/driverController.js
const Driver = require('../models/Driver');
const FleetDriverAccount = require('../models/FleetDriverAccount');
const bcrypt = require('bcrypt');
const { generateDriverUsername } = require('../utils/generators');
const { sequelize } = require('../config/database');
const { processImageFromUri } = require('../utils/uploadManager');
const { QueryTypes } = require('sequelize');
const jwt = require('jsonwebtoken');


const driverController = {
    // إنشاء سائق شركة جديد
    createCompanyDriver: async (req, res) => {
        try {
            console.log('Received data:', req.body);

            const userId = req.body.userId;
            if (!userId) {
                return res.status(400).json({ message: 'userId is required' });
            }

            const {
                firstName, lastName, idNumber, phone, email,
                birthDate, licenseNumber, licenseType, licenseExpiry,
                licenseIssueDate, experienceYears, address, notes,
                username, password
            } = req.body;

            // التحقق من البيانات المطلوبة
            if (!firstName || !lastName || !idNumber || !phone || !licenseNumber || !password) {
                return res.status(400).json({ message: 'جميع الحقول المطلوبة يجب ملؤها' });
            }

            //let profileImageUrl = null;
            /*if (profile_image) {
                try {
                    const processedImage = await processImageFromUri(profile_image);
                    profileImageUrl = processedImage.url;
                } catch (imageError) {
                    console.error('Error processing profile image:', imageError);
                }
            }*/

            // إنشاء اسم مستخدم إذا لم يتم توفيره
            const finalUsername = username || generateDriverUsername(firstName, lastName, idNumber);

            // تحضير بيانات السائق
            const driverData = {
                userId: userId,
                driverType: 'company',
                firstName: firstName,
                lastName: lastName,
                idNumber: idNumber,
                birthDate: birthDate,
                phone: phone,
                email: email,
                address: address,
                licenseNumber: licenseNumber,
                licenseType: licenseType,
                licenseExpiry: licenseExpiry,
                licenseIssueDate: licenseIssueDate,
                experienceYears: experienceYears,
                approvalStatus: 'approved',
                employmentStatus: 'employed',
                hireDate: new Date(),
                notes: notes,
                status: 'inactive',
                //profileImage: profileImageUrl
            };

            // إنشاء السائق في قاعدة البيانات
            const driver = await Driver.create(driverData);

            // إنشاء حساب للسائق
            const hashedPassword = await bcrypt.hash(password, 10);
            const driverAccount = await FleetDriverAccount.create({
                driverId: driver.id,
                username: finalUsername,
                passwordHash: hashedPassword,
                status: 'active'
            });

            res.status(201).json({
                message: 'تم إنشاء السائق بنجاح',
                driver: {
                    firstName: driver.firstName,
                    lastName: driver.lastName,
                    status: driver.status,
                    username: finalUsername
                }
            });

        } catch (error) {
            console.error('Error creating company driver:', error);
            
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({
                    message: 'رقم الهوية أو اسم المستخدم مستخدم بالفعل'
                });
            }

            res.status(500).json({
                message: 'حدث خطأ أثناء إنشاء السائق',
                error: error.message
            });
        }
    },

    // الحصول على قائمة سائقي الشركة
    /*getCompanyDrivers: async (req, res) => {
        try {
            const drivers = await sequelize.query(`
                SELECT 
                    d.id,
                    d.first_name,
                    d.last_name,
                    d.phone,
                    d.email,
                    d.status,
                    d.driver_type,
                    d.profile_image,
                    a.username,
                    a.status AS account_status
                FROM drivers d
                LEFT JOIN fleet_driver_accounts a ON d.id = a.driver_id
                WHERE d.driver_type = 'company'
                ORDER BY d.id DESC
            `, {
                type: QueryTypes.SELECT
            });

            console.log('Fetched drivers:', drivers); // للتحقق من البيانات
            
            if (!driver.length) {
              return res.status(404).json({ message: 'السائق غير موجود' });
            }
            // تنسيق البيانات قبل إرسالها
            const formattedDrivers = drivers.map(driver => ({
                id: driver.id,
                firstName: driver.first_name,
                lastName: driver.last_name,
                phone: driver.phone,
                email: driver.email,
                status: driver.status,
                driverType: driver.driver_type,
                profileImage: driver.profile_image,
                username: driver.username,
                accountStatus: driver.account_status
            }));

            return res.status(200).json({
                success: true,
                data: formattedDrivers,
                total: formattedDrivers.length,
                message: 'تم جلب السائقين بنجاح'
            });

        } catch (error) {
            console.error('Error details:', error); // للتحقق من تفاصيل الخطأ
            return res.status(500).json({
                success: false,
                message: 'حدث خطأ أثناء جلب السائقين',
                error: error.message,
                data: []
            });
        }
    },*/
    getCompanyDrivers: async (req, res) => {
    const userId = req.query.userId; // الحصول على userId من استعلام الطلب

  try {
    const drivers = await Driver.findAll({
      where: {
        user_id: userId // تصفية المركبات بناءً على userId
      }
    });
    res.status(200).json(drivers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    // الحصول على بيانات سائق محدد
    getCompanyDriver: async (req, res) => {
        try {
            const userId = req.query.userId;
            const driverId = req.params.id;

            if (!userId) {
                return res.status(400).json({ message: 'userId is required' });
            }

            const driver = await sequelize.query(`
                SELECT d.*, a.username, a.status AS account_status, a.last_login
                FROM drivers d
                LEFT JOIN fleet_driver_accounts a ON d.id = a.driver_id
                WHERE d.id = :driverId AND d.user_id = :userId AND d.driver_type = 'company'
            `, {
                type: QueryTypes.SELECT,
                replacements: { driverId, userId }
            });

            if (!driver.length) {
                return res.status(404).json({ message: 'السائق غير موجود' });
            }

            res.json(driver[0]); // لأن الاستعلام يرجع مصفوفة
        } catch (error) {
            console.error('Error fetching company driver:', error);
            res.status(500).json({
                message: 'حدث خطأ أثناء جلب بيانات السائق',
                error: error.message
            });
        }
    },

    // تحديث بيانات سائق
    updateCompanyDriver: async (req, res) => {
        try {
            const userId = req.query.userId;
            if (!userId) {
                return res.status(400).json({ message: 'userId is required' });
            }

            const driver = await Driver.findOne({
                where: {
                    id: req.params.id,
                    user_id: userId,
                    driver_type: 'company'
                }
            });

            if (!driver) {
                return res.status(404).json({ message: 'السائق غير موجود' });
            }

            // تحديث بيانات السائق
            await driver.update(req.body);

            res.json({
                message: 'تم تحديث بيانات السائق بنجاح',
                driver
            });
        } catch (error) {
            console.error('Error updating company driver:', error);
            res.status(500).json({
                message: 'حدث خطأ أثناء تحديث بيانات السائق',
                error: error.message
            });
        }
    },

    // حذف سائق
    deleteCompanyDriver: async (req, res) => {
        try {
            const userId = req.query.userId;
            if (!userId) {
                return res.status(400).json({ message: 'userId is required' });
            }

            const driver = await Driver.findOne({
                where: {
                    id: req.params.id,
                    user_id: userId,
                    driver_type: 'company'
                }
            });

            if (!driver) {
                return res.status(404).json({ message: 'السائق غير موجود' });
            }

            await driver.destroy();

            res.json({ message: 'تم حذف السائق بنجاح' });
        } catch (error) {
            console.error('Error deleting company driver:', error);
            res.status(500).json({
                message: 'حدث خطأ أثناء حذف السائق',
                error: error.message
            });
        }
    },

    // تحديث حالة السائق
    updateCompanyDriverStatus: async (req, res) => {
        try {
            const userId = req.query.userId;
            if (!userId) {
                return res.status(400).json({ message: 'userId is required' });
            }

            const { status } = req.body; // يجب أن يكون status إما 'active' أو 'inactive'
            const driver = await Driver.findOne({
                where: {
                    id: req.params.id,
                    user_id: userId,
                    driver_type: 'company'
                }
            });

            if (!driver) {
                return res.status(404).json({ message: 'السائق غير موجود' });
            }

            // تحديث حالة السائق
            await driver.update({ status });

            res.json({
                message: 'تم تحديث حالة السائق بنجاح',
                driver: {
                    id: driver.id,
                    status: driver.status
                }
            });
        } catch (error) {
            console.error('Error updating driver status:', error);
            res.status(500).json({
                message: 'حدث خطأ أثناء تحديث حالة السائق',
                error: error.message
            });
        }
    },

    getDriversForAssignment: async (req, res) => {
        try {
            const { userId } = req.query;
            
            const query = `
                SELECT 
                    d.id,
                    d.first_name,
                    d.last_name,
                    d.phone,
                    d.email,
                    d.status,
                    d.profile_image,
                    (
                        SELECT COUNT(dva.id) 
                        FROM drivers_vehicle_assignments dva 
                        WHERE dva.driver_id = d.id 
                        AND dva.is_primary = true
                        AND dva.status = 'active'
                        AND (dva.end_date IS NULL OR dva.end_date > CURRENT_TIMESTAMP)
                    ) as is_primary_elsewhere
                FROM drivers d
                WHERE d.user_id = :userId 
                ORDER BY d.created_at DESC
            `;

            const drivers = await sequelize.query(query, {
                replacements: { userId },
                type: sequelize.QueryTypes.SELECT
            });

            return res.json({
                success: true,
                drivers: drivers.map(d => ({
                    ...d,
                    canBePrimary: d.is_primary_elsewhere === 0
                }))
            });

        } catch (error) {
            console.error('Error fetching drivers for assignment:', error);
            return res.status(500).json({
                success: false,
                message: 'حدث خطأ أثناء جلب السائقين',
                error: error.message
            });
        }
    },

    // تسجيل دخول السائق
    loginDriver: async (req, res) => {
        const { username, password } = req.body;
        
        try {
            console.log('Received password:', password);
            
            const [account] = await sequelize.query(`
                SELECT 
                    da.id,
                    da.driver_id,
                    da.username,
                    da.password_hash as password_hash,
                    da.status as account_status,
                    d.first_name,
                    d.last_name,
                    d.current_vehicle_id,
                    d.status,
                    d.profile_image
                FROM fleet_driver_accounts da
                JOIN drivers d ON d.id = da.driver_id
                WHERE da.username = :username 
                AND da.status = 'active'
            `, {
                replacements: { username },
                type: sequelize.QueryTypes.SELECT
            });

            console.log('Found account:', account);
            console.log('Stored hash:', account?.password_hash);

            if (!account) {
                return res.status(401).json({
                    success: false,
                    message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
                });
            }

            const isValidPassword = await bcrypt.compare(password, account.password_hash);
            console.log('Password comparison result:', isValidPassword);

            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
                });
            }

            // تحديث آخر تسجيل دخول
            await sequelize.query(`
                UPDATE fleet_driver_accounts 
                SET last_login = CURRENT_TIMESTAMP 
                WHERE id = :accountId
            `, {
                replacements: { accountId: account.id }
            });

            const token = jwt.sign(
                { 
                    id: account.driver_id,
                    accountId: account.id 
                },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                driver: {
                    id: account.driver_id,
                    name: `${account.first_name} ${account.last_name}`,
                    username: account.username,
                    currentVehicleId: account.current_vehicle_id,
                    status: account.status,
                    profileImage: account.profile_image
                },
                token
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'حدث خطأ في السيرفر'
            });
        }
    },

    // تسجيل دخول السائق إلى مركبة
    vehicleLogin: async (req, res) => {
        const client = await sequelize.getQueryInterface().sequelize.transaction();
        
        try {
            const { driverId, vehicleId, location } = req.body;

            const [assignment] = await sequelize.query(`
                SELECT * FROM drivers_vehicle_assignments
                WHERE driver_id = :driverId 
                AND vehicle_id = :vehicleId 
                AND status = 'active'
                AND (end_date IS NULL OR end_date > CURRENT_TIMESTAMP)
            `, {
                replacements: { driverId, vehicleId },
                type: sequelize.QueryTypes.SELECT,
                transaction: client
            });

            if (!assignment) {
                await client.rollback();
                return res.status(403).json({
                    success: false,
                    message: 'You are not authorized to use this vehicle'
                });
            }

            // تحديث المركبة الحالية والموقع
            await sequelize.query(`
                UPDATE drivers
                SET current_vehicle_id = :vehicleId,
                    current_location = ST_GeomFromText(:point),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = :driverId
            `, {
                replacements: { 
                    driverId, 
                    vehicleId,
                    point: location ? `POINT(${location.longitude} ${location.latitude})` : null
                },
                transaction: client
            });

            await client.commit();
            res.json({
                success: true,
                message: 'Logged in to vehicle successfully'
            });

        } catch (error) {
            await client.rollback();
            console.error('Vehicle login error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    // تسجيل خروج السائق من المركبة
    vehicleLogout: async (req, res) => {
        const client = await sequelize.getQueryInterface().sequelize.transaction();
        
        try {
            const { driverId, location } = req.body;

            await sequelize.query(`
                UPDATE drivers
                SET current_vehicle_id = NULL,
                    current_location = ST_GeomFromText(:point),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = :driverId
            `, {
                replacements: { 
                    driverId,
                    point: location ? `POINT(${location.longitude} ${location.latitude})` : null
                },
                transaction: client
            });

            await client.commit();
            res.json({
                success: true,
                message: 'Logged out of vehicle successfully'
            });

        } catch (error) {
            await client.rollback();
            console.error('Vehicle logout error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    // جلب بيانات الصفحة الرئيسية (مسار جديد)
    getHomeData: async (req, res) => {
        try {
            const driverId = req.query.driverId; // من middleware المصادقة
            console.log(driverId);
            // جلب بيانات السائق المحدثة
            const [driver] = await sequelize.query(`
                SELECT 
                    d.id,
                    d.first_name,
                    d.last_name,
                    d.current_vehicle_id,
                    d.status,
                    d.profile_image,
                    da.username
                FROM drivers d
                JOIN fleet_driver_accounts da ON da.driver_id = d.id
                WHERE d.id = :driverId
            `, {
                replacements: { driverId },
                type: sequelize.QueryTypes.SELECT
            });

            // جلب المركبات المرتبطة
            const [assignedVehicles] = await sequelize.query(`
                SELECT 
                    v.id,
                    v.plate_number,
                    v.make,
                    v.model,
                    v.vehicle_image,
                    dva.is_primary,
                    dva.assignment_order,
                    dva.status as assignment_status,
                    dva.start_date,
                    dva.end_date
                FROM drivers_vehicle_assignments dva
                JOIN vehicles v ON v.id = dva.vehicle_id
                WHERE dva.driver_id = :driverId
                AND dva.status = 'active'
                AND (dva.end_date IS NULL OR dva.end_date > CURRENT_TIMESTAMP)
                ORDER BY dva.is_primary DESC, dva.assignment_order ASC
            `, {
                replacements: { driverId },
                type: sequelize.QueryTypes.SELECT
            });

            res.json({
                success: true,
                driver: {
                    id: driver.id,
                    name: `${driver.first_name} ${driver.last_name}`,
                    username: driver.username,
                    currentVehicleId: driver.current_vehicle_id,
                    status: driver.status,
                    profileImage: driver.profile_image
                },
                assignedVehicles: assignedVehicles || [],
                theme: {
                    primary: '#007bff',
                    secondary: '#6c757d',
                    background: '#f8f9fa',
                    text: '#212529',
                    success: '#28a745',
                    danger: '#dc3545',
                    warning: '#ffc107',
                    info: '#17a2b8'
                }
            });

        } catch (error) {
            console.error('Error fetching home data:', error);
            res.status(500).json({
                success: false,
                message: 'حدث خطأ في جلب البيانات'
            });
        }
    }
};

module.exports = driverController;