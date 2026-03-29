document.addEventListener('DOMContentLoaded', async function() {
    const calendarEl = document.getElementById('calendar');
    const bookingModal = new bootstrap.Modal(document.getElementById('bookingModal'));
    const adminModal = new bootstrap.Modal(document.getElementById('adminModal'));
    const dateText = document.getElementById('selectedDateText');
    const startDateInput = document.getElementById('startDate');
    const numDaysInput = document.getElementById('numDays');
    const endDateInput = document.getElementById('endDate');
    const carSelection = document.getElementById('carSelection');
    const bookingTotalAmount = document.getElementById('bookingTotalAmount');
    const bookingUpkeepAmount = document.getElementById('bookingUpkeepAmount');
    const selectedDaysCount = document.getElementById('selectedDaysCount');
    const bookingForm = document.getElementById('bookingForm');
    const confirmBtn = document.getElementById('confirmBooking');
    
    // New fields
    const multiDayToggle = document.getElementById('multiDayToggle');
    const hourlyFields = document.getElementById('hourlyFields');
    const multiDayFields = document.getElementById('multiDayFields');
    const overtimeHoursInput = document.getElementById('overtimeHours');
    
    // New display fields
    const hourlyBasePriceDisplay = document.getElementById('hourlyBasePriceDisplay');
    const overtimeRateDisplay = document.getElementById('overtimeRateDisplay');

    // Get cars from globally injected djangoCars array
    let availableCars = [];
    if (typeof djangoCars !== 'undefined' && djangoCars.length > 0) {
        availableCars = djangoCars;
    } else if (typeof cars !== 'undefined') {
        availableCars = cars;
    }
    console.log("Cars for booking:", availableCars);

    if (typeof FullCalendar === 'undefined') {
        console.error("FullCalendar not found!");
        return;
    }

    // Fetch real bookings from Django API
    let bookings = [];
    try {
        const response = await fetch('/api/bookings/');
        const data = await response.json();
        bookings = data.events || [];
    } catch (e) {
        console.error("Failed to fetch bookings:", e);
    }

    let currentStart = null;
    let currentEnd = null;

    function calculateAmount() {
        const selectedCar = availableCars.find(car => String(car.id) === carSelection.value);
        
        if (selectedCar) {
            let totalAmount = 0;
            let upkeepTotal = 0;

            if (multiDayToggle.checked) {
                const days = parseInt(numDaysInput.value) || 1;
                const carTotal = parseFloat(selectedCar.price) * days;
                upkeepTotal = parseFloat(selectedCar.driver_upkeep) * days;
                totalAmount = carTotal + upkeepTotal;
            } else {
                const basePrice = parseFloat(selectedCar.hourly_rate);
                totalAmount = basePrice;
                upkeepTotal = 0;
                
                // Update display fields if they exist
                if (hourlyBasePriceDisplay) hourlyBasePriceDisplay.textContent = basePrice.toLocaleString();
                if (overtimeRateDisplay) overtimeRateDisplay.textContent = parseFloat(selectedCar.overtime_rate).toLocaleString();
            }
            
            if (bookingUpkeepAmount) bookingUpkeepAmount.textContent = upkeepTotal.toLocaleString();
            bookingTotalAmount.textContent = totalAmount.toLocaleString();
        } else {
            if (bookingUpkeepAmount) bookingUpkeepAmount.textContent = "0.00";
            bookingTotalAmount.textContent = "0.00";
        }
    }

    function updateDateSpan() {
        if (currentStart && currentEnd) {
            dateText.textContent = `${currentStart} to ${currentEnd}`;
            const start = new Date(currentStart);
            const end = new Date(currentEnd);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            selectedDaysCount.textContent = days;
            numDaysInput.value = days;
            calculateAmount();
        }
    }

    // Synchronization Logic
    startDateInput.addEventListener('change', function() {
        currentStart = this.value;
        const days = parseInt(numDaysInput.value) || 1;
        if (currentStart) {
            const start = new Date(currentStart);
            const end = new Date(start);
            end.setDate(start.getDate() + days - 1);
            currentEnd = end.toISOString().split('T')[0];
            endDateInput.value = currentEnd;
            updateDateSpan();
        }
    });

    numDaysInput.addEventListener('input', function() {
        const days = parseInt(this.value) || 1;
        if (currentStart) {
            const start = new Date(currentStart);
            const end = new Date(start);
            end.setDate(start.getDate() + days - 1);
            currentEnd = end.toISOString().split('T')[0];
            endDateInput.value = currentEnd;
            updateDateSpan();
        }
    });

    endDateInput.addEventListener('change', function() {
        currentEnd = this.value;
        if (currentStart && currentEnd >= currentStart) {
            const start = new Date(currentStart);
            const end = new Date(currentEnd);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            numDaysInput.value = days;
            updateDateSpan();
        } else if (currentEnd < currentStart) {
            alert("End date cannot be before start date.");
            this.value = currentEnd = currentStart;
            numDaysInput.value = 1;
            updateDateSpan();
        }
    });

    function handleDateSelection(startDate, endDate) {
        const localTodayISO = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
        
        if (startDate < localTodayISO) {
            if (typeof notifyUser === 'function') {
                notifyUser('Invalid Date', 'You cannot use past days for booking.');
            } else {
                alert('You cannot use past days for booking.');
            }
            if (typeof calendar !== 'undefined') calendar.unselect();
            return;
        }

        currentStart = startDate;
        currentEnd = endDate || startDate;
        
        startDateInput.value = currentStart;
        endDateInput.value = currentEnd;
        
        const start = new Date(currentStart);
        const end = new Date(currentEnd);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        numDaysInput.value = days;
        
        // Auto-check multi-day if selection is more than 1 day
        if (days > 1) {
            multiDayToggle.checked = true;
            multiDayFields.classList.remove('d-none');
            hourlyFields.classList.add('d-none');
        } else {
            multiDayToggle.checked = false;
            multiDayFields.classList.add('d-none');
            hourlyFields.classList.remove('d-none');
        }
        
        updateDateSpan();
        bookingModal.show();
    }

    // Initialize FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
        },
        height: 'auto',
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        selectAllow: function(selectInfo) {
            const localTodayISO = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
            return selectInfo.startStr >= localTodayISO;
        },
        dateClick: function(info) {
            const localTodayISO = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
            if (info.dateStr < localTodayISO) {
                if (typeof notifyUser === 'function') {
                    notifyUser('Invalid Action', 'You cannot select past days for booking.');
                }
            }
        },
        select: function(info) {
            const endDate = new Date(info.end);
            endDate.setDate(endDate.getDate() - 1);
            const endStr = endDate.toISOString().split('T')[0];
            handleDateSelection(info.startStr, endStr);
        },
        events: bookings,
        eventClick: function(info) {
            const props = info.event.extendedProps;
            document.getElementById('adminBookingId').value = info.event.id;
            document.getElementById('adminName').innerText = props.customerName || 'N/A';
            document.getElementById('adminCar').innerText = info.event.title;
            document.getElementById('adminAddress').innerText = props.address || 'N/A';
            document.getElementById('adminEmail').innerText = props.email || 'N/A';
            document.getElementById('adminPhone').innerText = props.phone || 'N/A';
            
            adminModal.show();
        }
    });

    calendar.render();

    // Populate car selection
    availableCars.forEach(car => {
        const option = document.createElement('option');
        option.value = car.id;
        option.textContent = `${car.name} - NGN ${parseFloat(car.price).toLocaleString()}/day`;
        carSelection.appendChild(option);
    });

    carSelection.addEventListener('change', calculateAmount);

    multiDayToggle.addEventListener('change', function() {
        if (this.checked) {
            multiDayFields.classList.remove('d-none');
            hourlyFields.classList.add('d-none');
        } else {
            multiDayFields.classList.add('d-none');
            hourlyFields.classList.remove('d-none');
            // Reset to 1 day if switching to hourly
            currentEnd = currentStart;
            endDateInput.value = currentEnd;
            numDaysInput.value = 1;
            updateDateSpan();
        }
        calculateAmount();
    });

    // Form Submission
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const carId = carSelection.value;
        const selectedCar = availableCars.find(car => String(car.id) === carId);
        const carName = selectedCar ? selectedCar.name : "Vehicle";
        const totalStr = bookingTotalAmount.innerText.replace(/,/g, '');

        if (!carId) {
            alert("Please select a vehicle.");
            return;
        }

        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Processing...';

        try {
            const response = await fetch('/api/create-booking/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    car_id: carId,
                    start_date: currentStart,
                    end_date: multiDayToggle.checked ? currentEnd : currentStart,
                    is_multi_day: multiDayToggle.checked,
                    overtime_hours: multiDayToggle.checked ? 0 : (parseInt(overtimeHoursInput.value) || 0),
                    amount: parseFloat(totalStr),
                    customer_phone: document.getElementById('customerPhone').value,
                    customer_address: document.getElementById('customerAddress').value,
                    kinsman_name: document.getElementById('kinsmanName').value,
                    kinsman_phone: document.getElementById('kinsmanPhone').value,
                    kinsman_address: document.getElementById('kinsmanAddress').value
                })
            });
            const result = await response.json();

            if (result.status === 'success') {
                bookingModal.hide();
                if (typeof notifyUser === 'function') {
                    notifyUser('Booking Confirmed!', `Your ${carName} booking has been confirmed for ${currentStart} to ${currentEnd}.`);
                } else {
                    alert('Booking confirmed successfully!');
                }
                
                // Refresh
                setTimeout(() => window.location.reload(), 2000);
            } else {
                throw new Error(result.message || 'Booking failed');
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert('Booking failed: ' + error.message);
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = 'Confirm Booking';
        }
    });

    // Admin Cancel
    const cancelBookingBtn = document.getElementById('cancelBookingBtn');
    if (cancelBookingBtn) {
        cancelBookingBtn.addEventListener('click', async () => {
            const bookingId = document.getElementById('adminBookingId').value;
            if (!bookingId) return;
            
            if (confirm('Are you sure you want to cancel this booking?')) {
                cancelBookingBtn.disabled = true;
                cancelBookingBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Canceling...';
                
                try {
                    const response = await fetch('/api/cancel-booking/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ booking_id: bookingId })
                    });
                    const result = await response.json();
                    
                    if (result.status === 'success') {
                        adminModal.hide();
                        if (typeof notifyUser === 'function') {
                            notifyUser('Booking Cancelled', 'The booking has been cancelled successfully.');
                        } else {
                            alert('Booking cancelled successfully!');
                        }
                        window.location.reload();
                    } else {
                        throw new Error(result.message || 'Cancellation failed');
                    }
                } catch (error) {
                    console.error('Cancellation error:', error);
                    alert('Cancellation failed: ' + error.message);
                    cancelBookingBtn.disabled = false;
                    cancelBookingBtn.innerHTML = 'Cancel Booking';
                }
            }
        });
    }
});
