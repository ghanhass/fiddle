import { CdnjsLibraryAssets } from "./cdnjs-library-assets";

export interface CdnjsLibraryMetaData {
  assets?: [CdnjsLibraryAssets];
  description?: string;
  latest?: string;
  name?: string;
  version?: string;
  versions?: [string];
}
