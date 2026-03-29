/**
 * Service Worker for Elite Drive
 * Handles Push Notifications and Caching
 */

self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    // Future: Add caching logic here
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
});

self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : { title: 'EasyCarHireNaija', body: 'New car available!' };
    
    const options = {
        body: data.body,
        icon: '/img/logo.png', // Placeholder
        badge: '/img/badge.png', // Placeholder
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '1'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});
