import { loadTypedefs, LoadTypedefsOptions } from '@graphql-toolkit/core';
import { GraphQLFileLoader } from '@graphql-toolkit/graphql-file-loader';
import * as Module from 'module';

export interface RequireExtensionsOptions extends LoadTypedefsOptions {
  extensions?: string[];
}

const DEFAULT_EXTENSIONS = ['graphql', 'graphqls', 'gql', 'gqls'];

export function register(options?: RequireExtensionsOptions) {
  options = options || ({} as RequireExtensionsOptions);
  options.extensions = options.extensions || DEFAULT_EXTENSIONS;
  options.loaders = options.loaders || [new GraphQLFileLoader()];

  function handleModule(m: Module, filename) {
    m.exports = loadTypedefs(filename, options).then(result => {
      Object.assign(m.exports, result);
    });
  }

  for (const ext of options.extensions) {
    require.extensions[`.${ext}`] = handleModule;
  }
}
