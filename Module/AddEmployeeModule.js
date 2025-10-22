import * as EmployeeDb from './EmployeeDbModule.js';
import * as Department from './DepartmentModule.js';
import * as Position from './PositionModule.js';
export function init(content) {
  const form = document.createElement('form');
  form.innerHTML = `
        <h2>Thêm Nhân Viên</h2>
        <input type="text" id="ten" placeholder="Tên" required>
        <select id="MaPhongBan">
            ${Department.getAllDepartments().map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
        </select>
        <select id="positionId">
            ${Position.getAllPositions().map(p => `<option value="${p.id}">${p.title}</option>`).join('')}
        </select>
        <input type="number" id="luong" placeholder="Lương" required min="0">
        <input type="date" id="hireDate" required>
        <button type="submit">Thêm</button>
    `;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('ten').value.trim();
    const departmentId = parseInt(document.getElementById('MaPhongBan').value);
    const positionId = parseInt(document.getElementById('positionId').value);
    const salary = parseFloat(document.getElementById('luong').value);
    const hireDate = document.getElementById('hireDate').value;

    if (!name || salary <= 0 || !hireDate) {
        alert('Invalid input');
        return;
    }

    const employee = { name, departmentId, positionId, salary, hireDate, bonus: 0, deduction: 0 };
    EmployeeDb.addEmployee(employee);
    alert('Employee added');
    form.reset();
});

  content.appendChild(form);
}