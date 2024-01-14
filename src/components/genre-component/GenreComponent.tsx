import { Stack, Button, IconButton } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import "./GenreComponent.css";

interface Props {
  availableGenres: string[];
  selectedGenres: string[];
  isLoading: boolean;
  addGenre: (arg0: string) => void;
  removeGenre: (arg0: string) => void;
}

function GenreComponent({
  availableGenres,
  isLoading,
  selectedGenres,
  addGenre,
  removeGenre,
}: Props) {
  return (
    <>
      {!isLoading && (
        <Stack
          className="removeScrollbar"
          spacing={4}
          direction="column"
          align="center"
          pos={"fixed"}
          overflowY={"scroll"}
          h={"100%"}
          w={"auto"}
          pt={"20px"}
        >
          {availableGenres.map((genre) =>
            selectedGenres.includes(genre) ? (
              <Button key={genre} size={"xs"}>
                {genre}
                <IconButton
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
      )}
    </>
  );
}
export default GenreComponent;
