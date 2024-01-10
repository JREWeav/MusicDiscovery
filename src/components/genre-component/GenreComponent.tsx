import { useState, useEffect } from "react";
import apiClient from "../../services/api-client";
import { Stack, Button } from "@chakra-ui/react";
import "./GenreComponent.css";

interface Result {
  genres: string[];
}

function GenreComponent() {
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
        >
          {genres.map((genre) => (
            <Button key={genre} size={"xs"}>
              {genre}
            </Button>
          ))}
        </Stack>
      )}
    </>
  );
}
export default GenreComponent;
