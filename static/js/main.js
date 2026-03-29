/**
 * Main Application Logic for EasyCarHireNaija
 * Handles Service Worker Registration & Custom UI Notifications
 */

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/static/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Dynamic Footer Year
document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.innerText = new Date().getFullYear();
    }
});

// Singleton Notification Modal Instance
let notificationModalInstance = null;

function showAppNotification(title, message) {
    const modalEl = document.getElementById('notiModal');
    if (!modalEl) return;
    
    if (!notificationModalInstance) {
        notificationModalInstance = new bootstrap.Modal(modalEl);
    }
    
    // Safety: Force clear any lingering backdrops or modal-open classes
    // This solves edge cases where multiple modals conflict
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    document.body.classList.remove('modal-open');
    document.body.style.paddingRight = '';
    
    document.getElementById('notiTitle').innerText = title;
    document.getElementById('notiBody').innerText = message;
    notificationModalInstance.show();
}

// Singleton Toast Instance
let toastInstance = null;

function showToast(title, message) {
    const toastEl = document.getElementById('appToast');
    if (!toastEl) return;
    
    if (!toastInstance) {
        toastInstance = new bootstrap.Toast(toastEl, { delay: 4000 });
    }
    
    document.getElementById('toastTitle').innerText = title;
    document.getElementById('toastBody').innerText = message;
    toastInstance.show();
}

// UI Triggers
document.getElementById('notiBell')?.addEventListener('click', requestNotificationPermission);

// Permission Logic
async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        showAppNotification('System Error', 'This browser does not support notifications.');
        return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        showAppNotification('Success', 'Notifications enabled! You will now receive luxury car updates.');
    } else {
        showAppNotification('Access Denied', 'Notification permission was denied.');
    }
}

/**
 * Universal Notification Utility (Native & In-App)
 */
function notifyUser(title, body) {
    // 1. Browser Native Push (if permitted)
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification(title, {
                body: body,
                icon: 'https://cdn-icons-png.flaticon.com/512/744/744465.png',
                vibrate: [200, 100, 200]
            });
        });
    }
    
    // 2. In-App Toast (Non-blocking backup)
    showToast(title, body);
}
