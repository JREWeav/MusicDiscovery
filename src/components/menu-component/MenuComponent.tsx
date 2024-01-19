import {
  Box,
  FormControl,
  Input,
  Switch,
  useColorMode,
} from "@chakra-ui/react";

import GenreComponent from "../genre-component/GenreComponent.tsx";
import { FormEvent, useRef } from "react";
import ScrollContainer from "react-indiana-drag-scroll";

interface Props {
  addGenre: (g: string) => void;
  removeGenre: (g: string) => void;
  setSearch: (s: string) => void;
  availableGenres: string[];
  selectedGenres: string[];
}

function MenuComponent({
  addGenre,
  removeGenre,
  setSearch,
  availableGenres,
  selectedGenres,
}: Props) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (searchBar.current !== null) {
      setSearch(searchBar.current.value);
    }
  };
  const searchBar = useRef<HTMLInputElement>(null);

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
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
        display={"flex"}
        alignItems={"center"}
        justifyItems={"center"}
        pb={"10px"}
      >
        <ScrollContainer vertical={false}>
          <GenreComponent
            availableGenres={availableGenres}
            selectedGenres={selectedGenres}
            addGenre={addGenre}
            removeGenre={removeGenre}
          ></GenreComponent>
        </ScrollContainer>
      </Box>
    </>
  );
}
export default MenuComponent;
