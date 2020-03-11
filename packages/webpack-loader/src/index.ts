import { loadTypedefs, LoadTypedefsOptions } from '@graphql-toolkit/core';
import { getOptions } from 'loader-utils';
import { loader } from 'webpack';
import { GraphQLFileLoader } from '@graphql-toolkit/graphql-file-loader';

export default async function(this: loader.LoaderContext, source: string) {
  const callback = this.async();

  this.cacheable();

  const options = getOptions(this) as LoadTypedefsOptions;

  options.loaders = options.loaders || [new GraphQLFileLoader()];

  const result = await loadTypedefs(source, options);

  callback(null, `module.exports = ${JSON.stringify(result, null, 2)}`);
}
