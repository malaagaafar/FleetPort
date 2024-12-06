-- إنشاء قاعدة البيانات
CREATE DATABASE fleet_system;

-- استخدام قاعدة البيانات
\c fleet_system

-- جدول الأجهزة
CREATE TABLE devices (
    id INTEGER PRIMARY KEY,  -- نفس ID من Traccar
    name VARCHAR(255),
    unique_id VARCHAR(255) UNIQUE,
    status VARCHAR(50),
    disabled BOOLEAN DEFAULT false,
    last_update TIMESTAMP,
    position_id INTEGER,
    group_id INTEGER,
    phone VARCHAR(255),
    model VARCHAR(255),
    contact VARCHAR(255),
    category VARCHAR(255),
    attributes JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول المواقع
CREATE TABLE positions (
    id INTEGER PRIMARY KEY,  -- نفس ID من Traccar
    device_id INTEGER REFERENCES devices(id),
    protocol VARCHAR(255),
    device_time TIMESTAMP,
    fix_time TIMESTAMP,
    server_time TIMESTAMP,
    outdated BOOLEAN DEFAULT false,
    valid BOOLEAN DEFAULT true,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    altitude DOUBLE PRECISION,
    speed DOUBLE PRECISION,
    course DOUBLE PRECISION,
    address TEXT,
    accuracy DOUBLE PRECISION,
    network JSONB,
    geofence_ids INTEGER[],
    attributes JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء المؤشرات
CREATE INDEX idx_positions_device_id ON positions(device_id);
CREATE INDEX idx_positions_device_time ON positions(device_time);
CREATE INDEX idx_devices_unique_id ON devices(unique_id);
CREATE INDEX idx_positions_location ON positions USING gist (
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
);

-- دالة لتحديث updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- trigger لتحديث updated_at في جدول devices
CREATE TRIGGER update_devices_updated_at
    BEFORE UPDATE ON devices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 