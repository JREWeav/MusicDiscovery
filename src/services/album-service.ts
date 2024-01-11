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

interface Image {
  url: string;
  height: number;
  width: number;
}

interface Artist {
  name: string;
  external_urls: {
    spotify: string;
  };
}
