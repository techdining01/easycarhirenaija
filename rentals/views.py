from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.core.paginator import Paginator
from datetime import timedelta
from rentals.models import Car, Booking, Review
from django.views.decorators.csrf import csrf_exempt
import json
import gspread
from django.contrib.auth import login, logout, authenticate
from oauth2client.service_account import ServiceAccountCredentials
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from rentals.forms import CustomUserCreationForm, CarForm



def home_view(request):
    cars_list = Car.objects.all()
    return render(request, 'rentals/index.html', {'cars': cars_list})

def car_details_view(request, car_id):
    car = get_object_or_404(Car, id=car_id)
    return render(request, 'rentals/car-details.html', {'car': car})



@login_required()
def booking_view(request):
    cars_list = Car.objects.all()
    return render(request, 'rentals/booking.html', {'cars': cars_list})



def append_to_gsheet(booking):
    try:
        scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
        creds = ServiceAccountCredentials.from_json_keyfile_name('credentials.json', scope)
        client = gspread.authorize(creds)
        sheet = client.open('EasyCarHireBookings').sheet1
        
        row = [
            booking.customer_name,
            booking.customer_address,
            booking.customer_phone,
            booking.customer_email,
            booking.kinsman_name,
            booking.kinsman_address,
            booking.kinsman_phone,
            booking.car.name,
            str(booking.amount),
            f"{booking.start_date} to {booking.end_date}"
        ]
        sheet.append_row(row)
    except FileNotFoundError:
        print("Credentials.json not found. Skipping Google Sheets integration.")
    except Exception as e:
        print(f"Google Sheets append failed: {e}")

def api_bookings(request):
    # Return all booked dates in a format FullCalendar can understand
    bookings = Booking.objects.all()
    # Create event objects for FullCalendar
    events = []
    for b in bookings:
        event = {
            'id': b.id,
            'title': b.car.name,
            'start': b.start_date.strftime('%Y-%m-%d'),
            'extendedProps': {
                'customerName': b.customer_name,
                'address': b.customer_address,
                'email': b.customer_email,
                'phone': b.customer_phone,
            }
        }
        if b.end_date and b.end_date != b.start_date:
            event['end'] = (b.end_date + timedelta(days=1)).strftime('%Y-%m-%d')
        events.append(event)
    return JsonResponse({'events': events})

