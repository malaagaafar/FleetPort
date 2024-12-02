// src/controllers/driverController.js
const Driver = require('../models/Driver');
const FleetDriverAccount = require('../models/FleetDriverAccount');
const bcrypt = require('bcrypt');
const { generateDriverUsername } = require('../utils/generators');
const { sequelize } = require('../config/database');
const { processImageFromUri } = require('../utils/uploadManager');
const { QueryTypes } = require('sequelize');


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
    }
};

module.exports = driverController;