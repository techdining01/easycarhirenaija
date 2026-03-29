/**
 * Central Data Store for Cars and Reviews
 */
const cars = [
    {
        id: "porsche-911",
        name: "Porsche 911 Turbo S",
        price: "250,000",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600",
        description: "Speed, elegance, and advanced German engineering combined.",
        rating: 4.9,
        reviews: [
            { user: "Segun", comment: "The acceleration is mind-blowing!", stars: 5 },
            { user: "Tayo", comment: "Perfect for a weekend cruise.", stars: 5 }
        ]
    },
    {
        id: "mercedes-s-class",
        name: "Mercedes-Benz S-Class",
        price: "350,000",
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=600",
        description: "The ultimate statement of luxury and sophisticated comfort.",
        rating: 5.0,
        reviews: [
            { user: "Chinonso", comment: "Like floating on a cloud.", stars: 5 }
        ]
    },
    {
        id: "lamborghini-huracan",
        name: "Lamborghini Huracán",
        price: "550,000",
        image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=600",
        description: "Unleash the power of the bull on the open road with style.",
        rating: 4.8,
        reviews: []
    },
    {
        id: "mercedes-gwagon",
        name: "Mercedes-Benz G 63 AMG",
        price: "450,000",
        image: "/static/images/mercedes-gwagon.png",
        description: "The legendary G-Class, where off-road meets pure luxury.",
        rating: 5.0,
        reviews: []
    },
    {
        id: "mercedes-gle",
        name: "Mercedes-Benz GLE Coupe",
        price: "300,000",
        image: "/static/images/mercedes-gle.png",
        description: "Athletic performance and SUV presence in one sleek package.",
        rating: 4.9,
        reviews: []
    },
    {
        id: "mercedes-cclass",
        name: "Mercedes-Benz C-Class",
        price: "180,000",
        image: "/static/images/mercedes-cclass.png",
        description: "Dynamic, luxurious, and technologically advanced.",
        rating: 4.8,
        reviews: []
    },
    {
        id: "lexus-lc500",
        name: "Lexus LC 500",
        price: "220,000",
        image: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=600",
        description: "A masterpiece of Takumi craftsmanship and raw performance.",
        rating: 4.9,
        reviews: []
    },
    {
        id: "toyota-highlander",
        name: "Toyota Highlander",
        price: "180,000",
        image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=600",
        description: "Premium SUV comfort for the whole family's adventure.",
        rating: 4.7,
        reviews: []
    },
    {
        id: "toyota-venza",
        name: "Toyota Venza Limited",
        price: "170,000",
        image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=600",
        description: "Elegance meets efficiency in this sophisticated hybrid crossover.",
        rating: 4.8,
        reviews: []
    },
    {
        id: "jeep-wrangler",
        name: "Jeep Wrangler Rubicon",
        price: "210,000",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600",
        description: "The ultimate off-road icon for the fearless explorer.",
        rating: 4.9,
        reviews: []
    }
];
