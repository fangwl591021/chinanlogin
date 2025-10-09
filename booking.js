const GAS_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
let userProfile = null;

async function initializeBooking() {
    try {
        await liff.init({ liffId: '2008231249-yv8294Jp' });
        
        if (!liff.isLoggedIn()) {
            liff.login();
            return;
        }

        userProfile = await liff.getProfile();
        loadBookingInterface();
        
    } catch (error) {
        console.error('預約頁面初始化失敗:', error);
        showError('系統初始化失敗，請重新整理頁面');
    }
}

function loadBookingInterface() {
    document.getElementById('bookingApp').innerHTML = `
        <div class="booking-interface">
            <h2>選擇乘車班次</h2>
            <div id="schedulesList">
                <p>載入班次中...</p>
            </div>
            <div class="user-info">
                <p>歡迎，${userProfile.displayName}</p>
            </div>
        </div>
    `;
    
    loadSchedules();
}

async function loadSchedules() {
    try {
        const today = new Date().toLocaleDateString('zh-TW');
        const response = await fetch(`${GAS_URL}?action=getSchedules&date=${today}`);
        const data = await response.json();
        
        if (data.error) throw new Error(data.error);
        
        displaySchedules(data.schedules);
        
    } catch (error) {
        console.error('載入班次失敗:', error);
        document.getElementById('schedulesList').innerHTML = '<p>載入班次失敗</p>';
    }
}

function displaySchedules(schedules) {
    const schedulesHTML = schedules.map(schedule => `
        <div class="schedule-card">
            <h3>班次 ${schedule.id}</h3>
            <p>時間: ${schedule.time}</p>
            <p>剩餘座位: ${schedule.availableSeats}/${schedule.totalSeats}</p>
            <button class="btn-primary" onclick="bookSchedule('${schedule.id}')" 
                    ${schedule.availableSeats === 0 ? 'disabled' : ''}>
                ${schedule.availableSeats === 0 ? '已額滿' : '預約'}
            </button>
        </div>
    `).join('');
    
    document.getElementById('schedulesList').innerHTML = schedulesHTML;
}

function bookSchedule(scheduleId) {
    alert(`預約班次 ${scheduleId} - 功能開發中`);
    // 這裡會實現實際的預約邏輯
}

function showError(message) {
    alert('錯誤: ' + message);
}

document.addEventListener('DOMContentLoaded', initializeBooking);
