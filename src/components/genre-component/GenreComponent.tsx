import { useState, useEffect } from "react";
import apiClient from "../../services/api-client";
import { Stack, Button, IconButton } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import "./GenreComponent.css";

interface Result {
  genres: string[];
}

interface Props {
  selectedGenres: string[];
  addGenre: (arg0: string) => void;
  removeGenre: (arg0: string) => void;
}

function GenreComponent({ selectedGenres, addGenre, removeGenre }: Props) {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("[]");
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    apiClient
      .get<Result>(
        "https://api.spotify.com/v1/recommendations/available-genre-seeds",
        {
          signal: controller.signal,
        }
      )
      .then((res) => {
        setGenres(res.data.genres);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
        console.log(error);
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

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
          {genres.map((genre) =>
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
