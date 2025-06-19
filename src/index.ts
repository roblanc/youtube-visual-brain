import { fetchLatestThumbnails } from './youtube';

async function run() {
  const link = process.argv[2];
  const apiKey = process.env.YOUTUBE_API_KEY || '';
  if (!link) {
    console.error('Usage: node dist/index.js <youtube_link>');
    process.exit(1);
  }
  try {
    const result = await fetchLatestThumbnails(link, apiKey);
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}

run();
