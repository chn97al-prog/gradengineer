/* ==========================================
   statistics.js
   تجهيزات المهندس
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadStatistics();

});

// تحميل الإحصائيات
function loadStatistics() {

    // بيانات تجريبية
    document.getElementById("totalOrders").innerText = 150;

    document.getElementById("individualOrders").innerText = 65;

    document.getElementById("groupOrders").innerText = 85;

    document.getElementById("completedOrders").innerText = 120;

    document.getElementById("pendingOrders").innerText = 30;

    document.getElementById("totalGroups").innerText = 12;

    document.getElementById("totalRepresentatives").innerText = 8;

}

// تحديث الإحصائيات
function refreshStatistics(){

    loadStatistics();

}

// تصدير الإحصائيات
function exportStatistics(){

    alert("سيتم إضافة التصدير إلى PDF و Excel لاحقاً.");

}