/* ==========================================
   auth.js
   تجهيزات المهندس
========================================== */

import { auth } from "./firebase.js";

import {

signInWithEmailAndPassword,

signOut,

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// تسجيل الدخول

const loginForm = document.getElementById("loginForm");

if(loginForm){

loginForm.addEventListener("submit",async(e)=>{

e.preventDefault();

const email=document.getElementById("email").value;

const password=document.getElementById("password").value;

try{

await signInWithEmailAndPassword(auth,email,password);

alert("تم تسجيل الدخول بنجاح");

window.location.href="dashboard.html";

}catch(error){

alert("فشل تسجيل الدخول");

console.log(error);

}

});

}

// تسجيل الخروج

window.logout=function(){

signOut(auth)

.then(()=>{

window.location.href="login.html";

})

.catch((error)=>{

console.log(error);

});

}

// التحقق من تسجيل الدخول

onAuthStateChanged(auth,(user)=>{

const page=window.location.pathname;

if(page.includes("dashboard") ||

page.includes("orders") ||

page.includes("groups") ||

page.includes("representatives") ||

page.includes("statistics") ||

page.includes("settings")){

if(!user){

window.location.href="login.html";

}

}

});