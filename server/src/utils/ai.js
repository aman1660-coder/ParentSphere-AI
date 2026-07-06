import { env } from '../config/env.js';

const localGuidance = ({ message = '', child = {}, history = [] }) => {
  const text = message.toLowerCase();
  const age = child.age ? `${child.age}-year-old` : 'child';
  const focus = text.includes('sleep')
    ? 'sleep rhythm and calming bedtime routines'
    : text.includes('anger') || text.includes('tantrum')
      ? 'emotion naming, co-regulation, and predictable boundaries'
      : text.includes('study') || text.includes('school')
        ? 'study structure, attention breaks, and confidence building'
        : text.includes('food') || text.includes('nutrition')
          ? 'balanced nutrition, hydration, and mealtime consistency'
          : 'connection, observation, and age-appropriate routines';

  const continuity = history.length
    ? 'I also considered your previous chat context so the guidance stays consistent.'
    : 'This is a fresh recommendation based on your current question.';

  return [
    `For a ${age}, focus on ${focus}.`,
    continuity,
    'Try one small change for 5-7 days, track the child response, and avoid changing many routines at once.',
    'A practical plan: validate the feeling, describe the expected behavior, offer two acceptable choices, and praise effort immediately when you see progress.',
    'If the concern includes self-harm, persistent aggression, severe anxiety, sudden regression, or major appetite/sleep disruption, book a counsellor session or consult a pediatric professional.'
  ].join(' ');
};

export const askParentingAssistant = async ({ message, child, history }) => {
  if (!env.openaiKey) {
    return localGuidance({ message, child, history });
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.openaiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: env.openaiModel,
      messages: [
        {
          role: 'system',
          content:
            'You are Parentsphere AI, a cautious parenting assistant. Give practical, age-aware guidance. Encourage professional support for urgent medical, mental health, or safety concerns.'
        },
        ...(history || []).slice(-8).map((item) => ({
          role: item.role === 'assistant' ? 'assistant' : 'user',
          content: item.content
        })),
        {
          role: 'user',
          content: `Child profile: ${JSON.stringify(child || {})}\nParent question: ${message}`
        }
      ],
      temperature: 0.55
    })
  });

  if (!response.ok) {
    return localGuidance({ message, child, history });
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || localGuidance({ message, child, history });
};

export const buildRecommendations = ({ child = {}, books = [], counsellors = [], videos = [] }) => {
  const age = Number(child.age || 0);
  const stage =
    age <= 5 ? 'early childhood' : age <= 12 ? 'middle childhood' : 'adolescent development';

  return {
    stage,
    activities: [
      age <= 5 ? 'Storytelling with emotion cards' : 'Weekly goal-setting journal',
      'Outdoor movement for at least 30 minutes',
      'One parent-child check-in without screens',
      'Skill-building hobby session twice a week'
    ],
    books: books.slice(0, 4).map((book) => ({
      id: book._id,
      title: book.title,
      reason: `Useful for ${book.category.toLowerCase()} during ${stage}.`
    })),
    counsellors: counsellors.slice(0, 3).map((counsellor) => ({
      id: counsellor._id,
      name: counsellor.name,
      specialization: counsellor.specialization,
      reason: `Matches guidance needs around ${counsellor.specialization.toLowerCase()}.`
    })),
    courses: videos.slice(0, 3).map((video) => ({
      id: video._id,
      title: video.title,
      reason: `A structured resource for ${stage}.`
    }))
  };
};
