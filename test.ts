import { parse } from 'std/path';
import z from 'zod';

const schema = z.string().transform(path => parse(path));

console.log(schema.safeParse('k3lj23lkmlfsd908f0s'));
