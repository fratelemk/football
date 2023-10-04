"use client";
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Heading,
  RadioGroup,
  Text,
  TextField,
} from "@radix-ui/themes";
import { ChangeEvent, ReactNode, useState } from "react";
import {
  Match,
  PlayerCount,
  Visibility,
  auth,
  createMatch,
} from "@/lib/firebase";
import { useAuth } from "./layout";
import { signOut } from "firebase/auth";

function Wraper({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <Box style={{ width: "640px" }}>
      <Card variant="surface" size="4">
        <Box height="7">
          <Heading mt="-1">{title}</Heading>
        </Box>
        {description && (
          <Text as="p" color="gray" mb="5" size="2">
            {description}
          </Text>
        )}
        {children}
      </Card>
    </Box>
  );
}

function CreateMatchForm() {
  const [form, setForm] = useState<Match>({
    visibility: Visibility.Public,
    players: PlayerCount.Medium,
  });

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFormSubmit = async () => {
    try {
      createMatch(form);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Flex direction="column" gap="3">
        <RadioGroup.Root name="players" onChange={handleFormChange}>
          <Text as="div" size="2" mb="2" weight="bold">
            Players
          </Text>
          <Flex gap="3">
            {Object.entries(PlayerCount).map(([key, value]) => (
              <label key={key}>
                <Flex gap="2" align="center">
                  <RadioGroup.Item value={value} />
                  <Text size="2">
                    {key} ({value}+)
                  </Text>
                </Flex>
              </label>
            ))}
          </Flex>
        </RadioGroup.Root>
        <RadioGroup.Root name="visibility" onChange={handleFormChange}>
          <Text as="div" size="2" mb="2" weight="bold">
            Visibility
          </Text>
          <Flex gap="3">
            {Object.entries(Visibility).map(([key, value]) => (
              <label key={key}>
                <Flex gap="2" align="center">
                  <RadioGroup.Item value={value} />
                  <Text size="2">{key}</Text>
                </Flex>
              </label>
            ))}
          </Flex>
        </RadioGroup.Root>
      </Flex>

      <Flex gap="3" mt="4" justify="end">
        <Dialog.Close>
          <Button variant="soft" color="gray">
            Cancel
          </Button>
        </Dialog.Close>
        <Dialog.Close>
          <Button onClick={handleFormSubmit}>Save</Button>
        </Dialog.Close>
      </Flex>
    </>
  );
}

export default function Index() {
  const { user } = useAuth();
  return (
    <Flex gap="6">
      <Text>{user?.displayName}</Text>
      {user && (
        <Button
          onClick={() => {
            signOut(auth);
          }}
        >
          Logout
        </Button>
      )}
      <Wraper title="Match">
        <Text>21 Oct 2023</Text>
        <Dialog.Root>
          <Dialog.Trigger>
            <Button>Create</Button>
          </Dialog.Trigger>

          <Dialog.Content style={{ maxWidth: 450 }}>
            <Dialog.Title>New match</Dialog.Title>
            <CreateMatchForm />
          </Dialog.Content>
        </Dialog.Root>
      </Wraper>
    </Flex>
  );
}
