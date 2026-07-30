// High-fidelity Mock Data for Kochi, Munnar, Alleppey, Wayanad, Goa, and Jaipur

export const destinationsData = {
  kochi: {
    name: "Kochi",
    state: "Kerala",
    description: "A vibrant city of historic colonial enclaves, bustling markets, and scenic backwaters.",
    image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80",
    attractions: [
      {
        id: "kochi_attr_1",
        name: "Fort Kochi & Chinese Fishing Nets",
        rating: 4.6,
        category: "Attraction",
        subCategory: "Historical",
        description: "Explore the historic seaside streets of Fort Kochi, dotted with iconic giant cantilevered Chinese fishing nets introduced in the 14th century.",
        image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80",
        openingHours: "Open 24 hours (Best views at Sunrise/Sunset)",
        estimatedVisitDuration: "2 hours",
        entryFee: "Free",
        lat: 9.9686,
        lon: 76.2415
      },
      {
        id: "kochi_attr_2",
        name: "Mattancherry Palace (Dutch Palace)",
        rating: 4.3,
        category: "Attraction",
        subCategory: "History & Museum",
        description: "A Portuguese palace featuring murals depicting Hindu temple art, portraits of Kochi kings, and historic exhibits.",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80",
        openingHours: "10:00 AM - 5:00 PM (Closed on Fridays)",
        estimatedVisitDuration: "1.5 hours",
        entryFee: "₹10 per adult",
        lat: 9.9599,
        lon: 76.2592
      },
      {
        id: "kochi_attr_3",
        name: "Marine Drive Promenade",
        rating: 4.4,
        category: "Attraction",
        subCategory: "Nature & Leisure",
        description: "A picturesque promenade built facing the Kochi backwaters, popular with locals and visitors looking to catch the cool breeze and boat cruises.",
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
        openingHours: "Open 24 hours",
        estimatedVisitDuration: "1 hour",
        entryFee: "Free",
        lat: 9.9806,
        lon: 76.2758
      },
      {
        id: "kochi_attr_4",
        name: "St. Francis Church",
        rating: 4.2,
        category: "Attraction",
        subCategory: "Religious & Historical",
        description: "Constructed in 1503, it is the oldest European church in India and once housed the remains of explorer Vasco da Gama.",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
        openingHours: "10:00 AM - 5:00 PM (Sundays open 12:00 PM - 5:00 PM)",
        estimatedVisitDuration: "45 minutes",
        entryFee: "Free",
        lat: 9.9678,
        lon: 76.2403
      },
      {
        id: "kochi_attr_5",
        name: "Hill Palace Museum",
        rating: 4.5,
        category: "Attraction",
        subCategory: "Museum",
        description: "The largest archaeological museum in Kerala, serving as the official administrative office and residence of the Kochi Maharaja.",
        image: "https://images.unsplash.com/photo-1569783908620-75c0ee8b1916?auto=format&fit=crop&w=600&q=80",
        openingHours: "9:00 AM - 12:30 PM, 2:00 PM - 4:30 PM (Closed on Mondays)",
        estimatedVisitDuration: "2.5 hours",
        entryFee: "₹30 per adult",
        lat: 9.9535,
        lon: 76.3533
      }
    ],
    restaurants: [
      {
        id: "kochi_rest_1",
        name: "Kashi Art Cafe",
        rating: 4.7,
        category: "Restaurant",
        subCategory: "Continental & Coffee",
        description: "A trendy art gallery and organic garden cafe in Fort Kochi, famous for fresh salads, chocolate cake, and excellent brews.",
        image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
        priceRange: "$$", // Mid-range
        lat: 9.9672,
        lon: 76.2427
      },
      {
        id: "kochi_rest_2",
        name: "Paragon Restaurant",
        rating: 4.8,
        category: "Restaurant",
        subCategory: "Kerala & Malabar Cuisine",
        description: "Legendary restaurant renowned for its authentic Malabar biryanis, fish curry meals, and traditional coastal delicacies.",
        image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80",
        priceRange: "$$",
        lat: 10.0102,
        lon: 76.3219
      },
      {
        id: "kochi_rest_3",
        name: "Fort House Restaurant",
        rating: 4.4,
        category: "Restaurant",
        subCategory: "Seafood & Kerala Traditional",
        description: "Stunning waterfront restaurant in Fort Kochi offering traditional Kerala Christian Syrian recipes, fresh seafood, and romantic jetty views.",
        image: "https://images.unsplash.com/photo-1579027989536-b7b1ecda6374?auto=format&fit=crop&w=600&q=80",
        priceRange: "$$$", // Luxury / High-end
        lat: 9.9658,
        lon: 76.2472
      },
      {
        id: "kochi_rest_4",
        name: "Ginger House Restaurant",
        rating: 4.2,
        category: "Restaurant",
        subCategory: "Indo-Western & Snacks",
        description: "A unique museum restaurant situated inside an antique warehouse, offering local ginger-infused drinks and curries on the water's edge.",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
        priceRange: "$$$",
        lat: 9.9591,
        lon: 76.2608
      }
    ],
    hotels: [
      {
        id: "kochi_hotel_1",
        name: "Brunton Boatyard - CGH Earth",
        rating: 4.9,
        category: "Hotel",
        subCategory: "Luxury Heritage",
        description: "Set in a historic former shipyard, this high-end hotel captures Kochi's colonial past with magnificent views of the harbor.",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
        priceRange: "$$$",
        lat: 9.9691,
        lon: 76.2435
      },
      {
        id: "kochi_hotel_2",
        name: "Forte Kochi Boutique Hotel",
        rating: 4.7,
        category: "Hotel",
        subCategory: "Boutique Mid-range",
        description: "A restored Dutch colonial mansion offering luxury rooms, a courtyard pool, and historic charms on Princess Street.",
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80",
        priceRange: "$$",
        lat: 9.9669,
        lon: 76.2422
      },
      {
        id: "kochi_hotel_3",
        name: "Nomad Backpackers Hostel",
        rating: 4.3,
        category: "Hotel",
        subCategory: "Budget Hostel",
        description: "A colorful, highly rated budget hostel in Fort Kochi featuring dorms, community kitchen, and common rooftop spaces.",
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
        priceRange: "$",
        lat: 9.9632,
        lon: 76.2458
      }
    ],
    events: [
      {
        id: "kochi_event_1",
        name: "Cochin Carnival",
        date: "Dec 25 - Jan 1 annually",
        category: "Event",
        subCategory: "Festival",
        description: "A vibrant, week-long cultural carnival in Fort Kochi with massive beach parades, burning of Pappanji (giant old man effigy), and musical shows.",
        image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
        entryFee: "Free",
        lat: 9.9686,
        lon: 76.2415
      },
      {
        id: "kochi_event_2",
        name: "Kochi-Muziris Biennale",
        date: "Dec - Mar (Alternate Years)",
        category: "Event",
        subCategory: "Art Exhibition",
        description: "The largest contemporary art exhibition in Asia, held in heritage sites around Fort Kochi with global artwork installations.",
        image: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=600&q=80",
        entryFee: "₹150 per day",
        lat: 9.9649,
        lon: 76.2430
      }
    ]
  },
  munnar: {
    name: "Munnar",
    state: "Kerala",
    description: "Famous for its lush tea plantations, misty mountains, and cool, refreshing highland climate.",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80",
    attractions: [
      {
        id: "munnar_attr_1",
        name: "Eravikulam National Park",
        rating: 4.7,
        category: "Attraction",
        subCategory: "Wildlife & Trekking",
        description: "Home of the endangered Nilgiri Tahr. Walk through scenic hills with panoramic views of tea plantations and mist-covered valleys.",
        image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80",
        openingHours: "7:30 AM - 4:00 PM",
        estimatedVisitDuration: "3 hours",
        entryFee: "₹200 per adult",
        lat: 10.1518,
        lon: 77.0602
      },
      {
        id: "munnar_attr_2",
        name: "Tata Tea Museum",
        rating: 4.4,
        category: "Attraction",
        subCategory: "Museum",
        description: "Learn about the history of tea processing and regional development in Munnar, including ancient machinery and tea tastings.",
        image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80",
        openingHours: "9:00 AM - 5:00 PM (Closed on Mondays)",
        estimatedVisitDuration: "1.5 hours",
        entryFee: "₹125 per adult",
        lat: 10.0903,
        lon: 77.0621
      },
      {
        id: "munnar_attr_3",
        name: "Mattupetty Dam & Lake",
        rating: 4.5,
        category: "Attraction",
        subCategory: "Boating & Scenic",
        description: "A beautiful storage gravity dam nestled between the hills. Offers speedboat and pedal boat cruises with frequent wild elephant sightings.",
        image: "https://images.unsplash.com/photo-1627894483216-2138af692e2e?auto=format&fit=crop&w=600&q=80",
        openingHours: "9:30 AM - 5:00 PM",
        estimatedVisitDuration: "2 hours",
        entryFee: "₹10 (Boating extra)",
        lat: 10.1064,
        lon: 77.1245
      }
    ],
    restaurants: [
      {
        id: "munnar_rest_1",
        name: "Rapsy Restaurant",
        rating: 4.3,
        category: "Restaurant",
        subCategory: "Multi-cuisine Budget",
        description: "A legendary local eatery in Munnar town popular with international travelers for Spanish omelets, parotta, and local chicken dishes.",
        image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=600&q=80",
        priceRange: "$",
        lat: 10.0881,
        lon: 77.0595
      },
      {
        id: "munnar_rest_2",
        name: "Saravana Bhavan Munnar",
        rating: 4.5,
        category: "Restaurant",
        subCategory: "South Indian Vegetarian",
        description: "Excellent and highly hygienic spot in town for traditional ghee roast dosas, idlis, and full leaf meals.",
        image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80",
        priceRange: "$",
        lat: 10.0892,
        lon: 77.0601
      }
    ],
    hotels: [
      {
        id: "munnar_hotel_1",
        name: "Windermere Estate",
        rating: 4.8,
        category: "Hotel",
        subCategory: "Luxury Plantation",
        description: "A luxury plantation retreat overlooking the valleys of tea and cardamom, offering rustic elegance and personalized service.",
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
        priceRange: "$$$",
        lat: 10.0768,
        lon: 77.0694
      },
      {
        id: "munnar_hotel_2",
        name: "Tea County Hill Resort",
        rating: 4.4,
        category: "Hotel",
        subCategory: "Mid-range",
        description: "Run by KTDC, located beautifully in a valley between green hills, offering modern comforts and spa amenities.",
        image: "https://images.unsplash.com/photo-1495365200479-c4ed1d35e1aa?auto=format&fit=crop&w=600&q=80",
        priceRange: "$$",
        lat: 10.0895,
        lon: 77.0635
      }
    ],
    events: [
      {
        id: "munnar_event_1",
        name: "Neelakurinji Bloom (Cycle: 12 Years)",
        date: "Next predicted: 2030 (Aug - Oct)",
        category: "Event",
        subCategory: "Nature Spectacle",
        description: "A rare phenomenon when the hills of Munnar turn purplish blue due to the mass blooming of Kurinji flowers.",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
        entryFee: "Free",
        lat: 10.1518,
        lon: 77.0602
      }
    ]
  },
  alleppey: {
    name: "Alleppey",
    state: "Kerala",
    description: "Famous for its houseboats, calm backwater canals, sandy beaches, and lagoon lifestyle.",
    image: "https://images.unsplash.com/photo-1593693411515-c202e974fe08?auto=format&fit=crop&w=1200&q=80",
    attractions: [
      {
        id: "alleppey_attr_1",
        name: "Alappuzha Backwaters & Houseboat",
        rating: 4.8,
        category: "Attraction",
        subCategory: "Cruise & Leisure",
        description: "The core experience of Alleppey. Cruise on a traditional Kettuvallam (houseboat) through pristine lagoons, lakes, and narrow canals lined with palm trees.",
        image: "https://images.unsplash.com/photo-1593693411515-c202e974fe08?auto=format&fit=crop&w=600&q=80",
        openingHours: "Day cruises 9:00 AM - 5:00 PM, Overnight bookings standard",
        estimatedVisitDuration: "1 day",
        entryFee: "Varies from ₹6,000 to ₹25,000",
        lat: 9.4981,
        lon: 76.3388
      },
      {
        id: "alleppey_attr_2",
        name: "Alappuzha Lighthouse & Beach",
        rating: 4.3,
        category: "Attraction",
        subCategory: "Beach & Heritage",
        description: "A lovely sandy beach with a historic 150-year-old lighthouse that visitors can climb for spectacular views of the Arabian Sea.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
        openingHours: "3:00 PM - 5:00 PM (Lighthouse hours)",
        estimatedVisitDuration: "1.5 hours",
        entryFee: "₹20 for Lighthouse",
        lat: 9.4939,
        lon: 76.3155
      }
    ],
    restaurants: [
      {
        id: "alleppey_rest_1",
        name: "Halais Restaurant",
        rating: 4.4,
        category: "Restaurant",
        subCategory: "Kerala Biryani",
        description: "Popular local hotspot serving excellent malabar-style chicken biryani, ghee rice, and traditional duck roast curry.",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
        priceRange: "$$",
        lat: 9.5012,
        lon: 76.3451
      },
      {
        id: "alleppey_rest_2",
        name: "Cassia Beach Restaurant",
        rating: 4.6,
        category: "Restaurant",
        subCategory: "Seafood & Beach View",
        description: "A trendy open-air cafe near Marari beach known for fresh grilled fish, pizzas, and cocktails.",
        image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80",
        priceRange: "$$",
        lat: 9.5995,
        lon: 76.2991
      }
    ],
    hotels: [
      {
        id: "alleppey_hotel_1",
        name: "Lake Palace Resort",
        rating: 4.7,
        category: "Hotel",
        subCategory: "Luxury Resort",
        description: "A premium resort set on the banks of Vembanad Lake, featuring traditional wood architecture and luxury private cottages.",
        image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80",
        priceRange: "$$$",
        lat: 9.5255,
        lon: 76.3571
      },
      {
        id: "alleppey_hotel_2",
        name: "Zostel Alleppey Beachfront",
        rating: 4.4,
        category: "Hotel",
        subCategory: "Budget Hostel",
        description: "A beautiful container hostel located right on Alappuzha beach, offering cozy dorms, private rooms, and beachside activities.",
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
        priceRange: "$",
        lat: 9.4925,
        lon: 76.3150
      }
    ],
    events: [
      {
        id: "alleppey_event_1",
        name: "Nehru Trophy Boat Race",
        date: "Second Saturday of August annually",
        category: "Event",
        subCategory: "Snake Boat Race",
        description: "The most famous Chundan Vallam (snake boat) race in India. Hundreds of oarsmen row synchronized to traditional folk songs on Punnamada Lake.",
        image: "https://images.unsplash.com/photo-1593693411515-c202e974fe08?auto=format&fit=crop&w=600&q=80",
        entryFee: "₹100 - ₹3000 for gallery seats",
        lat: 9.5185,
        lon: 76.3533
      }
    ]
  },
  wayanad: {
    name: "Wayanad",
    state: "Kerala",
    description: "Nestled in the Western Ghats, Wayanad is a green paradise of mist, spice forests, and ancient caves.",
    image: "https://images.unsplash.com/photo-1627393100177-b4297e79a5be?auto=format&fit=crop&w=1200&q=80",
    attractions: [
      {
        id: "wayanad_attr_1",
        name: "Banasura Sagar Dam",
        rating: 4.6,
        category: "Attraction",
        subCategory: "Scenic Reservoir",
        description: "The largest earth dam in India and the second largest in Asia. Offers speedboating, zip-lining, and beautiful island trekking vistas.",
        image: "https://images.unsplash.com/photo-1627393100177-b4297e79a5be?auto=format&fit=crop&w=600&q=80",
        openingHours: "9:00 AM - 5:00 PM",
        estimatedVisitDuration: "2 hours",
        entryFee: "₹40 per adult",
        lat: 11.6703,
        lon: 75.9602
      },
      {
        id: "wayanad_attr_2",
        name: "Edakkal Caves",
        rating: 4.5,
        category: "Attraction",
        subCategory: "Prehistoric Heritage",
        description: "Two natural caves containing neolithic petroglyphs (carvings) dating back to 6,000 BC. Requires a steep but highly rewarding trek up the mountain.",
        image: "https://images.unsplash.com/photo-1503177119275-0aa32b31d468?auto=format&fit=crop&w=600&q=80",
        openingHours: "9:00 AM - 4:00 PM (Closed on Mondays)",
        estimatedVisitDuration: "3 hours",
        entryFee: "₹50 per adult",
        lat: 11.6288,
        lon: 76.2345
      }
    ],
    restaurants: [
      {
        id: "wayanad_rest_1",
        name: "1980's A Nostalgic Restaurant",
        rating: 4.7,
        category: "Restaurant",
        subCategory: "Traditional Kerala",
        description: "Renowned rustic restaurant serving exceptional Kerala meals inside clay pots, specialty fish fry, and local tapioca dishes.",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
        priceRange: "$$",
        lat: 11.6052,
        lon: 76.0825
      }
    ],
    hotels: [
      {
        id: "wayanad_hotel_1",
        name: "Vythiri Resort",
        rating: 4.8,
        category: "Hotel",
        subCategory: "Eco-Luxury Resort",
        description: "A premium jungle getaway located amidst a tropical rainforest, offering luxury treehouses, wooden cottages, and hanging bridge views.",
        image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=600&q=80",
        priceRange: "$$$",
        lat: 11.5385,
        lon: 76.0275
      }
    ],
    events: [
      {
        id: "wayanad_event_1",
        name: "Wayanad Splash Carnival",
        date: "July annually",
        category: "Event",
        subCategory: "Monsoon Tourism",
        description: "A unique monsoon tourism carnival focusing on off-road mud racing, local organic farming fairs, and adventure rain sports.",
        image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
        entryFee: "Depends on sports",
        lat: 11.6052,
        lon: 76.0825
      }
    ]
  },
  goa: {
    name: "Goa",
    state: "Goa",
    description: "Famous for its sunny beaches, historic churches, lively flea markets, and Portuguese heritage cuisine.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    attractions: [
      {
        id: "goa_attr_1",
        name: "Basilica of Bom Jesus",
        rating: 4.7,
        category: "Attraction",
        subCategory: "Religious & Heritage",
        description: "A UNESCO World Heritage site in Old Goa containing the mortal remains of St. Francis Xavier. Built in 1605, it is a prime example of baroque architecture.",
        image: "https://images.unsplash.com/photo-1614082242765-7c98cdc0d2df?auto=format&fit=crop&w=600&q=80",
        openingHours: "9:00 AM - 6:30 PM",
        estimatedVisitDuration: "1.5 hours",
        entryFee: "Free",
        lat: 15.5009,
        lon: 73.9116
      },
      {
        id: "goa_attr_2",
        name: "Fort Aguada & Lighthouse",
        rating: 4.5,
        category: "Attraction",
        subCategory: "Historical Fort",
        description: "A well-preserved seventeenth-century Portuguese fort standing on Sinquerim Beach, featuring an impressive four-story historic lighthouse.",
        image: "https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&w=600&q=80",
        openingHours: "9:30 AM - 6:00 PM",
        estimatedVisitDuration: "2 hours",
        entryFee: "Free",
        lat: 15.4925,
        lon: 73.7739
      },
      {
        id: "goa_attr_3",
        name: "Calangute Beach",
        rating: 4.2,
        category: "Attraction",
        subCategory: "Beach & Watersports",
        description: "Known as the 'Queen of Beaches', Calangute is a massive beach destination offering parasailing, jet-skiing, and bustling beach shacks.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
        openingHours: "Open 24 hours (Best for daytime activities)",
        estimatedVisitDuration: "3 hours",
        entryFee: "Free",
        lat: 15.5494,
        lon: 73.7535
      }
    ],
    restaurants: [
      {
        id: "goa_rest_1",
        name: "Gunpowder Assagao",
        rating: 4.7,
        category: "Restaurant",
        subCategory: "Peninsular Indian",
        description: "A highly acclaimed restaurant situated in a dreamy Assagao heritage villa, specializing in spicy pork vindaloo, appams, and Malabar parottas.",
        image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=600&q=80",
        priceRange: "$$",
        lat: 15.5901,
        lon: 73.7915
      },
      {
        id: "goa_rest_2",
        name: "Fisherman's Wharf",
        rating: 4.5,
        category: "Restaurant",
        subCategory: "Goan Seafood",
        description: "Riverside dining offering fresh catch preparation (Goan fish curry, butter garlic prawns) with live music and local drinks.",
        image: "https://images.unsplash.com/photo-1579027989536-b7b1ecda6374?auto=format&fit=crop&w=600&q=80",
        priceRange: "$$$",
        lat: 15.2289,
        lon: 73.9405
      }
    ],
    hotels: [
      {
        id: "goa_hotel_1",
        name: "Taj Exotica Resort & Spa",
        rating: 4.9,
        category: "Hotel",
        subCategory: "Beachfront Luxury",
        description: "A grand Mediterranean-inspired resort overlooking the Arabian Sea, featuring lush gardens, golf courses, and private villa pools.",
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
        priceRange: "$$$",
        lat: 15.2635,
        lon: 73.9238
      },
      {
        id: "goa_hotel_2",
        name: "Red Door Hostel Anjuna",
        rating: 4.2,
        category: "Hotel",
        subCategory: "Budget Hostel",
        description: "A top backpacker hostel in Anjuna with a beautiful green garden courtyard, shared kitchen, and great community vibes.",
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
        priceRange: "$",
        lat: 15.5802,
        lon: 73.7431
      }
    ],
    events: [
      {
        id: "goa_event_1",
        name: "Goa Carnival",
        date: "February annually",
        category: "Event",
        subCategory: "Cultural Parade",
        description: "Portuguese-origin carnival with massive colorful floats, dancing troupes, street music, and night-long feasts across Panaji.",
        image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
        entryFee: "Free to watch",
        lat: 15.4989,
        lon: 73.8278
      }
    ]
  },
  jaipur: {
    name: "Jaipur",
    state: "Rajasthan",
    description: "The historical Pink City, showcasing majestic hilltop forts, royal palaces, and vibrant spice bazaars.",
    image: "https://images.unsplash.com/photo-1477584322813-ac8f6453664d?auto=format&fit=crop&w=1200&q=80",
    attractions: [
      {
        id: "jaipur_attr_1",
        name: "Amber Palace (Amer Fort)",
        rating: 4.8,
        category: "Attraction",
        subCategory: "Fort & Palace",
        description: "A majestic hilltop fortress built in yellow and pink sandstone. Famous for its artistic Sheesh Mahal (Mirror Palace) and elephant/jeep paths.",
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80",
        openingHours: "8:00 AM - 5:30 PM",
        estimatedVisitDuration: "3 hours",
        entryFee: "₹100 for Indians, ₹500 for Foreigners",
        lat: 26.9855,
        lon: 75.8513
      },
      {
        id: "jaipur_attr_2",
        name: "Hawa Mahal (Palace of Winds)",
        rating: 4.6,
        category: "Attraction",
        subCategory: "Royal Heritage",
        description: "Constructed of red and pink sandstone, this unique five-story exterior resembles a honeycomb with its 953 small windows (jharokhas).",
        image: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=600&q=80",
        openingHours: "9:00 AM - 5:00 PM",
        estimatedVisitDuration: "1 hour",
        entryFee: "₹50 for Indians, ₹200 for Foreigners",
        lat: 26.9239,
        lon: 75.8267
      },
      {
        id: "jaipur_attr_3",
        name: "City Palace Jaipur",
        rating: 4.5,
        category: "Attraction",
        subCategory: "Royal Residence",
        description: "A palace complex built by Maharaja Sawai Jai Singh II. Includes the Chandra Mahal and Mubarak Mahal palaces, and beautifully decorated courtyards.",
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80",
        openingHours: "9:30 AM - 5:00 PM",
        estimatedVisitDuration: "2 hours",
        entryFee: "₹300 per adult",
        lat: 26.9258,
        lon: 75.8236
      }
    ],
    restaurants: [
      {
        id: "jaipur_rest_1",
        name: "Chokhi Dhani Resort & Restaurant",
        rating: 4.6,
        category: "Restaurant",
        subCategory: "Rajasthani Cultural Feast",
        description: "An ethnic village setup providing a cultural feast of folk dancing, camel rides, and traditional Gatte ki Sabzi and Dal Baati Churma thalis.",
        image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80",
        priceRange: "$$$",
        lat: 26.7667,
        lon: 75.8354
      },
      {
        id: "jaipur_rest_2",
        name: "Laxmi Mishthan Bhandar (LMB)",
        rating: 4.4,
        category: "Restaurant",
        subCategory: "Vegetarian Sweets & Thali",
        description: "Established in 1727, famous in Johri Bazaar for traditional Rajasthani Royal Thali, onion kachoris, and mouth-watering Ghewar.",
        image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80",
        priceRange: "$$",
        lat: 26.9213,
        lon: 75.8288
      }
    ],
    hotels: [
      {
        id: "jaipur_hotel_1",
        name: "Rambagh Palace - Taj",
        rating: 5.0,
        category: "Hotel",
        subCategory: "Heritage Luxury",
        description: "Known as the 'Jewel of Jaipur', this historic former residence of the Maharaja of Jaipur is one of the world's most luxurious heritage palace hotels.",
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
        priceRange: "$$$",
        lat: 26.8981,
        lon: 75.8089
      },
      {
        id: "jaipur_hotel_2",
        name: "Moustache Hostel Jaipur",
        rating: 4.5,
        category: "Hotel",
        subCategory: "Budget Hostel",
        description: "A trendy boutique designer hostel featuring rooftop views, beautiful Rajasthani style patterns, and private and shared dorm options.",
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
        priceRange: "$",
        lat: 26.9205,
        lon: 75.7975
      }
    ],
    events: [
      {
        id: "jaipur_event_1",
        name: "Jaipur Literature Festival (JLF)",
        date: "January annually",
        category: "Event",
        subCategory: "Literature Festival",
        description: "The world's largest free literary festival, bringing together global Nobel laureates, novelists, thinkers, and cultural icons for panels.",
        image: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=600&q=80",
        entryFee: "Free registration, paid delegates separate",
        lat: 26.8995,
        lon: 75.8068
      }
    ]
  }
};

