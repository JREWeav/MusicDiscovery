import { Image } from "./image-interface.ts";
import { Artist } from "./artist-interface.ts";

export interface Album {
  album_type: string;
  total_tracks: number;
  name: string;
  id: string;
  external_urls: {
    spotify: string;
  };
  images: Image[];
  artists: Artist[];
}
