import { z } from 'zod';

export const ChatMessageInputSchema = z.object({
  conversationId: z.string().uuid().optional(),
  message: z.string().trim().min(2, 'Message cannot be empty').max(2000),
  language: z.enum(['en', 'te', 'hi']).default('en'),
  cropContext: z.string().optional().default(''),
  soilContext: z.string().optional().default(''),
  growthStageContext: z.string().optional().default('')
});

export const ChatMessageOutputSchema = z.object({
  answer: z.string(),
  language: z.string(),
  category: z.string(),
  summary: z.string(),
  recommended_actions: z.array(z.string()),
  follow_up_questions: z.array(z.string()),
  warnings: z.array(z.string()),
  source_references: z.array(
    z.object({
      title: z.string(),
      organization: z.string(),
      url: z.string().nullable().optional()
    })
  ),
  confidence: z.enum(['high', 'medium', 'low']),
  requires_expert_review: z.boolean()
});

