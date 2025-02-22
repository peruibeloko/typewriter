import { typewriter } from '@/app/app.module.ts';

const { server, shutdown } = typewriter();

Deno.addSignalListener('SIGINT', shutdown.function);

Deno.serve(
  {
    port: 3000,
    hostname: '0.0.0.0',
    signal: shutdown.signal,
    onListen: ({ port }) => console.log(`Listening on port ${port}`),
  },
  server,
).finished.then(() => console.log('Thank you for using typewriter!'));
