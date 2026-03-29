from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"

class Car(models.Model):
    name = models.CharField(max_length=100, default="")
    brand = models.CharField(max_length=50, default="")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text="Daily Rental Price")
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text="Base price for 0 Day (5 hours Max)")
    overtime_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text="Price per hour for every hour past 5 hours")
    driver_upkeep = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text="Extra daily cost applied in multi-day rentals")
    image = models.CharField(max_length=255, default="", help_text="Path or URL to the car image")
    description = models.TextField(default="")
    rating = models.FloatField(default=5.0)

    def __str__(self):
        return self.name

class Review(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='reviews')
    user = models.CharField(max_length=100, default="Anonymous")
    comment = models.TextField(default="")
    stars = models.IntegerField(default=5)

    def __str__(self):
        return f"Review for {self.car.name} by {self.user}"

class Booking(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='bookings')
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_multi_day = models.BooleanField(default=False)
    overtime_hours = models.IntegerField(default=0)
    customer_name = models.CharField(max_length=100, default="")
    customer_email = models.EmailField(default="")
    customer_phone = models.CharField(max_length=20, default="")
    customer_address = models.TextField(default="")
    kinsman_name = models.CharField(max_length=100, default="")
    kinsman_address = models.TextField(default="")
    kinsman_phone = models.CharField(max_length=20, default="")
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking for {self.car.name} on {self.start_date}"
