export function initDefaultData() {
    if (!localStorage.getItem('departments')) {
        const defaults = [
            { id: 1, name: 'IT', managerId: 1 },
            { id: 2, name: 'HR', managerId: 2 }

        ];
        localStorage.setItem('departments', JSON.stringify(defaults));
    }
}
export function getAllDepartments() {
    return JSON.parse(localStorage.getItem('departments')) || [];
}
export function getDepartmentById(id) {
    return getAllDepartments().find(d => d.id === id);
}
export function addDepartment(name) {
    const depts = getAllDepartments();
    const id = Math.max(...depts.map(d => d.id), 0) + 1;
    depts.push({ id, name, managerId: null });
    saveDepartments(depts);
}
export function editDepartment(id, newName) {
    let depts = getAllDepartments();
    depts = depts.map(d => d.id === id ? { ...d, name: newName } : d);
    saveDepartments(depts);
}
export function deleteDepartment(id) {
    let depts = getAllDepartments();
    depts = depts.filter(d => d.id !== id);
    saveDepartments(depts);
}
function saveDepartments(depts) {
    localStorage.setItem('departments', JSON.stringify(depts));
}
export function init(content) {
    const table = document.createElement('table');
    table.innerHTML = '<thead><tr><th>ID</th><th>Tên</th><th>Hành Động</th></tr></thead><tbody></tbody>';
    const tbody = table.querySelector('tbody');
    refreshTable();
    const addForm = document.createElement('form');
    addForm.innerHTML = `
        <h2>Quản Lý Phòng Ban</h2>
        <input type="text" id="deptName" placeholder="Tên Phòng Ban" required>
        <button type="submit">Thêm</button>
    `;
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('deptName').value.trim();
        if (name) {
            addDepartment(name);
            refreshTable();
            addForm.reset();
        }
    });
    function refreshTable() {
        tbody.innerHTML = '';
        getAllDepartments().forEach(d => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${d.id}</td><td>${d.name}</td><td></td>`;
            const actions = row.querySelector('td:last-child');

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Sửa';
            editBtn.addEventListener('click', () => {
                const newName = prompt('Tên mới', d.name);
                if (newName) {
                    editDepartment(d.id, newName);
                    refreshTable();
                }
            });
            const delBtn = document.createElement('button');
            delBtn.textContent = 'Xóa';
            delBtn.addEventListener('click', () => {
                if (confirm('Xóa phòng ban?')) {
                    deleteDepartment(d.id);
                    refreshTable();
                }
            });
            actions.appendChild(editBtn);
            actions.appendChild(delBtn);
            tbody.appendChild(row);
        });
    }
    content.appendChild(addForm);
    content.appendChild(table);
}