/**
 * AUTOAID 360 - Database Seeder
 * Populates the database with initial data for development and testing
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';

// Load environment variables
dotenv.config();

/**
 * Sample user data
 */
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@autoaid360.com',
    passwordHash: 'Admin@123',
    role: 'admin',
    phone: '+917217842834',
    location: {
      address: 'Corporate Office, Sector 62',
      city: 'Noida',
      state: 'Uttar Pradesh',
      coordinates: { lat: 28.6139, lng: 77.2090 }
    }
  },
  {
    name: 'Lead Mechanic',
    email: 'mechanic@autoaid360.com',
    passwordHash: 'Mech@123',
    role: 'mechanic',
    phone: '+919876543210',
    location: {
      address: 'Service Center, Connaught Place',
      city: 'New Delhi',
      state: 'Delhi',
      coordinates: { lat: 28.6315, lng: 77.2167 }
    }
  },
  {
    name: 'Demo Customer',
    email: 'customer@autoaid360.com',
    passwordHash: 'Cust@123',
    role: 'customer',
    phone: '+919123456789',
    location: {
      address: 'Residential Complex, Gurgaon',
      city: 'Gurgaon',
      state: 'Haryana',
      coordinates: { lat: 28.4595, lng: 77.0266 }
    }
  },
  {
    name: 'Rajesh Kumar',
    email: 'rajesh.mechanic@autoaid360.com',
    passwordHash: 'Rajesh@123',
    role: 'mechanic',
    phone: '+918765432109',
    location: {
      address: 'Industrial Area, Faridabad',
      city: 'Faridabad',
      state: 'Haryana'
    }
  },
  {
    name: 'Priya Sharma',
    email: 'priya.customer@gmail.com',
    passwordHash: 'Priya@123',
    role: 'customer',
    phone: '+917654321098',
    location: {
      address: 'DLF Phase 3, Gurgaon',
      city: 'Gurgaon',
      state: 'Haryana'
    }
  }
];

/**
 * Sample service data
 */
