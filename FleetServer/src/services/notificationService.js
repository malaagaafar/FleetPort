const { sequelize } = require('../config/database');

class NotificationService {
    static async createNotification({
        userId,
        partnerId = null,
        type,
        title,
        message,
        data = {}
    }) {
        try {
            const query = `
                INSERT INTO notifications (
                    user_id,
                    partner_id,
                    type,
                    title,
                    message,
                    data,
                    created_at
                ) VALUES (
                    :userId,
                    :partnerId,
                    :type,
                    :title,
                    :message,
                    :data::jsonb,
                    CURRENT_TIMESTAMP
                ) RETURNING id
            `;

            const [result] = await sequelize.query(query, {
                replacements: {
                    userId,
                    partnerId,
                    type,
                    title,
                    message,
                    data: JSON.stringify(data)
                },
                type: sequelize.QueryTypes.INSERT
            });

            return result[0].id;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }

    static async sendTripNotification(tripId, action, userId) {
        try {
            // جلب معلومات الرحلة
            const [trip] = await sequelize.query(
                `SELECT 
                    t.*,
                    v.name as vehicle_name,
                    d.first_name || ' ' || d.last_name as driver_name
                FROM trips t
                LEFT JOIN vehicles v ON t.vehicle_id = v.id
                LEFT JOIN drivers d ON t.driver_id = d.id
                WHERE t.id = :tripId`,
                {
                    replacements: { tripId },
                    type: sequelize.QueryTypes.SELECT
                }
            );

            if (!trip) {
                throw new Error('Trip not found');
            }

            let title, message;
            switch (action) {
                case 'created':
                    title = 'رحلة جديدة';
                    message = `تم إنشاء رحلة جديدة "${trip.title}" مع السائق ${trip.driver_name}`;
                    break;
                case 'started':
                    title = 'بدء الرحلة';
                    message = `بدأت الرحلة "${trip.title}" مع المركبة ${trip.vehicle_name}`;
                    break;
                case 'completed':
                    title = 'اكتمال الرحلة';
                    message = `اكتملت الرحلة "${trip.title}" بنجاح`;
                    break;
                case 'cancelled':
                    title = 'إلغاء الرحلة';
                    message = `تم إلغاء الرحلة "${trip.title}"`;
                    break;
                default:
                    title = 'تحديث الرحلة';
                    message = `تم تحديث الرحلة "${trip.title}"`;
            }

            await this.createNotification({
                userId: userId || trip.user_id,
                type: 'trip',
                title,
                message,
                data: {
                    tripId,
                    tripTitle: trip.title,
                    action,
                    vehicleName: trip.vehicle_name,
                    driverName: trip.driver_name
                }
            });

        } catch (error) {
            console.error('Error sending trip notification:', error);
            throw error;
        }
    }

    static async getUserNotifications(userId, options = {}) {
        try {
            const {
                limit = 20,
                offset = 0,
                unreadOnly = false
            } = options;

            const query = `
                SELECT *
                FROM notifications
                WHERE user_id = :userId
                ${unreadOnly ? 'AND is_read = false' : ''}
                ORDER BY created_at DESC
                LIMIT :limit OFFSET :offset
            `;

            const notifications = await sequelize.query(query, {
                replacements: { userId, limit, offset },
                type: sequelize.QueryTypes.SELECT
            });

            return notifications;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    }

    static async markAsRead(notificationId, userId) {
        try {
            const query = `
                UPDATE notifications
                SET 
                    is_read = true,
                    read_at = CURRENT_TIMESTAMP
                WHERE id = :notificationId
                AND user_id = :userId
                RETURNING id
            `;

            const [result] = await sequelize.query(query, {
                replacements: { notificationId, userId },
                type: sequelize.QueryTypes.UPDATE
            });

            return result.length > 0;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }

    static async markAllAsRead(userId) {
        try {
            const query = `
                UPDATE notifications
                SET 
                    is_read = true,
                    read_at = CURRENT_TIMESTAMP
                WHERE user_id = :userId
                AND is_read = false
            `;

            await sequelize.query(query, {
                replacements: { userId },
                type: sequelize.QueryTypes.UPDATE
            });

            return true;
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    }
}

module.exports = NotificationService;