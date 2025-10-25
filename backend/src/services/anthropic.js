import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Generate NPC dialogue using Claude API
 * @param {Object} npc - NPC configuration
 * @param {Object} gameState - Current game state
 * @param {Array} conversationHistory - Previous messages
 * @param {string} playerMessage - Player's message
 * @returns {Promise<Object>} AI response with dialogue and effects
 */
export async function generateNPCResponse(npc, gameState, conversationHistory, playerMessage) {
  try {
    // Build context-aware prompt
    const systemPrompt = buildSystemPrompt(npc, gameState);
    const conversationContext = buildConversationContext(conversationHistory);

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 300,
      temperature: 0.8,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `${conversationContext}\n\nPlayer says: "${playerMessage}"\n\nRespond as ${npc.name}. Keep your response under 100 words. Stay in character.`
        }
      ]
    });

    const responseText = message.content[0].text;

    // Parse response for game effects
    const effects = analyzeResponseForEffects(responseText, npc, gameState);

    return {
      npcResponse: responseText,
      moodChange: effects.moodChange,
      suggestion: effects.suggestion,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating NPC response:', error);

    // Fallback to scripted response on error
    return {
      npcResponse: getFallbackResponse(npc, gameState),
      moodChange: 0,
      suggestion: null,
      error: true
    };
  }
}

/**
 * Build system prompt with NPC personality and game context
 */
function buildSystemPrompt(npc, gameState) {
  const { phase, oxygen, power, morale, day, recentEvents } = gameState;

  return `${npc.systemPrompt}

Current Mission Status:
- Phase: ${phase}
- Day: ${day || 1}
- Oxygen: ${oxygen || 100}%
- Power: ${power || 100}%
- Crew Morale: ${morale || 100}%
${recentEvents && recentEvents.length > 0 ? `- Recent Events: ${recentEvents.join(', ')}` : ''}

Your personality traits:
- Optimism: ${npc.traits.optimism * 100}%
- Risk Tolerance: ${npc.traits.risk_tolerance * 100}%
- Technical Expertise: ${npc.traits.technical * 100}%

Remember: You are ${npc.name}, ${npc.role}. Respond naturally and stay in character.`;
}

/**
 * Build conversation context from history
 */
function buildConversationContext(history) {
  if (!history || history.length === 0) {
    return 'This is the start of the conversation.';
  }

  const recentHistory = history.slice(-5); // Last 5 exchanges
  return 'Previous conversation:\n' + recentHistory.map(h =>
    `${h.speaker === 'player' ? 'Player' : h.npcName}: ${h.message}`
  ).join('\n');
}

/**
 * Analyze response for game effects
 */
function analyzeResponseForEffects(response, npc, gameState) {
  const effects = {
    moodChange: 0,
    suggestion: null
  };

  // Simple sentiment analysis based on keywords
  const positiveWords = ['great', 'excellent', 'good', 'perfect', 'yes', 'agree', 'smart'];
  const negativeWords = ['bad', 'worry', 'concern', 'danger', 'no', 'disagree', 'risky'];

  const lowerResponse = response.toLowerCase();
  const positiveCount = positiveWords.filter(w => lowerResponse.includes(w)).length;
  const negativeCount = negativeWords.filter(w => lowerResponse.includes(w)).length;

  // Mood change based on NPC optimism and response sentiment
  if (positiveCount > negativeCount) {
    effects.moodChange = Math.round(5 * npc.traits.optimism);
  } else if (negativeCount > positiveCount) {
    effects.moodChange = -Math.round(3 * (1 - npc.traits.optimism));
  }

  // Extract suggestions based on keywords
  if (lowerResponse.includes('habitat') || lowerResponse.includes('life support')) {
    effects.suggestion = { action: 'build_habitat', priority: 'high' };
  } else if (lowerResponse.includes('lab') || lowerResponse.includes('research')) {
    effects.suggestion = { action: 'build_lab', priority: 'medium' };
  } else if (lowerResponse.includes('power') || lowerResponse.includes('solar')) {
    effects.suggestion = { action: 'check_power', priority: 'high' };
  }

  return effects;
}

/**
 * Get fallback response when API fails
 */
function getFallbackResponse(npc, gameState) {
  const responses = {
    'commander-sarah': [
      "Let's stay focused on the mission. We need to prioritize our objectives.",
      "I trust your judgment. Make the call and let's move forward.",
      "We've trained for this. Stay calm and follow procedure."
    ],
    'engineer-mike': [
      "No worries, we can figure this out! Just need the right approach.",
      "Let me take a look at the systems. I'm sure it's fixable.",
      "Back at Spirit, we'd solve this with duct tape and coffee. We'll manage!"
    ],
    'scientist-lisa': [
      "Fascinating! The data here is incredible. Let me analyze this further.",
      "This reminds me of the exhibits at Exploration Place. Science in action!",
      "Every discovery brings us closer to understanding our new home."
    ],
    'pilot-ace': [
      "Trust me, I've flown through worse. This is nothing!",
      "Flying over Kansas wheat fields prepared me for anything. We got this!",
      "Just another day in the pilot's seat. Let's do this!"
    ],
    'medic-jamie': [
      "How are you feeling? It's important we all stay healthy and rested.",
      "Let's be careful here. Safety first, always.",
      "I'm concerned about the crew's well-being. We should take it slow."
    ]
  };

  const npcResponses = responses[npc.id] || ["I'm here to help with the mission."];
  return npcResponses[Math.floor(Math.random() * npcResponses.length)];
}
