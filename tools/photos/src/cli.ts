import { ZodError } from 'zod';
import { sync } from './sync.ts';

try {
  await sync();
} catch (err) {
  if (err instanceof ZodError) {
    console.error('config error:');

    for (const issue of err.issues) {
      console.error(`  ${issue.path.join('.')}: ${issue.message}`);
    }
  } else {
    console.error(err instanceof Error ? err.message : err);
  }

  process.exit(1);
}
