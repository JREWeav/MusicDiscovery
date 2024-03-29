import { Album } from "../../services/album-interface.ts";
import { Box, Flex, Progress, SimpleGrid, Spinner } from "@chakra-ui/react";
import AlbumComponent from "../album-component/AlbumComponent.tsx";
//import AlbumComponentBlank from "../album-component/AlbumComponentBlank.tsx";
import InfiniteScroll from "react-infinite-scroll-component";

interface Props {
  isLoading: boolean;
  hasMore: boolean;
  albums: Album[];
  nextURL: string;
  selectedGenres: string[];
  getNextPage: (arg0: string) => void;
}

function AlbumGrid({
  isLoading,
  hasMore,
  albums,
  nextURL,
  selectedGenres,
  getNextPage,
}: Props) {
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
          next={() => getNextPage(nextURL)}
          hasMore={hasMore}
          loader={
            <Box
              width={"auto"}
              height={"auto"}
              mt={"10px"}
              display={"flex"}
              justifyContent={"center"}
            >
              <Progress
                size="md"
                width={"40%"}
                borderRadius={"2rem"}
                isIndeterminate
              />
            </Box>
          }
        >
          <SimpleGrid
            minChildWidth="300px"
            spacing="20px"
            justifyItems={"center"}
          >
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

            {/* {hasMore && (
              <>
                <AlbumComponentBlank></AlbumComponentBlank>
                <AlbumComponentBlank></AlbumComponentBlank>
                <AlbumComponentBlank></AlbumComponentBlank>
                <AlbumComponentBlank></AlbumComponentBlank>
                <AlbumComponentBlank></AlbumComponentBlank>
              </>
            )} */}
          </SimpleGrid>
        </InfiniteScroll>
      )}
    </>
  );
}
export default AlbumGrid;
