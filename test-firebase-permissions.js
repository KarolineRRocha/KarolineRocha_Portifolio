const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, addDoc, deleteDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCJP7srkrJ46QU7fkihd6RFAEKWc93lUqk",
  authDomain: "karoline-rocha-portfolio.firebaseapp.com",
  projectId: "karoline-rocha-portfolio",
  storageBucket: "karoline-rocha-portfolio.firebasestorage.app",
  messagingSenderId: "1072400112152",
  appId: "1:1072400112152:web:c87e66a4099390e608c16d",
  measurementId: "G-R1FSHG2N8T"
};

async function testFirebasePermissions() {
  try {
    console.log('🔥 Testing Firebase permissions...');

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('✅ Firebase initialized');

    // Test 1: Read access
    console.log('📖 Testing read access...');
    const projectsRef = collection(db, 'projects');
    const snapshot = await getDocs(projectsRef);
    console.log(`✅ Read successful - Found ${snapshot.docs.length} projects`);

    // Test 2: Write access
    console.log('✍️ Testing write access...');
    const testDoc = {
      name: 'Test Project',
      description: 'Test description for permissions',
      technologies: ['Test'],
      imageUrl: '',
      demoUrl: '',
      projectUrl: '',
      category: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
      featured: false,
      order: 999
    };

    const docRef = await addDoc(projectsRef, testDoc);
    console.log(`✅ Write successful - Document created with ID: ${docRef.id}`);

    // Test 3: Delete access
    console.log('🗑️ Testing delete access...');
    await deleteDoc(docRef);
    console.log(`✅ Delete successful - Document deleted`);

    console.log('🎉 All Firebase permissions tests passed!');

  } catch (error) {
    console.error('❌ Firebase permissions test failed:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });

    if (error.code === 'permission-denied') {
      console.error('🔒 PERMISSION DENIED: Check Firestore security rules');
      console.error('💡 Solution: Update Firestore rules to allow read/write access');
    }
  }
}

testFirebasePermissions();
