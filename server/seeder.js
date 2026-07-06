import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Counsellor from './models/Counsellor.js';
import Book from './models/Book.js';
import Article from './models/Article.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Counsellor.deleteMany();
    await Book.deleteMany();
    await Article.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash('123456', salt);

    // Dummy Users
    const createdUsers = await User.insertMany([
      { name: 'Admin User', email: 'admin@parentsphere.com', password: hashPassword, role: 'admin' },
      { name: 'John Doe (Parent)', email: 'john@example.com', password: hashPassword, role: 'parent' }
    ]);

    // Dummy Counsellors
    await Counsellor.insertMany([
      {
        name: 'Dr. Sarah Jenkins',
        email: 'sarah@parentsphere.com',
        password: hashPassword,
        specialization: 'Child Psychology',
        experience: 12,
        qualification: 'PhD in Clinical Psychology',
        fee: 1500,
        description: 'Expert in child behavioral issues and cognitive development.',
        availability: [{ day: 'Monday', slots: ['10:00 AM', '02:00 PM'] }]
      },
      {
        name: 'Mr. David Smith',
        email: 'david@parentsphere.com',
        password: hashPassword,
        specialization: 'Adolescent Behaviour',
        experience: 8,
        qualification: 'MSc Counselling',
        fee: 1000,
        description: 'Specializes in teenage anxiety and academic stress.',
        availability: [{ day: 'Wednesday', slots: ['11:00 AM', '04:00 PM'] }]
      }
    ]);

    // Dummy Books
    await Book.insertMany([
      {
        title: 'The Whole-Brain Child',
        author: 'Daniel J. Siegel',
        category: 'Child Psychology',
        pdfLink: '#',
        coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop'
      },
      {
        title: 'How to Talk So Kids Will Listen',
        author: 'Adele Faber',
        category: 'Communication',
        pdfLink: '#',
        coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop'
      }
    ]);

    // Dummy Articles
    await Article.insertMany([
      {
        title: '5 Ways to Build Your Child\'s Emotional Intelligence',
        content: 'Emotional intelligence is key to your child\'s success. Start by validating their feelings...',
        category: 'Emotional Intelligence',
        image: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=600&auto=format&fit=crop'
      },
      {
        title: 'Nutrition Tips for Picky Eaters',
        content: 'Dealing with a picky eater can be stressful. Try presenting food in fun shapes...',
        category: 'Health',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop'
      }
    ]);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  // destroyData(); // Implementation omitted for brevity
} else {
  importData();
}