// Travel Itinerary Generator Engine
export function generateItinerary(destinationKey, days = 3, budget = "mid-range", preference = "Culture") {
  const destKeyNormalized = destinationKey.toLowerCase().trim();
  const dest = destinationsData[destKeyNormalized] || destinationsData.kochi;
  
  // Base details
  const safetyScore = 85 + Math.floor(Math.random() * 12);
  const qualityScore = 90 + Math.floor(Math.random() * 8);
  const weatherTemp = 24 + Math.floor(Math.random() * 8);
  const weatherDescriptions = ["Clear Sunny", "Mist & Fog", "Overcast Clouds", "Cool Breeze", "Light Drizzle"];
  const weatherDesc = weatherDescriptions[Math.floor(Math.random() * weatherDescriptions.length)];

  // Filter lists based on preferences / ratings
  const attractions = [...dest.attractions];
  const restaurants = [...dest.restaurants];
  const hotels = [...dest.hotels];
  const events = [...dest.events];

  // Calculate budget breakdown
  const foodCost = budget === "budget" ? 15 : budget === "luxury" ? 100 : 45;
  const hotelCost = budget === "budget" ? 25 : budget === "luxury" ? 280 : 90;
  const activityCost = budget === "budget" ? 8 : budget === "luxury" ? 40 : 18;
  const transportCost = budget === "budget" ? 10 : budget === "luxury" ? 50 : 25;

  const totalEst = (foodCost + hotelCost + activityCost + transportCost) * days;

  const budgetBreakdown = {
    accommodation: hotelCost * days,
    meals: foodCost * days,
    activities: activityCost * days,
    transport: transportCost * days,
    total_estimated: totalEst
  };

  const packingChecklist = [
    "Valid Identity cards & booking vouchers",
    "Comfortable walking / hiking shoes",
    "Light cotton clothing & a light jacket",
    "Sunscreen, Sunglasses & Hat",
    "Power bank and camera gear",
    "Umbrella or waterproof windbreaker"
  ];

  const movieRecommendations = [
    {
      title: `Exploring India: The Magic of ${dest.name}`,
      rating: 4.8,
      overview: `A stunning documentary detailing the deep history, spice trade, and cultural convergence in ${dest.name}.`,
      poster_path: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=300&q=80"
    },
    {
      title: "Chef's Table: Local Heritage",
      rating: 4.5,
      overview: `Highlighting regional spices, local recipes, and ancient culinary crafts of ${dest.name}.`,
      poster_path: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80"
    }
  ];

  // Compile day-by-day itineraries dynamically
  const daysArray = [];
  const themes = {
    Culture: ["Historic Discoveries", "Heritage Walk & Folklore", "Crafts & Cuisine Exploration", "Art & Local Life Walk"],
    Adventure: ["Active Exploration", "Trekking & Scenic Paths", "Local Sports & Action", "Hidden Gems Trail"],
    Nature: ["Misty Valleys & Wildlife", "Lakeside Sunsets", "Plantation Trails", "Forest & Falls Excursion"],
    Food: ["Spicy Breakfast Trail", "Coastal Seafood Mastery", "Traditional Village Feasts", "Market Tasting Tour"],
    Family: ["Scenic Boating & Parks", "Palace & Museum Walks", "Beach & Souvenir Shopping", "Amusement & Picnic Day"]
  };

  const defaultThemes = themes[preference] || themes.Culture;

  for (let i = 1; i <= days; i++) {
    const theme = defaultThemes[(i - 1) % defaultThemes.length] || `Discovering ${dest.name} - Part ${i}`;
    
    // Pick daily attractions
    const attr1 = attractions[(i - 1) % attractions.length];
    const attr2 = attractions[i % attractions.length];
    const rest1 = restaurants[(i - 1) % restaurants.length] || { name: "Local Spices Bistro" };
    const rest2 = restaurants[i % restaurants.length] || { name: "Heritage Curry House" };
    
    const activities = [
      `09:00 AM – Visit ${attr1.name}. ${attr1.description.slice(0, 110)}... (Est. time: ${attr1.estimatedVisitDuration || '2 hours'})`,
      `12:00 PM – Lunch at ${rest1.name} (${rest1.subCategory || 'Traditional Dining'})`,
      `03:00 PM – Explore ${attr2.name}. Enjoy local photography and guided walks.`,
      `07:00 PM – Dinner at ${rest2.name} and walk around the local town center.`
    ];

    daysArray.push({
      day: `Day ${i}`,
      theme,
      activities
    });
  }

  return {
    id: `${destKeyNormalized}_trip_${Date.now()}`,
    destination: dest.name,
    dates: `${new Date().toLocaleDateString()} - ${new Date(Date.now() + days * 86400000).toLocaleDateString()}`,
    duration: days,
    travelers: 1,
    travel_quality_score: qualityScore,
    safety_score: safetyScore,
    weather_info: {
      temp: weatherTemp,
      description: weatherDesc
    },
    budget_breakdown: budgetBreakdown,
    packing_checklist: packingChecklist,
    movie_recommendations: movieRecommendations,
    evaluator_feedback: `The system successfully verified ${dest.name} plans. Excellent climate matches selected travel preferences. Recommended transport options: Private pre-paid taxi or auto-rickshaws.`,
    itinerary: {
      days: daysArray
    },
    nearby_attractions: attractions,
    restaurants: restaurants,
    malls: hotels,
    budget_tier: budget
  };
}

