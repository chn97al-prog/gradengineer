/* ==========================================
   representatives.js
   تجهيزات المهندس
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadRepresentatives();

});

// بيانات تجريبية
let representatives = [

{
id:1,
name:"محمد علي",
phone:"07801234567",
email:"mohammed@gmail.com",
college:"الهندسة",
status:"نشط"
},

{
id:2,
name:"أحمد حسن",
phone:"07712345678",
email:"ahmed@gmail.com",
college:"علوم الحاسوب",
status:"نشط"
}

];

// عرض الممثلين
function loadRepresentatives(){

    const table=document.getElementById("representativesTable");

    if(!table) return;

    table.innerHTML="";

    representatives.forEach(rep=>{

        table.innerHTML+=`

        <tr>

            <td>${rep.name}</td>

            <td>${rep.phone}</td>

            <td>${rep.email}</td>

            <td>${rep.college}</td>

            <td>${rep.status}</td>

            <td>

                <button class="btn"
                onclick="editRepresentative(${rep.id})">

                تعديل

                </button>

                <button class="btn"
                onclick="deleteRepresentative(${rep.id})">

                حذف

                </button>

            </td>

        </tr>

        `;

    });

}

// إضافة ممثل
const form=document.getElementById("representativeForm");

if(form){

form.addEventListener("submit",function(e){

e.preventDefault();

const name=document.getElementById("repName").value;

const phone=document.getElementById("repPhone").value;

const email=document.getElementById("repEmail").value;

const college=document.getElementById("repCollege").value;

representatives.push({

id:Date.now(),

name,

phone,

email,

college,

status:"نشط"

});

loadRepresentatives();

form.reset();

alert("تمت إضافة الممثل بنجاح");

});

}

// حذف ممثل
function deleteRepresentative(id){

if(confirm("هل تريد حذف الممثل؟")){

representatives=
representatives.filter(rep=>rep.id!==id);

loadRepresentatives();

}

}

// تعديل ممثل
function editRepresentative(id){

const rep=
representatives.find(r=>r.id===id);

if(!rep) return;

const newName=
prompt("اسم الممثل",rep.name);

if(newName){

rep.name=newName;

loadRepresentatives();

}

}

// البحث
function searchRepresentative(){

const value=document
.getElementById("search")
.value
.toLowerCase();

const rows=document
.querySelectorAll("#representativesTable tr");

rows.forEach(row=>{

row.style.display=
row.innerText.toLowerCase().includes(value)
? ""
: "none";

});

}