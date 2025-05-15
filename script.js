document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements (only those available on the current page)
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const bookingForm = document.getElementById('booking-form');
    const bookingList = document.getElementById('booking-list');
    const logoutBtn = document.getElementById('logout-btn');

    // Initialize localStorage
    let users = JSON.parse(localStorage.getItem('hotelUsers')) || [];
    let bookings = JSON.parse(localStorage.getItem('hotelBookings')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentHotelUser')) || null;

    // Debug: Log initialization
    console.log('Script loaded. Current user:', currentUser);

    // Redirect to login if not logged in and on dashboard
    if (window.location.pathname.includes('dashboard.html') && !currentUser) {
        console.log('No user logged in, redirecting to login.html');
        window.location.href = 'login.html';
    }

    // Render bookings if on dashboard
    if (bookingList) {
        console.log('Rendering bookings on dashboard');
        renderBookings();
    }

    // Signup Form Submission
    if (signupForm) {
        console.log('Signup form found, binding event listener');
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Signup form submitted');

            const username = document.getElementById('signup-username').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            console.log('Signup data:', { username, email, password });

            // Validate email format
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Please enter a valid email address!');
                console.log('Invalid email format');
                return;
            }

            // Check for duplicate email
            if (users.find(user => user.email === email)) {
                alert('Email already exists!');
                console.log('Duplicate email detected');
                return;
            }

            // Add new user
            users.push({ username, email, password });
            localStorage.setItem('hotelUsers', JSON.stringify(users));
            console.log('User added to localStorage:', users);

            alert('Signup successful! Please log in.');
            signupForm.reset();
            window.location.href = 'login.html';
        });
    } else {
        console.log('No signup form found on this page');
    }

    // Login Form Submission
    if (loginForm) {
        console.log('Login form found, binding event listener');
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Login form submitted');

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            console.log('Login data:', { email, password });

            const user = users.find(user => user.email === email && user.password === password);
            if (!user) {
                alert('Invalid email or password!');
                console.log('Invalid credentials');
                return;
            }

            currentUser = user;
            localStorage.setItem('currentHotelUser', JSON.stringify(currentUser));
            console.log('User logged in:', currentUser);
            loginForm.reset();
            window.location.href = 'dashboard.html';
        });
    }

    // Booking Form Submission
    if (bookingForm) {
        console.log('Booking form found, binding event listener');
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Booking form submitted');

            const guestName = document.getElementById('guest-name').value;
            const checkIn = document.getElementById('check-in').value;
            const checkOut = document.getElementById('check-out').value;
            const roomType = document.getElementById('room-type').value;
            const bookingId = document.getElementById('booking-id').value;

            console.log('Booking data:', { guestName, checkIn, checkOut, roomType, bookingId });

            if (new Date(checkIn) >= new Date(checkOut)) {
                alert('Check-out date must be after check-in date!');
                console.log('Invalid date range');
                return;
            }

            if (bookingId) {
                // Edit existing booking
                const booking = bookings.find(b => b.id === bookingId);
                booking.guestName = guestName;
                booking.checkIn = checkIn;
                booking.checkOut = checkOut;
                booking.roomType = roomType;
                console.log('Booking edited:', booking);
            } else {
                // Add new booking
                const booking = {
                    id: Date.now().toString(),
                    guestName,
                    checkIn,
                    checkOut,
                    roomType
                };
                bookings.push(booking);
                console.log('New booking added:', booking);
            }

            localStorage.setItem('hotelBookings', JSON.stringify(bookings));
            renderBookings();
            bookingForm.reset();
            document.getElementById('booking-id').value = '';
            console.log('Bookings updated:', bookings);
        });
    }

    // Render Bookings
    function renderBookings() {
        if (!bookingList) return;
        console.log('Rendering bookings');
        bookingList.innerHTML = '';
        bookings.forEach(booking => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${booking.guestName}</td>
                <td>${booking.checkIn}</td>
                <td>${booking.checkOut}</td>
                <td>${booking.roomType}</td>
                <td>
                    <button onclick="editBooking('${booking.id}')">Edit</button>
                    <button onclick="deleteBooking('${booking.id}')">Delete</button>
                </td>
            `;
            bookingList.appendChild(row);
        });
    }

    // Edit Booking
    window.editBooking = function(id) {
        console.log('Editing booking:', id);
        const booking = bookings.find(b => b.id === id);
        document.getElementById('guest-name').value = booking.guestName;
        document.getElementById('check-in').value = booking.checkIn;
        document.getElementById('check-out').value = booking.checkOut;
        document.getElementById('room-type').value = booking.roomType;
        document.getElementById('booking-id').value = booking.id;
    };

    // Delete Booking
    window.deleteBooking = function(id) {
        console.log('Deleting booking:', id);
        if (confirm('Are you sure you want to delete this booking?')) {
            bookings = bookings.filter(b => b.id !== id);
            localStorage.setItem('hotelBookings', JSON.stringify(bookings));
            renderBookings();
            console.log('Booking deleted, updated bookings:', bookings);
        }
    };

    // Logout
    if (logoutBtn) {
        console.log('Logout button found, binding event listener');
        logoutBtn.addEventListener('click', () => {
            console.log('Logging out');
            currentUser = null;
            localStorage.removeItem('currentHotelUser');
            window.location.href = 'login.html';
            if (bookingForm) bookingForm.reset();
        });
    }
});