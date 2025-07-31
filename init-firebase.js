const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, deleteDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDCHHh4bA0Vu6EzRNHQYnrArZNsuPfa8F4",
  authDomain: "karoline-portifolio.firebaseapp.com",
  projectId: "karoline-portifolio",
  storageBucket: "karoline-portifolio.firebasestorage.app",
  messagingSenderId: "6738401934",
  appId: "1:6738401934:web:5c5448d710cca1f90607df",
  measurementId: "G-CCEDGQ16LQ"
};

const COLLECTIONS = {
  PROJECTS: 'projects'
};

const defaultProjects = [
  {
    name: 'CESAE Book Space',
    description: 'Educational platform for CESAE students and teachers',
    technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
    imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    demoUrl: '',
    projectUrl: 'https://github.com/KarolineRRocha/CESAE_Book_Space',
    category: 'completed',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    featured: true,
    order: 1
  },
  {
    name: 'FreePlayFinder',
    description: 'A gaming discovery platform that helps users find free-to-play games across multiple platforms. Features advanced filtering, user reviews, and personalized recommendations.',
    technologies: ['Angular', 'TypeScript', 'Node.js'],
    imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
    demoUrl: 'https://karolinerrocha.github.io/FreePlayFinder/',
    projectUrl: 'https://github.com/KarolineRRocha/FreePlayFinder',
    category: 'completed',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    featured: true,
    order: 2
  },
  {
    name: 'Ecofab',
    description: 'Sustainable manufacturing platform',
    technologies: ['Angular', 'TypeScript', 'SCSS', 'Firebase'],
    imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
    demoUrl: 'https://karolinerrocha.github.io/Ecofab/',
    projectUrl: 'https://github.com/KarolineRRocha/Ecofab',
    category: 'completed',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
    featured: true,
    order: 3
  },
  {
    name: 'Upload',
    description: 'Video sharing platform built with Angular and TypeScript',
    technologies: ['Angular', 'TypeScript', 'SCSS'],
    imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
    demoUrl: 'https://karolinerrocha.github.io/Upload/',
    projectUrl: 'https://github.com/KarolineRRocha/Upload',
    category: 'completed',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
    featured: true,
    order: 4
  },
  {
    name: 'Jogo Quatro em Linha',
    description: 'Classic Connect Four game implementation',
    technologies: ['JavaScript', 'HTML', 'CSS'],
    imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    demoUrl: 'https://karolinerrocha.github.io/jogo-quatro-em-linha/',
    projectUrl: 'https://github.com/KarolineRRocha/jogo-quatro-em-linha',
    category: 'completed',
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-04-05'),
    featured: true,
    order: 5
  },
  {
    name: 'They Develop and Cook',
    description: 'Recipe sharing platform for developers who love cooking',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
    demoUrl: 'https://karolinerrocha.github.io/They_develop_and_cook/',
    projectUrl: 'https://github.com/KarolineRRocha/They_develop_and_cook',
    category: 'completed',
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-05-01'),
    featured: true,
    order: 6
  }
];

async function initializeFirebase() {
  try {
    console.log('🚀 Initializing Firebase...');

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('📊 Clearing existing projects...');
    const projectsRef = collection(db, COLLECTIONS.PROJECTS);
    const snapshot = await getDocs(projectsRef);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    console.log('➕ Adding default projects...');
    const addPromises = defaultProjects.map(project => addDoc(projectsRef, project));
    await Promise.all(addPromises);

    console.log('✅ Firebase initialized successfully with', defaultProjects.length, 'projects!');
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error);
  }
}

initializeFirebase();
