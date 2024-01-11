import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { Album } from "../../services/album-service";

interface Props {
  album: Album;
}

function AlbumComponent({ album }: Props) {
  return (
    <Card maxW={"sm"}>
      <CardBody>
        <Image
          m={0}
          src={album.images[0].url}
          alt="Green double couch with wooden legs"
          borderRadius="lg"
          onClick={() => window.open(album.external_urls.spotify)}
          cursor={"pointer"}
        />
      </CardBody>
      <CardFooter>
        <Stat>
          <StatLabel>
            {album.artists.map((artist, index) =>
              index < album.artists.length - 1 ? (
                index < 5 ? (
                  <a
                    href={artist.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={artist.name}
                  >
                    {artist.name},{" "}
                  </a>
                ) : null
              ) : (
                <a
                  href={artist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {artist.name}
                </a>
              )
            )}
            {""}
            {album.artists.length > 5 ? "..." : ""}
          </StatLabel>
          <StatNumber>
            <a
              href={album.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
            >
              {album?.name}
            </a>
          </StatNumber>
          <StatHelpText>
            {album.album_type.toUpperCase() +
              " - " +
              album.total_tracks +
              " TRACKS"}
          </StatHelpText>
        </Stat>
      </CardFooter>
    </Card>
  );
}

export default AlbumComponent;
