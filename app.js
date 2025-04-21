import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
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

// Hàm thêm sản phẩm vào Firebase
function addProduct(masp, soluong) {
  const productRef = ref(database, "order");
  const newProductRef = push(productRef);

  set(newProductRef, {
    masp: masp,
    soluong: parseInt(soluong),
  })
    .then(() => {
      console.log("✅ Sản phẩm đã được thêm vào Firebase!");

      document.getElementById("masp").value = "";
      document.getElementById("soluong").value = "";
    })
    .catch((error) => console.error("❌ Lỗi khi thêm sản phẩm:", error));
}

// Hàm xử lý khi nhấn nút "Gửi"
function submitForm() {
  let masp = document.getElementById("masp").value.trim();
  let soluong = document.getElementById("soluong").value.trim();

  addProduct(masp, soluong);
}

// Đợi DOM load xong rồi mới gán sự kiện
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("submitBtn").addEventListener("click", submitForm);
});

document.getElementById("masp").value = "";
document.getElementById("soluong").value = "";
