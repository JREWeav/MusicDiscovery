import { Album } from "../../services/album-interface.ts";
import { Flex, SimpleGrid, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import AlbumComponent from "../album-component/AlbumComponent.tsx";
import InfiniteScroll from "react-infinite-scroll-component";

interface Props {
  isLoading: boolean;
  albums: Album[];
  nextURL: string;
  selectedGenres: string[];
  getNextPage: (arg0: string) => void;
}

function AlbumGrid({
  isLoading,
  albums,
  nextURL,
  selectedGenres,
  getNextPage,
}: Props) {
  const [hasMore, setHasMore] = useState(true);

  return (
    <>
      {isLoading && (
        <Flex
          w={"100%"}
          h={"500px"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Spinner thickness="6px" size={"xl"}></Spinner>
        </Flex>
      )}
      {!isLoading && albums.length > 0 && (
        <InfiniteScroll
          dataLength={albums.length}
          next={() =>
            nextURL != null ? getNextPage(nextURL) : setHasMore(false)
          }
          hasMore={hasMore}
          loader={<h3>Nothing Here!</h3>}
        >
          <SimpleGrid minChildWidth="300px" spacing="20px">
            {selectedGenres.length > 0 &&
              albums.map((album) =>
                album != undefined &&
                selectedGenres.some((selectedGenre) =>
                  album.artists[0].genres?.some((genre) =>
                    genre.includes(selectedGenre)
                  )
                ) ? (
                  <AlbumComponent
                    album={album}
                    key={album?.id}
                  ></AlbumComponent>
                ) : null
              )}

            {selectedGenres.length === 0 &&
              albums.map((album) =>
                album != undefined ? (
                  <AlbumComponent
                    album={album}
                    key={album?.id}
                  ></AlbumComponent>
                ) : null
              )}
          </SimpleGrid>
        </InfiniteScroll>
      )}
    </>
  );
}
export default AlbumGrid;
