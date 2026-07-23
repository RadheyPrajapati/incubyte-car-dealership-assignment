require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Vehicle = require('./src/models/Vehicle');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/car_dealership';

const DEMO_VEHICLES = [
  {
    make: 'Porsche',
    model: '911 Carrera S',
    year: 2024,
    category: 'Coupe',
    price: 131300,
    quantity: 3,
    status: 'Available',
    vin: 'WP0AA2A98MS12001',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
    description: 'Twin-turbo 3.0L flat-six engine producing 443 horsepower with 8-speed PDK dual-clutch transmission.'
  },
  {
    make: 'Tesla',
    model: 'Model S Plaid',
    year: 2024,
    category: 'Electric',
    price: 89990,
    quantity: 4,
    status: 'Available',
    vin: '5YJSA1E28MF34002',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
    description: 'Tri-motor all-wheel drive with 1,020 horsepower and 0-60 mph acceleration in 1.99 seconds.'
  },
  {
    make: 'BMW',
    model: 'X7 xDrive40i',
    year: 2023,
    category: 'SUV',
    price: 81900,
    quantity: 2,
    status: 'Available',
    vin: '5UXCW2C03P98003',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    description: 'Full-size 7-seater luxury SUV equipped with xDrive all-wheel drive and Panoramic Sky Lounge glass roof.'
  },
  {
    make: 'Mercedes-AMG',
    model: 'GT 63 S',
    year: 2024,
    category: 'Coupe',
    price: 170350,
    quantity: 1,
    status: 'Available',
    vin: 'W1K7X8EB7MA004',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
    description: 'Handcrafted AMG 4.0L V8 Biturbo producing 630 horsepower with AMG Performance 4MATIC+ drive system.'
  },
  {
    make: 'Audi',
    model: 'RS e-tron GT',
    year: 2024,
    category: 'Electric',
    price: 147100,
    quantity: 2,
    status: 'Available',
    vin: 'WAUZZZF80NA005',
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80',
    description: 'Dual electric motors generating up to 637 horsepower in boost mode with carbon fiber roof structure.'
  },
  {
    make: 'Ford',
    model: 'Mustang Dark Horse',
    year: 2024,
    category: 'Coupe',
    price: 59270,
    quantity: 0,
    status: 'Out of Stock',
    vin: '1FA6P8CF9R5006',
    image: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80',
    description: '5.0L Coyote V8 engine delivering 500 naturally aspirated horsepower with TREMEC 6-speed manual transmission.'
  }
];

async function seedData() {
  try {
    console.log('Connecting to MongoDB at:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);

    console.log('Clearing existing demo data...');
    await User.deleteMany({});
    await Vehicle.deleteMany({});

    console.log('Registering Dealer Admin account (radheym2006@gmail.com)...');
    const adminUser = new User({
      name: 'Radhey (Dealer Admin)',
      email: 'radheym2006@gmail.com',
      password: '123456',
      role: 'ADMIN'
    });
    await adminUser.save();
    console.log('Successfully registered Admin:', adminUser.email);

    console.log('Registering Demo Customer account...');
    const customerUser = new User({
      name: 'Demo Customer',
      email: 'customer@dealership.com',
      password: '123456',
      role: 'USER'
    });
    await customerUser.save();
    console.log('Successfully registered Customer:', customerUser.email);

    console.log('Seeding Demo Vehicle Showroom Catalog...');
    const createdVehicles = await Vehicle.insertMany(DEMO_VEHICLES);
    console.log(`Successfully seeded ${createdVehicles.length} vehicle models!`);

    console.log('\n=============================================');
    console.log('        DEMO DATA SEEDING COMPLETE           ');
    console.log('=============================================');
    console.log('DEALER ADMIN CREDENTIALS:');
    console.log('  Email:    radheym2006@gmail.com');
    console.log('  Password: 123456');
    console.log('  Role:     ADMIN');
    console.log('---------------------------------------------');
    console.log('CUSTOMER CREDENTIALS:');
    console.log('  Email:    customer@dealership.com');
    console.log('  Password: 123456');
    console.log('  Role:     USER');
    console.log('=============================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
}

seedData();
