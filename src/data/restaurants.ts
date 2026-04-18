export interface Restaurant {
  id: string;
  name: string;
  city: string;
  cuisine: string[];
  rating: number;
  review_count: number;
  price_range: "$$" | "$$$" | "$$$$";
  photo_url: string;
  description: string;
  tags: string[];
}

export const restaurants: Restaurant[] = [
  {
    id: "r1",
    name: "Karim's Hotel",
    city: "Delhi",
    cuisine: ["Mughlai", "North Indian"],
    rating: 4.6,
    review_count: 1540,
    price_range: "$$",
    photo_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
    description: "Legendary Mughlai eatery near Jama Masjid, famous for its Mutton Korma and Kebabs.",
    tags: ["Legendary", "Spicy", "History"]
  },
  {
    id: "r2",
    name: "MTR (Mavalli Tiffin Room)",
    city: "Bangalore",
    cuisine: ["South Indian", "Kannada"],
    rating: 4.7,
    review_count: 2100,
    price_range: "$",
    photo_url: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&q=80",
    description: "The birthplace of Rava Idli. A heritage restaurant serving authentic South Indian vegetarian meals.",
    tags: ["Heritage", "Vegetarian", "Crowded"]
  },
  {
    id: "r3",
    name: "Britannia & Co.",
    city: "Mumbai",
    cuisine: ["Parsi", "Irani"],
    rating: 4.5,
    review_count: 980,
    price_range: "$$",
    photo_url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
    description: "Famous Parsi restaurant in Ballard Estate, known for its Berry Pulav and colonial charm.",
    tags: ["Vintage", "Specialty", "Must Visit"]
  },
  {
    id: "r4",
    name: "Peter Cat",
    city: "Kolkata",
    cuisine: ["Continental", "North Indian"],
    rating: 4.6,
    review_count: 1800,
    price_range: "$$$",
    photo_url: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&q=80",
    description: "Iconic restaurant on Park Street, famous for its signature Chelo Kebab.",
    tags: ["Iconic", "Kebabs", "Ambiance"]
  },
  {
    id: "r5",
    name: "Barbeque Nation",
    city: "Jaipur",
    cuisine: ["Grill", "Multi-cuisine"],
    rating: 4.4,
    review_count: 3200,
    price_range: "$$$",
    photo_url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
    description: "Popular buffet chain with live grills on the table. Great for family outings.",
    tags: ["Buffet", "Family Friendly", "Live Grill"]
  },
  {
    id: "r6",
    name: "Gunpowder",
    city: "Goa",
    cuisine: ["South Indian", "Coastal"],
    rating: 4.8,
    review_count: 750,
    price_range: "$$$",
    photo_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    description: "Award-winning restaurant in Assagao serving bold flavors from peninsular India.",
    tags: ["Cozy", "Authentic", "Garden Dining"]
  }
];