const sampleServices = [
  {
    title: 'Emergency Roadside Assistance',
    description: 'Complete 24/7 roadside assistance including tire change, jump start, fuel delivery, and lockout service. Our certified mechanics reach you within 30 minutes.',
    category: 'roadside-assistance',
    price: 999,
    durationMinutes: 45,
    availability: '24/7',
    serviceAreas: [
      { city: 'Delhi', state: 'Delhi', radius: 50 },
      { city: 'Gurgaon', state: 'Haryana', radius: 30 },
      { city: 'Noida', state: 'Uttar Pradesh', radius: 25 }
    ],
    requirements: ['Vehicle registration documents', 'Valid ID proof'],
    features: [
      '24/7 availability',
      'Certified mechanics',
      'GPS tracking',
      'Real-time updates',
      'Insurance coverage'
    ],
    rating: { average: 4.5, totalReviews: 127 },
    popularityScore: 150
  },
  {
    title: 'EV Charging Support',
    description: 'On-demand EV charging service with mobile charging units. We bring the charger to you! Compatible with all major EV brands.',
    category: 'ev-charging',
    price: 299,
    durationMinutes: 60,
    availability: '24/7',
    serviceAreas: [
      { city: 'Delhi', state: 'Delhi', radius: 40 },
      { city: 'Gurgaon', state: 'Haryana', radius: 35 }
    ],
    requirements: ['EV compatibility check', 'Charging port access'],
    features: [
      'Mobile charging units',
      'Fast charging technology',
      'All EV brands supported',
      'Real-time charging status',
      'Eco-friendly service'
    ],
    rating: { average: 4.7, totalReviews: 89 },
    popularityScore: 120
  },
  {
    title: 'Battery Delivery & Installation',
    description: 'Premium car battery delivery and installation service. We carry all major battery brands and provide free battery testing.',
    category: 'battery-delivery',
    price: 1599,
    durationMinutes: 30,
    availability: 'business-hours',
    serviceAreas: [
      { city: 'Delhi', state: 'Delhi', radius: 30 },
      { city: 'Noida', state: 'Uttar Pradesh', radius: 25 }
    ],
    requirements: ['Vehicle make and model', 'Current battery specifications'],
    features: [
      'Premium battery brands',
      'Free battery testing',
      'Old battery disposal',
      '2-year warranty',
      'Professional installation'
    ],
    rating: { average: 4.6, totalReviews: 64 },
    popularityScore: 95
  },
  {
    title: 'Accident Protection & Towing',
    description: 'Comprehensive accident support including towing, insurance assistance, and emergency repairs. Available 24/7 with rapid response.',
    category: 'accident-protection',
    price: 2499,
    durationMinutes: 90,
    availability: '24/7',
    serviceAreas: [
      { city: 'Delhi', state: 'Delhi', radius: 60 },
      { city: 'Gurgaon', state: 'Haryana', radius: 40 },
      { city: 'Faridabad', state: 'Haryana', radius: 35 }
    ],
    requirements: ['Valid driving license', 'Vehicle registration', 'Insurance documents'],
    features: [
      'Immediate response',
      'Insurance claim assistance',
      'Professional towing',
      'Emergency repairs',
      'Legal support guidance'
    ],
    rating: { average: 4.8, totalReviews: 43 },
    popularityScore: 85
  },
  {
    title: 'Heavy Vehicle Towing',
    description: 'Specialized towing service for trucks, buses, and heavy commercial vehicles. Equipped with heavy-duty towing equipment.',
    category: 'towing',
    price: 3999,
    durationMinutes: 120,
    availability: '24/7',
    serviceAreas: [
      { city: 'Delhi', state: 'Delhi', radius: 80 },
      { city: 'Gurgaon', state: 'Haryana', radius: 50 }
    ],
    requirements: ['Commercial vehicle documents', 'Special permits if applicable'],
    features: [
      'Heavy-duty equipment',
      'Experienced operators',
      'Damage-free towing',
      'GPS tracking',
      'Insurance coverage'
    ],
    rating: { average: 4.4, totalReviews: 31 },
    popularityScore: 70
  },
  {
    title: 'On-Site Emergency Repair',
    description: 'Professional mechanics come to your location for emergency repairs. Equipped with tools and common spare parts.',
    category: 'emergency-repair',
    price: 1299,
    durationMinutes: 75,
    availability: '24/7',
    serviceAreas: [
      { city: 'Delhi', state: 'Delhi', radius: 45 },
      { city: 'Noida', state: 'Uttar Pradesh', radius: 30 }
    ],
    requirements: ['Vehicle access', 'Problem description'],
    features: [
      'Certified mechanics',
      'Mobile workshop',
      'Common spare parts',
      'Diagnostic tools',
      'Quality guarantee'
    ],
    rating: { average: 4.5, totalReviews: 78 },
    popularityScore: 100
  },
  {
    title: 'Preventive Maintenance Check',
    description: 'Comprehensive vehicle health check-up and preventive maintenance at your doorstep. Includes engine, brakes, AC, and electrical systems.',
    category: 'preventive-maintenance',
    price: 899,
    durationMinutes: 60,
    availability: 'business-hours',
    serviceAreas: [
      { city: 'Gurgaon', state: 'Haryana', radius: 25 },
      { city: 'Faridabad', state: 'Haryana', radius: 20 }
    ],
    requirements: ['Vehicle service history', 'Parking space for inspection'],
    features: [
      'Comprehensive inspection',
      'Digital report',
      'Preventive recommendations',
      'Cost estimates',
      'Follow-up support'
    ],
    rating: { average: 4.3, totalReviews: 52 },
    popularityScore: 60
  }
];

/**
 * Clear existing data
 */
const clearDatabase = async () => {
  try {
    await User.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});
    console.log('🗑️  Cleared existing data');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
};

/**
 * Seed users
 */
