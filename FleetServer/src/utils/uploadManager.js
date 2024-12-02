/*const { createCanvas, loadImage } = require('canvas');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// تحديد المسار الحالي
const __dirname = path.resolve();

// إنشاء مجلد للصور
const uploadDir = path.join(__dirname, '../../uploads');
const profileImagesDir = path.join(uploadDir, 'profile-images');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(profileImagesDir)) {
    fs.mkdirSync(profileImagesDir, { recursive: true });
}

// تكوين multer
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB كحد أقصى
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('نوع الملف غير مدعوم. يرجى استخدام JPEG أو PNG'));
        }
        cb(null, true);
    }
});

// دالة معالجة الصورة
const processProfileImage = async (buffer) => {
    const filename = `${uuidv4()}.webp`;
    const filepath = path.join(profileImagesDir, filename);

    try {
        const image = await loadImage(buffer);
        const canvas = createCanvas(300, 300);
        const ctx = canvas.getContext('2d');

        // رسم الصورة على الكانفاس
        ctx.drawImage(image, 0, 0, 300, 300);

        // حفظ الصورة
        const out = fs.createWriteStream(filepath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on('finish', () => {
            console.log('تم حفظ الصورة:', filepath);
        });

        return {
            filename,
            filepath,
            url: `/uploads/profile-images/${filename}`
        };
    } catch (error) {
        console.error('Error processing image:', error);
        throw new Error('فشل في معالجة الصورة');
    }
};

// دالة لمعالجة الصورة من URI
const processImageFromUri = async (uri) => {
    try {
        const cleanUri = uri.replace('file://', '');
        
        if (cleanUri.includes('base64,')) {
            const base64Data = cleanUri.split('base64,')[1];
            const imageBuffer = Buffer.from(base64Data, 'base64');
            return await processProfileImage(imageBuffer);
        } else {
            const imageBuffer = await fs.promises.readFile(cleanUri);
            return await processProfileImage(imageBuffer);
        }
    } catch (error) {
        console.error('Error processing image from URI:', error);
        throw new Error('فشل في معالجة الصورة من URI');
    }
};

// تصدير الدوال
module.exports = {
    upload,
    processProfileImage,
    processImageFromUri
}; */