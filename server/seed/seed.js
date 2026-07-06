import '../src/config/env.js';
import { connectDB } from '../src/config/db.js';
import AIChat from '../src/models/AIChat.js';
import Appointment from '../src/models/Appointment.js';
import Article from '../src/models/Article.js';
import Book from '../src/models/Book.js';
import Child from '../src/models/Child.js';
import ContactMessage from '../src/models/ContactMessage.js';
import Counsellor from '../src/models/Counsellor.js';
import ForumPost from '../src/models/ForumPost.js';
import Newsletter from '../src/models/Newsletter.js';
import Payment from '../src/models/Payment.js';
import Testimonial from '../src/models/Testimonial.js';
import User from '../src/models/User.js';
import Video from '../src/models/Video.js';

const reset = async () => {
  await Promise.all([
    User.deleteMany({}),
    Counsellor.deleteMany({}),
    Appointment.deleteMany({}),
    Payment.deleteMany({}),
    Book.deleteMany({}),
    Article.deleteMany({}),
    AIChat.deleteMany({}),
    Testimonial.deleteMany({}),
    ContactMessage.deleteMany({}),
    Child.deleteMany({}),
    ForumPost.deleteMany({}),
    Video.deleteMany({}),
    Newsletter.deleteMany({})
  ]);
};

const availability = [
  { day: 'Monday', slots: ['10:00 AM', '12:00 PM', '04:00 PM'] },
  { day: 'Wednesday', slots: ['11:00 AM', '02:00 PM', '06:00 PM'] },
  { day: 'Saturday', slots: ['09:00 AM', '01:00 PM'] }
];

