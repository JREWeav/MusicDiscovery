import { Box, Flex, Input, Stack } from "@chakra-ui/react";
import AlbumGrid from "../album-grid-component/AlbumGridComponent.tsx";
import GenreComponent from "../genre-component/GenreComponent.tsx";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Album } from "../../services/album-service.ts";
import apiClient from "../../services/api-client.ts";

interface SearchResult {
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

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    const genreString =
      selectedGenres.length > 0
        ? "%2520genre:" + selectedGenres.join("%2520genre:")
        : "";

    const searchURL =
      search !== ""
        ? "https://api.spotify.com/v1/search?q=".concat(
            search,
            genreString,
            "&type=album"
          )
        : "https://api.spotify.com/v1/search?q=tag%3Anew&type=album";
    apiClient
      .get<SearchResult>(searchURL, {
        signal: controller.signal,
      })
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
  }, [selectedGenres, search]);

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

  const getURL = () => {
    setLoading(true);
    const controller = new AbortController();
    const genreString = "%2520genre:" + selectedGenres.join("%2520genre:");
    const searchURL = "https://api.spotify.com/v1/search?q=".concat(
      search,
      genreString,
      "&type=album"
    );
    apiClient
      .get<SearchResult>(searchURL, {
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
                updateSearch={getURL}
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
