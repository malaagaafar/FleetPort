CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- حذف الجدول القديم إذا كان موجوداً
--DROP TABLE IF EXISTS password_reset_tokens;
--DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    business_name VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    last_login TIMESTAMP WITH TIME ZONE,
    profile_image VARCHAR(255),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE EXTENSION IF NOT EXISTS btree_gist;  -- إضافة هذا الامتداد

-- الحالات التشغيلية والإدارية للمركبة
CREATE TYPE vehicle_status AS ENUM (
    -- الحالات التشغيلية (تُحدث تلقائياً)
    'on_trip',       -- في رحلة حالياً
    'active',            -- متصل ومتاح
    'parked',        -- متوقف في منطقة وقوف
    'inactive',           -- غير متصل
    'maintenance',   -- في الصيانة

    -- الحالات الإدارية (يتم تعيينها يدوياً)
    'temp_inactive', -- موقوف مؤقتاً
    'retired',       -- خارج الخدمة نهائياً
    'out_of_service',  -- خارج الخدمة
    'reserved'      -- محجوز
);

-- أنواع الحمولات
CREATE TYPE cargo_type AS ENUM (
    'general',          -- بضائع عامة
    'refrigerated',     -- مبردة
    'hazardous',       -- خطرة
    'liquid',          -- سوائل
    'bulk',            -- سائبة
    'heavy',           -- ثقيلة
    'fragile',         -- قابلة للكسر
    'livestock',       -- مواشي
    'vehicles',        -- مركبات
    'equipment'        -- معدات
);

CREATE TYPE maintenance_type AS ENUM (
    'oil_change',          -- تغيير الزيت
    'tire_service',        -- خدمة الإطارات
    'brake_service',       -- صيانة الفرامل
    'battery_service',     -- خدمة البطارية
    'engine_service',      -- صيانة المحرك
    'transmission',        -- صيانة ناقل الحركة
    'cooling_system',      -- نظام التبريد
    'fuel_system',         -- نظام الوقود
    'electrical',          -- النظام الكهربائي
    'inspection',          -- فحص عام
    'filter_change',       -- تغيير الفلاتر
    'alignment',           -- ضبط الزوايا
    'other'               -- أخرى
);
CREATE TYPE fuel_type AS ENUM ('petrol', 'diesel', 'electric', 'hybrid');
CREATE TYPE notification_type AS ENUM ('alert', 'warning', 'info', 'maintenance', 'system');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'critical');


