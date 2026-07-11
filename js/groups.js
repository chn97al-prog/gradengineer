/* ==========================================
   groups.js
   تجهيزات المهندس
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadGroups();

});

// بيانات تجريبية
let groups = [

{
code:"ENG-26-0001",
name:"هندسة الحاسبات",
representative:"محمد علي",
status:"مفتوح"
},

{
code:"ENG-26-0002",
name:"الهندسة المدنية",
representative:"أحمد حسن",
status:"مفتوح"
},

{
code:"ENG-26-0003",
name:"الهندسة الكهربائية",
representative:"حيدر كريم",
status:"مغلق"
}

];

// عرض المجموعات
function loadGroups(){

    const table = document.getElementById("groupsTable");

    if(!table) return;

    table.innerHTML = "";

    groups.forEach(group=>{

        table.innerHTML += `

        <tr>

            <td>${group.code}</td>

            <td>${group.name}</td>

            <td>${group.representative}</td>

            <td>${group.status}</td>

            <td>

                <button class="btn"
                onclick="copyCode('${group.code}')">

                نسخ الكود

                </button>

                <button class="btn"
                onclick="editGroup('${group.code}')">

                تعديل

                </button>

                <button class="btn"
                onclick="deleteGroup('${group.code}')">

                حذف

                </button>

            </td>

        </tr>

        `;

    });

}

// إنشاء كود جديد
function generateGroupCode(){

    const number = Math.floor(Math.random()*9000)+1000;

    return "ENG-26-" + number;

}

// إضافة مجموعة
function addGroup(){

    const name = document.getElementById("groupName").value;

    const rep = document.getElementById("representative").value;

    if(name==="" || rep===""){

        alert("يرجى إدخال جميع البيانات");

        return;

    }

    groups.push({

        code:generateGroupCode(),

        name:name,

        representative:rep,

        status:"مفتوح"

    });

    loadGroups();

    alert("تم إنشاء المجموعة بنجاح");

}

// نسخ الكود
function copyCode(code){

    navigator.clipboard.writeText(code);

    alert("تم نسخ الكود");

}

// تعديل المجموعة
function editGroup(code){

    alert("تعديل المجموعة: " + code);

}

// حذف المجموعة
function deleteGroup(code){

    if(confirm("هل تريد حذف المجموعة؟")){

        groups = groups.filter(g=>g.code!==code);

        loadGroups();

    }

}

// البحث
function searchGroups(){

    const value=document
    .getElementById("search")
    .value
    .toLowerCase();

    const rows=document
    .querySelectorAll("#groupsTable tr");

    rows.forEach(row=>{

        row.style.display=
        row.innerText.toLowerCase().includes(value)
        ? ""
        : "none";

    });

}