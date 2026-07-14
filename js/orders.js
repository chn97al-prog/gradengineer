/* ==========================================
   orders.js
   إدارة الطلبات (فردية ومجموعات)
========================================== */

// متغيرات عامة
let allIndividualOrders = [];
let allGroupOrders = [];
let currentOrderId = null;
let currentOrderType = null;

// تحميل البيانات عند فتح الصفحة
document.addEventListener('DOMContentLoaded', async () => {
    await loadOrders();
    updateStatistics();
});

// تحميل جميع الطلبات من Supabase
async function loadOrders() {
    try {
        // تحميل الطلبات الفردية
        const { data: individualData, error: individualError } = await supabase
            .from('individual_orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (individualError) throw individualError;
        allIndividualOrders = individualData || [];

        // تحميل طلبات المجموعات
        const { data: groupData, error: groupError } = await supabase
            .from('group_orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (groupError) throw groupError;
        allGroupOrders = groupData || [];

        // عرض البيانات
        displayIndividualOrders(allIndividualOrders);
        displayGroupOrders(allGroupOrders);
    } catch (error) {
        console.error('خطأ في تحميل الطلبات:', error);
        alert('حدث خطأ في تحميل الطلبات');
    }
}

// عرض الطلبات الفردية
function displayIndividualOrders(orders) {
    const table = document.getElementById('individualOrdersTable');
    if (!table) return;

    table.innerHTML = '';

    if (orders.length === 0) {
        table.innerHTML = '<tr><td colspan="7" style="text-align:center;">لا توجد طلبات فردية</td></tr>';
        return;
    }

    orders.forEach((order, index) => {
        const date = new Date(order.created_at).toLocaleDateString('ar-SA');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>ORD-IND-${String(index + 1).padStart(4, '0')}</td>
            <td>${order.student_name}</td>
            <td>${order.sash_name}</td>
            <td>${order.fabric_type}</td>
            <td>
                <span class='status-badge status-${order.status.toLowerCase().replace(' ', '-')}'>
                    ${order.status}
                </span>
            </td>
            <td>${date}</td>
            <td>
                <button class='btn-small' onclick="viewDetails('${order.id}', 'individual')">👁️ عرض</button>
                <button class='btn-small' onclick="editOrder('${order.id}', 'individual')">✏️ تعديل</button>
                <button class='btn-small' onclick="deleteOrder('${order.id}', 'individual')">🗑️ حذف</button>
            </td>
        `;
        table.appendChild(row);
    });
}

// عرض طلبات المجموعات
function displayGroupOrders(orders) {
    const table = document.getElementById('groupOrdersTable');
    if (!table) return;

    table.innerHTML = '';

    if (orders.length === 0) {
        table.innerHTML = '<tr><td colspan="6" style="text-align:center;">لا توجد طلبات مجموعات</td></tr>';
        return;
    }

    // تجميع الطلبات حسب كود الدفعة
    const groupedByBatch = {};
    orders.forEach(order => {
        if (!groupedByBatch[order.batch_code]) {
            groupedByBatch[order.batch_code] = [];
        }
        groupedByBatch[order.batch_code].push(order);
    });

    // عرض كل دفعة
    Object.keys(groupedByBatch).forEach(batchCode => {
        const batchOrders = groupedByBatch[batchCode];
        const firstOrder = batchOrders[0];
        const date = new Date(firstOrder.created_at).toLocaleDateString('ar-SA');
        const representative = firstOrder.representative_name || 'غير محدد';

        // صف الدفعة الرئيسي
        const mainRow = document.createElement('tr');
        mainRow.className = 'batch-row';
        mainRow.innerHTML = `
            <td>
                <button class='expand-btn' onclick="toggleBatchDetails(this, '${batchCode}')">
                    ▼ ${batchCode}
                </button>
            </td>
            <td>${batchOrders.length}</td>
            <td>${representative}</td>
            <td>
                <span class='status-badge status-${firstOrder.status.toLowerCase().replace(' ', '-')}'>
                    ${firstOrder.status}
                </span>
            </td>
            <td>${date}</td>
            <td>
                <button class='btn-small' onclick="viewBatchDetails('${batchCode}')">👁️ عرض</button>
                <button class='btn-small' onclick="editBatch('${batchCode}')">✏️ تعديل</button>
                <button class='btn-small' onclick="deleteBatch('${batchCode}')">🗑️ حذف</button>
            </td>
        `;
        table.appendChild(mainRow);

        // صفوف الطلاب (مخفية افتراضياً)
        batchOrders.forEach((order, studentIndex) => {
            const studentRow = document.createElement('tr');
            studentRow.className = `batch-detail-row batch-${batchCode}`;
            studentRow.style.display = 'none';
            studentRow.innerHTML = `
                <td style='padding-right:40px;'>
                    ➜ الطالب ${studentIndex + 1}
                </td>
                <td>${order.student_name}</td>
                <td>${order.sash_name}</td>
                <td>${order.fabric_type}</td>
                <td>
                    <span class='status-badge status-${order.status.toLowerCase().replace(' ', '-')}'>
                        ${order.status}
                    </span>
                </td>
                <td>
                    <button class='btn-small' onclick="viewDetails('${order.id}', 'group')">👁️ عرض</button>
                    <button class='btn-small' onclick="editOrder('${order.id}', 'group')">✏️ تعديل</button>
                    <button class='btn-small' onclick="deleteOrder('${order.id}', 'group')">🗑️ حذف</button>
                </td>
            `;
            table.appendChild(studentRow);
        });
    });
}

// توسيع/إغلاق تفاصيل الدفعة
function toggleBatchDetails(btn, batchCode) {
    const rows = document.querySelectorAll(`.batch-${batchCode}`);
    const isVisible = rows[0].style.display !== 'none';
    
    rows.forEach(row => {
        row.style.display = isVisible ? 'none' : 'table-row';
    });
    
    btn.textContent = isVisible ? `▶ ${batchCode}` : `▼ ${batchCode}`;
}

// عرض تفاصيل الطلب
async function viewDetails(orderId, type) {
    try {
        let order;
        if (type === 'individual') {
            order = allIndividualOrders.find(o => o.id === orderId);
        } else {
            order = allGroupOrders.find(o => o.id === orderId);
        }

        if (!order) {
            alert('لم يتم العثور على الطلب');
            return;
        }

        currentOrderId = orderId;
        currentOrderType = type;

        const modalBody = document.getElementById('modalBody');
        const date = new Date(order.created_at).toLocaleDateString('ar-SA');
        
        let html = `
            <div class='detail-grid'>
                <div class='detail-item'>
                    <label>معرّف الطلب:</label>
                    <p>${orderId}</p>
                </div>
                <div class='detail-item'>
                    <label>اسم الطالب:</label>
                    <p>${order.student_name}</p>
                </div>
                <div class='detail-item'>
                    <label>الاسم على الوشاح:</label>
                    <p>${order.sash_name}</p>
                </div>
                <div class='detail-item'>
                    <label>نوع القماش:</label>
                    <p>${order.fabric_type}</p>
                </div>
                <div class='detail-item'>
                    <label>الكتابة على الظهر:</label>
                    <p>${order.back_text || 'لا يوجد'}</p>
                </div>
                <div class='detail-item'>
                    <label>الكتابة على القبعة:</label>
                    <p>${order.cap_text || 'لا يوجد'}</p>
                </div>
                <div class='detail-item'>
                    <label>جانب القبعة:</label>
                    <p>${order.side_cap_text || 'لا يوجد'}</p>
                </div>
                <div class='detail-item'>
                    <label>رقم الهاتف:</label>
                    <p>${order.phone || 'لا يوجد'}</p>
                </div>
                <div class='detail-item'>
                    <label>الحالة:</label>
                    <p>${order.status}</p>
                </div>
                <div class='detail-item'>
                    <label>التاريخ:</label>
                    <p>${date}</p>
                </div>
        `;

        if (type === 'individual' && order.measurements) {
            html += `
                <div class='detail-item'>
                    <label>القياسات:</label>
                    <p>${JSON.stringify(order.measurements, null, 2)}</p>
                </div>
            `;
        }

        if (order.additions) {
            html += `
                <div class='detail-item'>
                    <label>الإضافات:</label>
                    <p>${JSON.stringify(order.additions, null, 2)}</p>
                </div>
            `;
        }

        if (type === 'group' && order.representative_name) {
            html += `
                <div class='detail-item'>
                    <label>الممثل:</label>
                    <p>${order.representative_name}</p>
                </div>
            `;
        }

        html += '</div>';
        modalBody.innerHTML = html;

        document.getElementById('detailsModal').style.display = 'block';
    } catch (error) {
        console.error('خطأ في عرض التفاصيل:', error);
        alert('حدث خطأ في عرض التفاصيل');
    }
}

// عرض تفاصيل الدفعة كاملة
async function viewBatchDetails(batchCode) {
    const batchOrders = allGroupOrders.filter(o => o.batch_code === batchCode);
    if (batchOrders.length === 0) {
        alert('لم يتم العثور على الدفعة');
        return;
    }

    const modalBody = document.getElementById('modalBody');
    const firstOrder = batchOrders[0];
    
    let html = `
        <div class='detail-grid'>
            <div class='detail-item'>
                <label>كود الدفعة:</label>
                <p>${batchCode}</p>
            </div>
            <div class='detail-item'>
                <label>عدد الطلاب:</label>
                <p>${batchOrders.length}</p>
            </div>
            <div class='detail-item'>
                <label>الممثل:</label>
                <p>${firstOrder.representative_name || 'غير محدد'}</p>
            </div>
            <div class='detail-item'>
                <label>الحالة:</label>
                <p>${firstOrder.status}</p>
            </div>
        </div>
        <hr>
        <h3>طلاب الدفعة:</h3>
        <div class='students-list'>
    `;

    batchOrders.forEach((order, index) => {
        html += `
            <div class='student-item'>
                <strong>الطالب ${index + 1}: ${order.student_name}</strong><br>
                الاسم على الوشاح: ${order.sash_name}<br>
                نوع القماش: ${order.fabric_type}<br>
                الإضافات: ${order.additions ? JSON.stringify(order.additions) : 'لا يوجد'}
            </div>
        `;
    });

    html += '</div>';
    modalBody.innerHTML = html;
    document.getElementById('detailsModal').style.display = 'block';
}

// تعديل الطلب
async function editOrder(orderId, type) {
    try {
        let order;
        if (type === 'individual') {
            order = allIndividualOrders.find(o => o.id === orderId);
        } else {
            order = allGroupOrders.find(o => o.id === orderId);
        }

        if (!order) {
            alert('لم يتم العثور على الطلب');
            return;
        }

        currentOrderId = orderId;
        currentOrderType = type;

        const editModalBody = document.getElementById('editModalBody');
        
        let html = `
            <div class='edit-form'>
                <div class='form-group'>
                    <label>اسم الطالب:</label>
                    <input type='text' id='editStudentName' value='${order.student_name}'>
                </div>
                <div class='form-group'>
                    <label>الاسم على الوشاح:</label>
                    <input type='text' id='editSashName' value='${order.sash_name}'>
                </div>
                <div class='form-group'>
                    <label>نوع القماش:</label>
                    <input type='text' id='editFabricType' value='${order.fabric_type}'>
                </div>
                <div class='form-group'>
                    <label>الكتابة على الظهر:</label>
                    <input type='text' id='editBackText' value='${order.back_text || ''}'>
                </div>
                <div class='form-group'>
                    <label>الكتابة على القبعة:</label>
                    <input type='text' id='editCapText' value='${order.cap_text || ''}'>
                </div>
                <div class='form-group'>
                    <label>جانب القبعة:</label>
                    <input type='text' id='editSideCapText' value='${order.side_cap_text || ''}'>
                </div>
                <div class='form-group'>
                    <label>رقم الهاتف:</label>
                    <input type='text' id='editPhone' value='${order.phone || ''}'>
                </div>
                <div class='form-group'>
                    <label>الحالة:</label>
                    <select id='editStatus'>
                        <option value='Pending' ${order.status === 'Pending' ? 'selected' : ''}>قيد الانتظار</option>
                        <option value='In Progress' ${order.status === 'In Progress' ? 'selected' : ''}>قيد الإنجاز</option>
                        <option value='Completed' ${order.status === 'Completed' ? 'selected' : ''}>مكتملة</option>
                        <option value='Cancelled' ${order.status === 'Cancelled' ? 'selected' : ''}>ملغاة</option>
                    </select>
                </div>
        `;

        if (type === 'group' && order.representative_name) {
            html += `
                <div class='form-group'>
                    <label>الممثل:</label>
                    <input type='text' id='editRepresentative' value='${order.representative_name}'>
                </div>
            `;
        }

        html += '</div>';
        editModalBody.innerHTML = html;
        document.getElementById('editModal').style.display = 'block';
    } catch (error) {
        console.error('خطأ في تعديل الطلب:', error);
        alert('حدث خطأ');
    }
}

// حفظ التعديلات
async function saveEdit() {
    try {
        const updates = {
            student_name: document.getElementById('editStudentName').value,
            sash_name: document.getElementById('editSashName').value,
            fabric_type: document.getElementById('editFabricType').value,
            back_text: document.getElementById('editBackText').value,
            cap_text: document.getElementById('editCapText').value,
            side_cap_text: document.getElementById('editSideCapText').value,
            phone: document.getElementById('editPhone').value,
            status: document.getElementById('editStatus').value,
        };

        if (currentOrderType === 'group') {
            const repField = document.getElementById('editRepresentative');
            if (repField) {
                updates.representative_name = repField.value;
            }
        }

        const tableName = currentOrderType === 'individual' ? 'individual_orders' : 'group_orders';
        const { error } = await supabase
            .from(tableName)
            .update(updates)
            .eq('id', currentOrderId);

        if (error) throw error;

        alert('تم حفظ التعديلات بنجاح');
        closeEditModal();
        await loadOrders();
        updateStatistics();
    } catch (error) {
        console.error('خطأ في حفظ التعديلات:', error);
        alert('حدث خطأ في حفظ التعديلات');
    }
}

// حذف الطلب
async function deleteOrder(orderId, type) {
    if (!confirm('هل تريد حذف هذا الطلب؟')) return;

    try {
        const tableName = type === 'individual' ? 'individual_orders' : 'group_orders';
        const { error } = await supabase
            .from(tableName)
            .delete()
            .eq('id', orderId);

        if (error) throw error;

        alert('تم حذف الطلب بنجاح');
        await loadOrders();
        updateStatistics();
    } catch (error) {
        console.error('خطأ في حذف الطلب:', error);
        alert('حدث خطأ في حذف الطلب');
    }
}

// حذف الدفعة كاملة
async function deleteBatch(batchCode) {
    if (!confirm('هل تريد حذف هذه الدفعة بالكامل؟')) return;

    try {
        const { error } = await supabase
            .from('group_orders')
            .delete()
            .eq('batch_code', batchCode);

        if (error) throw error;

        alert('تم حذف الدفعة بنجاح');
        await loadOrders();
        updateStatistics();
    } catch (error) {
        console.error('خطأ في حذف الدفعة:', error);
        alert('حدث خطأ في حذف الدفعة');
    }
}

// حذف الطلب من الـ Modal
async function deleteOrderFromModal() {
    if (!currentOrderId) return;
    await deleteOrder(currentOrderId, currentOrderType);
    closeModal();
}

// تطبيق الفلاتر
function applyFilters() {
    const typeFilter = document.getElementById('typeFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    // تصفية الطلبات الفردية
    let filteredIndividual = allIndividualOrders;
    if (statusFilter !== 'all') {
        filteredIndividual = filteredIndividual.filter(o => o.status === statusFilter);
    }
    if (searchInput) {
        filteredIndividual = filteredIndividual.filter(o =>
            o.student_name.toLowerCase().includes(searchInput) ||
            o.sash_name.toLowerCase().includes(searchInput) ||
            o.phone?.toLowerCase().includes(searchInput)
        );
    }

    // تصفية طلبات المجموعات
    let filteredGroups = allGroupOrders;
    if (statusFilter !== 'all') {
        filteredGroups = filteredGroups.filter(o => o.status === statusFilter);
    }
    if (searchInput) {
        filteredGroups = filteredGroups.filter(o =>
            o.batch_code.toLowerCase().includes(searchInput) ||
            o.student_name.toLowerCase().includes(searchInput) ||
            o.representative_name?.toLowerCase().includes(searchInput)
        );
    }

    // عرض النتائج حسب الفلتر
    if (typeFilter === 'individual' || typeFilter === 'all') {
        displayIndividualOrders(filteredIndividual);
    } else {
        document.getElementById('individualOrdersTable').innerHTML = '';
    }

    if (typeFilter === 'group' || typeFilter === 'all') {
        displayGroupOrders(filteredGroups);
    } else {
        document.getElementById('groupOrdersTable').innerHTML = '';
    }
}

// إعادة تعيين الفلاتر
function resetFilters() {
    document.getElementById('typeFilter').value = 'all';
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('searchInput').value = '';
    displayIndividualOrders(allIndividualOrders);
    displayGroupOrders(allGroupOrders);
}

// تحديث الإحصائيات
function updateStatistics() {
    const totalOrders = allIndividualOrders.length + allGroupOrders.length;
    const totalIndividual = allIndividualOrders.length;
    const totalGroups = allGroupOrders.length;
    const pending = allIndividualOrders.filter(o => o.status === 'Pending').length +
                    allGroupOrders.filter(o => o.status === 'Pending').length;
    const inProgress = allIndividualOrders.filter(o => o.status === 'In Progress').length +
                       allGroupOrders.filter(o => o.status === 'In Progress').length;
    const completed = allIndividualOrders.filter(o => o.status === 'Completed').length +
                      allGroupOrders.filter(o => o.status === 'Completed').length;

    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('totalIndividual').textContent = totalIndividual;
    document.getElementById('totalGroups').textContent = totalGroups;
    document.getElementById('pendingOrders').textContent = pending;
    document.getElementById('inProgressOrders').textContent = inProgress;
    document.getElementById('completedOrders').textContent = completed;
}

// إغلاق Modals
function closeModal() {
    document.getElementById('detailsModal').style.display = 'none';
    currentOrderId = null;
    currentOrderType = null;
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    currentOrderId = null;
    currentOrderType = null;
}

// إغلاق الـ Modal عند الضغط خارجها
window.onclick = function(event) {
    const modal = document.getElementById('detailsModal');
    const editModal = document.getElementById('editModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
    if (event.target === editModal) {
        editModal.style.display = 'none';
    }
};