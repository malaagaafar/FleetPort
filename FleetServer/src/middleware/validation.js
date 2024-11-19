const { body } = require('express-validator');

exports.validateRegistration = [
    // التحقق من البيانات
    (req, res, next) => {
        console.log('البيانات المستلمة في التحقق:', req.body);

        const {
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            phone_number: phoneNumber
        } = req.body;

        if (!firstName || firstName.trim() === '') {
            return res.status(400).json({ message: 'الاسم الأول مطلوب' });
        }

        if (!lastName || lastName.trim() === '') {
            return res.status(400).json({ message: 'الاسم الأخير مطلوب' });
        }

        if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.status(400).json({ message: 'البريد الإلكتروني غير صالح' });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
        }

        if (!phoneNumber || phoneNumber.trim() === '') {
            return res.status(400).json({ message: 'رقم الهاتف مطلوب' });
        }

        next();
    }
];

// ... باقي الكود كما هو

exports.validateLogin = [
    (req, res, next) => {
        const { email, password } = req.body;

        if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.status(400).json({ message: 'البريد الإلكتروني غير صالح' });
        }

        if (!password) {
            return res.status(400).json({ message: 'كلمة المرور مطلوبة' });
        }

        next();
    }
];