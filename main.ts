import { typewriter } from '@/app/app.module.ts';
import { start } from '@/cli/cli.service.ts';

const { server, shutdown } = typewriter();

try {
  Deno.addSignalListener('SIGINT', shutdown.function);
} catch {
  console.error('SIGINT listener not supported');
}

try {
  Deno.addSignalListener('SIGTERM', shutdown.function);
} catch {
  console.error('SIGTERM listener not supported');
}

Deno.serve(
  {
    port: 3000,
    hostname: '0.0.0.0',
    signal: shutdown.signal,
    onListen: ({ port }) => {
      console.log(`Listening on port ${port}`);
      start(shutdown.function);
    },
  },
  server,
).finished.then(() => console.log('Thank you for using typewriter!'));
