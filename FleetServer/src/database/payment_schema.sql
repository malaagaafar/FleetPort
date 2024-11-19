CREATE TYPE payment_status AS ENUM (
    'pending',      -- في انتظار الدفع
    'processing',   -- جاري المعالجة
    'completed',    -- مكتمل
    'failed',       -- فشل
    'refunded'      -- مسترجع
);

CREATE TABLE payment_transactions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'SAR',
    payment_method VARCHAR(50),
    payment_gateway VARCHAR(50),
    gateway_transaction_id VARCHAR(100),
    status payment_status DEFAULT 'pending',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);