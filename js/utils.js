/* ==========================================
   utils.js
   تجهيزات المهندس
========================================== */

// إنشاء رقم طلب
function generateOrderID() {

    const now = new Date();

    const year = now.getFullYear();

    const random = Math.floor(Math.random() * 900000) + 100000;

    return `ENG-${year}-${random}`;

}

// إنشاء كود مجموعة
function generateGroupCode() {

    const random = Math.floor(Math.random() * 9000) + 1000;

    return `GRP-${random}`;

}

// تنسيق التاريخ
function formatDate(date = new Date()) {

    return date.toLocaleDateString("ar-IQ", {

        year: "numeric",

        month: "long",

        day: "numeric"

    });

}

// تنسيق الوقت
function formatTime(date = new Date()) {

    return date.toLocaleTimeString("ar-IQ");

}

// التحقق من صحة رقم الهاتف العراقي
function validatePhone(phone) {

    const regex = /^07[0-9]{9}$/;

    return regex.test(phone);

}

// التحقق من البريد الإلكتروني
function validateEmail(email) {

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);

}

// تحويل أول حرف إلى كبير
function capitalize(text) {

    return text.charAt(0).toUpperCase() + text.slice(1);

}

// نسخ نص إلى الحافظة
function copyText(text) {

    navigator.clipboard.writeText(text);

    alert("تم النسخ بنجاح");

}

// تحميل ملف JSON
function downloadJSON(data, filename = "data.json") {

    const blob = new Blob(

        [JSON.stringify(data, null, 2)],

        { type: "application/json" }

    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = filename;

    link.click();

}

// إظهار رسالة نجاح
function showSuccess(message) {

    alert(message);

}

// إظهار رسالة خطأ
function showError(message) {

    alert(message);

}