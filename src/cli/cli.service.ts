import { Auth } from '@/auth/auth.model.ts';

type Command =
  | { action: 'register'; data: string }
  | { action: 'quit' }
  | { action: 'stop' }
  | { action: 'exit' }
  | { action: 'kill' };

export function start(shutdown: () => void) {
  while (true) {
    const input = prompt('> ');
    if (!input) continue;
    const command = parseInput(input);
    if (typeof command === 'string') {
      console.log(command);
      continue;
    }
    const result = execute(command, shutdown);

    if (result === 'die') return;

    console.log(result);
  }
}

function parseInput(input: string) {
  const result = input.match(/^(?<action>\w+)(?: (?<data>.+))?$/);
  if (!result?.groups) return 'malformed syntax';
  return result.groups as Command;
}

function execute(command: Command, shutdown: () => void) {
  switch (command.action) {
    case 'register': {
      Auth.register(command.data);
      return `successfully registered ${command.data}`;
    }

    case 'quit':
    case 'stop':
    case 'exit':
    case 'kill': {
      shutdown();
      return 'die';
    }

    default: {
      return `unknown command ${command['action']}`;
    }
  }
}
