-- إضافة بعض السجلات المحاكية لجدول fuel_logs
INSERT INTO fuel_logs 
(device_id, previous_level, new_level, liters_added, price_per_liter, total_cost, filling_time, status, receipt_image_url, confirmed_by, confirmation_time, notes) 
VALUES
    -- سجل مؤكد مع جميع البيانات
    (1, 25.5, 95.0, 55.5, 1.89, 104.90, NOW() - INTERVAL '2 hours', 
    'confirmed', 'https://example.com/receipts/receipt1.jpg', 1, NOW() - INTERVAL '1 hour', 
    'Regular refill - confirmed'),

    -- سجل معلق بانتظار التأكيد (مع سعر)
    (2, 15.0, 90.0, 60.0, 1.89, 113.40, NOW() - INTERVAL '5 hours', 
    'pending', 'https://example.com/receipts/receipt2.jpg', NULL, NULL, 
    'Waiting for confirmation'),

    -- سجل معلق بدون سعر
    (1, 10.0, 85.0, 60.0, NULL, NULL, NOW() - INTERVAL '1 day', 
    'pending', NULL, NULL, NULL, 
    'Price needs to be added'),

    -- سجل مؤكد قديم
    (3, 20.0, 100.0, 64.0, 1.85, 118.40, NOW() - INTERVAL '3 days', 
    'confirmed', 'https://example.com/receipts/receipt3.jpg', 1, NOW() - INTERVAL '2 days', 
    'Monthly refill'),

    -- سجل معلق قديم
    (2, 30.0, 95.0, 52.0, 1.89, 98.28, NOW() - INTERVAL '4 days', 
    'pending', 'https://example.com/receipts/receipt4.jpg', NULL, NULL, 
    'End of shift refill'),

    -- سجل حديث جداً
    (1, 5.0, 80.0, 60.0, 1.89, 113.40, NOW() - INTERVAL '30 minutes', 
    'pending', NULL, NULL, NULL, 
    'Emergency refill'),

    -- سجل مؤكد حديث
    (3, 15.0, 90.0, 60.0, 1.89, 113.40, NOW() - INTERVAL '6 hours', 
    'confirmed', 'https://example.com/receipts/receipt5.jpg', 1, NOW() - INTERVAL '5 hours', 
    'Regular refill'),

    -- سجل بسعر مختلف
    (2, 25.0, 95.0, 56.0, 1.92, 107.52, NOW() - INTERVAL '2 days', 
    'confirmed', 'https://example.com/receipts/receipt6.jpg', 1, NOW() - INTERVAL '1 day', 
    'Premium fuel used'),

    -- سجل بكمية صغيرة
    (1, 45.0, 65.0, 16.0, 1.89, 30.24, NOW() - INTERVAL '12 hours', 
    'pending', NULL, NULL, NULL, 
    'Small top-up'),

    -- سجل بكمية كبيرة
    (3, 5.0, 100.0, 76.0, 1.89, 143.64, NOW() - INTERVAL '5 days', 
    'confirmed', 'https://example.com/receipts/receipt7.jpg', 1, NOW() - INTERVAL '4 days', 
    'Complete tank fill');

-- تحديث device_time في جدول positions لبعض المركبات لإضافة مستويات الوقود
UPDATE positions 
SET attributes = jsonb_set(
    COALESCE(attributes, '{}'::jsonb),
    '{fuel}',
    to_jsonb(
        CASE 
            WHEN device_id = 1 THEN 65.0
            WHEN device_id = 2 THEN 90.0
            WHEN device_id = 3 THEN 85.0
            ELSE 50.0
        END
    )
)
WHERE id IN (
    SELECT id 
    FROM positions 
    WHERE device_id IN (1, 2, 3) 
    ORDER BY device_time DESC 
    LIMIT 3
); 