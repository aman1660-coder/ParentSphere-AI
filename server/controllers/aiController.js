import AIChat from '../models/AIChat.js';

// @desc    Send message to AI assistant
// @route   POST /api/ai/chat
// @access  Private
export const sendChatMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    
    // Find or create chat history for user
    let chat = await AIChat.findOne({ userId: req.user._id });
    
    if (!chat) {
      chat = new AIChat({ userId: req.user._id, messages: [] });
    }

    // Add user message
    chat.messages.push({ role: 'user', content: message });

    // Dummy AI Response logic (Fallback when no OpenAI key)
    let aiResponse = "I'm the Parentsphere AI Assistant. ";
    
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('sleep')) {
      aiResponse += "For better child sleep, establish a consistent bedtime routine, avoid screens 1 hour before bed, and ensure the room is dark and quiet.";
    } else if (lowerMsg.includes('eat') || lowerMsg.includes('food')) {
      aiResponse += "Picky eating is common! Try offering a variety of colorful foods, involve them in cooking, and avoid pressuring them to clear their plate.";
    } else if (lowerMsg.includes('tantrum')) {
      aiResponse += "During a tantrum, stay calm, ensure they are safe, and validate their feelings once they cool down. Consistency is key.";
    } else {
      aiResponse += "That's a great question about parenting. As an AI, I suggest observing your child's cues and maintaining open communication. Let me know if you need specific advice on sleep, nutrition, or behavior!";
    }

    // If OPENAI_API_KEY is real, you would integrate `openai` package here
    // e.g. const response = await openai.createChatCompletion({...})

    chat.messages.push({ role: 'assistant', content: aiResponse });
    await chat.save();

    res.json({
      reply: aiResponse,
      history: chat.messages
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get chat history
// @route   GET /api/ai/history
// @access  Private
export const getChatHistory = async (req, res, next) => {
  try {
    const chat = await AIChat.findOne({ userId: req.user._id });
    res.json(chat ? chat.messages : []);
  } catch (error) {
    next(error);
  }
};
