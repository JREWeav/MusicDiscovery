import { Stack, Button, IconButton, Box } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

interface Props {
  availableGenres: string[];
  selectedGenres: string[];
  addGenre: (arg0: string) => void;
  removeGenre: (arg0: string) => void;
}

function GenreComponent({
  availableGenres,
  selectedGenres,
  addGenre,
  removeGenre,
}: Props) {
  return (
    <>
      <Box width={"fit-content"} height={"auto"}>
        <Stack className="removeScrollbar" spacing={4} direction="row">
          {availableGenres.map((genre) =>
            selectedGenres.includes(genre) ? (
              <Button
                key={genre}
                size={"xs"}
                width={"fit-content"}
                minW={"fit-content"}
              >
                {genre}
                <IconButton
                  ml={"4px"}
                  mr={"0px"}
                  bg={"0"}
                  aria-label="Remove Genre"
                  icon={<CloseIcon />}
                  onClick={() => {
                    removeGenre(genre);
                  }}
                  size={"xs"}
                />
              </Button>
            ) : (
              <Button
                key={genre}
                size={"xs"}
                onClick={() => {
                  addGenre(genre);
                }}
              >
                {genre}
              </Button>
            )
          )}
        </Stack>
      </Box>
    </>
  );
}
export default GenreComponent;
