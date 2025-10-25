import express from 'express';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { generateNPCResponse } from '../services/anthropic.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Load NPC configurations
let npcData;
async function loadNPCs() {
  const npcPath = join(__dirname, '../data/npcs.json');
  const data = await readFile(npcPath, 'utf-8');
  npcData = JSON.parse(data);
}
loadNPCs();

/**
 * GET /api/npc - Get all NPCs
 */
router.get('/', (req, res) => {
  res.json(npcData.npcs);
});

/**
 * GET /api/npc/:id - Get specific NPC
 */
router.get('/:id', (req, res) => {
  const npc = npcData.npcs.find(n => n.id === req.params.id);
  if (!npc) {
    return res.status(404).json({ error: 'NPC not found' });
  }
  res.json(npc);
});

/**
 * POST /api/npc/chat - Generate AI response from NPC
 * Body: {
 *   npcId: string,
 *   playerMessage: string,
 *   gameState: object,
 *   conversationHistory: array
 * }
 */
router.post('/chat', async (req, res) => {
  try {
    const { npcId, playerMessage, gameState, conversationHistory } = req.body;

    // Validate request
    if (!npcId || !playerMessage) {
      return res.status(400).json({
        error: 'Missing required fields: npcId and playerMessage'
      });
    }

    // Find NPC
    const npc = npcData.npcs.find(n => n.id === npcId);
    if (!npc) {
      return res.status(404).json({ error: 'NPC not found' });
    }

    // Generate AI response
    const response = await generateNPCResponse(
      npc,
      gameState || {},
      conversationHistory || [],
      playerMessage
    );

    res.json({
      npcId: npc.id,
      npcName: npc.name,
      ...response
    });
  } catch (error) {
    console.error('Error in /chat endpoint:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      message: error.message
    });
  }
});

export default router;