export const assistantSuggestedPrompts = [
  "What can I visit in Kochi in 2 days?",
  "Best food places near Fort Kochi?",
  "Create a budget itinerary for Munnar.",
  "Which events are happening in Goa?",
  "Best time of year to visit Wayanad?"
];

export const assistantAnswers = {
  "what can i visit in kochi in 2 days?": `### Kochi 2-Day Highlights

**Day 1: Colonial Heritage (Fort Kochi)**
*   **Morning**: Chinese Fishing Nets & St. Francis Church. Walk down Prince Street.
*   **Afternoon**: Lunch at *Kashi Art Cafe*. Visit the Dutch Cemetery.
*   **Evening**: Sunset walk at Fort Kochi Beach and local Kathakali dance performance.

**Day 2: Royal History & Markets (Mattancherry & Ernakulam)**
*   **Morning**: Mattancherry Palace (Dutch Palace) and Jew Town Synagogue.
*   **Afternoon**: Seafood lunch at *Fort House*. Take a ferry to Marine Drive.
*   **Evening**: Sunset cruise along the backwaters, dinner at *Paragon Restaurant*.`,

  "best food places near fort kochi?": `### Fort Kochi Food Recommendations

1.  **Kashi Art Cafe** (Princess Street)
    *   *Vibe*: Artsy, serene garden courtyard.
    *   *Must-Try*: Roast Chicken Sandwich, Organic salads, Dark chocolate cake.
2.  **Fort House Restaurant** (Calvathy Road)
    *   *Vibe*: Waterfront jetty dining under lanterns.
    *   *Must-Try*: Kerala Syrian Christian beef fry, Pork vindaloo, Karimeen Pollichathu (pearl spot fish).
3.  **Ginger House Restaurant** (Mattancherry Jew Town)
    *   *Vibe*: Museum-like, on the water.
    *   *Must-Try*: Ginger ice tea, Ginger prawns, local banana fritters.`,

  "create a budget itinerary for munnar.": `### Budget Munnar Plan (3 Days)

*   **Accommodation**: Stay at *Zostel Munnar* or private rooms in local homesteads (₹1000-₹1500/night).
*   **Transport**: Hire a local scooter/moped (₹400/day) instead of taxi packages.

**Day 1: Tea Trails**
*   Visit *Tata Tea Museum* (₹125 entry).
*   Walk through Lockhart Tea plantation trails (Free).
*   Lunch/Dinner at *Rapsy Restaurant* in Munnar town (extremely budget-friendly parottas/biryani).

**Day 2: Dams & Lakes**
*   Ride to *Mattupetty Dam* (₹10 entry). Share a speed-boat with other travelers.
*   Check out *Kundala Lake* and echo point.

**Day 3: Wildlife**
*   Take early morning KSRTC bus to *Eravikulam National Park* (₹200 entry). See Nilgiri Tahr.`,

  "which events are happening in goa?": `### Major Goa Annual Events

*   **Goa Carnival (February)**: A spectacular multi-day festival with massive street parades, float events, and traditional Portuguese costumes in Panaji.
*   **Shigmo Festival (March)**: Spring festival featuring traditional Hindu folklore parades, color fights, and elaborate wooden float displays.
*   **Sunburn Festival (December)**: Asia's largest electronic dance music (EDM) festival, bringing international DJs to Vagator/Anjuna beaches.
*   **Feast of St. Francis Xavier (December 3)**: A major religious celebration at the Basilica of Bom Jesus, Old Goa, attracting millions.`,

  "best time of year to visit wayanad?": `### Best Time to Visit Wayanad

*   **October to May (Peak Season)**: Cool and comfortable temperatures (18°C - 28°C). Ideal for trekking up Chembra Peak, exploring Edakkal Caves, and jungle safaris.
*   **June to September (Monsoon - Adventure)**: Beautiful lush-green look with gushing waterfalls (Soochipara). Best for experiencing the *Wayanad Splash monsoon festival*, though mountain trekking is closed due to slippery terrains.`,

  "spa in kochi": `### 💆 Top Ayurvedic Spas & Wellness Retreats in Kochi

If you are visiting Kochi exclusively for a relaxing spa or authentic Kerala Ayurveda experience, here are the top recommended centers:

1. **Ayurville Ayurveda Clinic & Spa (Fort Kochi)**
   * **Highlight**: Traditional authentic *Abhyangam* (herbal oil massage) and *Shirodhara* (oil stream therapy) by licensed practitioners.
   * **Vibe**: Peaceful heritage bungalow on KB Jacob Road, Fort Kochi.
   * **Estimated Cost**: ₹2,500 – ₹4,500 per session.

2. **Fort Ayurveda Spa at Forte Kochi Hotel**
   * **Highlight**: Luxury wellness treatment combining classical Kerala therapies with modern steam rooms inside a restored 1860 colonial mansion.
   * **Location**: Princess Street, Fort Kochi.
   * **Estimated Cost**: ₹3,500 – ₹6,000 per session.

3. **Quan Spa at Kochi Marriott & Grand Hyatt Spa (Bolgatty Island)**
   * **Highlight**: World-class 5-star luxury waterfront spa featuring Swedish massage, deep tissue therapy, and couples hydrotherapy.
   * **Location**: Bolgatty Island & Edappally.
   * **Estimated Cost**: ₹5,000 – ₹9,000 per session.

4. **Prakriti Ayurveda Massage Center**
   * **Highlight**: Budget-friendly, highly-rated authentic *Panchakarma* & head/foot reflexology.
   * **Location**: Near Seagull Hotel, Fort Kochi.
   * **Estimated Cost**: ₹1,800 – ₹3,000 per session.

> 💡 **Traveler Tip**: Book your appointment 24 hours in advance, especially during peak season (November–February). Afterward, enjoy a quiet sunset stroll along Fort Kochi beach!`,

  "spa and wellness in munnar": `### 🌿 Mountain Spas & Wellness Retreats in Munnar

* **Mayura Ayurveda Spa at Amber Dale**: Relax with warm herbal oil massages surrounded by misty tea valley panoramas.
* **Spice Tree Wellness Spa**: Holistic aromatherapy, eucalyptus steam, and tea-infused body scrubs.`,

  "spa and wellness in goa": `### 🌊 Oceanfront Spas & Wellness in Goa

* **Jiva Spa at Taj Exotica (Benaulim)**: Ayurvedic wellness therapies right on the Arabian Sea shore.
* **Warren Tricomi Spa (Candolim)**: Modern Swedish massages, body wraps, and scalp treatments.`
};
