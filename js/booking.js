/**
 * Booking Calendar Logic for Elite Drive
 */

document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const bookingModal = new bootstrap.Modal(document.getElementById('bookingModal'));
    const adminModal = new bootstrap.Modal(document.getElementById('adminModal'));
    const dateText = document.getElementById('selectedDateText');

    // Mock Booking Data for Admin View
    const mockBookings = [
        {
            title: 'Mercedes G-Wagon',
            start: '2026-03-25',
            backgroundColor: '#000',
            borderColor: '#000',
            extendedProps: {
                customerName: 'Obinna Okafor',
                address: '12 Luxury Lane, Victoria Island, Lagos',
                email: 'obinna@example.com',
                phone: '+234 801 234 5678'
            }
        },
        {
            title: 'Porsche 911',
            start: '2026-03-28',
            backgroundColor: '#d63384',
            borderColor: '#d63384',
            extendedProps: {
                customerName: 'Sarah Lawson',
                address: 'Plot 45, Maitama, Abuja',
                email: 'sarah@luxury.ng',
                phone: '+234 902 333 4444'
            }
        }
    ];

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        selectable: true,
        select: function(info) {
            const selectedDate = info.startStr;
            dateText.innerText = selectedDate;
            
            // Smart Availability Check
            const carSelect = document.getElementById('carSelection');
            carSelect.innerHTML = '<option selected>Select a vehicle...</option>';
            
            // Find which cars are already booked for THIS specific date
            const bookedCarTitles = mockBookings
                .filter(b => b.start === selectedDate)
                .map(b => b.title);

            // Populate only with available cars (or show as booked)
            cars.forEach(car => {
                const isBooked = bookedCarTitles.includes(car.name);
                const option = document.createElement('option');
                option.value = car.name;
                option.textContent = isBooked ? `${car.name} (Already Booked)` : car.name;
                if (isBooked) {
                    option.disabled = true;
                    option.classList.add('text-muted');
                }
                carSelect.appendChild(option);
            });

            bookingModal.show();
        },
        // Display Car Names on the Calendar
        events: mockBookings,
        // Admin Interaction
        eventClick: function(info) {
            const props = info.event.extendedProps;
            document.getElementById('adminName').innerText = props.customerName;
            document.getElementById('adminCar').innerText = info.event.title;
            document.getElementById('adminAddress').innerText = props.address;
            document.getElementById('adminEmail').innerText = props.email;
            document.getElementById('adminPhone').innerText = props.phone;
            
            adminModal.show();
        }
    });

    calendar.render();

    const confirmBtn = document.getElementById('confirmBooking');
    confirmBtn.addEventListener('click', () => {
        const car = document.getElementById('carSelection').value;
        if(car === 'Select a vehicle...') {
            alert('Please select a vehicle first.');
            return;
        }

        // Disable button to prevent multiple submissions
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Processing...';

        // 1. Set up a ONE-TIME listener for when the modal is FULLY hidden
        document.getElementById('bookingModal').addEventListener('hidden.bs.modal', function () {
            // 2. Brute-force cleanup just in case Bootstrap transition gets stuck
            document.body.classList.remove('modal-open');
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
            document.body.style.paddingRight = '';

            // 3. Now show the non-blocking success toast
            notifyUser('Booking confirmed!', `Your ${car} is reserved for ${dateText.innerText}. See you then!`);
            
            // Reset button
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = 'Confirm Selection';
        }, { once: true });

        // 4. Hide the booking modal
        bookingModal.hide();
    });
});
