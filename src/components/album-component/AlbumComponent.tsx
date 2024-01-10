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
import { Album } from "../album-grid-component/AlbumGridComponent.tsx";

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
        />
      </CardBody>
      <CardFooter>
        <Stat>
          <StatLabel>
            {album.artists.map((artist, index) =>
              index < album.artists.length - 1
                ? index < 5
                  ? artist.name + ", "
                  : null
                : artist.name
            )}
            {""}
            {album.artists.length > 5 ? "..." : ""}
          </StatLabel>
          <StatNumber>{album?.name}</StatNumber>
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
