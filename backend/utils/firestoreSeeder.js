const dotenv = require('dotenv');
dotenv.config();

// Set emulator mode explicitly
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

const { collections, addDoc } = require('../config/collections');

const seedFirestore = async () => {
  try {
    console.log('Seeding Firestore (emulator mode)...');

    // Create test animals (simplified)
    console.log('Creating animals...');

    await addDoc(collections.animals, {
      category: 'Dog',
      name: 'Buddy',
      age: '3 years',
      gender: 'Male',
      description: 'Golden retriever found near Golden Gate Park. Fully recovered and ready for adoption!',
      healthStatus: 'Available For Adoption',
      photos: [],
      location: {
        type: 'Point',
        coordinates: [-122.4662, 37.7694]
      },
      reportedBy: 'test-user-1',
      assignedShelter: 'test-shelter-1'
    });

    await addDoc(collections.animals, {
      category: 'Cat',
      name: 'Whiskers',
      age: '2 years',
      gender: 'Female',
      description: 'Tabby cat rescued from storm drain. Healthy and playful!',
      healthStatus: 'Available For Adoption',
      photos: [],
      location: {
        type: 'Point',
        coordinates: [-122.4282, 37.7881]
      },
      reportedBy: 'test-user-1',
      assignedShelter: 'test-shelter-1'
    });

    await addDoc(collections.animals, {
      category: 'Cow',
      name: 'Bessie',
      age: '5 years',
      gender: 'Female',
      description: 'Stray cow with minor injuries. Fully recovered now!',
      healthStatus: 'Available For Adoption',
      photos: [],
      location: {
        type: 'Point',
        coordinates: [-122.4342, 37.7548]
      },
      reportedBy: 'test-user-1',
      assignedShelter: 'test-shelter-1'
    });

    // Also add a test shelter for the animals
    await addDoc(collections.shelters, {
      id: 'test-shelter-1',
      shelterName: 'Paws & Claws Veterinary Clinic',
      address: '742 Evergreen Terrace, Springfield',
      status: 'Approved'
    });

    console.log('Firestore seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Firestore:', error);
    process.exit(1);
  }
};

seedFirestore();