const seedUsers = async () => {
  try {
    console.log('👥 Seeding users...');
    
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.name} (${user.email})`);
    }
    
    return createdUsers;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

/**
 * Seed services
 */
const seedServices = async (users) => {
  try {
    console.log('🔧 Seeding services...');
    
    // Find mechanics and admin to assign as service creators
    const mechanics = users.filter(user => user.role === 'mechanic');
    const admin = users.find(user => user.role === 'admin');
    const creators = [...mechanics, admin];
    
    const createdServices = [];
    for (const serviceData of sampleServices) {
      // Randomly assign creator
      const creator = creators[Math.floor(Math.random() * creators.length)];
      serviceData.createdBy = creator._id;
      
      const service = new Service(serviceData);
      await service.save();
      createdServices.push(service);
      console.log(`✅ Created service: ${service.title}`);
    }
    
    return createdServices;
  } catch (error) {
    console.error('Error seeding services:', error);
    throw error;
  }
};

/**
 * Seed sample bookings
 */
const seedBookings = async (users, services) => {
  try {
    console.log('📅 Seeding sample bookings...');
    
    const customers = users.filter(user => user.role === 'customer');
    const mechanics = users.filter(user => user.role === 'mechanic');
    
    const sampleBookings = [
      {
        user: customers[0]._id,
        service: services[0]._id, // Emergency Roadside Assistance
        scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        status: 'pending',
        location: {
          address: 'NH-8, Sector 15, Gurgaon',
          city: 'Gurgaon',
          state: 'Haryana',
          coordinates: { lat: 28.4595, lng: 77.0266 }
        },
        vehicleInfo: {
          make: 'Maruti Suzuki',
          model: 'Swift',
          year: 2020,
          licensePlate: 'DL-01-AB-1234',
          vehicleType: 'car'
        },
        contactInfo: {
          phone: '+919123456789',
          preferredContact: 'phone'
        },
        problemDescription: 'Car broke down on highway, engine making strange noise',
        urgencyLevel: 'high',
        estimatedCost: 999
      },
      {
        user: customers[1]._id,
        service: services[1]._id, // EV Charging Support
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        status: 'accepted',
        mechanic: mechanics[0]._id,
        location: {
          address: 'DLF Cyber City, Gurgaon',
          city: 'Gurgaon',
          state: 'Haryana',
          coordinates: { lat: 28.4945, lng: 77.0834 }
        },
        vehicleInfo: {
          make: 'Tata',
          model: 'Nexon EV',
          year: 2023,
          licensePlate: 'HR-26-CD-5678',
          vehicleType: 'ev'
        },
        contactInfo: {
          phone: '+917654321098',
          preferredContact: 'whatsapp'
        },
        problemDescription: 'Need emergency charging, battery at 5%',
        urgencyLevel: 'medium',
        estimatedCost: 299
      }
    ];
    
    for (const bookingData of sampleBookings) {
      const booking = new Booking(bookingData);
      await booking.save();
      console.log(`✅ Created booking: ${booking._id}`);
    }
    
  } catch (error) {
    console.error('Error seeding bookings:', error);
    throw error;
  }
};

/**
 * Main seeder function
 */
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    console.log('==========================================');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await clearDatabase();
    
    // Seed data in order
    const users = await seedUsers();
    const services = await seedServices(users);
    await seedBookings(users, services);
    
    console.log('==========================================');
    console.log('✅ Database seeding completed successfully!');
    console.log('');
    console.log('🔐 Demo Accounts:');
    console.log('Admin: admin@autoaid360.com / Admin@123');
    console.log('Mechanic: mechanic@autoaid360.com / Mech@123');
    console.log('Customer: customer@autoaid360.com / Cust@123');
    console.log('');
    console.log('📊 Seeded Data:');
    console.log(`- ${users.length} users`);
    console.log(`- ${services.length} services`);
    console.log('- 2 sample bookings');
    console.log('');
    console.log('🚀 Ready to start the server!');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run seeder if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;