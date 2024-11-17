-- إنشاء قاعدة البيانات
CREATE DATABASE fleet_management;

-- استخدام قاعدة البيانات
\c fleet_management;

-- إنشاء الامتدادات المطلوبة
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- إنشاء الأنواع المخصصة
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'dispatcher', 'driver', 'user');
CREATE TYPE vehicle_status AS ENUM ('active', 'maintenance', 'inactive', 'reserved');
CREATE TYPE driver_status AS ENUM ('active', 'inactive', 'suspended', 'on_trip');
CREATE TYPE trip_status AS ENUM ('planned', 'in_progress', 'completed', 'cancelled');
CREATE TYPE maintenance_type AS ENUM ('routine', 'repair', 'inspection', 'emergency');
CREATE TYPE fuel_type AS ENUM ('petrol', 'diesel', 'electric', 'hybrid');
CREATE TYPE notification_type AS ENUM ('alert', 'warning', 'info', 'maintenance', 'system');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'critical');

-- جدول الشركات
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    commercial_register VARCHAR(50) UNIQUE,
    tax_number VARCHAR(50) UNIQUE,
    address TEXT,
    city VARCHAR(50),
    country VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(100),
    logo_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active',
    subscription_plan VARCHAR(50),
    subscription_status VARCHAR(20),
    subscription_expiry DATE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- جدول المستخدمين
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role user_role NOT NULL,
    phone VARCHAR(20),
    profile_image VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active',
    last_login TIMESTAMP WITH TIME ZONE,
    permissions JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- جدول المركبات
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    vin VARCHAR(17) UNIQUE,
    make VARCHAR(50),
    model VARCHAR(50),
    year INTEGER,
    color VARCHAR(30),
    fuel_type fuel_type,
    status vehicle_status DEFAULT 'active',
    current_location GEOMETRY(Point, 4326),
    current_driver_id INTEGER,
    mileage DECIMAL(10, 2) DEFAULT 0,
    fuel_capacity DECIMAL(8, 2),
    current_fuel_level DECIMAL(8, 2),
    insurance_number VARCHAR(50),
    insurance_expiry DATE,
    registration_expiry DATE,
    last_maintenance_date TIMESTAMP WITH TIME ZONE,
    next_maintenance_date TIMESTAMP WITH TIME ZONE,
    specifications JSONB DEFAULT '{}',
    documents JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- جدول السائقين
CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_type VARCHAR(20),
    license_expiry DATE,
    identity_number VARCHAR(50) UNIQUE,
    date_of_birth DATE,
    nationality VARCHAR(50),
    address TEXT,
    emergency_contact JSONB,
    status driver_status DEFAULT 'active',
    current_vehicle_id INTEGER REFERENCES vehicles(id),
    current_location GEOMETRY(Point, 4326),
    rating DECIMAL(3,2),
    total_trips INTEGER DEFAULT 0,
    total_distance DECIMAL(10,2) DEFAULT 0,
    certifications JSONB DEFAULT '[]',
    documents JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- جدول الرحلات
CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    vehicle_id INTEGER REFERENCES vehicles(id),
    driver_id INTEGER REFERENCES drivers(id),
    start_location GEOMETRY(Point, 4326),
    end_location GEOMETRY(Point, 4326),
    start_address TEXT,
    end_address TEXT,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    status trip_status DEFAULT 'planned',
    distance DECIMAL(10,2),
    duration INTEGER, -- بالدقائق
    fuel_consumption DECIMAL(8,2),
    route GEOMETRY(LineString, 4326),
    waypoints JSONB DEFAULT '[]',
    cost DECIMAL(10,2),
    notes TEXT,
    customer_info JSONB,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- سأكمل بقية الجداول في الرد التالي نظراً لحدود الحجم...
-- ... يتبع من الجداول السابقة

