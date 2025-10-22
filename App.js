import * as Auth from './Module/AuthModule.js';
import * as EmployeeDb from './Module/EmployeeDbModule.js';
import * as AddEmployee from './Module/AddEmployeeModule.js';
import * as EditEmployee from './Module/EditEmployeeModule.js';
import * as DeleteEmployee from './Module/DeleteEmployeeModule.js';
import * as SearchEmployee from './Module/searchEmployeeModule.js';
import * as Department from './Module/DepartmentModule.js';
import * as Position from './Module/PositionModule.js';
import * as Salary from './Module/salaryModule.js';
import * as Attendance from './Module/AttendanceModule.js';
import * as Leave from './Module/LeaveModule.js';
import * as Performance from './Module/PerformanceModule.js';
const modules = {
    addEmployee: AddEmployee,
    editEmployee: EditEmployee,
    deleteEmployee: DeleteEmployee,
    searchEmployee: SearchEmployee,
    department: Department,
    position: Position,
    salary: Salary,
    attendance: Attendance,
    leave: Leave,
    performance: Performance
};
function initApp() {
    console.log('initApp được gọi'); // Debug: Xem initApp có chạy không
    const loginForm = document.getElementById('loginForm');
    const registerBtn = document.getElementById('registerBtn');
    const logout = document.getElementById('logout');
    const menu = document.getElementById('menu');
    const content = document.getElementById('content');
    const loginDiv = document.getElementById('login-form');
    const dashboard = document.getElementById('dashboard');
    const registerForm = document.getElementById('registerForm');
    const registerDiv = document.getElementById('register-form');
    const switchToLogin = document.getElementById('switchToLogin');
    console.log('Elements:', { loginForm, registerForm, registerDiv, switchToLogin }); // 
    if (dashboard) {
        dashboard.style.display = 'none';
        content.innerHTML = ''; // Clear bất kỳ nội dung nào nếu module load sớm
    }
    if (Auth.isLoggedIn()) {
        console.log('Đã login, show dashboard');
        showDashboard();
    } else {
        console.log('Chưa login, show register');
        showRegister();
    }
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const success = await Auth.login(username, password);
        if (success) {
            showDashboard();
        } else {
            alert('Invalid credentials');
        }
    });
    registerBtn.addEventListener('click', () => {
        const username = prompt('Enter username');
        const password = prompt('Enter password');
        Auth.register(username, password);
    });
    logout.addEventListener('click', () => {
        Auth.logout();
        showLogin();
    });
    menu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && e.target.dataset.module) {
            e.preventDefault();
            const moduleName = e.target.dataset.module;
            content.innerHTML = '';
            modules[moduleName].init(content);
        }
    });
    registerForm.addEventListener('submit', (e) => {
        console.log('Register form submit fired!'); // Xem event có chạy không
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;
        console.log('Register data:', { username, password });
        Auth.register(username, password);
        console.log('Sau register, gọi showLogin');
        showLogin();
    });
    switchToLogin.addEventListener('click', () => {
        console.log('Switch to login clicked!');
        showLogin();
    });
    EmployeeDb.initDefaultData();
    Department.initDefaultData();
    Position.initDefaultData();
    Attendance.initDefaultData();
    Leave.initDefaultData();
    Performance.initDefaultData();
    function showDashboard() {
        console.log('Calling showDashboard');
        loginDiv.style.display = 'none';
        registerDiv.style.display = 'none';
        dashboard.style.display = 'block';  // Hiển thị dashboard
        content.innerHTML = '';  // Clear trước khi load
        modules['searchEmployee'].init(content);  // Load nội dung
    }
    function showLogin() {
        console.log('Calling showLogin');
        dashboard.style.display = 'none';  // Ẩn dashboard
        content.innerHTML = '';  // Clear content
        loginDiv.style.display = 'block';
        registerDiv.style.display = 'none';
    }
    function showRegister() {
        console.log('Calling showRegister');
        dashboard.style.display = 'none';  // Ẩn dashboard
        content.innerHTML = '';  // Clear content
        loginDiv.style.display = 'none';
        registerDiv.style.display = 'block';
    }
}
document.addEventListener('DOMContentLoaded', initApp);