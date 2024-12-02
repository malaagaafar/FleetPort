const generateDriverUsername = (firstName, lastName, idNumber) => {
    // إزالة المسافات وأخذ أول 3 أحرف من الاسم الأول والأخير
    const firstPart = firstName.replace(/\s/g, '').slice(0, 3).toLowerCase();
    const lastPart = lastName.replace(/\s/g, '').slice(0, 3).toLowerCase();
    // أخذ آخر 4 أرقام من رقم الهوية
    const idPart = idNumber.slice(-4);
    
    return `${firstPart}${lastPart}${idPart}`;
};

module.exports = {
    generateDriverUsername
}; 