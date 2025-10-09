const GAS_URL = 'https://script.google.com/macros/s/AKfycbwkcw58SxvxRyHb1sRrxxIUM-L76L-Idnbv0gKh_W3M3t8P86h7X0TtIHyMrwtGWb3Jfg/exec';
let userProfile = null;

// 等待頁面完全載入
window.addEventListener('load', function() {
    initializeBooking();
});

async function initializeBooking() {
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
        loadBookingInterface();
        
    } catch (error) {
        console.error('預約頁面初始化失敗:', error);
        showError('系統初始化失敗: ' + error.message);
    }
}

// 其餘函數保持不變...
