
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import projects from './projects.json' assert { type: 'json' };

async function ping(name, url, envKey) {
  const key = process.env[envKey];
  if (!key) {
    console.warn(`[⚠️] Skipping ${name} – no key set for env var ${envKey}`);
    return;
  }

  const supabase = createClient(url, key);

  try {
    const { error } = await supabase.rpc('pg_sleep', { seconds: 0 });
    if (error) throw error;
    console.log(`[✅] ${name} is awake (${new Date().toISOString()})`);
  } catch (err) {
    console.error(`[❌] ${name} failed to wake: ${err.message}`);
  }
}

async function run() {
  console.log(`[🌐] Starting keep-alive ping...`);
  for (const project of projects) {
    await ping(project.name, project.url, project.envKey);
  }
}

run();
