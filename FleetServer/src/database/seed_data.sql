-- إدخال بيانات الأجهزة الرئيسية
INSERT INTO primary_devices 
(name, type, model, manufacturer, description, supported_sensors, specifications, price, installation_fee, image_url, is_active) 
VALUES
(
    'Teltonika FMB920',
    'teltonika_fmb920',
    'FMB920',
    'Teltonika',
    'جهاز تتبع احترافي مع دعم لبروتوكول GNSS/GSM. مثالي للسيارات والمركبات الخفيفة',
    ARRAY['temperature', 'door', 'fuel']::sensor_type[],
    '{
        "connectivity": ["2G", "GNSS", "GPS", "GLONASS"],
        "battery": "170 mAh",
        "input_voltage": "10-30V DC",
        "ip_rating": "IP54"
    }'::jsonb,
    299.99,
    50.00,
    'https://example.com/images/fmb920.jpg',
    true
),
(
    'Teltonika FMB130',
    'teltonika_fmb130',
    'FMB130',
    'Teltonika',
    'جهاز تتبع متقدم مع دعم CAN-BUS ومناسب للشاحنات والمركبات الثقيلة',
    ARRAY['temperature', 'door', 'fuel', 'weight']::sensor_type[],
    '{
        "connectivity": ["4G", "GNSS", "GPS", "GLONASS", "CAN-BUS"],
        "battery": "1200 mAh",
        "input_voltage": "10-30V DC",
        "ip_rating": "IP67"
    }'::jsonb,
    499.99,
    75.00,
    'https://example.com/images/fmb130.jpg',
    true
),
(
    'Concox GT06N',
    'concox_gt06n',
    'GT06N',
    'Concox',
    'جهاز تتبع اقتصادي مناسب للسيارات الصغيرة والاستخدام الشخصي',
    ARRAY['temperature', 'door']::sensor_type[],
    '{
        "connectivity": ["2G", "GPS"],
        "battery": "450 mAh",
        "input_voltage": "9-36V DC",
        "ip_rating": "IP54"
    }'::jsonb,
    149.99,
    35.00,
    'https://example.com/images/gt06n.jpg',
    true
),
(
    'Concox X3',
    'concox_x3',
    'X3',
    'Concox',
    'جهاز تتبع متطور مع كاميرا مدمجة ودعم للواي فاي',
    ARRAY['temperature', 'door', 'camera']::sensor_type[],
    '{
        "connectivity": ["4G", "WiFi", "GPS", "GLONASS"],
        "camera": "2MP",
        "battery": "800 mAh",
        "input_voltage": "9-36V DC",
        "ip_rating": "IP65"
    }'::jsonb,
    399.99,
    60.00,
    'https://example.com/images/x3.jpg',
    true
);

-- إدخال بيانات المستشعرات
INSERT INTO sensors 
(name, type, model, manufacturer, description, specifications, price, installation_fee, image_url, is_active)
VALUES
(
    'حساس درجة الحرارة DS18B20',
    'temperature',
    'DS18B20',
    'Dallas Semiconductor',
    'حساس درجة حرارة رقمي عالي الدقة مناسب لتتبع درجة حرارة البضائع',
    '{
        "range": "-55°C to +125°C",
        "accuracy": "±0.5°C",
        "resolution": "9-12 bit",
        "interface": "1-Wire"
    }'::jsonb,
    49.99,
    25.00,
    'https://example.com/images/ds18b20.jpg',
    true
),
(
    'حساس باب مغناطيسي',
    'door',
    'MC-38',
    'Generic',
    'حساس مغناطيسي لمراقبة فتح وإغلاق الأبواب',
    '{
        "type": "NC/NO",
        "gap_distance": "15mm",
        "voltage": "12V DC"
    }'::jsonb,
    19.99,
    15.00,
    'https://example.com/images/mc38.jpg',
    true
),
(
    'حساس وقود خازني',
    'fuel',
    'CLS-420',
    'Omnicomm',
    'حساس مستوى وقود عالي الدقة للشاحنات والمعدات الثقيلة',
    '{
        "length": "700mm",
        "accuracy": "±1%",
        "interface": "RS-485",
        "resolution": "4096 points"
    }'::jsonb,
    299.99,
    100.00,
    'https://example.com/images/cls420.jpg',
    true
),
(
    'كاميرا مراقبة داخلية',
    'camera',
    'DVR-100',
    'Mobile Witness',
    'كاميرا مراقبة داخلية للمركبات مع رؤية ليلية',
    '{
        "resolution": "1080p",
        "night_vision": true,
        "angle": "140°",
        "storage": "32GB"
    }'::jsonb,
    199.99,
    75.00,
    'https://example.com/images/dvr100.jpg',
    true
),
(
    'حساس وزن',
    'weight',
    'SB-1000',
    'VPG Transducers',
    'حساس وزن للشاحنات والمقطورات',
    '{
        "capacity": "1000kg",
        "accuracy": "±0.5%",
        "interface": "Analog",
        "ip_rating": "IP68"
    }'::jsonb,
    449.99,
    150.00,
    'https://example.com/images/sb1000.jpg',
    true
);