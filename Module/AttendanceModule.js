export function initDefaultData() {
  if (!localStorage.getItem("attendance")) {
    localStorage.setItem("attendance", JSON.stringify([]));
  }
}

function getAttendance() {
  return JSON.parse(localStorage.getItem("attendance")) || [];
}

function saveAttendance(attendance) {
  localStorage.setItem("attendance", JSON.stringify(attendance));
}

export function checkIn(employeeId) {
  const attendance = getAttendance();
  const today = new Date().toISOString().split("T")[0];
  const exists = attendance.find(
    (r) => r.date === today && r.employeeId === employeeId && !r.checkOut
  );
  if (exists) throw new Error("Nhân viên đã điểm danh vào hôm nay rồi!");
  attendance.push({
    date: today,
    employeeId,
    checkIn: new Date().toISOString(),
    checkOut: null,
  });
  saveAttendance(attendance);
}

export function checkOut(employeeId) {
  const attendance = getAttendance();
  const today = new Date().toISOString().split("T")[0];
  const record = attendance.find(
    (r) => r.date === today && r.employeeId === employeeId && !r.checkOut
  );
  if (!record) throw new Error("Chưa điểm danh vào hoặc đã ra rồi!");
  record.checkOut = new Date().toISOString();
  saveAttendance(attendance);
}

export function getAttendanceReport(employeeId, fromDate, toDate) {
  const attendance = getAttendance().filter(
    (r) =>
      r.employeeId === employeeId &&
      r.date >= fromDate &&
      r.date <= toDate
  );
  return attendance.map((r) => {
    if (r.checkOut) {
      const hours =
        (new Date(r.checkOut) - new Date(r.checkIn)) / (1000 * 60 * 60);
      return { ...r, hours: hours.toFixed(2) };
    }
    return { ...r, hours: "Chưa" };
  });
}
export function init(content) {
  const form = document.createElement("form");
  form.innerHTML = `
    <h2>Chấm Công</h2>
    <input type="number" id="attEmpId" placeholder="ID Nhân Viên" required>
    <button type="button" id="checkInBtn">Điểm Danh Vào</button>
    <button type="button" id="checkOutBtn">Điểm Danh Ra</button>
    <br><br>
    <input type="date" id="fromDate">
    <input type="date" id="toDate">
    <button type="submit">Lấy Báo Cáo</button>
    <p id="attMsg" style="color:red;"></p>
  `;

  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr><th>Ngày</th><th>Vào</th><th>Ra</th><th>Giờ Làm</th></tr>
    </thead>
    <tbody></tbody>
  `;
  const checkInBtn = form.querySelector("#checkInBtn");
  const checkOutBtn = form.querySelector("#checkOutBtn");
  const msg = form.querySelector("#attMsg");

  checkInBtn.addEventListener("click", () => {
    try {
      const id = parseInt(form.querySelector("#attEmpId").value);
      checkIn(id);
      msg.style.color = "green";
      msg.textContent = "✅ Đã điểm danh vào!";
    } catch (e) {
      msg.style.color = "red";
      msg.textContent = e.message;
    }
  });

  checkOutBtn.addEventListener("click", () => {
    try {
      const id = parseInt(form.querySelector("#attEmpId").value);
      checkOut(id);
      msg.style.color = "green";
      msg.textContent = "✅ Đã điểm danh ra!";
    } catch (e) {
      msg.style.color = "red";
      msg.textContent = e.message;
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = parseInt(form.querySelector("#attEmpId").value);
    const fromDate = form.querySelector("#fromDate").value || "1900-01-01";
    const toDate =
      form.querySelector("#toDate").value ||
      new Date().toISOString().split("T")[0];

    const report = getAttendanceReport(id, fromDate, toDate);
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";

    if (report.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4">Không có dữ liệu</td></tr>`;
      return;
    }

    report.forEach((r) => {
      const row = `
        <tr>
          <td>${r.date}</td>
          <td>${r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : "-"}</td>
          <td>${r.checkOut ? new Date(r.checkOut).toLocaleTimeString() : "-"}</td>
          <td>${r.hours}</td>
        </tr>`;
      tbody.innerHTML += row;
    });
  });
  content.innerHTML = "";
  content.appendChild(form);
  content.appendChild(table);
}
