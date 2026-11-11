import { GeminiService } from '../services/gemini.service.js';
import { KnowledgeService } from '../services/knowledge.service.js';
import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

let inMemoryConversations = [
  {
    id: 'conv-demo-1',
    farmer_id: 'f1111111-1111-1111-1111-111111111111',
    title: 'Paddy Sucking Pest Management',
    language: 'en',
    created_at: new Date().toISOString(),
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Why are the bottom leaves of my rice crop turning yellow and dry?',
        created_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: 'Yellowing of bottom leaves in paddy during tillering typically points to Nitrogen deficiency or early Brown Planthopper (BPH) feeding marks near the water line. Inspect the base of tillers for tiny brown hopper nymphs. If hoppers are absent, apply 20 kg Urea per acre in drained standing water.',
        created_at: new Date(Date.now() - 3500000).toISOString()
      }
    ]
  }
];

export class ChatController {
  static async sendMessage(req, res, next) {
    try {
      const farmerId = req.user.id;
      const { message, conversationId, language, cropContext, soilContext } = req.body;

      if (!message || message.trim() === '') {
        return res.status(400).json({ success: false, message: 'Message is required' });
      }

      // Farmer context
      const farmerContext = {
        fullName: req.user.fullName,
        activeCrops: cropContext || 'Rice, Cotton, Chilli',
        soilType: soilContext || 'Black cotton soil',
        district: 'Guntur',
        state: 'Andhra Pradesh'
      };

      // Retrieve grounded knowledge docs
      const knowledgeDocs = await KnowledgeService.searchKnowledge({
        query: message,
        cropName: cropContext
      });

      // Gemini AI response
      const aiResponse = await GeminiService.getChatbotResponse(message, farmerContext, knowledgeDocs);

      let targetConvId = conversationId;
      if (!targetConvId) {
        targetConvId = `conv-${Date.now()}`;
        inMemoryConversations.unshift({
          id: targetConvId,
          farmer_id: farmerId,
          title: message.substring(0, 40) + '...',
          language: language || 'en',
          created_at: new Date().toISOString(),
          messages: []
        });
      }

      const conv = inMemoryConversations.find(c => c.id === targetConvId);
      if (conv) {
        conv.messages.push({
          id: `msg-${Date.now()}-u`,
          role: 'user',
          content: message,
          created_at: new Date().toISOString()
        });
        conv.messages.push({
          id: `msg-${Date.now()}-a`,
          role: 'assistant',
          content: aiResponse.answer,
          metadata: aiResponse,
          created_at: new Date().toISOString()
        });
      }

      res.status(200).json({
        success: true,
        data: {
          conversationId: targetConvId,
          response: aiResponse
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async getConversations(req, res, next) {
    try {
      const farmerId = req.user.id;
      const list = inMemoryConversations.filter(c => c.farmer_id === farmerId);
      res.status(200).json({ success: true, data: list });
    } catch (err) {
      next(err);
    }
  }

  static async getConversationById(req, res, next) {
    try {
      const { id } = req.params;
      const farmerId = req.user.id;
      const conv = inMemoryConversations.find(c => c.id === id && c.farmer_id === farmerId);
      if (!conv) {
        return res.status(404).json({ success: false, message: 'Conversation not found' });
      }
      res.status(200).json({ success: true, data: conv });
    } catch (err) {
      next(err);
    }
  }

  static async deleteConversation(req, res, next) {
    try {
      const { id } = req.params;
      const farmerId = req.user.id;
      inMemoryConversations = inMemoryConversations.filter(c => !(c.id === id && c.farmer_id === farmerId));
      res.status(200).json({ success: true, message: 'Conversation deleted' });
    } catch (err) {
      next(err);
    }
  }
}

