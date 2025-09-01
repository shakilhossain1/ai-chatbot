import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import z from 'zod';
import { chatService } from './services/chat.service';

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/api/hello', (req: Request, res: Response) => {
  res.send({ message: 'Hello from API!' });
});

// const conversations = new Map<string, string>();

const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt is required')
    .max(1000, 'Prompt is too long (max 1000 characters)'),
  conversationId: z.uuid(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
  const parseResult = chatSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json(parseResult.error.format());
    return;
  }

  try {
    const { prompt, conversationId } = req.body;

    const response = await chatService.sendMessage(prompt, conversationId);

    res.json({ message: response.message });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get response from OpenAI' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
