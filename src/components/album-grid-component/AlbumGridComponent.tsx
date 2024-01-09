import { SimpleGrid, Spinner } from "@chakra-ui/react";
import AlbumComponent from "../album-component/AlbumComponent.tsx";
import { useEffect, useState } from "react";
import apiClient from "../../services/api-client.ts";

interface SearchResult {
  albums: {
    next: string;
    items: Album[];
  };
}

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
}

function AlbumGrid() {
  const [isLoading, setLoading] = useState(true);
  const [nextURL, setNextURL] = useState("");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    apiClient
      .get<SearchResult>("/search?q=tag%3Anew&type=album", {
        signal: controller.signal,
      })
      .then((res) => {
        setNextURL(res.data.albums.next);
        setAlbums(res.data.albums.items);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, []);
  return (
    <>
      {isLoading && <Spinner></Spinner>}
      {nextURL && <p>{nextURL}</p>}
      {error && <p>{error}</p>}
      {!isLoading && (
        <SimpleGrid minChildWidth="240px" spacing="40px">
          {albums.map((album) => (
            <AlbumComponent album={album}></AlbumComponent>
          ))}
        </SimpleGrid>
      )}
    </>
  );
}
export default AlbumGrid;
