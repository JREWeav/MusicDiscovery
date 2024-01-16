import {
  Box,
  FormControl,
  Input,
  Switch,
  VStack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import AlbumGrid from "../album-grid-component/AlbumGridComponent.tsx";
import GenreComponent from "../genre-component/GenreComponent.tsx";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Album } from "../../services/album-interface.ts";
import apiClient from "../../services/api-client.ts";
import { Artist } from "../../services/artist-interface.ts";
import ScrollContainer from "react-indiana-drag-scroll";

interface albumSearchResult {
  albums: {
    next: string;
    items: Album[];
  };
}

interface artistSearchResult {
  artists: Artist[];
}

/* 
TODO: 
  * Add AlbumComponentBlank as a Placeholder for unloaded data
  * Redo how genres are displayed
  * Make new data load when the page is not scrolled down
  * Make selected genres go to top
  * Make genres go to top if window is too small
  * Add filter features
  * Batch search artists
*/

function MainComponent() {
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
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
    let tempGenres: string[] = [];
    const tempArtists: string[] = [];
    for (const newAlbum of newAlbums) {
      tempArtists.push(newAlbum.artists[0].id);
    }
    await apiClient
      .get<artistSearchResult>(
        "https://api.spotify.com/v1/artists?ids=" + tempArtists.join(","),
        {
          signal: controller.signal,
        }
      )
      .then((res) => {
        for (let i = 0; i < newAlbums.length; i++) {
          console.log(res.data.artists[i].genres);
          newAlbums[i].artists[0].images = res.data.artists[i].images;
          newAlbums[i].artists[0].genres = res.data.artists[i].genres;
          tempGenres = [...tempGenres, ...res.data.artists[i].genres];
        }
      })
      .catch((err) => {
        console.log("Error on getting artist: " + err);
      });
    if (reset) {
      setAvailableGenres(
        tempGenres
          .filter((genre, index) => tempGenres.indexOf(genre) === index)
          .sort()
      );
      return newAlbums;
    } else {
      const allGenres = [...availableGenres, ...tempGenres];
      setAvailableGenres(
        allGenres
          .filter((genre, index) => allGenres.indexOf(genre) === index)
          .sort()
      );
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
      <VStack>
        <Box
          w={"90%"}
          h={"auto"}
          zIndex={"1000000"}
          bg={bgColor}
          pos={"fixed"}
          pt={"20px"}
          mb={"10px"}
        >
          <Box pb={"10px"}>
            <form onSubmit={handleSubmit}>
              <FormControl display={"flex"} alignItems={"center"}>
                <Input
                  placeholder="Search for album..."
                  size="lg"
                  mr={"20px"}
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
            </form>
          </Box>
          <Box
            zIndex={"100000"}
            bg={bgColor}
            display={"flex"}
            alignItems={"center"}
            justifyItems={"center"}
            pb={"10px"}
          >
            <ScrollContainer vertical={false}>
              <GenreComponent
                availableGenres={availableGenres}
                selectedGenres={selectedGenres}
                isLoading={isLoading}
                addGenre={(g: string) => {
                  setAvailableGenres([
                    g,
                    ...availableGenres.filter((genre) => genre !== g),
                  ]);
                  setSelectedGenres([...selectedGenres, g]);
                }}
                removeGenre={(g: string) => {
                  const tempGenres = selectedGenres.filter(
                    (genre) => genre !== g
                  );
                  setAvailableGenres([
                    ...tempGenres,
                    ...availableGenres
                      .filter((genre) => !tempGenres.includes(genre))
                      .sort(),
                  ]);
                  setSelectedGenres(tempGenres);
                }}
              ></GenreComponent>
            </ScrollContainer>
          </Box>
        </Box>
        <Box h={"100%"} w={"90%"} pt={"140px"}>
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
      </VStack>
    </>
  );
}
export default MainComponent;
