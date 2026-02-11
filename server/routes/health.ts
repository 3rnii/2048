import { Router, Request, Response } from 'express';

const router = Router();

export function getHealth(_req: Request, res: Response): void {
  res.json({ ok: true });
}

router.get('/', getHealth);

export default router;
