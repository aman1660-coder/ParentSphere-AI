import mongoose from 'mongoose';
import dotenv from 'dotenv';

import Counsellor from '../src/models/Counsellor.js';
import Book from '../src/models/Book.js';
import Article from '../src/models/Article.js';
import Video from '../src/models/Video.js';

dotenv.config({ path: './.env' });

const counsellors = [
  {
    name: 'Dr. Ananya Sharma',
    specialization: 'Child Psychology',
    experience: 12,
    qualification: 'PhD in Child Psychology',
    fee: 1200,
    image:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    availability: [
      {
        day: 'Monday',
        slots: ['10:00 AM', '11:00 AM', '2:00 PM']
      },
      {
        day: 'Wednesday',
        slots: ['10:00 AM', '3:00 PM', '5:00 PM']
      },
      {
        day: 'Saturday',
        slots: ['9:00 AM', '11:00 AM']
      }
    ],
    rating: 4.9,
    reviewsCount: 125,
    description:
      'Experienced child psychologist helping children overcome emotional, behavioral, and developmental challenges.',
    languages: ['English', 'Hindi'],
    mode: 'Online',
    isActive: true
  },
  {
    name: 'Dr. Rahul Mehta',
    specialization: 'Academic Counselling',
    experience: 10,
    qualification: 'MSc Psychology, Certified Academic Counsellor',
    fee: 900,
    image:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
    availability: [
      {
        day: 'Tuesday',
        slots: ['9:00 AM', '12:00 PM', '4:00 PM']
      },
      {
        day: 'Thursday',
        slots: ['10:00 AM', '1:00 PM']
      }
    ],
    rating: 4.7,
    reviewsCount: 98,
    description:
      'Academic counsellor specializing in study habits, examination stress, motivation, and educational planning.',
    languages: ['English', 'Hindi'],
    mode: 'Hybrid',
    isActive: true
  },
  {
    name: 'Dr. Priya Kapoor',
    specialization: 'Parenting Guidance',
    experience: 15,
    qualification: 'PhD Psychology, Certified Parenting Coach',
    fee: 1500,
    image:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80',
    availability: [
      {
        day: 'Monday',
        slots: ['11:00 AM', '2:00 PM']
      },
      {
        day: 'Friday',
        slots: ['10:00 AM', '12:00 PM', '4:00 PM']
      }
    ],
    rating: 4.9,
    reviewsCount: 180,
    description:
      'Parenting expert providing practical guidance for positive parenting, discipline, and family communication.',
    languages: ['English', 'Hindi'],
    mode: 'Online',
    isActive: true
  },
  {
    name: 'Dr. Vikram Singh',
    specialization: 'Adolescent Behaviour',
    experience: 9,
    qualification: 'MPhil Clinical Psychology',
    fee: 1100,
    image:
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80',
    availability: [
      {
        day: 'Wednesday',
        slots: ['9:00 AM', '1:00 PM', '5:00 PM']
      },
      {
        day: 'Saturday',
        slots: ['10:00 AM', '12:00 PM']
      }
    ],
    rating: 4.8,
    reviewsCount: 76,
    description:
      'Specialist in adolescent behavior, teenage anxiety, peer pressure, confidence, and parent-child relationships.',
    languages: ['English', 'Hindi'],
    mode: 'Hybrid',
    isActive: true
  },
  {
    name: 'Dr. Neha Verma',
    specialization: 'Family Counselling',
    experience: 13,
    qualification: 'MA Psychology, Certified Family Therapist',
    fee: 1300,
    image:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    availability: [
      {
        day: 'Tuesday',
        slots: ['10:00 AM', '2:00 PM']
      },
      {
        day: 'Sunday',
        slots: ['11:00 AM', '3:00 PM']
      }
    ],
    rating: 4.8,
    reviewsCount: 112,
    description:
      'Family counsellor helping parents and children improve communication and build healthier relationships.',
    languages: ['English', 'Hindi'],
    mode: 'Online',
    isActive: true
  },
  {
    name: 'Dr. Arjun Rao',
    specialization: 'Career Guidance',
    experience: 11,
    qualification: 'MSc Psychology, Certified Career Counsellor',
    fee: 1000,
    image:
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
    availability: [
      {
        day: 'Thursday',
        slots: ['9:00 AM', '12:00 PM', '4:00 PM']
      },
      {
        day: 'Saturday',
        slots: ['11:00 AM', '2:00 PM']
      }
    ],
    rating: 4.6,
    reviewsCount: 89,
    description:
      'Career counsellor helping students understand their strengths, interests, and suitable education paths.',
    languages: ['English', 'Hindi', 'Kannada'],
    mode: 'Hybrid',
    isActive: true
  }
];

