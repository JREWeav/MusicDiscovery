import { SimpleGrid, Spinner } from "@chakra-ui/react";
import AlbumComponent from "../album-component/AlbumComponent.tsx";
import { useEffect, useState } from "react";
import apiClient from "../../services/api-client.ts";
import InfiniteScroll from "react-infinite-scroll-component";

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
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    apiClient
      .get<SearchResult>(
        "https://api.spotify.com/v1/search?q=tag%3Anew&type=album",
        {
          signal: controller.signal,
        }
      )
      .then((res) => {
        setNextURL(res.data.albums.next);
        setAlbums(res.data.albums.items);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        console.log(error);
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const getNextPage = (url: string) => {
    const controller = new AbortController();
    apiClient
      .get<SearchResult>(url, {
        signal: controller.signal,
      })
      .then((res) => {
        setNextURL(res.data.albums.next);
        setAlbums([...albums, ...res.data.albums.items]);
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
      });
  };

  return (
    <>
      {isLoading && <Spinner></Spinner>}
      {!isLoading && (
        <InfiniteScroll
          dataLength={albums.length}
          next={() =>
            nextURL != null ? getNextPage(nextURL) : setHasMore(false)
          }
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
        >
          <SimpleGrid minChildWidth="300px" spacing="20px">
            {albums.map((album) =>
              album != undefined ? (
                <AlbumComponent album={album} key={album?.id}></AlbumComponent>
              ) : null
            )}
          </SimpleGrid>
        </InfiniteScroll>
      )}
    </>
  );
}
export default AlbumGrid;
