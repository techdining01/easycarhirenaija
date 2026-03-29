from django.urls import path
from . import views

app_name = 'rentals'

urlpatterns = [
    path('', views.home_view, name='home'),
    path('car/<int:car_id>/', views.car_details_view, name='car_details'),
    path('booking/', views.booking_view, name='booking'),
    path('api/bookings/', views.api_bookings, name='api_bookings'),
    path('api/create-booking/', views.create_booking, name='create_booking'),
    path('api/cancel-booking/', views.cancel_booking, name='cancel_booking'),
    path('api/update-car/', views.update_car, name='update_car'),
    path('api/delete-car/', views.delete_car, name='delete_car'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('signup/', views.signup_view, name='signup'),
    path('admin-dashboard/', views.admin_dashboard_view, name='admin_dashboard'),
    path('api/add-car/', views.add_car, name='add_car'),
]
