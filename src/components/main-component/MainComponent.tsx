import { Box, Flex, Input, Stack } from "@chakra-ui/react";
import AlbumGrid from "../album-grid-component/AlbumGridComponent.tsx";
import GenreComponent from "../genre-component/GenreComponent.tsx";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Album } from "../../services/album-interface.ts";
import apiClient from "../../services/api-client.ts";
import { Artist } from "../../services/artist-interface.ts";

interface albumSearchResult {
  albums: {
    next: string;
    items: Album[];
  };
}

function MainComponent() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const searchBar = useRef<HTMLInputElement>(null);

  const [isLoading, setLoading] = useState(true);
  const [nextURL, setNextURL] = useState("");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [error, setError] = useState("");

  const getURL = (url: string, nextPage: boolean) => {
    const controller = new AbortController();
    setAlbums([]);
    setLoading(nextPage ? false : true);

    apiClient
      .get<albumSearchResult>(url, {
        signal: controller.signal,
      })
      .then((res) => {
        setNextURL(res.data.albums.next);
        addGenres(res.data.albums.items, true);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        console.log(error);
        setLoading(false);
      });

    return () => controller.abort();
  };

  useEffect(() => {
    const searchURL =
      search !== ""
        ? "https://api.spotify.com/v1/search?q=".concat(search, "&type=album")
        : "https://api.spotify.com/v1/search?q=tag%3Anew&type=album";
    getURL(searchURL, false);
  }, [search]);

  const getNextPage = (url: string) => {
    const controller = new AbortController();
    apiClient
      .get<albumSearchResult>(url, {
        signal: controller.signal,
      })
      .then((res) => {
        setNextURL(res.data.albums.next);
        addGenres(res.data.albums.items, false);
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
      });
  };

  const addGenres = (newAlbums: Album[], reset: boolean) => {
    const controller = new AbortController();
    for (const newAlbum of newAlbums) {
      apiClient
        .get<Artist>(
          "https://api.spotify.com/v1/artists/" + newAlbum.artists[0].id,
          {
            signal: controller.signal,
          }
        )
        .then((res) => {
          newAlbum.artists[0].genres = res.data.genres.map((genre) =>
            genre.split(" ").join("-").toLowerCase()
          );
          console.log;
          console.log(newAlbum);
          newAlbum.artists[0].images = res.data.images;
        })
        .catch((err) => {
          console.log("Error on getting artist: " + err);
        });
    }
    console.log("Made it here!");
    reset ? setAlbums(newAlbums) : setAlbums([...albums, ...newAlbums]);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (searchBar.current !== null) {
      setSearch(searchBar.current.value);
    }
  };

  return (
    <>
      <Stack>
        <Box w={"100%"} h={"10%"} zIndex={"1000000"} bg={"white"} pos={"fixed"}>
          <form onSubmit={handleSubmit}>
            <Input
              placeholder="Search for album..."
              size="md"
              w={"95%"}
              my={"30px"}
              mx={"30px"}
              id="search"
              type="text"
              ref={searchBar}
            />{" "}
          </form>
        </Box>
        <Box h={"100%"} w={"100%"} pt={"90px"}>
          <Flex>
            <Box boxSize={"8%"} justifySelf={"center"} h={"100%"}>
              <GenreComponent
                selectedGenres={selectedGenres}
                addGenre={(g: string) =>
                  setSelectedGenres([...selectedGenres, g])
                }
                removeGenre={(g: string) =>
                  setSelectedGenres(
                    selectedGenres.filter((genre) => genre !== g)
                  )
                }
              ></GenreComponent>
            </Box>
            <Box boxSize={"92%"} mx={"auto"}>
              <AlbumGrid
                isLoading={isLoading}
                albums={albums}
                nextURL={nextURL}
                selectedGenres={selectedGenres}
                getNextPage={getNextPage}
              ></AlbumGrid>
            </Box>
          </Flex>
        </Box>
      </Stack>
    </>
  );
}
export default MainComponent;
