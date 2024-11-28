const { QueryTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class DeviceCatalogService {
    async getAvailableDevices({ 
        category = 'primary_devices',
        type = null,
        trailerType = null,
        page = 1, 
        limit = 10
    }) {
        try {
            console.log('=== Service Start ===');
            console.log('Input params:', { category, type, trailerType, page, limit });

            let query = `
                SELECT 
                    id,
                    name,
                    type,
                    trailer_type,
                    price,
                    image_url as "imageUrl",
                    description,
                    specifications,
                    installation_fee as "installationFee",
                    is_active as "isActive",
                    category
                FROM ${category === 'primary_devices' ? 'primary_devices' : 'sensors'}
                WHERE is_active = true 
                AND type = '${type}'
                AND '${trailerType}' = ANY(trailer_type)            `;

            const replacements = {};

            if (category === 'sensors' && type != null) {
                query = `
                SELECT 
                    id,
                    name,
                    type,
                    price,
                    image_url as "imageUrl",
                    description,
                    specifications,
                    installation_fee as "installationFee",
                    is_active as "isActive",
                    category
                FROM ${category === 'primary_devices' ? 'primary_devices' : 'sensors'}
                WHERE is_active = true 
                AND type = '${type}'`; // استخدام template literals
                //replacements.type = type; // إضافة القيمة إلى replacements
            }
            else if (category === 'sensors') {
                query = `
                SELECT 
                    id,
                    name,
                    type,
                    price,
                    image_url as "imageUrl",
                    description,
                    specifications,
                    installation_fee as "installationFee",
                    is_active as "isActive",
                    category
                FROM ${category === 'primary_devices' ? 'primary_devices' : 'sensors'}
                WHERE is_active = true 
                `;
            }

            query += ` ORDER BY id ASC LIMIT :limit OFFSET :offset`;
            replacements.limit = parseInt(limit);
            replacements.offset = (parseInt(page) - 1) * parseInt(limit);

            console.log('Final SQL:', query);
            console.log('Replacements:', replacements);

            const devices = await sequelize.query(query, {
                replacements,
                type: QueryTypes.SELECT
            });

            console.log('Devices found:', devices.length);

            const countQuery = `
                SELECT COUNT(*) as count
                FROM ${category === 'primary_devices' ? 'primary_devices' : 'sensors'}
                WHERE is_active = true
                ${type && category === 'sensors' ? ' AND type = :type' : ''}
            `;

            const [countResult] = await sequelize.query(countQuery, {
                replacements: type ? { type } : {},
                type: QueryTypes.SELECT
            });

            const result = {
                devices,
                pagination: {
                    total: parseInt(countResult.count),
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(parseInt(countResult.count) / limit)
                }
            };

            console.log('=== Service End ===');
            return result;

        } catch (error) {
            console.error('=== Service Error ===');
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            
            throw new Error(`خطأ في جلب البيانات: ${error.message}`);
        }
    }
}

module.exports = new DeviceCatalogService();