import {
  Avatar,
  Box,
  Card,
  CardBody,
  CardFooter,
  HStack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";

function AlbumComponent() {
  return (
    <Card maxW={"sm"}>
      <CardBody>
        <Box
          m={0}
          borderRadius="lg"
          minW={"100%"}
          minH={"100%"}
          bgGradient="linear(to-r, teal.500, green.500)"
        />
      </CardBody>
      <CardFooter>
        <Stat>
          <StatLabel alignItems={"center"}>
            <HStack>
              <Avatar name={""} src={""} size={"md"} />
              <Box>
                <a>Loading...</a>
              </Box>
            </HStack>
          </StatLabel>
          <StatNumber>
            <a>Loading...</a>
          </StatNumber>
          <StatHelpText>{"Loading..."}</StatHelpText>
        </Stat>
      </CardFooter>
    </Card>
  );
}

export default AlbumComponent;
