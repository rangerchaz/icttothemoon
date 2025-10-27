"use client";

import { useState, useEffect, useRef } from 'react';
import { gameStore } from '../game/GameStore';
import { NPC, DialogueResponse, ConversationMessage } from '../game/types';

// Use environment variable or default to empty string for relative URLs
// In production, API is served from same domain at /api
// In development with NEXT_PUBLIC_API_URL set, it will use that
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function DialogueBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load NPCs on mount
  useEffect(() => {
    fetch(`${API_URL}/api/npc`)
      .then(res => res.json())
      .then(data => setNpcs(data))
      .catch(err => console.error('Failed to load NPCs:', err));

    // Listen for dialogue open events
    const handleOpenDialogue = () => {
      setIsOpen(true);
    };

    window.addEventListener('openDialogue' as any, handleOpenDialogue);

    return () => {
      window.removeEventListener('openDialogue' as any, handleOpenDialogue);
    };
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectNPC = (npc: NPC) => {
    setSelectedNPC(npc);
    const history = gameStore.getConversationHistory(npc.id);
    setMessages(history);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedNPC || isLoading) return;

    const playerMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add player message to display
    const newPlayerMsg: ConversationMessage = {
      speaker: 'player',
      message: playerMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newPlayerMsg]);
    gameStore.addConversation(newPlayerMsg);

    try {
      // Call API
      const response = await fetch(`${API_URL}/api/npc/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          npcId: selectedNPC.id,
          playerMessage,
          gameState: gameStore.getState(),
          conversationHistory: messages.slice(-10) // Last 10 messages
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data: DialogueResponse = await response.json();

      // Add NPC response
      const npcMsg: ConversationMessage = {
        speaker: 'npc',
        npcName: selectedNPC.id,
        message: data.npcResponse,
        timestamp: data.timestamp
      };

      setMessages(prev => [...prev, npcMsg]);
      gameStore.addConversation(npcMsg);

      // Apply mood change
      if (data.moodChange) {
        gameStore.updateResource('morale', data.moodChange);
      }

      // Handle suggestions
      if (data.suggestion) {
        gameStore.addEvent(`${selectedNPC.name} suggests: ${data.suggestion.action}`);
      }

    } catch (error) {
      console.error('Error sending message:', error);

      // Fallback response
      const fallbackMsg: ConversationMessage = {
        speaker: 'npc',
        npcName: selectedNPC.id,
        message: "I'm having trouble communicating right now. Let me get back to you.",
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 pointer-events-auto">
      <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-4xl h-[600px] flex flex-col border border-gray-700">
        {/* Header */}
        <div className="bg-gray-800 px-6 py-4 rounded-t-lg border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">AI CREW COMMUNICATIONS</h2>
          <button
            onClick={() => {
              setIsOpen(false);
              setSelectedNPC(null);
              setMessages([]);
            }}
            className="text-red-400 hover:text-red-300 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* NPC List */}
          <div className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">CREW MEMBERS</h3>
              {npcs.map(npc => (
                <button
                  key={npc.id}
                  onClick={() => handleSelectNPC(npc)}
                  className={`w-full text-left p-3 rounded mb-2 transition-colors ${
                    selectedNPC?.id === npc.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{npc.avatar}</span>
                    <div>
                      <div className="font-semibold text-sm">{npc.name}</div>
                      <div className="text-xs opacity-75">{npc.role}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Area */}
          <div className="flex-1 flex flex-col">
            {selectedNPC ? (
              <>
                {/* NPC Info */}
                <div className="bg-gray-800 px-6 py-3 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedNPC.avatar}</span>
                    <div>
                      <div className="font-bold text-white">{selectedNPC.name}</div>
                      <div className="text-sm text-gray-400">{selectedNPC.role}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">{selectedNPC.personality}</div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">
                      Start a conversation with {selectedNPC.name}
                    </div>
                  )}

                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.speaker === 'player' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-4 ${
                          msg.speaker === 'player'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-100'
                        }`}
                      >
                        <div className="text-sm">{msg.message}</div>
                        <div className="text-xs opacity-50 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-700 rounded-lg p-4">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={`Message ${selectedNPC.name}...`}
                      className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isLoading}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Send
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Press Enter to send • Advice from {selectedNPC.name} may affect mission outcomes
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a crew member to start talking
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
