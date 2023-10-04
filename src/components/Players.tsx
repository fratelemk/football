import { addPlayer, removePlayer } from "@/lib/firebase";
import { TrashIcon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Separator,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useState } from "react";
import { ChangeEvent } from "react";

function PlayerInput() {
  const [player, setPlayer] = useState<string>("");
  const handlePlayerChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlayer(e.target.value);
  };
  const handlePlayerAdd = async () => {
    await addPlayer(player, "UgsGuKQ5EB2dV4VoIk7B");
  };
  return (
    <Flex gap="3" justify="start" mb="5">
      <Box grow="1">
        <TextField.Root>
          <TextField.Input
            size="2"
            variant="surface"
            placeholder="Name"
            tabIndex={-1}
            onChange={handlePlayerChange}
          />
        </TextField.Root>
      </Box>
      <Button tabIndex={-1} onClick={handlePlayerAdd}>
        Add
      </Button>
    </Flex>
  );
}

function Player({ name }: { name: string }) {
  const handleRemoval = async () => {
    await removePlayer(name, "UgsGuKQ5EB2dV4VoIk7B");
  };
  return (
    <Box>
      <Flex gap="4" align="center" justify="start">
        <Flex
          align="center"
          justify="start"
          gap="3"
          style={{ width: "200px", whiteSpace: "nowrap" }}
        >
          <Text size="2">{name}</Text>
        </Flex>
        <Flex justify="end" grow="1">
          <IconButton color="red" onClick={handleRemoval}>
            <TrashIcon width="18" height="18" />
          </IconButton>
        </Flex>
      </Flex>
    </Box>
  );
}

export default function Players({ players }: { players: string[] }) {
  return (
    <Flex direction="column" justify="start" style={{ width: 540 }}>
      <PlayerInput />
      {players.map((name, index) => (
        <>
          <Player key={name} name={name} />
          {index !== players.length - 1 && (
            <Box mt="-1">
              <Separator size="4" my="3" />
            </Box>
          )}
        </>
      ))}
    </Flex>
  );
}
