const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // عدد الاتصالات القصوى
  idleTimeoutMillis: 30000, // وقت انتظار الاتصال غير المستخدم
  connectionTimeoutMillis: 2000 // وقت محاولة الاتصال
});

// اختبار الاتصال
pool.on('connect', () => {
  console.log('Connected to database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool; 