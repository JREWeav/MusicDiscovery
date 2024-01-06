import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Spinner,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import apiClient from "../../services/api-client.ts";

interface SearchResult {
  next: string;
  items: Album[];
}

interface Album {
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

function AlbumComponent() {
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
        setNextURL(res.data.next);
        setAlbums(res.data.items);
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
        <Card maxW={"sm"}>
          <CardBody>
            <Image
              m={0}
              src={albums[0]?.images[0].url}
              alt="Green double couch with wooden legs"
              borderRadius="lg"
            />
          </CardBody>
          <CardFooter>
            <Stat>
              <StatLabel>{albums[0]?.artists[0].name}</StatLabel>
              <StatNumber>{albums[0]?.name}</StatNumber>
              <StatHelpText>
                {albums[0]?.album_type +
                  " - " +
                  albums[0]?.total_tracks +
                  " tracks"}
              </StatHelpText>
            </Stat>
          </CardFooter>
        </Card>
      )}
    </>
  );
}

export default AlbumComponent;
