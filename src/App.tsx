import { Box, Flex } from "@chakra-ui/react";
import AlbumGrid from "./components/album-grid-component/AlbumGridComponent.tsx";
import GenreComponent from "./components/genre-component/GenreComponent.tsx";

function App() {
  return (
    <>
      <Box pt={"30px"}>
        <Flex>
          <Box boxSize={"8%"} justifySelf={"center"}>
            <GenreComponent></GenreComponent>
          </Box>
          <Box boxSize={"90%"} mx={"auto"}>
            <AlbumGrid></AlbumGrid>
          </Box>
        </Flex>
      </Box>
    </>
  );
}

export default App;
