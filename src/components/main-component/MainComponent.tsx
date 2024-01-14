import {
  Box,
  Flex,
  FormControl,
  Input,
  Stack,
  Switch,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
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

/* 
TODO: 
  * Add AlbumComponentBlank as a Placeholder for unloaded data
  * Make new data load when the page is not scrolled down
  * Maybe make database for genres?
  * Make selected genres go to top
  * Make genres go to top if window is too small
  * Add filter features
*/

function MainComponent() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const searchBar = useRef<HTMLInputElement>(null);

  const [isLoading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [nextURL, setNextURL] = useState("");
  const [albums, setAlbums] = useState<Album[]>([]);

  const { colorMode, toggleColorMode } = useColorMode();

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
        res.data.albums.next !== null ? setHasMore(true) : setHasMore(false);
        setNextURL(res.data.albums.next);
        setAlbums(await addArtistData(res.data.albums.items, !nextPage));
        setLoading(false);
        return () => console.log("Data loaded!");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    return () => controller.abort();
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

  const bgColor = useColorModeValue("#FFFFFF", "#1A202C");

  return (
    <>
      <Stack>
        <Box w={"100%"} h={"10%"} zIndex={"1000000"} bg={bgColor} pos={"fixed"}>
          <FormControl
            onSubmit={handleSubmit}
            display={"flex"}
            alignItems={"center"}
            pl={"10%"}
            pr={"5%"}
          >
            <Input
              placeholder="Search for album..."
              size="lg"
              w={"95%"}
              my={"30px"}
              mx={"30px"}
              id="search"
              type="text"
              ref={searchBar}
            />
            <Switch
              size="lg"
              isChecked={colorMode === "dark" ? true : false}
              onChange={toggleColorMode}
            />
          </FormControl>
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
                hasMore={hasMore}
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
