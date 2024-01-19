import { Box, VStack, useColorModeValue } from "@chakra-ui/react";
import AlbumGrid from "../album-grid-component/AlbumGridComponent.tsx";
import MenuComponent from "../menu-component/MenuComponent.tsx";
import { useEffect, useState } from "react";
import { Album } from "../../services/album-interface.ts";
import apiClient from "../../services/api-client.ts";
import { Artist } from "../../services/artist-interface.ts";

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
  * Make new data load when the page is not scrolled down
  * Add filter features
*/

function MainComponent() {
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const [isLoading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
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
      setSelectedGenres([]);
      setAvailableGenres(
        tempGenres
          .filter((genre, index) => tempGenres.indexOf(genre) === index)
          .sort()
      );

      return newAlbums;
    } else {
      const allGenres = [...availableGenres, ...tempGenres];
      setAvailableGenres([
        ...selectedGenres,
        ...allGenres
          .filter((genre, index) => allGenres.indexOf(genre) === index)
          .sort()
          .filter((genre) => !selectedGenres.includes(genre)),
      ]);
      return [...albums, ...newAlbums];
    }
  };

  const addGenre = (g: string) => {
    setAvailableGenres([g, ...availableGenres.filter((genre) => genre !== g)]);
    setSelectedGenres([...selectedGenres, g]);
  };

  const removeGenre = (g: string) => {
    const tempGenres = selectedGenres.filter((genre) => genre !== g);
    setAvailableGenres([
      ...tempGenres,
      ...availableGenres.filter((genre) => !tempGenres.includes(genre)).sort(),
    ]);
    setSelectedGenres(tempGenres);
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
          <MenuComponent
            addGenre={addGenre}
            availableGenres={availableGenres}
            removeGenre={removeGenre}
            selectedGenres={selectedGenres}
            setSearch={setSearch}
          ></MenuComponent>
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