@csrf_exempt
@login_required
def create_booking(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            car = get_object_or_404(Car, id=data.get('car_id'))
            start_date = data.get('start_date')
            end_date = data.get('end_date', start_date)
            
            # Backend Calculation for amount validation
            from datetime import datetime
            start_dt = datetime.strptime(start_date, "%Y-%m-%d").date()
            end_dt = datetime.strptime(end_date, "%Y-%m-%d").date()
            is_multi_day = data.get('is_multi_day', False)
            overtime_hours = int(data.get('overtime_hours', 0))
            
            if is_multi_day:
                days = (end_dt - start_dt).days + 1
                car_total = car.price * days
                upkeep_total = car.driver_upkeep * days
                calculated_amount = float(car_total + upkeep_total)
            else:
                base_price = car.hourly_rate
                overtime_price = car.overtime_rate * overtime_hours
                calculated_amount = float(base_price + overtime_price)
                upkeep_total = 0
            
            # We can use the calculated amount to ensure data integrity
            final_amount = data.get('amount', calculated_amount)
            
            booking = Booking.objects.create(
                car=car,
                start_date=start_date,
                end_date=end_date,
                amount=final_amount,
                is_multi_day=is_multi_day,
                overtime_hours=overtime_hours,
                customer_name=request.user.get_full_name() or request.user.username,
                customer_email=request.user.email,
                customer_phone=getattr(getattr(request.user, 'profile', None), 'phone_number', data.get('customer_phone', '')),
                customer_address=getattr(getattr(request.user, 'profile', None), 'address', data.get('customer_address', '')),
                kinsman_name=data.get('kinsman_name', ""),
                kinsman_address=data.get('kinsman_address', ""),
                kinsman_phone=data.get('kinsman_phone', "")
            )
            
            # Send Email
            try:
                subject = f"New Booking: {car.name} from {start_date} to {end_date}"
                message = f"""
New booking confirmed!

Customer: {booking.customer_name}
Email: {booking.customer_email}
Phone: {booking.customer_phone}
Address: {booking.customer_address}

Kinsman Details:
Name: {booking.kinsman_name}
Phone: {booking.kinsman_phone}
Address: {booking.kinsman_address}

Car Details:
Name/Plate: {car.name}
Days Booked: {days}
Car Rate: NGN {car.price}/day
Driver Upkeep: NGN {car.driver_upkeep}/day (applied if > 1 day)
Total Amount: NGN {booking.amount}
Booking Range: {start_date} to {end_date}
"""
                send_mail(
                    subject,
                    message,
                    getattr(settings, 'DEFAULT_FROM_EMAIL', 'no-reply@easycarhirenaija.com'),
                    [booking.customer_email, getattr(settings, 'ADMIN_EMAIL', 'admin@easycarhirenaija.com')],
                    fail_silently=True
                )
            except Exception as e:
                print(f"Email failed: {e}")

            # Append to Google Sheet
            append_to_gsheet(booking)

            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    return JsonResponse({'status': 'invalid method'}, status=405)

@csrf_exempt
@login_required
def cancel_booking(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            booking_id = data.get('booking_id')
            booking = get_object_or_404(Booking, id=booking_id)
            booking.delete()
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    return JsonResponse({'status': 'invalid method'}, status=405)

def login_view(request):
    if request.method == 'POST':
        username_or_email = request.POST.get('username_or_email')
        password = request.POST.get('password')
        
        # Try to find user by email first, then by username
        from django.contrib.auth.models import User
        try:
            # Check if input is an email
            if '@' in username_or_email:
                user = User.objects.get(email=username_or_email)
                username = user.username
            else:
                username = username_or_email
            
            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                login(request, user)
                messages.success(request, f'Welcome back, {user.get_full_name() or user.username}!')
                # Redirect to booking page after successful login
                next_url = request.GET.get('next', '/booking/')
                return redirect(next_url)
            else:
                messages.error(request, 'Invalid email/username or password.')
        except User.DoesNotExist:
            messages.error(request, 'Invalid email/username or password.')
    
    return render(request, 'rentals/login.html')

def logout_view(request):
    logout(request)
    messages.info(request, 'You have been successfully logged out.')
    return redirect('/')

def signup_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, f'Account created successfully! Welcome, {user.get_full_name() or user.username}!')
            # Redirect to booking page after successful signup
            return redirect('/booking/')
        else:
            messages.error(request, 'Invalid signup information. Please try again.')
    else:
        form = CustomUserCreationForm()
    
    return render(request, 'rentals/signup.html', {'form': form})

@user_passes_test(lambda u: u.is_superuser, login_url='/login/')
def admin_dashboard_view(request):
    bookings_list = Booking.objects.all().order_by('-created_at')
    cars_list = Car.objects.all().order_by('name')
    
    # Paginate bookings
    paginator_bookings = Paginator(bookings_list, 10)
    page_bookings = request.GET.get('page_bookings')
    bookings = paginator_bookings.get_page(page_bookings)
    
    # Paginate cars
    paginator_cars = Paginator(cars_list, 10)
    page_cars = request.GET.get('page_cars')
    cars = paginator_cars.get_page(page_cars)
    
    form = CarForm()
    return render(request, 'rentals/admin_dashboard.html', {
        'bookings': bookings,
        'cars': cars,
        'car_form': form
    })

@csrf_exempt
@user_passes_test(lambda u: u.is_superuser)
def add_car(request):
    if request.method == 'POST':
        form = CarForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'New car added successfully!')
            return redirect('/admin-dashboard/')
        else:
            messages.error(request, 'Error adding car. Please check the form.')
            return redirect('/admin-dashboard/')
    return redirect('/admin-dashboard/')

@csrf_exempt
@user_passes_test(lambda u: u.is_superuser)
def update_car(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            car_id = data.get('car_id')
            car = get_object_or_404(Car, id=car_id)
            
            car.name = data.get('name', car.name)
            car.brand = data.get('brand', car.brand)
            car.price = data.get('price', car.price)
            car.hourly_rate = data.get('hourly_rate', car.hourly_rate)
            car.overtime_rate = data.get('overtime_rate', car.overtime_rate)
            car.driver_upkeep = data.get('upkeep', car.driver_upkeep)
            car.image = data.get('image', car.image)
            car.description = data.get('description', car.description)
            car.rating = data.get('rating', car.rating)
            car.save()
            
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    return JsonResponse({'status': 'invalid method'}, status=405)

@csrf_exempt
@user_passes_test(lambda u: u.is_superuser)
def delete_car(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            car_id = data.get('car_id')
            car = get_object_or_404(Car, id=car_id)
            car.delete()
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    return JsonResponse({'status': 'invalid method'}, status=405)
