from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Car, UserProfile

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True, widget=forms.EmailInput(attrs={
        'class': 'form-control rounded-pill',
        'placeholder': 'Email Address'
    }))
    
    first_name = forms.CharField(max_length=30, required=True, widget=forms.TextInput(attrs={
        'class': 'form-control rounded-pill',
        'placeholder': 'First Name'
    }))
    
    last_name = forms.CharField(max_length=30, required=True, widget=forms.TextInput(attrs={
        'class': 'form-control rounded-pill',
        'placeholder': 'Last Name'
    }))
    
    phone_number = forms.CharField(max_length=20, required=True, widget=forms.TextInput(attrs={
        'class': 'form-control rounded-pill',
        'placeholder': 'Phone Number'
    }))
    
    address = forms.CharField(max_length=200, required=True, widget=forms.TextInput(attrs={
        'class': 'form-control rounded-pill',
        'placeholder': 'Home Address'
    }))

    class Meta:
        model = User
        fields = ("username", "first_name", "last_name", "email", "phone_number", "address", "password1", "password2")
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({
            'class': 'form-control rounded-pill',
            'placeholder': 'Username'
        })
        self.fields['password1'].widget.attrs.update({
            'class': 'form-control rounded-pill',
            'placeholder': 'Password'
        })
        self.fields['password2'].widget.attrs.update({
            'class': 'form-control rounded-pill',
            'placeholder': 'Confirm Password'
        })

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data["email"]
        user.first_name = self.cleaned_data["first_name"]
        user.last_name = self.cleaned_data["last_name"]
        
        # Store phone and address in user's profile (we'll need to extend User model or create a profile model)
        # For now, we'll store them in session or another approach
        
        if commit:
            user.save()
            # Create or update user profile with phone and address
            from .models import UserProfile
            profile, created = UserProfile.objects.get_or_create(user=user)
            profile.phone_number = self.cleaned_data["phone_number"]
            profile.address = self.cleaned_data["address"]
            profile.save()
            
        return user

class CarForm(forms.ModelForm):
    class Meta:
        model = Car
        fields = ['name', 'brand', 'price', 'hourly_rate', 'overtime_rate', 'driver_upkeep', 'image', 'description', 'rating']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Car Name (e.g. Toyota Camry)'}),
            'brand': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Brand (e.g. Toyota)'}),
            'price': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Daily Price (NGN)'}),
            'hourly_rate': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': '0 Day / 5hr Base Price (NGN)'}),
            'overtime_rate': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Overtime Rate per Hour (NGN)'}),
            'driver_upkeep': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Driver Upkeep (NGN)'}),
            'image': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Image Path (e.g. /static/images/cars/camry.jpg)'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'Car Description'}),
            'rating': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.1', 'min': '0', 'max': '5'}),
        }
