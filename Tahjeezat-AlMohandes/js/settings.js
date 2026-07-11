/* ==========================================
   settings.js
   تجهيزات المهندس
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadSettings();

});

// تحميل الإعدادات
function loadSettings() {

    // قيم افتراضية مؤقتة
    document.getElementById("siteName").value = "تجهيزات المهندس";

    document.getElementById("welcomeMessage").value =
        "أهلاً وسهلاً بكم في تجهيزات المهندس";

    document.getElementById("themeColor").value = "#D4AF37";

    document.getElementById("ordersStatus").value = "open";

}

// حفظ الإعدادات
const settingsForm = document.getElementById("settingsForm");

if (settingsForm) {

    settingsForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const settings = {

            siteName: document.getElementById("siteName").value,

            welcomeMessage: document.getElementById("welcomeMessage").value,

            themeColor: document.getElementById("themeColor").value,

            ordersStatus: document.getElementById("ordersStatus").value,

            phone: document.getElementById("phone").value,

            whatsapp: document.getElementById("whatsapp").value,

            instagram: document.getElementById("instagram").value,

            facebook: document.getElementById("facebook").value

        };

        // حفظ مؤقت داخل المتصفح
        localStorage.setItem(
            "siteSettings",
            JSON.stringify(settings)
        );

        alert("تم حفظ الإعدادات بنجاح");

    });

}

// استرجاع الإعدادات
function getSettings() {

    return JSON.parse(
        localStorage.getItem("siteSettings")
    );

}

// إعادة تعيين الإعدادات
function resetSettings() {

    if (confirm("هل تريد إعادة ضبط الإعدادات؟")) {

        localStorage.removeItem("siteSettings");

        location.reload();

    }

}