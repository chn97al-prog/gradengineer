/* ==========================================
   تجهيزات المهندس
   app.js
========================================== */

// عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {

    console.log("Tahjeezat Al-Mohandes Loaded");

    animateButtons();

});

// حركة بسيطة للأزرار
function animateButtons(){

    const buttons=document.querySelectorAll(".btn");

    buttons.forEach(btn=>{

        btn.addEventListener("mouseenter",()=>{

            btn.style.transform="translateY(-4px) scale(1.03)";

        });

        btn.addEventListener("mouseleave",()=>{

            btn.style.transform="translateY(0) scale(1)";

        });

    });

}

// رسالة نجاح
function showSuccess(message){

    alert(message);

}

// رسالة خطأ
function showError(message){

    alert(message);

}

// التحقق من أن الحقول ليست فارغة
function validateRequired(formId){

    const form=document.getElementById(formId);

    const inputs=form.querySelectorAll("input[required], textarea[required], select[required]");

    let valid=true;

    inputs.forEach(input=>{

        if(input.value.trim()===""){

            input.style.border="2px solid red";

            valid=false;

        }else{

            input.style.border="2px solid #D4AF37";

        }

    });

    return valid;

}

// حفظ نوع الطلب
function savePackage(type){

    localStorage.setItem("package",type);

}

// حفظ نوع الوشاح
function saveSash(type){

    localStorage.setItem("sashType",type);

}

// قراءة نوع الطلب
function getPackage(){

    return localStorage.getItem("package");

}

// قراءة نوع الوشاح
function getSash(){

    return localStorage.getItem("sashType");

}

// حذف البيانات المؤقتة
function clearOrder(){

    localStorage.removeItem("package");

    localStorage.removeItem("sashType");

}

// رقم طلب عشوائي مؤقت
function generateOrderID(){

    return "ORD-"+Date.now();

}