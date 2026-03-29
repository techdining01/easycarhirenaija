import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EasyCarHire.settings')
django.setup()

from rentals.models import Car

cars_data = [
    {
        "name": "Porsche 911 Turbo S",
        "brand": "Porsche",
        "price": 120000,
        "image": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
        "description": "The pinnacle of German engineering. 0-60 in 2.6 seconds.",
        "rating": 4.9
    },
    {
        "name": "Mercedes-Benz S-Class",
        "brand": "Mercedes",
        "price": 85000,
        "image": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800",
        "description": "Luxury redefined. The ultimate chauffeur-driven experience.",
        "rating": 4.8
    },
    {
        "name": "Lamborghini Huracán",
        "brand": "Lamborghini",
        "price": 150000,
        "image": "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&q=80&w=800",
        "description": "Unleash the bull. A V10 masterpiece of Italian design.",
        "rating": 5.0
    },
    {
        "name": "Mercedes-Benz G 63 AMG",
        "brand": "Mercedes",
        "price": 95000,
        "image": "images/mercedes-gwagon.png",
        "description": "The legendary G-Wagon. Off-road capability meets unparalleled luxury.",
        "rating": 4.9
    },
    {
        "name": "Mercedes-Benz GLE Coupe",
        "brand": "Mercedes",
        "price": 75000,
        "image": "images/mercedes-gle.png",
        "description": "Sporty elegance. Aversatile luxury SUV with a striking silhouette.",
        "rating": 4.7
    },
    {
        "name": "Mercedes-Benz C-Class",
        "brand": "Mercedes",
        "price": 55000,
        "image": "images/mercedes-cclass.png",
        "description": "Modern luxury in a compact form. Sophisticated and dynamic.",
        "rating": 4.6
    },
    {
        "name": "Toyota Highlander",
        "brand": "Toyota",
        "price": 65000,
        "image": "https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?auto=format&fit=crop&q=80&w=800",
        "description": "Sophisticated SUV with 3-row seating and premium interior.",
        "rating": 4.8
    },
    {
        "name": "Toyota Venza",
        "brand": "Toyota",
        "price": 58000,
        "image": "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800",
        "description": "Elegant crossover with hybrid efficiency and sleek design.",
        "rating": 4.7
    },
    {
        "name": "Honda Accord Luxe",
        "brand": "Honda",
        "price": 45000,
        "image": "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=800",
        "description": "The benchmark sedan. Reliable, comfortable, and efficient.",
        "rating": 4.6
    }
]

for data in cars_data:
    Car.objects.update_or_create(
        name=data['name'],
        defaults={
            'brand': data['brand'],
            'price': data['price'],
            'image': data['image'],
            'description': data['description'],
            'rating': data['rating']
        }
    )

print(f"Successfully synchronized {len(cars_data)} cars in the database!")
