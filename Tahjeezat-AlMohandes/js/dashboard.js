/* ==========================================
   dashboard.js
   تجهيزات المهندس
========================================== */

// تشغيل الصفحة
document.addEventListener("DOMContentLoaded", () => {

    loadDashboard();

});

// تحميل بيانات لوحة التحكم
function loadDashboard() {

    // مؤقتاً أرقام تجريبية
    document.getElementById("totalOrders").innerText = 125;

    document.getElementById("individualOrders").innerText = 48;

    document.getElementById("groupOrders").innerText = 77;

    document.getElementById("totalGroups").innerText = 15;

    document.getElementById("totalRepresentatives").innerText = 8;

}

// تحديث الصفحة
function refreshDashboard() {

    loadDashboard();

}

// الانتقال إلى صفحة الطلبات
function openOrders() {

    window.location.href = "orders.html";

}

// الانتقال إلى صفحة المجموعات
function openGroups() {

    window.location.href = "groups.html";

}

// الانتقال إلى صفحة الممثلين
function openRepresentatives() {

    window.location.href = "representatives.html";

}

// تسجيل الخروج
function logout() {

    if(confirm("هل تريد تسجيل الخروج؟")){

        window.location.href = "login.html";

    }

}