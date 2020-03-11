import { register } from '../src';
import { print } from 'graphql';
import { readFileSync } from 'fs';

register();

describe('GraphQL Node Import', () => {
  it('should import correct definitions', () => {
    const typeDefs = require('./test.graphql');
    expect(
      print(typeDefs).replace(/\s\s+/g, ' ')
    ).toBe(readFileSync(require.resolve('./test.graphql'), 'utf8').replace(
        /\s\s+/g,
        ' '
      ));
  });
});
