const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../config/database');

class PaymentService {
    async createPaymentIntent({ amount, currency = 'SAR', userId, metadata = {} }) {
        try {
            // إنشاء نية الدفع في Stripe
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // تحويل إلى أصغر وحدة عملة
                currency,
                metadata: {
                    userId,
                    ...metadata
                }
            });

            // تسجيل المعاملة في قاعدة البيانات
            const { rows: [transaction] } = await db.query(`
                INSERT INTO payment_transactions (
                    user_id,
                    amount,
                    currency,
                    payment_gateway,
                    gateway_transaction_id,
                    status,
                    metadata
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
            `, [
                userId,
                amount,
                currency,
                'stripe',
                paymentIntent.id,
                'pending',
                metadata
            ]);

            return {
                clientSecret: paymentIntent.client_secret,
                transactionId: transaction.id
            };
        } catch (error) {
            throw new Error(`خطأ في إنشاء معاملة الدفع: ${error.message}`);
        }
    }

    async handlePaymentWebhook(event) {
        try {
            const { type, data } = event;

            switch (type) {
                case 'payment_intent.succeeded':
                    await this.handleSuccessfulPayment(data.object);
                    break;
                case 'payment_intent.payment_failed':
                    await this.handleFailedPayment(data.object);
                    break;
            }
        } catch (error) {
            throw new Error(`خطأ في معالجة webhook الدفع: ${error.message}`);
        }
    }

    async handleSuccessfulPayment(paymentIntent) {
        await db.query('BEGIN');
        try {
            // تحديث حالة المعاملة
            await db.query(`
                UPDATE payment_transactions 
                SET status = 'completed', 
                    payment_method = $1,
                    updated_at = CURRENT_TIMESTAMP
                WHERE gateway_transaction_id = $2
            `, [paymentIntent.payment_method_types[0], paymentIntent.id]);

            // استكمال عملية الشراء
            const { metadata } = paymentIntent;
            if (metadata.type === 'device_purchase') {
                await this.completePurchase(metadata);
            }

            await db.query('COMMIT');
        } catch (error) {
            await db.query('ROLLBACK');
            throw error;
        }
    }
}

module.exports = new PaymentService();