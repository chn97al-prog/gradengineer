/* ==========================================
   auth.js
   تجهيزات المهندس
========================================== */

import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


// تسجيل الدخول

const loginForm = document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

      await signInWithEmailAndPassword(auth, email, password);

      alert("تم تسجيل الدخول بنجاح");

      window.location.href = "dashboard.html";

    } catch (error) {

      alert("الإيميل أو كلمة المرور غير صحيحة");

      console.log(error);

    }

  });

}


// تسجيل الخروج

window.logout = function(){

  signOut(auth)
  .then(()=>{

    window.location.href = "login.html";

  })
  .catch((error)=>{

    console.log(error);

  });

};


// حماية صفحات الإدارة

onAuthStateChanged(auth,(user)=>{

  const page = window.location.pathname;

  const adminPages = [
    "dashboard",
    "orders",
    "groups",
    "representatives",
    "statistics",
    "settings"
  ];


  if(adminPages.some(p => page.includes(p))){

    if(!user){

      window.location.href="login.html";

    }

  }

});