const books = [
  {
    title: 'Positive Parenting Guide',
    author: 'Parentsphere Learning Team',
    category: 'Parenting',
    pdfLink: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    coverImage:
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
    summary:
      'A practical introduction to positive parenting techniques for developing healthy relationships with children.',
    tags: ['Parenting', 'Family', 'Children'],
    readingTime: '45 min',
    isFeatured: true
  },
  {
    title: 'Understanding Your Child',
    author: 'Parentsphere Psychology Team',
    category: 'Child Psychology',
    pdfLink: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    coverImage:
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80',
    summary:
      'Learn the fundamentals of child psychology, emotional needs, behavior, and developmental changes.',
    tags: ['Psychology', 'Child Development'],
    readingTime: '60 min',
    isFeatured: true
  },
  {
    title: 'Raising Emotionally Intelligent Children',
    author: 'Parentsphere Learning Team',
    category: 'Emotional Intelligence',
    pdfLink: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    coverImage:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    summary:
      'Strategies for helping children understand emotions, develop empathy, and improve social skills.',
    tags: ['Emotions', 'Intelligence', 'Development'],
    readingTime: '50 min',
    isFeatured: false
  },
  {
    title: 'Healthy Nutrition for Growing Children',
    author: 'Parentsphere Health Team',
    category: 'Child Nutrition',
    pdfLink: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    coverImage:
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80',
    summary:
      'An introductory guide to healthy nutrition, eating habits, and balanced diets for growing children.',
    tags: ['Nutrition', 'Health', 'Children'],
    readingTime: '40 min',
    isFeatured: false
  }
];

const articles = [
  {
    title: 'Understanding Important Stages of Child Development',
    content:
      'Child development involves physical, emotional, cognitive, and social changes. Parents can support development by providing a safe environment, encouraging curiosity, communicating openly, and observing developmental milestones.',
    excerpt:
      'Understand important child development stages and learn how parents can support healthy growth.',
    category: 'Child Growth',
    image:
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80',
    readTime: '5 min read',
    isPublished: true
  },
  {
    title: 'Five Positive Parenting Techniques for Everyday Life',
    content:
      'Positive parenting focuses on communication, encouragement, consistency, empathy, and appropriate boundaries. Small improvements in daily communication can strengthen relationships between parents and children.',
    excerpt:
      'Discover practical positive parenting strategies that can strengthen your relationship with your child.',
    category: 'Parenting Tips',
    image:
      'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=900&q=80',
    readTime: '6 min read',
    isPublished: true
  },
  {
    title: 'Helping Children Develop Better Study Habits',
    content:
      'Parents can encourage effective study habits by creating consistent routines, providing an appropriate learning environment, encouraging regular breaks, and focusing on progress instead of only examination scores.',
    excerpt:
      'Simple strategies parents can use to help children become more confident and independent learners.',
    category: 'Education',
    image:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80',
    readTime: '4 min read',
    isPublished: true
  },
  {
    title: 'Creating Healthy Technology Habits at Home',
    content:
      'Technology can support education and communication when used responsibly. Families should create clear screen-time rules, encourage offline activities, discuss online safety, and model healthy technology habits.',
    excerpt:
      'Learn how families can create balanced and responsible technology habits for children.',
    category: 'Technology',
    image:
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80',
    readTime: '5 min read',
    isPublished: true
  }
];

const videos = [
  {
    title: 'Introduction to Positive Parenting',
    description:
      'Learn the basic principles of positive parenting and healthy parent-child communication.',
    category: 'Parenting Courses',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail:
      'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?auto=format&fit=crop&w=900&q=80',
    duration: '12:30',
    level: 'Beginner'
  },
  {
    title: 'Understanding Child Development',
    description:
      'An introduction to physical, emotional, cognitive, and social development in children.',
    category: 'Child Development Videos',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail:
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80',
    duration: '18:45',
    level: 'Beginner'
  },
  {
    title: 'Managing Parenting Stress',
    description:
      'A practical webinar discussing parenting stress, emotional well-being, and healthy family routines.',
    category: 'Webinars',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
    duration: '35:20',
    level: 'Intermediate'
  }
];

const seedDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing from server/.env');
    }

    console.log('Connecting to MongoDB...');

    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB connected successfully.');

    console.log('Deleting existing counsellors, books, articles and videos...');

    await Promise.all([
      Counsellor.deleteMany({}),
      Book.deleteMany({}),
      Article.deleteMany({}),
      Video.deleteMany({})
    ]);

    console.log('Adding new data...');

    const createdCounsellors = await Counsellor.insertMany(counsellors);
    const createdBooks = await Book.insertMany(books);

    // create() is used here so Article pre-validation slug middleware runs.
    const createdArticles = [];
    for (const article of articles) {
      const createdArticle = await Article.create(article);
      createdArticles.push(createdArticle);
    }

    const createdVideos = await Video.insertMany(videos);

    console.log('');
    console.log('========================================');
    console.log('DATABASE SEEDED SUCCESSFULLY');
    console.log('========================================');
    console.log(`Counsellors: ${createdCounsellors.length}`);
    console.log(`Books: ${createdBooks.length}`);
    console.log(`Articles: ${createdArticles.length}`);
    console.log(`Videos: ${createdVideos.length}`);
    console.log('========================================');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('DATABASE SEEDING FAILED');
    console.error(error);

    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
};

seedDatabase();