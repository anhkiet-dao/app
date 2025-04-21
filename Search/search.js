import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  child,
  push,
  set,
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCOsWpn50GmILkdfGoHluQ8SFIN3tIUDtE",
  authDomain: "nt131p22.firebaseapp.com",
  databaseURL:
    "https://nt131p22-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nt131p22",
  storageBucket: "nt131p22.appspot.com",
  messagingSenderId: "485453782957",
  appId: "1:485453782957:web:e3f269e3a57e083fd4cb24",
  measurementId: "G-QVQ8RGM1J1",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, push, set };

async function searchByInvoiceNumber(soHoaDon) {
  try {
    const dbRef = ref(database);
    const revenueSnapshot = await get(child(dbRef, "donHang"));

    if (!revenueSnapshot.exists()) {
      console.warn("Không có dữ liệu doanh thu.");
      return;
    }

    let foundOrder = null;

    revenueSnapshot.forEach((childSnapshot) => {
      const order = childSnapshot.val();
      if (order.soHoaDon === soHoaDon) {
        foundOrder = order;
      }
    });

    const tableBody = document.querySelector("#sanPhamTable tbody");
    if (!tableBody) {
      console.error("Không tìm thấy phần tử bảng sản phẩm.");
      return;
    }

    tableBody.innerHTML = "";
    if (foundOrder) {
      foundOrder.danhSachSanPham.forEach((item) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = item.maSP;
        row.insertCell(1).textContent = item.tenSP;
        row.insertCell(2).textContent = item.giaSP.toLocaleString();
        row.insertCell(3).textContent = item.soLuong;
        row.insertCell(4).textContent = (
          item.giaSP * item.soLuong
        ).toLocaleString();
        row.insertCell(5).textContent = `${item.giamGia}%`;
        row.insertCell(6).textContent = item.thanhToan.toLocaleString();
      });

      // Hiển thị thông tin số hóa đơn và thời gian
      document.getElementById("invoiceInfo").innerHTML = `
        <strong>Số Hóa Đơn:</strong> ${foundOrder.soHoaDon} <br>
        <strong>Thời Gian:</strong> ${foundOrder.thoiGian} <br>
        <strong>Tổng tiền: </strong> ${foundOrder.tongTien.toLocaleString()} VND
      `;

      // Hiển thị bảng
      document.getElementById("sanPhamTable").style.display = "table";
    } else {
      // Nếu không tìm thấy hóa đơn, cập nhật UI rõ ràng
      document.getElementById("invoiceInfo").innerHTML =
        "<p style='color: red; font-weight: bold;'>Không tìm thấy hóa đơn với số này.</p>";

      document.getElementById("sanPhamTable").style.display = "none";
      document.getElementById("tongThanhToan").innerText = ""; // Ẩn tổng thanh toán
    }
  } catch (error) {
    console.error("Lỗi khi tìm kiếm hóa đơn:", error);
  }
}

// Lắng nghe sự kiện khi người dùng nhấn nút tìm kiếm
document.getElementById("searchBtn").addEventListener("click", () => {
  const soHoaDonInput = document.getElementById("soHoaDonInput");
  if (soHoaDonInput) {
    const soHoaDonValue = soHoaDonInput.value.trim();
    if (soHoaDonValue) {
      searchByInvoiceNumber(soHoaDonValue);
    } else {
      alert("Vui lòng nhập số hóa đơn.");
    }
  } else {
    console.error("Không tìm thấy phần tử 'soHoaDonInput'...");
  }
});

// Tải dữ liệu khi trang web đã sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  loadRevenueData();
});
