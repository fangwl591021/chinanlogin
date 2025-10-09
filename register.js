const GAS_URL = 'https://script.google.com/macros/s/AKfycbzKZNfyLWWIKCEe_yzlZZP8KcWcjREeHAb36-X2HbIflXh0kCTxFJxkO8KIEv4Z6_3Pew/exec';
let userProfile = null;

// 等待頁面完全載入
window.addEventListener('load', function() {
    initializeLiff();
});

async function initializeLiff() {
    try {
        // 檢查 liff 物件是否存在
        if (typeof liff === 'undefined') {
            throw new Error('LIFF SDK 載入失敗');
        }

        await liff.init({ liffId: '2008231249-yv8294Jp' });
        
        if (!liff.isLoggedIn()) {
            liff.login();
            return;
        }

        userProfile = await liff.getProfile();
        showRegisterForm();
        
    } catch (error) {
        console.error('LIFF 初始化失敗:', error);
        showError('系統初始化失敗: ' + error.message);
    }
}

// 其餘函數保持不變...
function showRegisterForm() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    
    if (userProfile) {
        document.getElementById('name').value = userProfile.displayName;
    }
}

function showUserInfo(userData) {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('userInfo').style.display = 'block';
    
    document.getElementById('infoName').textContent = userData.name;
    document.getElementById('infoPhone').textContent = userData.phone;
    document.getElementById('infoStudentId').textContent = userData.studentId || '未填寫';
    document.getElementById('infoDepartment').textContent = userData.department || '未填寫';
}

function goToBooking() {
    window.location.href = 'booking.html';
}

function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

function showError(message) {
    alert('錯誤: ' + message);
}

// 表單提交處理
document.getElementById('userForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!userProfile) {
        showError('使用者資料未載入完成');
        return;
    }

    const formData = {
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        studentId: document.getElementById('studentId').value.trim(),
        department: document.getElementById('department').value.trim()
    };

    if (!validateForm(formData)) return;

    await submitRegistration(formData);
});

function validateForm(data) {
    if (!data.name) {
        showError('請填寫姓名');
        return false;
    }
    
    if (!data.phone || !/^09[0-9]{8}$/.test(data.phone)) {
        showError('請填寫正確的手機號碼');
        return false;
    }
    
    if (!document.getElementById('agreement').checked) {
        showError('請同意服務條款及隱私權政策');
        return false;
    }
    
    return true;
}

async function submitRegistration(formData) {
    try {
        showLoading(true);
        document.getElementById('submitBtn').disabled = true;
        
        const updateUrl = `${GAS_URL}?action=updateUser&userId=${userProfile.userId}&name=${encodeURIComponent(formData.name)}&phone=${formData.phone}&studentId=${encodeURIComponent(formData.studentId)}&department=${encodeURIComponent(formData.department)}`;
        
        const response = await fetch(updateUrl);
        const data = await response.json();
        
        if (data.error) throw new Error(data.error);
        
        showUserInfo(formData);
        
    } catch (error) {
        console.error('註冊失敗:', error);
        showError('註冊失敗: ' + error.message);
    } finally {
        showLoading(false);
        document.getElementById('submitBtn').disabled = false;
    }
}
