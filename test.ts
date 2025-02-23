import { parse } from '@std/toml';

const src = `
name = false
`;

console.log(parse(src));
