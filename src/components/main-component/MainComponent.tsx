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

  const getURL = async (
    url: string,
    controller: AbortController,
    nextPage: boolean
  ) => {
    setLoading(!nextPage);

    apiClient
      .get<albumSearchResult>(url, {
        signal: controller.signal,
      })
      .then(async (res) => {
        setNextURL(res.data.albums.next);
        setAlbums(await addArtistData(res.data.albums.items, !nextPage));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    const searchURL =
      search !== ""
        ? "https://api.spotify.com/v1/search?q=".concat(search, "&type=album")
        : "https://api.spotify.com/v1/search?q=tag%3Anew&type=album";
    getURL(searchURL, controller, false);
    return () => controller.abort();
  }, [search]);

  const addArtistData = async (newAlbums: Album[], reset: boolean) => {
    const controller = new AbortController();
    for (const newAlbum of newAlbums) {
      await apiClient
        .get<Artist>(
          "https://api.spotify.com/v1/artists/" + newAlbum.artists[0].id,
          {
            signal: controller.signal,
          }
        )
        .then((res) => {
          newAlbum.artists[0].images = res.data.images;
          newAlbum.artists[0].genres = res.data.genres.map((genre) =>
            genre.split(" ").join("-").toLowerCase()
          );
        })
        .catch((err) => {
          console.log("Error on getting artist: " + err);
        });
    }
    if (reset) {
      return newAlbums;
    } else {
      return [...albums, ...newAlbums];
    }
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
                getNextPage={() => {
                  const controller = new AbortController();
                  getURL(nextURL, controller, true);
                }}
              ></AlbumGrid>
            </Box>
          </Flex>
        </Box>
      </Stack>
    </>
  );
}
export default MainComponent;
