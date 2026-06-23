const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Shelter = require('../models/Shelter');
const Admin = require('../models/Admin');
const Animal = require('../models/Animal');
const RescueRequest = require('../models/RescueRequest');
const AdoptionRequest = require('../models/AdoptionRequest');
const Notification = require('../models/Notification');

// Load env variables
dotenv.config();

const seedData = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    // Clear existing data
    console.log('Clearing database collection records...');
    await User.deleteMany({});
    await Shelter.deleteMany({});
    await Admin.deleteMany({});
    await Animal.deleteMany({});
    await RescueRequest.deleteMany({});
    await AdoptionRequest.deleteMany({});
    await Notification.deleteMany({});
    console.log('Database cleared.');

    console.log('Seeding records...');

    // 1. Create Users (User, Shelter Owner, Admin)
    const adminUser = await User.create({
      name: 'Global Administrator',
      email: 'admin@rehabitat.org',
      password: 'password123',
      phone: '+1 (555) 019-2834',
      role: 'admin'
    });

    const shelterUser1 = await User.create({
      name: 'Dr. Evelyn Carter',
      email: 'evelyn@pawclinic.org',
      password: 'password123',
      phone: '+1 (555) 012-3456',
      role: 'shelter'
    });

    const shelterUser2 = await User.create({
      name: 'Marcus Vance',
      email: 'marcus@greenvalesanctuary.org',
      password: 'password123',
      phone: '+1 (555) 014-9876',
      role: 'shelter'
    });

    const shelterUserPending = await User.create({
      name: 'Clara Oswald',
      email: 'clara@safehaven.org',
      password: 'password123',
      phone: '+1 (555) 016-5432',
      role: 'shelter'
    });

    const normalUser1 = await User.create({
      name: 'Sarah Connor',
      email: 'sarah@gmail.com',
      password: 'password123',
      phone: '+1 (555) 017-8899',
      role: 'user'
    });

    const normalUser2 = await User.create({
      name: 'John Doe',
      email: 'john@gmail.com',
      password: 'password123',
      phone: '+1 (555) 018-7766',
      role: 'user'
    });

    // 2. Create Admin profile
    await Admin.create({
      userId: adminUser._id,
      adminCode: 'ADMIN-GLOBAL-01'
    });

    // 3. Create Shelter profiles (Paws Clinic approved, Greenvale approved, SafeHaven pending)
    const shelter1 = await Shelter.create({
      userId: shelterUser1._id,
      shelterName: 'Paws & Claws Veterinary Clinic',
      licenseNumber: 'VET-LIC-88902',
      address: '742 Evergreen Terrace, Springfield',
      location: {
        type: 'Point',
        coordinates: [-122.4194, 37.7749] // San Francisco Downtown area
      },
      radiusPreferenceKm: 15,
      status: 'Approved'
    });

    const shelter2 = await Shelter.create({
      userId: shelterUser2._id,
      shelterName: 'Greenvale Animal Sanctuary',
      licenseNumber: 'SANCT-LIC-44512',
      address: '2288 Fulton St, San Francisco',
      location: {
        type: 'Point',
        coordinates: [-122.4512, 37.7725] // Fulton Street, close to Golden Gate Park
      },
      radiusPreferenceKm: 10,
      status: 'Approved'
    });

    const shelter3 = await Shelter.create({
      userId: shelterUserPending._id,
      shelterName: 'Safe Haven Rescue Shelter',
      licenseNumber: 'RESC-LIC-77112',
      address: '1590 Eisenhower Blvd, Springfield',
      location: {
        type: 'Point',
        coordinates: [-122.4820, 37.7599] // Outer Sunset Area
      },
      radiusPreferenceKm: 12,
      status: 'Pending'
    });

    // 4. Create Animal Reports
    // Case 1: Injured Dog (Rescued and Under Treatment)
    const animal1 = await Animal.create({
      category: 'Dog',
      description: 'Golden retriever found near Golden Gate Park with a severely bleeding left leg. Looks like a minor collision injury.',
      healthStatus: 'Under Treatment',
      photos: [],
      location: {
        type: 'Point',
        coordinates: [-122.4662, 37.7694] // Close to Greenvale (distance ~ 1.3km)
      },
      reportedBy: normalUser1._id,
      assignedShelter: shelter2._id
    });

    // Case 2: Injured Cat (Reported, no shelter has accepted yet)
    const animal2 = await Animal.create({
      category: 'Cat',
      description: 'Tabby cat trapped in a storm drain. Shivering, appears hydrated but unable to climb out. Needs harness/rescue tool.',
      healthStatus: 'Reported',
      photos: [],
      location: {
        type: 'Point',
        coordinates: [-122.4282, 37.7881] // Near downtown (distance to Paws Clinic ~ 1.6km)
      },
      reportedBy: normalUser2._id
    });

    // Case 3: Recovered Cow (Available for adoption)
    const animal3 = await Animal.create({
      category: 'Cow',
      description: 'Stray cow found with minor barbed wire lacerations on torso. Recovered fully after 2 weeks of antibiotic treatment.',
      healthStatus: 'Available For Adoption',
      photos: [],
      location: {
        type: 'Point',
        coordinates: [-122.4342, 37.7548] // Mission district area
      },
      reportedBy: normalUser1._id,
      assignedShelter: shelter1._id
    });

    // 5. Create RescueRequest Records
    // Request 1: Dog under treatment
    await RescueRequest.create({
      animalId: animal1._id,
      reporterId: normalUser1._id,
      assignedShelterId: shelter2._id,
      status: 'Under Treatment',
      logs: [
        { status: 'Reported', remarks: 'Golden retriever reported with leg injury', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
        { status: 'Rescue Accepted', remarks: 'Greenvale Sanctuary dispatched response vehicle', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000) },
        { status: 'Rescued', remarks: 'Dog successfully caught, leg stabilized with splint', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
        { status: 'Under Treatment', remarks: 'Stitches applied to gashes. Cast fitted. Recovering well under care.', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
      ]
    });

    // Request 2: Cat reported
    await RescueRequest.create({
      animalId: animal2._id,
      reporterId: normalUser2._id,
      status: 'Reported',
      logs: [
        { status: 'Reported', remarks: 'Tabby cat reported in drain' }
      ]
    });

    // Request 3: Cow recovered
    await RescueRequest.create({
      animalId: animal3._id,
      reporterId: normalUser1._id,
      assignedShelterId: shelter1._id,
      status: 'Available For Adoption',
      logs: [
        { status: 'Reported', remarks: 'Cow reported in wire fences', timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
        { status: 'Rescue Accepted', remarks: 'Paws clinic dispatched transport trailer', timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000) },
        { status: 'Rescued', remarks: 'Cow loaded safely into trailer', timestamp: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000) },
        { status: 'Under Treatment', remarks: 'Wound care applied, minor infections cleared', timestamp: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000) },
        { status: 'Recovered', remarks: 'Wounds fully healed. Fit for release or farming adoption.', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
        { status: 'Available For Adoption', remarks: 'Placed into public adoption database.', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) }
      ]
    });

    // 6. Create Adoption request
    await AdoptionRequest.create({
      animalId: animal3._id,
      userId: normalUser2._id,
      shelterId: shelter1._id,
      status: 'Pending',
      message: 'I have a large meadow and pasture space. I would love to adopt this cow to protect it and let it graze peacefully!',
      contactPhone: '+1 (555) 018-7766'
    });

    // 7. Seed initial notifications
    await Notification.create({
      recipientId: shelterUser1._id,
      title: 'New Injured Animal Reported Nearby',
      message: 'A Cat is reported 1.6 km from your location. Needs assistance!',
      type: 'Rescue'
    });

    await Notification.create({
      recipientId: normalUser1._id,
      title: 'Rescue Request Accepted',
      message: 'Your report of a Dog was accepted by Greenvale Animal Sanctuary. They are on their way!',
      type: 'Rescue'
    });

    console.log('Database seeded successfully.');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
