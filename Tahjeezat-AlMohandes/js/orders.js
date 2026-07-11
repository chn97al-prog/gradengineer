/* ==========================================
   orders.js
   تجهيزات المهندس
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadOrders();

});

// بيانات تجريبية
let orders = [

{
id:"ORD-1001",
name:"محمد علي",
type:"فردي",
status:"جديد"
},

{
id:"ORD-1002",
name:"أحمد حسن",
type:"مجموعة",
status:"قيد التنفيذ"
},

{
id:"ORD-1003",
name:"حيدر كريم",
type:"فردي",
status:"مكتمل"
}

];

// عرض الطلبات
function loadOrders(){

    const table=document.getElementById("ordersTable");

    if(!table) return;

    table.innerHTML="";

    orders.forEach(order=>{

        table.innerHTML+=`

        <tr>

            <td>${order.id}</td>

            <td>${order.name}</td>

            <td>${order.type}</td>

            <td>${order.status}</td>

            <td>

                <button class="btn"
                onclick="viewOrder('${order.id}')">

                عرض

                </button>

                <button class="btn"
                onclick="deleteOrder('${order.id}')">

                حذف

                </button>

            </td>

        </tr>

        `;

    });

}

// عرض الطلب
function viewOrder(id){

    alert("رقم الطلب: " + id);

}

// حذف الطلب
function deleteOrder(id){

    if(confirm("هل تريد حذف الطلب؟")){

        orders = orders.filter(order => order.id !== id);

        loadOrders();

    }

}

// البحث
function searchOrders(){

    const value=document
    .getElementById("search")
    .value
    .toLowerCase();

    const rows=document
    .querySelectorAll("#ordersTable tr");

    rows.forEach(row=>{

        row.style.display=
        row.innerText.toLowerCase().includes(value)
        ? ""
        : "none";

    });

}