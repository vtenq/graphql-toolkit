import { Source, parseGraphQLJSON, SchemaPointerSingle, DocumentLoader, SingleFileOptions } from '@graphql-toolkit/common';

const FILE_EXTENSIONS = ['.json'];

export interface JsonFileLoaderOptions extends SingleFileOptions {
  fs?: typeof import('fs');
  path?: typeof import('path');
  cwd?: string;
}

export class JsonFileLoader implements DocumentLoader {
  loaderId(): string {
    return 'json-file';
  }

  async canLoad(pointer: SchemaPointerSingle, options: JsonFileLoaderOptions): Promise<boolean> {
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

  async load(pointer: SchemaPointerSingle, options: JsonFileLoaderOptions): Promise<Source> {
    const { resolve: resolvePath, isAbsolute } = options.path;
    const normalizedFilepath = isAbsolute(pointer) ? pointer : resolvePath(options.cwd || process.cwd(), pointer);

    try {
      const { readFileSync } = options.fs;
      const jsonContent = readFileSync(normalizedFilepath, 'utf8');
      return parseGraphQLJSON(pointer, jsonContent, options);
    } catch (e) {
      throw new Error(`Unable to read JSON file: ${normalizedFilepath}: ${e.message || e}`);
    }
  }
}
