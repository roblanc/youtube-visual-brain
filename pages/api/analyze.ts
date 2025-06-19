import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchLatestThumbnails } from '../../src/youtube';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const link = req.body?.link;
  const apiKey = process.env.YOUTUBE_API_KEY || '';
  if (!link) {
    res.status(400).json({ error: 'Missing link in request body' });
    return;
  }

  try {
    const result = await fetchLatestThumbnails(link, apiKey);
    res.status(200).json(result.thumbnails);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch thumbnails' });
  }
}
