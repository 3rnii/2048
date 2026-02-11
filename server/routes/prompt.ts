import { Router, Request, Response } from 'express';
import { promptModel } from '../service/openai.js';

const router = Router();

const BOARD_SHAPE = { rows: 4, cols: 4 };

const isBoardValues = (value: unknown): value is (number | null)[][] => {
  if (!Array.isArray(value) || value.length !== BOARD_SHAPE.rows) return false;
  return value.every(
    (row) => Array.isArray(row) && row.length === BOARD_SHAPE.cols && row.every((cell) => cell === null || typeof cell === 'number')
  );
}

export const sanitizeAndParseJson = (raw: string) => {
  const sanitized = raw
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
  return JSON.parse(sanitized);
}

export async function handlePostPrompt(req: Request, res: Response): Promise<void> {
  const { boardValues } = req.body as { boardValues?: unknown };

  if (!isBoardValues(boardValues)) {
    res.status(400).json({ error: 'Invalid request: body must contain boardValues as a 4x4 array of numbers or null' });
    return;
  }

  try {
    const response = await promptModel(boardValues);
    const parsed = sanitizeAndParseJson(response);
    res.status(200).json(parsed);
  } catch (err) {
    console.error('Error generating prompt response:', err);
    res.status(500).json({ error: 'Failed to generate prompt response' });
  }
}

router.post('/', handlePostPrompt);

export default router;
