# AI Prompt: Premium Car Rental Platform (EasyCarHireNaija)

"I want to build a high-end, mobile-first Car Rental Progressive Web App (PWA) called **EasyCarHireNaija**. The platform must have a luxurious, premium aesthetic (dark mode or glassmorphism options) and be built with a Python-based backend.

### Technical Stack
- **Backend Options**: [Django / Flask / FastAPI] (Choose one)
- **Database**: SQLite (for development) or PostgreSQL
- **Frontend**: HTML5, Vanilla CSS, Bootstrap 5
- **Icons**: FontAwesome 6
- **Animations/JS**: Swiper.js (for car galleries), FullCalendar.js (for bookings), AOS (Animate on Scroll)
- **Frontend Architecture**: Mobile-first with a sticky bottom navigation bar and a premium offcanvas top navbar.

### Core Features to Implement

#### 1. Dynamic Car Inventory
- Create a `Car` model with fields: `name`, `brand`, `daily_price`, `description`, `image_url`, `rating`.
- Implement a **Car Details Page** with a multi-view image gallery using **Swiper.js** (Creative Effect).
- Include a **Reviews Section** for each car.

#### 2. Smart Booking System (Conflict Prevention)
- Create a `Booking` model linked to `User` and `Car`, with `start_date` and `end_date`.
- Implement an interactive **FullCalendar.js** booking page.
- **Smart Validation**: When a user selects a date, the car selection dropdown must dynamically disable any vehicles already reserved for that specific day to prevent scheduling conflicts.
- Implement **Non-Blocking Notifications (Toasts)** to confirm bookings without interrupting the user's flow.

#### 3. Administrative Features (Secret View)
- The calendar should show car names on booked days.
- **Admin Modal**: If an admin clicks a booking on the calendar, show a detailed pop-up with customer info (Name, Email, Phone, Address).

#### 4. Premium UI/UX Requirements
- **Global Navigation**: A unified top navbar (offcanvas style) and a persistent mobile bottom navigation bar (Home, Gallery, Book, Profile).
- **Aesthetics**: Use modern typography (Outfit/Inter), smooth gradients, and subtle micro-animations.
- **Layout Integrity**: Ensure `body` padding handles sticky navigation without covering page content.

#### 5. User Authentication
- Complete **Sign Up** and **Login** flows.
- User profile page to view active bookings.

### Requirements for the AI
1. Provide a clean directory structure.
2. Write modular Python code (Models, Views/Routes, Templates).
3. Ensure the CSS is centralized and highly professional (avoiding generic "blocky" designs).
4. Implement a dynamic 'current year' in the footer.
"
