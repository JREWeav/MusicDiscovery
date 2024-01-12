import {Image} from "./image-interface.ts";

export interface Artist {
  name: string;
  external_urls: {
    spotify: string;
  }
  id: string;
  genres: string[];
  images: Image[];
}