-- جدول سجلات الصيانة
CREATE TABLE maintenance_records (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    vehicle_id INTEGER REFERENCES vehicles(id),
    type maintenance_type NOT NULL,
    description TEXT,
    odometer_reading INTEGER,
    cost DECIMAL(10,2),
    performed_by VARCHAR(100),
    service_provider VARCHAR(100),
    scheduled_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,
    next_service_date TIMESTAMP WITH TIME ZONE,
    parts_used JSONB DEFAULT '[]',
    labor_hours DECIMAL(5,2),
    invoice_number VARCHAR(50),
    warranty_info JSONB,
    documents JSONB DEFAULT '[]',
    notes TEXT,
    status VARCHAR(20) DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- جدول سجلات الوقود
CREATE TABLE fuel_records (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    vehicle_id INTEGER REFERENCES vehicles(id),
    driver_id INTEGER REFERENCES drivers(id),
    fuel_type fuel_type NOT NULL,
    quantity DECIMAL(8,2) NOT NULL,
    cost_per_unit DECIMAL(6,2),
    total_cost DECIMAL(10,2),
    odometer_reading INTEGER,
    location GEOMETRY(Point, 4326),
    station_name VARCHAR(100),
    invoice_number VARCHAR(50),
    payment_method VARCHAR(50),
    full_tank BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- جدول بيانات المستشعرات
CREATE TABLE sensor_data (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    vehicle_id INTEGER REFERENCES vehicles(id),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    location GEOMETRY(Point, 4326),
    speed DECIMAL(5,2),
    heading DECIMAL(5,2),
    acceleration DECIMAL(5,2),
    engine_rpm INTEGER,
    engine_temperature DECIMAL(5,2),
    fuel_level DECIMAL(5,2),
    battery_voltage DECIMAL(5,2),
    tire_pressure JSONB,
    diagnostic_codes JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- جدول الإشعارات
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    recipient_id INTEGER REFERENCES users(id),
    priority priority_level DEFAULT 'medium',
    related_type VARCHAR(50),
    related_id INTEGER,
    read_at TIMESTAMP WITH TIME ZONE,
    data JSONB DEFAULT '{}',
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- جدول التقارير
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    parameters JSONB DEFAULT '{}',
    schedule JSONB,
    format VARCHAR(20) DEFAULT 'pdf',
    recipients JSONB DEFAULT '[]',
    last_generated TIMESTAMP WITH TIME ZONE,
    file_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active',
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- جدول قطع الغيار
CREATE TABLE parts (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    part_number VARCHAR(50) UNIQUE,
    description TEXT,
    category VARCHAR(50),
    manufacturer VARCHAR(100),
    quantity INTEGER DEFAULT 0,
    min_quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2),
    location VARCHAR(100),
    supplier_info JSONB,
    vehicle_compatibility JSONB DEFAULT '[]',
    images JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- جدول المهام
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    priority priority_level DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'pending',
    assigned_to INTEGER REFERENCES users(id),
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    related_type VARCHAR(50),
    related_id INTEGER,
    location GEOMETRY(Point, 4326),
    attachments JSONB DEFAULT '[]',
    notes JSONB DEFAULT '[]',
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- جدول الجداول الزمنية
CREATE TABLE schedules (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    recurring_pattern JSONB,
    assigned_to INTEGER REFERENCES users(id),
    vehicle_id INTEGER REFERENCES vehicles(id),
    driver_id INTEGER REFERENCES drivers(id),
    location GEOMETRY(Point, 4326),
    status VARCHAR(20) DEFAULT 'active',
    notifications JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء الفهارس
CREATE INDEX idx_vehicles_company ON vehicles(company_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_drivers_company ON drivers(company_id);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_trips_company ON trips(company_id);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_dates ON trips(start_time, end_time);
CREATE INDEX idx_maintenance_company ON maintenance_records(company_id);
CREATE INDEX idx_maintenance_vehicle ON maintenance_records(vehicle_id);
CREATE INDEX idx_fuel_company ON fuel_records(company_id);
CREATE INDEX idx_fuel_vehicle ON fuel_records(vehicle_id);
CREATE INDEX idx_sensor_vehicle ON sensor_data(vehicle_id);
CREATE INDEX idx_sensor_timestamp ON sensor_data(timestamp);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_schedules_dates ON schedules(start_date, end_date);

-- إنشاء Spatial Indexes
CREATE INDEX idx_vehicles_location ON vehicles USING GIST (current_location);
CREATE INDEX idx_drivers_location ON drivers USING GIST (current_location);
CREATE INDEX idx_trips_start_location ON trips USING GIST (start_location);
CREATE INDEX idx_trips_end_location ON trips USING GIST (end_location);
CREATE INDEX idx_trips_route ON trips USING GIST (route);
CREATE INDEX idx_sensor_location ON sensor_data USING GIST (location);
