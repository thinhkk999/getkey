import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-database.js";

// Cấu hình Firebase đồng bộ với trang chính
const firebaseConfig = {
    apiKey: "AIzaSyBbakrOVPpA2gEtVAJJ--yxZi8N7iGg8R0",
    authDomain: "dung-online.firebaseapp.com",
    databaseURL: "https://sharehub-feee9-default-rtdb.firebaseio.com",
    projectId: "dung-online",
    storageBucket: "dung-online.firebasestorage.app",
    messagingSenderId: "544119334753",
    appId: "1:544119334753:web:813f1ec13c4415e841c720",
    measurementId: "G-M40B1EE5FV"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const generatedKeyInput = document.getElementById('generatedKeyInput');
const copyKeyBtn = document.getElementById('copyKeyBtn');
const backHomeBtn = document.getElementById('backHomeBtn');
const statusMsg = document.getElementById('statusMsg');

// Link gốc trang chính của bạn
const ORIGIN_URL = "https://cheatfreefireios.github.io/teminux-freefire-/";

// Hàm sinh chuỗi ngẫu nhiên sau tiền tố teminux-
function generateRandomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `teminux-${result}`;
}

// Khởi tạo Key và đẩy lên Firebase ngay khi mở trang
async function initAndSaveKey() {
    const newKey = generateRandomString(8);
    generatedKeyInput.value = newKey;
    statusMsg.style.color = '#ffaa33';
    statusMsg.innerText = '[+] Đang đồng bộ key lên máy chủ...';

    try {
        await set(ref(db, 'rootver_codes/' + newKey), {
            created_at: new Date().toISOString(),
            status: 'active',
            source: 'auto_getkey'
        });
        statusMsg.style.color = '#33ff77';
        statusMsg.innerText = '[✓] Key đã sẵn sàng! Hãy bấm sao chép.';
    } catch (error) {
        statusMsg.style.color = '#ff3333';
        statusMsg.innerText = '[X] Lỗi kết nối máy chủ: ' + error.message;
    }
}

// Sự kiện nút Sao Chép
copyKeyBtn.addEventListener('click', () => {
    const keyVal = generatedKeyInput.value;
    if (!keyVal || keyVal.includes('Đang khởi tạo')) return;

    generatedKeyInput.select();
    generatedKeyInput.setSelectionRange(0, 99999); // Hỗ trợ mobile iOS/Android
    navigator.clipboard.writeText(keyVal).then(() => {
        statusMsg.style.color = '#33ff77';
        statusMsg.innerText = `[✓] Đã sao chép: ${keyVal}`;
        copyKeyBtn.innerText = '[ ĐÃ SAO CHÉP! ]';
        setTimeout(() => {
            copyKeyBtn.innerText = '[ SAO CHÉP KEY ]';
        }, 2000);
    }).catch(() => {
        // Fallback nếu trình duyệt chặn clipboard API
        document.execCommand('copy');
        statusMsg.innerText = `[✓] Đã sao chép: ${keyVal}`;
    });
});

// Sự kiện nút Quay Lại Link Gốc
backHomeBtn.addEventListener('click', () => {
    window.location.href = ORIGIN_URL;
});

// Chạy hàm tạo key khi tải trang
window.addEventListener('DOMContentLoaded', initAndSaveKey);