------------------------------------------------------------------------------------
-- Sign-up/Auth
-- جدول المستخدمين
-------------------------------------------------------------------
-- cPORTManager App
-- جدول المستخدمين (مدراء الأساطيل)
--------------------------------------------------------
-- cPORTDriver App
-- جدول حسابات دخول السائقين التابعين لأسطول (يضاف من قبل مدير الأسطول)
-- في مساحة السائقين
-- جدول رموز إعادة تعيين كلمة المرور لسائقي الأسطول
-- في مساحة السائقين
-------------------------------------------
-- جدول حسابات السائقين المستقلين (للتسجيل المباشر على تطبيق السائق)
-- في مساحة السائقين
-- جدول طلبات التوظيف للسائقين المستقلين
-- في مساحة السائقين
-- جدول رموز إعادة تعيين كلمة المرور للسائقين المستقلين
-- في مساحة السائقين
-------------------------------------------------------------------
-- cPORTPartner App
-- جدول حسابات الشركاء (للدخول على تطبيق الشركاء)
CREATE TYPE vehicle_type AS ENUM (
    'truck',            -- شاحنة
    'van',             -- فان
    'pickup',          -- بيك أب
    'refrigerated',    -- مبرد
    'tanker',          -- صهريج
    'trailer'          -- مقطورة
);
-- جدول المركبات
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,  -- تم تغييرها من INTEGER إلى UUID
    type vehicle_type NOT NULL,
    make VARCHAR(50) NOT NULL,           -- الشركة المصنعة
    model VARCHAR(50) NOT NULL,          -- الموديل
    year INTEGER NOT NULL,               -- سنة الصنع
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    vin VARCHAR(50) UNIQUE,             -- رقم الهيكل
    registration_number VARCHAR(50),     -- رقم التسجيل
    registration_expiry DATE,
    insurance_number VARCHAR(50),
    insurance_expiry DATE,
    status vehicle_status DEFAULT 'inactive',
    -- معلومات تقنية
    max_load_weight DECIMAL(10,2),      -- أقصى وزن حمولة (كجم)
    fuel_tank_capacity INTEGER,         -- سعة خزان الوقود (لتر)
    current_odometer INTEGER DEFAULT 0, -- عداد المسافات الحالي
    -- معلومات إضافية
    specifications JSONB DEFAULT '{}',   -- مواصفات إضافية
    documents JSONB DEFAULT '[]',        -- روابط المستندات
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE partner_accounts (
    id UUID PRIMARY KEY,
    business_name VARCHAR(100) NOT NULL,         -- اسم المنشأة التجارية
    contact_name VARCHAR(100) NOT NULL,          -- اسم الشخص المسؤول
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',         -- active, inactive, suspended
    business_type VARCHAR(50),                   -- نوع النشاط التجاري
    commercial_record VARCHAR(50),               -- السجل التجاري
    tax_number VARCHAR(50),                      -- الرقم الضريبي
    address TEXT,
    last_login TIMESTAMP WITH TIME ZONE,
    device_token VARCHAR(255),                   -- للإشعارات
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- جدول الرحلات المعروضة من الشركاء
CREATE TABLE partner_trip_offers (
    id SERIAL PRIMARY KEY,
    partner_id UUID REFERENCES partner_accounts(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    pickup_location GEOMETRY(Point, 4326),
    delivery_location GEOMETRY(Point, 4326),
    pickup_address TEXT,
    delivery_address TEXT,
    required_vehicle_type VARCHAR(50),           -- نوع المركبة المطلوب
    cargo_type VARCHAR(50),                      -- نوع البضاعة
    cargo_weight DECIMAL(10,2),                  -- وزن البضاعة
    cargo_volume DECIMAL(10,2),                  -- حجم البضاعة
    price_offer DECIMAL(10,2),                   -- السعر المعروض
    pickup_date TIMESTAMP WITH TIME ZONE,
    delivery_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'open',           -- open, assigned, completed, cancelled
    assigned_vehicle_id INTEGER REFERENCES vehicles(id),
    assigned_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- جدول طلبات استئجار المركبات من الشركاء

-- جدول رموز إعادة تعيين كلمة المرور للشركاء
CREATE TABLE partner_password_reset_tokens (
    id SERIAL PRIMARY KEY,
    partner_id UUID REFERENCES partner_accounts(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
------------------------------------------------------------------------------------
-- Entities
-------------------------------------------------------------------
-- cPORTManager App
------------------------------------
-- Devices
-- الأنواع المعرفة
-- أنواع المركبات

CREATE TYPE primary_device_type AS ENUM (
    'teltonika_fmb920',
    'teltonika_fmb130',
    'concox_gt06n',
    'concox_x3'
);
CREATE TYPE sensor_type AS ENUM (
    'temperature',
    'door',
    'fuel',
    'weight',
    'camera',
    'humidity'
);
CREATE TYPE device_status AS ENUM (
    'new',              -- جديد
    'in_stock',         -- في المخزن
    'assigned',         -- معين لمركبة
    'faulty',          -- معطل
    'maintenance',      -- في الصيانة
    'retired'          -- متقاعد
);
CREATE TYPE assignment_status AS ENUM (
    'pending_installation',    -- في انتظار التركيب الفعلي
	'pending_setup',        -- في انتظار إعداد Traccar
    'setup_failed',         -- فشل الإعداد في Traccar
    'pending_connection',   -- تم الإعداد وفي انتظار اتصال الجهاز
    'active',              -- متصل ويعمل
    'removed'              -- تم إزالة التعيين
    'installation_verified',   -- تم التحقق من التركيب
    'receiving_data',         -- يستقبل بيانات
    'connection_lost',        -- فقد الاتصال
    'inactive'                -- غير نشط
);
-- كتالوج الأجهزة المتاحة للشراء
CREATE TABLE primary_devices (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type primary_device_type NOT NULL,
    model VARCHAR(50) NOT NULL,
    manufacturer VARCHAR(100),
    description TEXT,
    supported_sensors sensor_type[] DEFAULT '{}',
    specifications JSONB DEFAULT '{}',
    price DECIMAL(10,2) NOT NULL,
    installation_fee DECIMAL(10,2),
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    installation_guide_url VARCHAR(255),
    installation_video_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- كتالوج المستشعرات
CREATE TABLE sensors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type sensor_type NOT NULL,
    model VARCHAR(50) NOT NULL,
    manufacturer VARCHAR(100),
    description TEXT,
    specifications JSONB DEFAULT '{}',
    price DECIMAL(10,2) NOT NULL,
    installation_fee DECIMAL(10,2),
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- الأجهزة المشتراة
CREATE TABLE purchased_primary_devices (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    device_id INTEGER REFERENCES primary_devices(id),
    serial_number VARCHAR(50) UNIQUE NOT NULL,
    imei VARCHAR(50) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    status device_status DEFAULT 'new',
    warranty_start DATE,
    warranty_end DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- المستشعرات المشتراة
CREATE TABLE purchased_sensors (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    sensor_id INTEGER REFERENCES sensors(id),
    serial_number VARCHAR(50) UNIQUE NOT NULL,
    status device_status DEFAULT 'new',
    warranty_start DATE,
    warranty_end DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- تعديل جدول تعيين الأجهزة
CREATE TABLE device_vehicle_assignments (
    id SERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES purchased_primary_devices(id),
    vehicle_id INTEGER REFERENCES vehicles(id),
    traccar_id INTEGER UNIQUE,               -- معرف Traccar (يمكن أن يكون NULL في البداية)
    status assignment_status DEFAULT 'pending_installation',
    installation_verified_at TIMESTAMP WITH TIME ZONE,  -- وقت التحقق من التركيب
    first_data_received_at TIMESTAMP WITH TIME ZONE,    -- وقت استلام أول بيانات
    last_connection TIMESTAMP WITH TIME ZONE,           -- آخر اتصال
    deactivated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- إضافة جدول للتنبيهات/الإشعارات الخاصة بالتركيب
CREATE TABLE installation_notifications (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER REFERENCES device_vehicle_assignments(id),
    type VARCHAR(50) NOT NULL,               -- نوع التنبيه
    message TEXT NOT NULL,                   -- رسالة التنبيه
    read_at TIMESTAMP WITH TIME ZONE,        -- وقت قراءة التنبيه
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- تعيين المستشعرات للأجهزة (النسخة المبسطة)
CREATE TABLE sensor_device_assignments (
    id SERIAL PRIMARY KEY,
    sensor_id INTEGER REFERENCES purchased_sensors(id),
    device_assignment_id INTEGER REFERENCES device_vehicle_assignments(id),
    sensor_name VARCHAR(50) NOT NULL,        -- اسم وصفي (مثل: cargo_temp)
    attribute_key VARCHAR(50) NOT NULL,      -- المفتاح في Traccar (مثل: temp1)
    description TEXT,                        -- وصف موقع/وظيفة المستشعر
    status assignment_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- سجل محاولات الإعداد
CREATE TABLE device_setup_logs (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER REFERENCES device_vehicle_assignments(id),
    attempt_number INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL,
    error_message TEXT,
    traccar_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- سجل صيانة الأجهزة
CREATE TABLE device_maintenance_logs (
    id SERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES purchased_primary_devices(id),
    maintenance_type VARCHAR(50) NOT NULL,
    description TEXT,
    cost DECIMAL(10,2),
    performed_by VARCHAR(100),
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    next_maintenance_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- إضافة نوع جديد لحالة صحة الجهاز
CREATE TYPE health_status AS ENUM (
    'healthy',           -- الجهاز يعمل بشكل طبيعي
    'warning',           -- هناك تحذيرات تحتاج للمراقبة
    'critical',          -- مشاكل خطيرة تحتاج لتدخل فوري
    'offline',           -- الجهاز غير متصل
    'unknown'            -- حالة غير معروفة
);
-- سجل صحة الأجهزة
CREATE TABLE device_health_logs (
    id SERIAL PRIMARY KEY,
    device_assignment_id INTEGER REFERENCES device_vehicle_assignments(id),
    status health_status NOT NULL,
    battery_level INTEGER,                    -- مستوى البطارية (للأجهزة التي تعمل بالبطارية)
    signal_strength INTEGER,                  -- قوة الإشارة
    gsm_status JSONB DEFAULT '{}',           -- حالة شبكة GSM
    memory_usage INTEGER,                     -- استخدام الذاكرة
    temperature DECIMAL(5,2),                 -- درجة حرارة الجهاز نفسه
    voltage DECIMAL(5,2),                     -- الجهد الكهربائي
    last_communication TIMESTAMP WITH TIME ZONE,
    uptime INTEGER,                          -- مدة التشغيل بالثواني
    firmware_version VARCHAR(50),            -- إصدار البرنامج الثابت
    hardware_version VARCHAR(50),            -- إصدار العتاد
    errors JSONB DEFAULT '[]',               -- قائمة الأخطاء
    warnings JSONB DEFAULT '[]',             -- قائمة التحذيرات
    diagnostics JSONB DEFAULT '{}',          -- بيانات تشخيصية إضافية
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- سجل تحديثات البرامج الثابتة
CREATE TABLE device_firmware_updates (
    id SERIAL PRIMARY KEY,
    device_assignment_id INTEGER REFERENCES device_vehicle_assignments(id),
    previous_version VARCHAR(50),
    new_version VARCHAR(50),
    update_status VARCHAR(20) NOT NULL,      -- pending, in_progress, completed, failed
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- إضافة فهارس جديدة
CREATE INDEX idx_health_logs_assignment ON device_health_logs(device_assignment_id);
CREATE INDEX idx_health_logs_status ON device_health_logs(status);
CREATE INDEX idx_health_logs_time ON device_health_logs(created_at);
CREATE INDEX idx_firmware_updates_assignment ON device_firmware_updates(device_assignment_id);
CREATE INDEX idx_firmware_updates_status ON device_firmware_updates(update_status);
-- إضافة view لعرض آخر حالة صحية لكل جهاز
CREATE VIEW latest_device_health AS
SELECT DISTINCT ON (device_assignment_id)
    device_assignment_id,
    status,
    battery_level,
    signal_strength,
    last_communication,
    errors,
    warnings,
    created_at
FROM device_health_logs
ORDER BY device_assignment_id, created_at DESC;
-- الفهارس
CREATE INDEX idx_primary_devices_type ON primary_devices(type);
CREATE INDEX idx_sensors_type ON sensors(type);
CREATE INDEX idx_purchased_devices_user ON purchased_primary_devices(user_id);
CREATE INDEX idx_purchased_devices_status ON purchased_primary_devices(status);
CREATE INDEX idx_purchased_sensors_user ON purchased_sensors(user_id);
CREATE INDEX idx_purchased_sensors_status ON purchased_sensors(status);
CREATE INDEX idx_device_assignments_device ON device_vehicle_assignments(device_id);
CREATE INDEX idx_device_assignments_vehicle ON device_vehicle_assignments(vehicle_id);
CREATE INDEX idx_device_assignments_status ON device_vehicle_assignments(status);
CREATE INDEX idx_sensor_assignments_sensor ON sensor_device_assignments(sensor_id);
CREATE INDEX idx_sensor_assignments_device ON sensor_device_assignments(device_assignment_id);
CREATE INDEX idx_setup_logs_assignment ON device_setup_logs(assignment_id);
CREATE INDEX idx_maintenance_logs_device ON device_maintenance_logs(device_id);
---------------------------------------
-- قراءات الأجهزة
-- جدول قراءات المواقع (كما هو من Traccar)
CREATE TABLE device_positions (
    id BIGSERIAL PRIMARY KEY,
    device_assignment_id INTEGER REFERENCES device_vehicle_assignments(id),
    traccar_position_id BIGINT NOT NULL,
    protocol VARCHAR(50),
    device_time TIMESTAMP WITH TIME ZONE,
    fix_time TIMESTAMP WITH TIME ZONE,
    server_time TIMESTAMP WITH TIME ZONE,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    altitude DOUBLE PRECISION,
    speed DOUBLE PRECISION,
    course DOUBLE PRECISION,
    address TEXT,
    accuracy DOUBLE PRECISION,
    network JSONB,
    attributes JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(device_assignment_id, traccar_position_id)
);
-- جدول قراءات المستشعرات (مستخرجة من attributes)
CREATE TABLE sensor_readings (
    id BIGSERIAL PRIMARY KEY,
    sensor_assignment_id INTEGER REFERENCES sensor_device_assignments(id),
    position_id BIGINT REFERENCES device_positions(id),
    value DOUBLE PRECISION,                  -- القيمة المقروءة
    raw_value JSONB,                         -- القيمة الأصلية كما وردت
    timestamp TIMESTAMP WITH TIME ZONE,      -- وقت القراءة (يؤخذ من device_time)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- فهارس
CREATE INDEX idx_sensor_readings_sensor ON sensor_readings(sensor_assignment_id);
CREATE INDEX idx_sensor_readings_position ON sensor_readings(position_id);
CREATE INDEX idx_sensor_readings_time ON sensor_readings(timestamp);
-------------------------------------------------------------------

-- جدول صيانة المركبات
CREATE TABLE vehicle_maintenance (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER REFERENCES vehicles(id),
    type VARCHAR(50) NOT NULL,          -- نوع الصيانة
    description TEXT,
    odometer_reading INTEGER,           -- قراءة العداد عند الصيانة
    cost DECIMAL(10,2),
    performed_by VARCHAR(100),          -- منفذ الصيانة
    performed_at TIMESTAMP WITH TIME ZONE,
    next_maintenance_date DATE,         -- موعد الصيانة القادمة
    next_maintenance_odometer INTEGER,  -- قراءة العداد للصيانة القادمة
    documents JSONB DEFAULT '[]',       -- فواتير، صور، الخ
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- جدول فحوصات المركبات
CREATE TABLE vehicle_inspections (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER REFERENCES vehicles(id),
    inspector_name VARCHAR(100) NOT NULL,
    inspection_date TIMESTAMP WITH TIME ZONE NOT NULL,
    type VARCHAR(50) NOT NULL,          -- نوع الفحص
    status VARCHAR(20) NOT NULL,        -- نتيجة الفحص
    odometer_reading INTEGER,
    findings JSONB DEFAULT '[]',        -- نتائج الفحص
    recommendations TEXT,
    next_inspection_date DATE,
    documents JSONB DEFAULT '[]',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- فهارس
CREATE INDEX idx_vehicles_user ON vehicles(user_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_plate ON vehicles(plate_number);
CREATE INDEX idx_maintenance_vehicle ON vehicle_maintenance(vehicle_id);
CREATE INDEX idx_inspections_vehicle ON vehicle_inspections(vehicle_id);

-------------------------------------------------------------------
-- Drivers
-- أنواع السائقين
CREATE TYPE driver_type AS ENUM (
    'company',         -- سائق تابع لشركة
    'independent'      -- سائق مستقل
);
-- حالات الحساب
CREATE TYPE account_status AS ENUM (
    'pending_review',  -- في انتظار المراجعة
    'active',          -- نشط
    'inactive',        -- غير نشط
    'suspended'        -- موقوف
);
-- حالات السائق
CREATE TYPE driver_status AS ENUM (
    'active',          -- نشط
    'inactive',        -- غير نشط
    'on_trip',         -- في رحلة
    'on_leave',        -- في إجازة
    'suspended',       -- موقوف
    'terminated'       -- منتهي العقد
);
-- أنواع الرخص
CREATE TYPE license_type AS ENUM (
    'light',           -- خصوصي
    'medium',          -- نقل متوسط
    'heavy',           -- نقل ثقيل
    'hazmat',          -- مواد خطرة
    'special'          -- تصريح خاص
);
-- جدول حسابات السائقين المستقلين
CREATE TABLE independent_driver_accounts (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,    -- عادة رقم الهوية
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    status account_status DEFAULT 'pending_review',
    device_token VARCHAR(255),               -- للإشعارات
    verification_code VARCHAR(6),            -- للتحقق من الهاتف/البريد
    verification_expires_at TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- جدول السائقين
CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),    -- للسائقين التابعين لشركة
    account_id INTEGER REFERENCES independent_driver_accounts(id),  -- للسائقين المستقلين
    driver_type driver_type NOT NULL,
    
    -- المعلومات الشخصية
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    id_number VARCHAR(20) UNIQUE NOT NULL,   -- رقم الهوية
    birth_date DATE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address TEXT,
    profile_image VARCHAR(255),
    emergency_contact JSONB,                 -- معلومات الاتصال في الطوارئ
    current_location GEOMETRY(Point, 4326),  -- للسائقين المستقلين
    
    -- معلومات الرخصة
    license_number VARCHAR(50) NOT NULL,
    license_type license_type NOT NULL,
    license_expiry DATE NOT NULL,
    license_issue_date DATE NOT NULL,
    hazmat_certified BOOLEAN DEFAULT false,  -- شهادة نقل مواد خطرة
    experience_years INTEGER,
    
    -- معلومات العمل
    hire_date DATE,                         -- للسائقين التابعين لشركة
    status driver_status DEFAULT 'inactive',
    current_vehicle_id INTEGER REFERENCES vehicles(id),
    total_trips INTEGER DEFAULT 0,
    total_distance DECIMAL(10,2) DEFAULT 0,
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    
    -- تفضيلات وإعدادات السائق المستقل
    employment_status VARCHAR(20),           -- seeking, employed
    preferences JSONB DEFAULT '{}',          -- تفضيلات العمل
    skills JSONB DEFAULT '[]',               -- مهارات السائق
    
    -- الوثائق والشهادات
    documents JSONB DEFAULT '[]',            -- روابط المستندات
    certifications JSONB DEFAULT '[]',       -- الشهادات والدورات
    
    -- معلومات إضافية
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- قيود
    CONSTRAINT valid_driver_type 
        CHECK (
            (driver_type = 'independent' AND account_id IS NOT NULL AND user_id IS NULL)
            OR 
            (driver_type = 'company' AND account_id IS NULL AND user_id IS NOT NULL)
        )
);
-- جدول حسابات سائقي الشركات
CREATE TABLE fleet_driver_accounts (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER REFERENCES drivers(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,    
    password_hash VARCHAR(255) NOT NULL,
    status account_status DEFAULT 'active',
    device_token VARCHAR(255),               -- للإشعارات
    verification_code VARCHAR(6),            -- للتحقق من الهاتف
    verification_expires_at TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- جدول إجازات السائقين
CREATE TABLE driver_leaves (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER REFERENCES drivers(id),
    type VARCHAR(50) NOT NULL,               -- نوع الإجازة
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending',    -- pending, approved, rejected, completed
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    documents JSONB DEFAULT '[]',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- جدول مخالفات السائقين
CREATE TABLE driver_violations (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER REFERENCES drivers(id),
    vehicle_id INTEGER REFERENCES vehicles(id),
    violation_date TIMESTAMP WITH TIME ZONE NOT NULL,
    type VARCHAR(50) NOT NULL,               -- نوع المخالفة
    description TEXT,
    location GEOMETRY(Point, 4326),
    fine_amount DECIMAL(10,2),
    paid BOOLEAN DEFAULT false,
    documents JSONB DEFAULT '[]',            -- صور، مستندات
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- فهارس
CREATE INDEX idx_independent_accounts_username ON independent_driver_accounts(username);
CREATE INDEX idx_independent_accounts_status ON independent_driver_accounts(status);
CREATE INDEX idx_drivers_user ON drivers(user_id);
CREATE INDEX idx_drivers_account ON drivers(account_id);
CREATE INDEX idx_drivers_type ON drivers(driver_type);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_drivers_id_number ON drivers(id_number);
CREATE INDEX idx_fleet_accounts_username ON fleet_driver_accounts(username);
CREATE INDEX idx_fleet_accounts_driver ON fleet_driver_accounts(driver_id);
CREATE INDEX idx_leaves_driver ON driver_leaves(driver_id);
CREATE INDEX idx_violations_driver ON driver_violations(driver_id);
-- جدول رموز إعادة تعيين كلمة المرور لسائقي الأسطول
CREATE TABLE fleet_driver_reset_tokens (
    id SERIAL PRIMARY KEY,
    driver_account_id INTEGER REFERENCES fleet_driver_accounts(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- جدول رموز إعادة تعيين كلمة المرور للسائقين المستقلين
CREATE TABLE independent_driver_reset_tokens (
    id SERIAL PRIMARY KEY,
    driver_account_id INTEGER REFERENCES independent_driver_accounts(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- جدول طلبات التوظيف للسائقين المستقلين
CREATE TABLE driver_job_applications (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER REFERENCES drivers(id) ON DELETE CASCADE,
    fleet_manager_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending',    -- pending, accepted, rejected, withdrawn
    application_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    response_date TIMESTAMP WITH TIME ZONE,
    proposed_salary DECIMAL(10,2),           -- الراتب المقترح
    proposed_start_date DATE,                -- تاريخ بدء العمل المقترح
    interview_date TIMESTAMP WITH TIME ZONE,  -- موعد المقابلة
    interview_notes TEXT,                    -- ملاحظات المقابلة
    rejection_reason TEXT,                   -- سبب الرفض
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- فهارس
CREATE INDEX idx_fleet_reset_tokens ON fleet_driver_reset_tokens(token);
CREATE INDEX idx_independent_reset_tokens ON independent_driver_reset_tokens(token);
CREATE INDEX idx_job_applications_driver ON driver_job_applications(driver_id);
CREATE INDEX idx_job_applications_manager ON driver_job_applications(fleet_manager_id);
CREATE INDEX idx_job_applications_status ON driver_job_applications(status);
-- جدول تقييمات السائقين
CREATE TABLE driver_reviews (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER REFERENCES drivers(id),
    reviewer_id UUID REFERENCES users(id),  -- مدير الأسطول
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
    review_type VARCHAR(50),                   -- monthly, quarterly, annual
    review_date DATE NOT NULL,
    performance_metrics JSONB,                 -- مقاييس الأداء
    strengths TEXT[],
    weaknesses TEXT[],
    recommendations TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- جدول تدريب السائقين
CREATE TABLE driver_training (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER REFERENCES drivers(id),
    training_type VARCHAR(100) NOT NULL,       -- نوع التدريب
    provider VARCHAR(100),                     -- مزود التدريب
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled',    -- scheduled, in_progress, completed, failed
    certification_number VARCHAR(50),          -- رقم الشهادة
    expiry_date DATE,                         -- تاريخ انتهاء الشهادة
    documents JSONB DEFAULT '[]',              -- شهادات، وثائق
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- جدول الجدول الزمني للسائقين
CREATE TABLE driver_schedules (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER REFERENCES drivers(id),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    schedule_type VARCHAR(50),                 -- regular, overtime, on_call
    status VARCHAR(20) DEFAULT 'scheduled',    -- scheduled, in_progress, completed
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_schedule_time 
        CHECK (end_time > start_time)
);
-- فهارس
CREATE INDEX idx_reviews_driver ON driver_reviews(driver_id);
CREATE INDEX idx_training_driver ON driver_training(driver_id);
CREATE INDEX idx_schedules_driver ON driver_schedules(driver_id);
CREATE INDEX idx_schedules_time ON driver_schedules(start_time, end_time);
--------------------------------------------------------------------
-- أنواع طرق التحقق
CREATE TYPE verification_method AS ENUM (
    'qr_code',         -- مسح رمز QR
    'pin_code',        -- رمز PIN
    'rfid_card',       -- بطاقة RFID
    'face_id',         -- التعرف على الوجه
    'fingerprint'      -- بصمة الإصبع
);

-- حالات الرحلة
CREATE TYPE trip_status AS ENUM (
    'draft',           -- مسودة
    'pending',         -- في انتظار البدء
    'assigned',        -- تم تعيين سائق
    'in_progress',     -- جارية
    'completed',       -- مكتملة
    'cancelled',       -- ملغية
    'failed'          -- فشلت
);

-- أنواع الرحلات
CREATE TYPE trip_type AS ENUM (
    'delivery',        -- توصيل
    'pickup',          -- استلام
    'transfer',        -- نقل
    'round_trip'       -- رحلة ذهاب وعودة
);

-- طرق التحقق للسائقين
CREATE TABLE driver_verification_methods (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER REFERENCES drivers(id),
    method verification_method NOT NULL,
    identifier VARCHAR(255) NOT NULL,           -- رقم البطاقة/الرمز/المعرف
    is_primary BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'active',        -- active, inactive, revoked
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',                -- بيانات إضافية حسب طريقة التحقق
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_driver_identifier 
        UNIQUE (driver_id, method, identifier)
);

-- الربط بين السائقين والمركبات
CREATE TABLE driver_vehicle_assignments (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER REFERENCES drivers(id),
    vehicle_id INTEGER REFERENCES vehicles(id),
    is_primary BOOLEAN DEFAULT false,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT no_overlapping_primary_assignments 
        EXCLUDE USING gist (
            vehicle_id WITH =,
            tstzrange(start_date, end_date, '[]') WITH &&  -- تغيير من tsrange إلى tstzrange
        ) WHERE (is_primary = true)
);
-- الرحلات
CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    reference_number VARCHAR(50) UNIQUE,
    user_id UUID REFERENCES users(id),       -- منشئ الرحلة
    vehicle_id INTEGER REFERENCES vehicles(id),
    type trip_type NOT NULL,
    status trip_status DEFAULT 'draft',
    
    title VARCHAR(200),
    description TEXT,
    
    scheduled_start TIMESTAMP WITH TIME ZONE,
    scheduled_end TIMESTAMP WITH TIME ZONE,
    actual_start TIMESTAMP WITH TIME ZONE,
    actual_end TIMESTAMP WITH TIME ZONE,
    
    start_location GEOMETRY(Point, 4326),
    end_location GEOMETRY(Point, 4326),
    waypoints GEOMETRY(MultiPoint, 4326),
    planned_route GEOMETRY(LineString, 4326),
    actual_route GEOMETRY(LineString, 4326),
    
    estimated_distance DECIMAL(10,2),
    actual_distance DECIMAL(10,2),
    estimated_duration INTEGER,
    actual_duration INTEGER,
    
    cargo_details JSONB DEFAULT '{}',           -- تفاصيل الحمولة
    requirements JSONB DEFAULT '{}',            -- متطلبات خاصة
    
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- سجل تواجد السائقين في المركبات
CREATE TABLE vehicle_driver_logs (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER REFERENCES drivers(id),
    vehicle_id INTEGER REFERENCES vehicles(id),
    trip_id INTEGER REFERENCES trips(id),
    verification_id INTEGER REFERENCES driver_verification_methods(id),
    check_in TIMESTAMP WITH TIME ZONE NOT NULL,
    check_out TIMESTAMP WITH TIME ZONE,
    location_in GEOMETRY(Point, 4326),
    location_out GEOMETRY(Point, 4326),
    odometer_in INTEGER,
    odometer_out INTEGER,
    status VARCHAR(20) DEFAULT 'active',        -- active, completed
    verification_status VARCHAR(20) NOT NULL,   -- verified, failed, override
    verified_by UUID REFERENCES users(id),   -- في حالة override
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_check_times 
        CHECK (check_out IS NULL OR check_out > check_in)
);


-- ربط السائقين بالرحلات
CREATE TABLE trip_driver_assignments (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id),
    driver_id INTEGER REFERENCES drivers(id),
    role VARCHAR(50) DEFAULT 'primary',         -- primary, secondary, backup
    status VARCHAR(20) DEFAULT 'assigned',      -- assigned, active, completed
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- نقاط التوقف في الرحلة
CREATE TABLE trip_stops (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id),
    sequence_number INTEGER NOT NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    address TEXT,
    type VARCHAR(50),                          -- pickup, delivery, rest, fuel
    scheduled_arrival TIMESTAMP WITH TIME ZONE,
    scheduled_departure TIMESTAMP WITH TIME ZONE,
    actual_arrival TIMESTAMP WITH TIME ZONE,
    actual_departure TIMESTAMP WITH TIME ZONE,
    tasks JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'pending',      -- pending, completed, skipped
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- سجل الأحداث والتحقق
CREATE TABLE trip_verification_logs (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id),
    driver_id INTEGER REFERENCES drivers(id),
    vehicle_id INTEGER REFERENCES vehicles(id),
    verification_id INTEGER REFERENCES driver_verification_methods(id),
    event_type VARCHAR(50) NOT NULL,           -- check_in, check_out, stop_arrival, etc.
    event_time TIMESTAMP WITH TIME ZONE NOT NULL,
    location GEOMETRY(Point, 4326),
    verification_status VARCHAR(20) NOT NULL,   -- success, failed, override
    verified_by UUID REFERENCES users(id),   -- في حالة override
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- أنواع أحداث الرحلة
CREATE TYPE trip_event_type AS ENUM (
    'trip_started',        -- بدء الرحلة
    'trip_ended',          -- انتهاء الرحلة
    'stop_arrived',        -- الوصول لنقطة توقف
    'stop_departed',       -- المغادرة من نقطة توقف
    'delay_started',       -- بدء تأخير
    'delay_ended',         -- انتهاء تأخير
    'route_deviated',      -- انحراف عن المسار
    'route_resumed',       -- العودة للمسار
    'driver_changed',      -- تغيير السائق
    'issue_reported',      -- تسجيل مشكلة
    'maintenance_needed',  -- حاجة للصيانة
    'fuel_alert',         -- تنبيه وقود
    'speed_violation',    -- تجاوز السرعة
    'sensor_alert',       -- تنبيه من المستشعرات
    'geofence_enter',     -- دخول منطقة جغرافية
    'geofence_exit'       -- خروج من منطقة جغرافية
);

-- سجل أحداث الرحلة
CREATE TABLE trip_events (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id),
    driver_id INTEGER REFERENCES drivers(id),      -- السائق وقت الحدث
    event_type trip_event_type NOT NULL,
    event_time TIMESTAMP WITH TIME ZONE NOT NULL,
    location GEOMETRY(Point, 4326),
    description TEXT,
    severity VARCHAR(20),                          -- info, warning, critical
    requires_action BOOLEAN DEFAULT false,         -- هل يحتاج إجراء؟
    action_taken TEXT,                            -- الإجراء المتخذ
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES users(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_resolution
        CHECK (
            (requires_action = false) OR
            (requires_action = true AND (resolved_at IS NULL OR resolved_by IS NOT NULL))
        )
);
-- ربط قراءات الأجهزة بالرحلات
CREATE TABLE trip_device_logs (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id),
    device_id INTEGER REFERENCES primary_devices(id),
    position_id INTEGER REFERENCES device_positions(id),  -- من Traccar
    driver_id INTEGER REFERENCES drivers(id),      -- السائق في ذلك الوقت
    
    -- بيانات الموقع والحركة
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    speed DOUBLE PRECISION,                        -- السرعة (كم/ساعة)
    heading DOUBLE PRECISION,                      -- الاتجاه (درجات)
    altitude DOUBLE PRECISION,                     -- الارتفاع
    
    -- حالة المركبة
    ignition BOOLEAN,                             -- حالة المحرك
    motion BOOLEAN,                               -- هل المركبة متحركة
    odometer DOUBLE PRECISION,                    -- قراءة العداد
    fuel_level DOUBLE PRECISION,                  -- مستوى الوقود
    battery_level DOUBLE PRECISION,               -- مستوى البطارية
    engine_hours DOUBLE PRECISION,                -- ساعات تشغيل المحرك
    
    -- الأداء والكفاءة
    engine_rpm DOUBLE PRECISION,                  -- دورات المحرك
    engine_temp DOUBLE PRECISION,                 -- حرارة المحرك
    engine_load DOUBLE PRECISION,                 -- حمل المحرك
    fuel_consumption DOUBLE PRECISION,            -- استهلاك الوقود
    
    -- التنبيهات والأحداث
    is_alert BOOLEAN DEFAULT false,
    alert_type VARCHAR(50),                       -- نوع التنبيه إن وجد
    event_type VARCHAR(50),                       -- نوع الحدث إن وجد
    
    -- بيانات إضافية
    raw_data JSONB,                              -- البيانات الخام من الجهاز
    metadata JSONB DEFAULT '{}',                  -- بيانات إضافية
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- قيود
    CONSTRAINT valid_position_data 
        CHECK (
            speed >= 0 AND 
            heading >= 0 AND heading <= 360
        )
);

-- جدول ملخص أداء الرحلة (يتم تحديثه دورياً)
CREATE TABLE trip_performance_stats (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id),
    last_update TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- إحصائيات المسافة والوقت
    total_distance DOUBLE PRECISION DEFAULT 0,     -- المسافة الكلية
    moving_time INTEGER DEFAULT 0,                 -- وقت الحركة (ثواني)
    idle_time INTEGER DEFAULT 0,                   -- وقت التوقف والمحرك يعمل
    stop_time INTEGER DEFAULT 0,                   -- وقت التوقف الكامل
    
    -- إحصائيات السرعة
    avg_speed DOUBLE PRECISION DEFAULT 0,
    max_speed DOUBLE PRECISION DEFAULT 0,
    speed_violations INTEGER DEFAULT 0,
    
    -- إحصائيات الوقود
    fuel_consumed DOUBLE PRECISION DEFAULT 0,
    fuel_cost DOUBLE PRECISION DEFAULT 0,
    avg_fuel_economy DOUBLE PRECISION DEFAULT 0,   -- كم/لتر
    
    -- إحصائيات القيادة
    harsh_acceleration_count INTEGER DEFAULT 0,
    harsh_braking_count INTEGER DEFAULT 0,
    harsh_cornering_count INTEGER DEFAULT 0,
    
    -- إحصائيات عامة
    total_alerts INTEGER DEFAULT 0,
    total_events INTEGER DEFAULT 0,
    score DOUBLE PRECISION DEFAULT 100,            -- تقييم الرحلة (0-100)
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- فهارس
CREATE INDEX idx_trip_device_logs_all ON trip_device_logs(
    trip_id, 
    device_id, 
    driver_id, 
    recorded_at
);
CREATE INDEX idx_trip_device_logs_location ON trip_device_logs USING GIST(location);
CREATE INDEX idx_trip_device_logs_alerts ON trip_device_logs(is_alert) 
    WHERE is_alert = true;
CREATE INDEX idx_trip_device_logs_time ON trip_device_logs(recorded_at);

CREATE INDEX idx_trip_performance_stats_trip ON trip_performance_stats(trip_id);
CREATE INDEX idx_trip_performance_stats_score ON trip_performance_stats(score);
-- قراءات المستشعرات خلال الرحلة
CREATE TABLE trip_sensor_logs (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id),
    sensor_reading_id INTEGER REFERENCES sensor_readings(id),
    driver_id INTEGER REFERENCES drivers(id),      -- السائق وقت القراءة
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    location GEOMETRY(Point, 4326),
    value JSONB NOT NULL,                         -- القيمة المسجلة
    expected_range JSONB,                         -- النطاق المتوقع
    is_alert BOOLEAN DEFAULT false,               -- هل تجاوزت الحدود؟
    alert_type VARCHAR(50),                       -- نوع التنبيه
    alert_severity VARCHAR(20),                   -- info, warning, critical
    alert_handled BOOLEAN DEFAULT false,          -- هل تم التعامل مع التنبيه؟
    handled_by UUID REFERENCES users(id),
    handled_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_alert_handling
        CHECK (
            (is_alert = false) OR
            (is_alert = true AND (alert_handled = false OR handled_by IS NOT NULL))
        )
);

-- فهارس إضافية
CREATE INDEX idx_trip_events_all ON trip_events(
    trip_id, 
    driver_id, 
    event_type, 
    event_time
);
CREATE INDEX idx_trip_events_location ON trip_events USING GIST(location);
CREATE INDEX idx_trip_events_unresolved ON trip_events(requires_action) 
    WHERE requires_action = true AND resolved_at IS NULL;

CREATE INDEX idx_trip_sensor_logs_all ON trip_sensor_logs(
    trip_id, 
    sensor_reading_id, 
    driver_id, 
    recorded_at
);
CREATE INDEX idx_trip_sensor_logs_alerts ON trip_sensor_logs(is_alert, alert_handled) 
    WHERE is_alert = true;
CREATE INDEX idx_trip_sensor_logs_location ON trip_sensor_logs USING GIST(location);

-- فهارس
CREATE INDEX idx_driver_verification_methods_driver ON driver_verification_methods(driver_id);
CREATE INDEX idx_driver_vehicle_assignments_all ON driver_vehicle_assignments(driver_id, vehicle_id, start_date, end_date);
CREATE INDEX idx_vehicle_driver_logs_all ON vehicle_driver_logs(driver_id, vehicle_id, trip_id, check_in, check_out);
CREATE INDEX idx_trips_all ON trips(vehicle_id, status, scheduled_start, scheduled_end);
CREATE INDEX idx_trip_driver_assignments_all ON trip_driver_assignments(trip_id, driver_id, status);
CREATE INDEX idx_trip_stops_trip ON trip_stops(trip_id);
CREATE INDEX idx_trip_verification_logs_all ON trip_verification_logs(trip_id, driver_id, vehicle_id, event_time);
-------------------------------------------------------------------
-- دالة لإنشاء المسار الفعلي من قراءات الجهاز
CREATE OR REPLACE FUNCTION get_trip_actual_route(trip_id_param INTEGER)
RETURNS GEOMETRY AS $$
BEGIN
    RETURN ST_MakeLine(
        ARRAY(
            SELECT location::geometry
            FROM trip_device_logs
            WHERE trip_id = trip_id_param
            ORDER BY recorded_at
        )
    );
END;
$$ LANGUAGE plpgsql;

-- دالة لجلب كل نقاط المسار مع معلوماتها
CREATE OR REPLACE FUNCTION get_trip_route_details(trip_id_param INTEGER)
RETURNS TABLE (
    point_type VARCHAR,           -- route_point, stop_point, alert_point
    sequence_number INTEGER,
    location GEOMETRY,
    recorded_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB
) AS $$
BEGIN
    -- نقاط المسار الفعلي
    RETURN QUERY
    SELECT 
        'route_point' as point_type,
        ROW_NUMBER() OVER (ORDER BY recorded_at) as sequence_number,
        location,
        recorded_at,
        jsonb_build_object(
            'speed', speed,
            'ignition', ignition,
            'motion', motion,
            'fuel_level', fuel_level,
            'is_alert', is_alert,
            'alert_type', alert_type
        ) as metadata
    FROM trip_device_logs
    WHERE trip_id = trip_id_param

    UNION ALL

    -- نقاط التوقف المخططة
    SELECT 
        'stop_point' as point_type,
        sequence_number,
        location,
        scheduled_arrival as recorded_at,
        jsonb_build_object(
            'type', type,
            'address', address,
            'tasks', tasks,
            'status', status
        ) as metadata
    FROM trip_stops
    WHERE trip_id = trip_id_param

    UNION ALL

    -- نقاط الأحداث والتنبيهات
    SELECT 
        'alert_point' as point_type,
        ROW_NUMBER() OVER (ORDER BY event_time) as sequence_number,
        location,
        event_time as recorded_at,
        jsonb_build_object(
            'event_type', event_type,
            'description', description,
            'severity', severity
        ) as metadata
    FROM trip_events
    WHERE trip_id = trip_id_param AND location IS NOT NULL

    ORDER BY recorded_at;
END;
$$ LANGUAGE plpgsql;

-- دالة لجلب ملخص الرحلة للخريطة
CREATE OR REPLACE FUNCTION get_trip_map_summary(trip_id_param INTEGER)
RETURNS TABLE (
    trip_info JSONB,
    planned_route GEOMETRY,
    actual_route GEOMETRY,
    stops JSONB[],
    events JSONB[],
    bounds GEOMETRY
) AS $$
BEGIN
    RETURN QUERY
    WITH trip_bounds AS (
        SELECT 
            ST_Envelope(
                ST_Collect(
                    ARRAY[
                        start_location,
                        end_location,
                        (SELECT ST_Collect(location) FROM trip_stops WHERE trip_id = trip_id_param),
                        (SELECT ST_Collect(location) FROM trip_device_logs WHERE trip_id = trip_id_param)
                    ]
                )
            ) as route_bounds
        FROM trips
        WHERE id = trip_id_param
    )
    SELECT 
        -- معلومات الرحلة
        jsonb_build_object(
            'id', t.id,
            'reference_number', t.reference_number,
            'status', t.status,
            'scheduled_start', t.scheduled_start,
            'scheduled_end', t.scheduled_end,
            'actual_start', t.actual_start,
            'actual_end', t.actual_end,
            'estimated_distance', t.estimated_distance,
            'actual_distance', t.actual_distance
        ) as trip_info,
        
        -- المسار المخطط
        t.planned_route,
        
        -- المسار الفعلي
        get_trip_actual_route(trip_id_param) as actual_route,
        
        -- نقاط التوقف
        ARRAY(
            SELECT jsonb_build_object(
                'id', id,
                'sequence', sequence_number,
                'type', type,
                'location', ST_AsGeoJSON(location)::jsonb,
                'status', status,
                'scheduled_arrival', scheduled_arrival,
                'actual_arrival', actual_arrival
            )
            FROM trip_stops
            WHERE trip_id = trip_id_param
            ORDER BY sequence_number
        ) as stops,
        
        -- الأحداث
        ARRAY(
            SELECT jsonb_build_object(
                'id', id,
                'type', event_type,
                'time', event_time,
                'location', ST_AsGeoJSON(location)::jsonb,
                'severity', severity,
                'description', description
            )
            FROM trip_events
            WHERE trip_id = trip_id_param
            AND location IS NOT NULL
            ORDER BY event_time
        ) as events,
        
        -- حدود الخريطة
        route_bounds as bounds
        
    FROM trips t, trip_bounds
    WHERE t.id = trip_id_param;
END;
$$ LANGUAGE plpgsql;
-------------------------------------------------------------------
-- أنواع الصيانة

-- حالة الصيانة
CREATE TYPE maintenance_status AS ENUM (
    'pending',            -- في الانتظار
    'scheduled',          -- مجدولة
    'in_progress',        -- قيد التنفيذ
    'completed',          -- مكتملة
    'cancelled',          -- ملغية
    'overdue'            -- متأخرة
);
-- جدول معايير الصيانة (القواعد والحدود)
CREATE TABLE maintenance_criteria (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type maintenance_type NOT NULL,
    description TEXT,
    measure_type VARCHAR(50) NOT NULL,          -- distance, time, engine_hours, fuel_consumption
    threshold_value DECIMAL(10,2) NOT NULL,     -- القيمة الحدية
    warning_threshold DECIMAL(10,2) NOT NULL,   -- قيمة التحذير
    critical_threshold DECIMAL(10,2) NOT NULL,  -- القيمة الحرجة
    repeat_interval INTERVAL,                   -- فترة التكرار
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- جدول معايير الصيانة حسب نوع/موديل المركبة
CREATE TABLE vehicle_maintenance_specs (
    id SERIAL PRIMARY KEY,
    make VARCHAR(50) NOT NULL,                  -- الشركة المصنعة
    model VARCHAR(50) NOT NULL,                 -- الموديل
    year INTEGER,                               -- سنة الصنع
    criteria_id INTEGER REFERENCES maintenance_criteria(id),
    custom_threshold DECIMAL(10,2),             -- قيمة حدية مخصصة
    custom_warning DECIMAL(10,2),               -- قيمة تحذير مخصصة
    custom_critical DECIMAL(10,2),              -- قيمة حرجة مخصصة
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_vehicle_criteria 
        UNIQUE (make, model, year, criteria_id)
);
-- جدول توصيات الصيانة
CREATE TABLE maintenance_recommendations (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER REFERENCES vehicles(id),
    criteria_id INTEGER REFERENCES maintenance_criteria(id),
    type maintenance_type NOT NULL,
    priority VARCHAR(20) NOT NULL,              -- low, medium, high, critical
    current_value DECIMAL(10,2) NOT NULL,       -- القيمة الحالية
    threshold_value DECIMAL(10,2) NOT NULL,     -- القيمة الحدية
    due_date DATE,                             -- تاريخ الاستحقاق
    status maintenance_status DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- جدول جدولة الصيانة
CREATE TABLE maintenance_schedules (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER REFERENCES vehicles(id),
    recommendation_id INTEGER REFERENCES maintenance_recommendations(id),
    type maintenance_type NOT NULL,
    scheduled_date DATE NOT NULL,
    estimated_duration INTEGER,                 -- بالدقائق
    assigned_to UUID REFERENCES users(id),   -- المسؤول عن الصيانة
    location TEXT,                             -- مكان الصيانة
    status maintenance_status DEFAULT 'scheduled',
    cost_estimate DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- جدول سجلات الصيانة
CREATE TABLE maintenance_logs (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER REFERENCES vehicles(id),
    schedule_id INTEGER REFERENCES maintenance_schedules(id),
    type maintenance_type NOT NULL,
    performed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    performed_by UUID REFERENCES users(id),
    odometer_reading INTEGER,
    cost DECIMAL(10,2),
    parts_used JSONB DEFAULT '[]',
    diagnosis TEXT,
    work_performed TEXT,
    recommendations TEXT,
    documents JSONB DEFAULT '[]',              -- صور، فواتير، الخ
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- فهارس
CREATE INDEX idx_maintenance_criteria_type ON maintenance_criteria(type);
CREATE INDEX idx_vehicle_maintenance_specs_vehicle ON vehicle_maintenance_specs(make, model, year);
CREATE INDEX idx_maintenance_recommendations_vehicle ON maintenance_recommendations(vehicle_id);
CREATE INDEX idx_maintenance_recommendations_status ON maintenance_recommendations(status);
CREATE INDEX idx_maintenance_schedules_vehicle ON maintenance_schedules(vehicle_id);
CREATE INDEX idx_maintenance_schedules_date ON maintenance_schedules(scheduled_date);
CREATE INDEX idx_maintenance_logs_vehicle ON maintenance_logs(vehicle_id);
CREATE INDEX idx_maintenance_logs_date ON maintenance_logs(performed_at);
-------------------------------------------------------------------
-- أنواع الإتاحة في السوق
CREATE TYPE marketplace_availability_type AS ENUM (
    'full_time',         -- متاح بشكل كامل
    'scheduled',         -- متاح في أوقات محددة
    'on_demand',         -- عند الطلب
    'contract_only'      -- للعقود فقط
);

-- جدول المركبات المتاحة في السوق
CREATE TABLE marketplace_vehicles (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER REFERENCES vehicles(id),
    fleet_id UUID REFERENCES users(id),
    
    -- تفاصيل الإتاحة
    availability_type marketplace_availability_type NOT NULL,
    is_active BOOLEAN DEFAULT true,
    start_date DATE,                            -- تاريخ بدء الإتاحة
    end_date DATE,                              -- تاريخ نهاية الإتاحة
    available_days INTEGER[],                   -- أيام الأسبوع المتاحة (1-7)
    available_hours JSONB,                      -- ساعات الإتاحة لكل يوم
    
    -- التسعير
    base_price_per_km DECIMAL(10,2),            -- السعر الأساسي لكل كم
    base_price_per_hour DECIMAL(10,2),          -- السعر الأساسي لكل ساعة
    minimum_hire_period INTEGER,                -- الحد الأدنى لفترة الاستئجار (بالساعات)
    pricing_rules JSONB DEFAULT '{}',           -- قواعد التسعير الخاصة
    
    -- القيود والشروط
    allowed_cargo_types cargo_type[],           -- أنواع الحمولات المسموحة
    max_distance INTEGER,                       -- أقصى مسافة مسموحة (كم)
    service_area GEOMETRY(Polygon, 4326),       -- منطقة الخدمة
    special_requirements TEXT,                  -- متطلبات خاصة
    
    -- الإحصائيات
    total_orders INTEGER DEFAULT 0,
    completed_orders INTEGER DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0,
    average_rating DECIMAL(2,1),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- جدول الشركاء المسموح لهم باستخدام المركبات
CREATE TABLE marketplace_vehicle_partners (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER REFERENCES marketplace_vehicles(id),
    partner_id UUID REFERENCES partner_accounts(id),
    
    -- شروط خاصة
    custom_pricing JSONB DEFAULT '{}',           -- تسعير خاص للشريك
    priority_level INTEGER DEFAULT 0,            -- مستوى الأولوية
    special_terms TEXT,                         -- شروط خاصة
    
    status VARCHAR(20) DEFAULT 'active',         -- active, suspended, blocked
    start_date DATE,
    end_date DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_vehicle_partner 
        UNIQUE (vehicle_id, partner_id)
);

-- جدول طلبات الحجز للمركبات المتاحة
CREATE TABLE marketplace_vehicle_bookings (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER REFERENCES marketplace_vehicles(id),
    partner_id UUID REFERENCES partner_accounts(id),
    
    -- تفاصيل الحجز
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    pickup_location GEOMETRY(Point, 4326),
    return_location GEOMETRY(Point, 4326),
    
    -- تفاصيل الاستخدام
    purpose TEXT,
    cargo_type cargo_type,
    estimated_distance INTEGER,
    route_plan GEOMETRY(LineString, 4326),
    
    -- التكلفة
    base_price DECIMAL(10,2) NOT NULL,
    additional_charges JSONB DEFAULT '[]',
    total_price DECIMAL(10,2) NOT NULL,
    
    status VARCHAR(20) DEFAULT 'pending',        -- pending, confirmed, cancelled, completed
    confirmation_code VARCHAR(50),
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- فهارس
CREATE INDEX idx_marketplace_vehicles_fleet ON marketplace_vehicles(fleet_id);
CREATE INDEX idx_marketplace_vehicles_active ON marketplace_vehicles(is_active);
CREATE INDEX idx_marketplace_vehicles_dates ON marketplace_vehicles(start_date, end_date);
CREATE INDEX idx_marketplace_vehicles_area ON marketplace_vehicles USING GIST(service_area);

CREATE INDEX idx_marketplace_vehicle_partners_all ON marketplace_vehicle_partners(vehicle_id, partner_id, status);

CREATE INDEX idx_marketplace_vehicle_bookings_vehicle ON marketplace_vehicle_bookings(vehicle_id);
CREATE INDEX idx_marketplace_vehicle_bookings_partner ON marketplace_vehicle_bookings(partner_id);
CREATE INDEX idx_marketplace_vehicle_bookings_dates ON marketplace_vehicle_bookings(start_time, end_time);
CREATE INDEX idx_marketplace_vehicle_bookings_status ON marketplace_vehicle_bookings(status);
------------------------------------------
-- النظام الأول: عرض الرحلات من الشركاء --
------------------------------------------

-- حالات طلبات الرحلات
CREATE TYPE partner_trip_status AS ENUM (
    'draft',            -- مسودة
    'published',        -- معروضة
    'in_bidding',       -- تحت المزايدة
    'assigned',         -- تم التعيين
    'in_progress',      -- قيد التنفيذ
    'completed',        -- مكتملة
    'cancelled'         -- ملغية
);

-- طلبات الرحلات من الشركاء
CREATE TABLE partner_trip_requests (
    id SERIAL PRIMARY KEY,
    partner_id UUID REFERENCES partner_accounts(id),
    reference_number VARCHAR(50) UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- المواقع والتواريخ
    pickup_location GEOMETRY(Point, 4326) NOT NULL,
    pickup_address TEXT NOT NULL,
    delivery_location GEOMETRY(Point, 4326) NOT NULL,
    delivery_address TEXT NOT NULL,
    pickup_date TIMESTAMP WITH TIME ZONE NOT NULL,
    delivery_date TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- تفاصيل الحمولة
    cargo_type cargo_type NOT NULL,
    cargo_weight DECIMAL(10,2),
    cargo_volume DECIMAL(10,2),
    special_requirements TEXT,
    
    -- المتطلبات
    required_vehicle_type VARCHAR(50),
    price_offer DECIMAL(10,2),                   -- السعر المقترح
    
    status partner_trip_status DEFAULT 'draft',
    assigned_fleet_id UUID REFERENCES users(id),
    assigned_vehicle_id INTEGER REFERENCES vehicles(id),
    assigned_trip_id INTEGER REFERENCES trips(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- عروض الأساطيل على طلبات الشركاء
CREATE TABLE partner_trip_bids (
    id SERIAL PRIMARY KEY,
    request_id INTEGER REFERENCES partner_trip_requests(id),
    fleet_id UUID REFERENCES users(id),
    vehicle_id INTEGER REFERENCES vehicles(id),
    price_offer DECIMAL(10,2) NOT NULL,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'pending',        -- pending, accepted, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--------------------------------------------
-- النظام الثاني: عرض المركبات من المدراء --
--------------------------------------------

-- أنواع إتاحة المركبات
CREATE TYPE fleet_vehicle_availability AS ENUM (
    'full_time',         -- متاح بشكل كامل
    'scheduled',         -- متاح في أوقات محددة
    'on_demand'          -- عند الطلب
);

-- المركبات المعروضة من المدراء
CREATE TABLE fleet_marketplace_vehicles (
    id SERIAL PRIMARY KEY,
    fleet_id UUID REFERENCES users(id),
    vehicle_id INTEGER REFERENCES vehicles(id),
    
    -- تفاصيل الإتاحة
    availability_type fleet_vehicle_availability NOT NULL,
    is_active BOOLEAN DEFAULT true,
    start_date DATE,
    end_date DATE,
    available_days INTEGER[],                    -- أيام الأسبوع (1-7)
    available_hours JSONB,                       -- ساعات كل يوم
    
    -- التسعير
    price_per_km DECIMAL(10,2),
    price_per_hour DECIMAL(10,2),
    price_per_day DECIMAL(10,2),
    minimum_hire_period INTEGER,                 -- بالساعات
    
    -- القيود
    allowed_cargo_types cargo_type[],
    max_distance INTEGER,                        -- أقصى مسافة (كم)
    service_area GEOMETRY(Polygon, 4326),        -- منطقة الخدمة
    special_requirements TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- طلبات استئجار المركبات من الشركاء
CREATE TABLE partner_vehicle_requests (
    id SERIAL PRIMARY KEY,
    partner_id UUID REFERENCES partner_accounts(id),
    vehicle_id INTEGER REFERENCES fleet_marketplace_vehicles(id),
    
    -- تفاصيل الطلب
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    pickup_location GEOMETRY(Point, 4326),
    return_location GEOMETRY(Point, 4326),
    
    purpose TEXT,
    cargo_type cargo_type,
    estimated_distance INTEGER,
    
    -- التكلفة
    total_price DECIMAL(10,2) NOT NULL,
    
    status VARCHAR(20) DEFAULT 'pending',        -- pending, approved, rejected, completed
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- فهارس
CREATE INDEX idx_partner_trip_requests_all ON partner_trip_requests(partner_id, status);
CREATE INDEX idx_partner_trip_requests_dates ON partner_trip_requests(pickup_date, delivery_date);
CREATE INDEX idx_partner_trip_bids_request ON partner_trip_bids(request_id);

CREATE INDEX idx_fleet_marketplace_vehicles_all ON fleet_marketplace_vehicles(fleet_id, is_active);
CREATE INDEX idx_fleet_marketplace_vehicles_dates ON fleet_marketplace_vehicles(start_date, end_date);
CREATE INDEX idx_partner_vehicle_requests_all ON partner_vehicle_requests(partner_id, status);
----------------------------------------------------------------------------------------------------
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    reference_number VARCHAR(50) UNIQUE,
    partner_id UUID REFERENCES partner_accounts(id),
    trip_id INTEGER REFERENCES trips(id),
    rental_request_id INTEGER REFERENCES partner_vehicle_requests(id),
    
    amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2),
    total_amount DECIMAL(10,2) NOT NULL,
    
    status VARCHAR(20) DEFAULT 'pending',        -- pending, paid, overdue, cancelled
    due_date DATE NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);----------------------------------------------------------------------------------------------------------
CREATE TABLE report_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    report_type VARCHAR(50) NOT NULL,           -- fleet, trips, financial, etc.
    query_template TEXT NOT NULL,
    parameters JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE generated_reports (
    id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES report_templates(id),
    user_id UUID REFERENCES users(id),
    parameters JSONB DEFAULT '{}',
    result_data JSONB,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-----------------------------------------------------------------------------------------------------------
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    partner_id UUID REFERENCES partner_accounts(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
---------------------------------------------------------------------------------------------------
CREATE TABLE support_tickets (
    id SERIAL PRIMARY KEY,
    reference_number VARCHAR(50) UNIQUE,
    user_id UUID REFERENCES users(id),
    partner_id UUID REFERENCES partner_accounts(id),
    
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal',
    subject VARCHAR(200) NOT NULL,
    description TEXT,
    
    status VARCHAR(20) DEFAULT 'open',          -- open, in_progress, resolved, closed
    assigned_to UUID REFERENCES users(id),
    resolution TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
----------------------------------------------------------------------------------------------------------