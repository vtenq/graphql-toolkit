import { Source, UniversalLoader, DocumentPointerSingle, SchemaPointerSingle, parseGraphQLSDL, SingleFileOptions } from '@graphql-toolkit/common';

const FILE_EXTENSIONS = ['.gql', '.gqls', '.graphql', '.graphqls'];

export interface GraphQLFileLoaderOptions extends SingleFileOptions {
  fs?: typeof import('fs');
  path?: typeof import('path');
}

export class GraphQLFileLoader implements UniversalLoader<GraphQLFileLoaderOptions> {
  loaderId(): string {
    return 'graphql-file';
  }

  async canLoad(pointer: SchemaPointerSingle | DocumentPointerSingle, options?: GraphQLFileLoaderOptions): Promise<boolean> {
    if (options?.path && options?.fs) {
      const { resolve, isAbsolute } = options.path;
      if (FILE_EXTENSIONS.find(extension => pointer.endsWith(extension))) {
        const normalizedFilePath = isAbsolute(pointer) ? pointer : resolve(options.cwd || process.cwd(), pointer);
        const { exists } = options.fs;
        return new Promise(resolve => exists(normalizedFilePath, resolve));
      }
    }

    return false;
  }

  async load(pointer: SchemaPointerSingle | DocumentPointerSingle, options: GraphQLFileLoaderOptions): Promise<Source> {
    const { resolve, isAbsolute } = options.path;
    const normalizedFilePath = isAbsolute(pointer) ? pointer : resolve(options.cwd || process.cwd(), pointer);
    const { readFile } = options.fs as any;
    type ReadFileFn = typeof import('fs').readFileSync;
    const readFile$ = (...args: Parameters<ReadFileFn>): Promise<ReturnType<ReadFileFn>> => new Promise((resolve, reject) => readFile(...args, (err: Error, data: Buffer | string) => (err ? reject(err) : resolve(data))));
    const data = await readFile$(normalizedFilePath, 'utf-8');
    const rawSDL = data?.toString()?.trim();

    return parseGraphQLSDL(pointer, rawSDL, options);
  }
}