const run = async () => {
  await connectDB();
  await reset();

  const [admin, parent, counsellorUser] = await User.create([
    {
      name: 'Aarav Admin',
      email: 'admin@parentsphere.com',
      phone: '9000000001',
      password: 'Admin@12345',
      role: 'admin',
      isEmailVerified: true
    },
    {
      name: 'Priya Sharma',
      email: 'parent@parentsphere.com',
      phone: '9000000002',
      password: 'Parent@12345',
      role: 'parent',
      isEmailVerified: true,
      preferences: {
        childAgeRange: '6-12',
        interests: ['reading', 'science', 'mindfulness'],
        concerns: ['screen time', 'focus']
      }
    },
    {
      name: 'Dr. Meera Iyer',
      email: 'counsellor@parentsphere.com',
      phone: '9000000003',
      password: 'Counsellor@12345',
      role: 'counsellor',
      isEmailVerified: true
    }
  ]);

  const counsellors = await Counsellor.create([
    {
      userId: counsellorUser._id,
      name: 'Dr. Meera Iyer',
      specialization: 'Child Psychology',
      experience: 12,
      qualification: 'PhD Child Psychology, NIMHANS',
      fee: 1200,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80',
      availability,
      rating: 4.9,
      reviewsCount: 236,
      description:
        'Works with children and parents on anxiety, tantrums, school adjustment, and positive discipline routines.',
      languages: ['English', 'Hindi', 'Tamil'],
      mode: 'Online'
    },
    {
      name: 'Rohan Kapoor',
      specialization: 'Academic Counselling',
      experience: 9,
      qualification: 'M.Ed, Learning Strategy Coach',
      fee: 900,
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
      availability,
      rating: 4.7,
      reviewsCount: 184,
      description:
        'Helps students build study systems, exam confidence, attention routines, and healthy academic motivation.',
      languages: ['English', 'Hindi'],
      mode: 'Hybrid'
    },
    {
      name: 'Ananya Rao',
      specialization: 'Parenting Guidance',
      experience: 10,
      qualification: 'Certified Positive Parenting Educator',
      fee: 1000,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      availability,
      rating: 4.8,
      reviewsCount: 201,
      description:
        'Guides parents through routines, respectful boundaries, sibling conflict, emotional coaching, and home systems.',
      languages: ['English', 'Kannada'],
      mode: 'Online'
    },
    {
      name: 'Dr. Kabir Sethi',
      specialization: 'Adolescent Behaviour',
      experience: 15,
      qualification: 'MD Psychiatry, Adolescent Mental Health Fellow',
      fee: 1600,
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80',
      availability,
      rating: 4.9,
      reviewsCount: 312,
      description:
        'Supports teens and families with mood concerns, peer pressure, identity, motivation, and safe communication.',
      languages: ['English', 'Hindi', 'Punjabi'],
      mode: 'Online'
    },
    {
      name: 'Nisha Menon',
      specialization: 'Special Needs Counselling',
      experience: 11,
      qualification: 'MSc Clinical Psychology, Special Education Diploma',
      fee: 1400,
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80',
      availability,
      rating: 4.8,
      reviewsCount: 175,
      description:
        'Creates parent-friendly support plans for neurodiversity, sensory needs, school collaboration, and daily skills.',
      languages: ['English', 'Malayalam'],
      mode: 'Hybrid'
    }
  ]);

  const books = await Book.create([
    {
      title: 'Calm Homes, Confident Children',
      author: 'Parentsphere Research Team',
      category: 'Parenting',
      pdfLink: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=700&q=80',
      summary: 'A practical guide to building peaceful routines, warm boundaries, and resilient family habits.',
      tags: ['routines', 'discipline', 'confidence'],
      readingTime: '55 min',
      isFeatured: true
    },
    {
      title: 'The Emotion Coach Parent',
      author: 'Leena Mathew',
      category: 'Emotional Intelligence',
      pdfLink: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      coverImage: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=700&q=80',
      summary: 'Tools for helping children name feelings, regulate stress, and repair conflict after big emotions.',
      tags: ['emotions', 'tantrums', 'connection'],
      readingTime: '40 min',
      isFeatured: true
    },
    {
      title: 'Food, Focus and Growing Bodies',
      author: 'Dr. Kavya Sen',
      category: 'Child Nutrition',
      pdfLink: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      coverImage: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=700&q=80',
      summary: 'Nutrition basics, school-lunch planning, hydration, and healthy conversations about food.',
      tags: ['nutrition', 'health', 'school'],
      readingTime: '35 min'
    },
    {
      title: 'Learning Without Pressure',
      author: 'Rohan Kapoor',
      category: 'Education',
      pdfLink: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=700&q=80',
      summary: 'A parent guide for homework rhythms, study independence, exam confidence, and motivation.',
      tags: ['learning', 'study', 'motivation'],
      readingTime: '50 min'
    },
    {
      title: 'Talk So Kids Can Open Up',
      author: 'Asha Verma',
      category: 'Communication Skills',
      pdfLink: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=700&q=80',
      summary: 'Conversation scripts for trust, boundaries, mistakes, school stress, and difficult family moments.',
      tags: ['communication', 'trust', 'listening'],
      readingTime: '45 min'
    }
  ]);

  parent.savedBooks = [books[0]._id, books[1]._id];
  await parent.save({ validateBeforeSave: false });

  const child = await Child.create({
    parent: parent._id,
    name: 'Ishaan',
    age: 9,
    height: 132,
    weight: 29,
    schoolGrade: 'Grade 4',
    interests: ['space', 'football', 'drawing'],
    behaviorNotes: 'Gets frustrated during long homework sessions and responds well to visual schedules.',
    growthRecords: [
      { height: 128, weight: 27, date: new Date('2025-10-01') },
      { height: 130, weight: 28, date: new Date('2026-01-15') },
      { height: 132, weight: 29, date: new Date('2026-06-01') }
    ]
  });

  await Article.create([
    {
      title: 'How to Reduce Screen-Time Battles Without Daily Arguments',
      excerpt: 'A calm framework for limits, transitions, replacement activities, and family media agreements.',
      content:
        'Screen-time conflict usually grows when rules are unclear or transitions feel sudden. Start with a family media agreement that names when screens are allowed, where devices sleep, and what happens before entertainment time. Give a five-minute transition warning, offer a replacement activity, and keep the tone steady. The goal is not perfect compliance on day one; it is predictable practice that children can trust.',
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1000&q=80',
      author: admin._id
    },
    {
      title: 'The Homework Routine That Protects Confidence',
      excerpt: 'Use predictable steps, short focus blocks, and parent praise that rewards strategy instead of marks.',
      content:
        'A healthy homework rhythm starts before the first worksheet. Keep supplies ready, choose a visible timer, and split work into short blocks. Ask the child to pick the first task from two options. Praise effort, planning, checking, and asking for help. When mistakes happen, use them as information rather than proof of ability. This helps children connect learning with agency.',
      category: 'Education',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
      author: admin._id
    },
    {
      title: 'Recognising Growth Spurts and Appetite Changes',
      excerpt: 'What parents can track at home and when changes should be discussed with a professional.',
      content:
        'Children often eat, sleep, and move differently during growth periods. Track height, weight, appetite, sleep, energy, and mood together instead of reacting to one number. Offer balanced meals and snacks, keep hydration visible, and avoid shame-based conversations. Consult a pediatrician if weight changes are sudden, appetite changes persist, or energy drops sharply.',
      category: 'Health',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1000&q=80',
      author: admin._id
    }
  ]);

  await Video.create([
    {
      title: 'Positive Discipline Masterclass',
      description: 'A structured parenting course on warmth, boundaries, repair, and consistent routines.',
      category: 'Parenting Courses',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80',
      duration: '42 min',
      level: 'Beginner',
      uploadedBy: admin._id
    },
    {
      title: 'Child Development Milestones: Ages 6-12',
      description: 'Understand physical, emotional, social, and learning milestones for middle childhood.',
      category: 'Child Development Videos',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=80',
      duration: '28 min',
      level: 'Intermediate',
      uploadedBy: admin._id
    },
    {
      title: 'Webinar: Raising Emotionally Resilient Teens',
      description: 'Counsellor-led session about trust, teen autonomy, boundaries, and mental health awareness.',
      category: 'Webinars',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80',
      duration: '55 min',
      level: 'Advanced',
      uploadedBy: admin._id
    }
  ]);

  await Testimonial.create([
    {
      parentName: 'Neha Gupta',
      review:
        'Parentsphere helped us replace power struggles with routines that actually fit our home. The AI assistant and counsellor session worked beautifully together.',
      rating: 5
    },
    {
      parentName: 'Arjun Nair',
      review:
        'The growth tracker gave us a simple way to discuss nutrition and school stress with our pediatrician and counsellor.',
      rating: 5
    },
    {
      parentName: 'Fatima Khan',
      review:
        'The article library and forum made me feel less alone. The advice is practical, respectful, and easy to try.',
      rating: 4
    }
  ]);

  const appointment = await Appointment.create({
    userId: parent._id,
    counsellorId: counsellors[0]._id,
    date: new Date('2026-07-18T10:00:00.000Z'),
    time: '04:00 PM',
    paymentStatus: 'paid',
    bookingStatus: 'confirmed',
    notes: 'Need help with homework frustration and sleep routine.',
    meetingLink: 'https://meet.jit.si/parentsphere-demo-session'
  });

  await Payment.create({
    paymentId: 'demo_payment_seed',
    orderId: 'demo_order_seed',
    amount: counsellors[0].fee,
    currency: 'INR',
    userId: parent._id,
    appointmentId: appointment._id,
    status: 'paid',
    provider: 'demo'
  });

  await AIChat.create({
    userId: parent._id,
    childId: child._id,
    title: 'Homework frustration',
    messages: [
      { role: 'user', content: 'My child gets upset during homework. What should I do?' },
      {
        role: 'assistant',
        content:
          'Use short focus blocks, preview the task, give two choices, and praise strategy. If frustration rises, pause for a regulation break before returning.'
      }
    ]
  });

  await ForumPost.create([
    {
      author: parent._id,
      title: 'How do you handle bedtime resistance after holidays?',
      category: 'Behaviour',
      content:
        'Our routine shifted during holidays and bedtime is taking too long again. What has helped your family reset gently?',
      likes: [admin._id],
      comments: [{ user: admin._id, text: 'Try moving bedtime earlier by 15 minutes every two nights and keep wake-up time steady.' }]
    },
    {
      author: admin._id,
      title: 'Weekly prompt: one screen-free activity that worked',
      category: 'Parent Stories',
      content:
        'Share one activity that kept your child engaged without screens this week. Include age and setup time so others can try it.',
      likes: [parent._id]
    }
  ]);

  await Newsletter.create({ email: 'subscriber@parentsphere.com', source: 'seed' });
  await ContactMessage.create({
    name: 'School Partnership Lead',
    email: 'partner@example.com',
    subject: 'Workshop partnership',
    message: 'We would like to discuss a positive parenting workshop for parents at our school.'
  });

  console.log('Parentsphere seed data created successfully');
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
