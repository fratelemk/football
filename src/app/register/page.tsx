"use client";
import { auth, createUser } from "@/lib/firebase";
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Link,
  Text,
  TextField,
} from "@radix-ui/themes";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

interface FormData {
  name: string;
  email: string;
  password: string;
}

function LoginForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  console.log(form);

  const handleFormSubmit = async () => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      await createUser(form.name, user.uid);
      router.push("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Box mb="5">
        <label>
          <Text as="div" size="2" weight="bold" mb="2">
            Name
          </Text>
          <TextField.Root>
            <TextField.Input
              tabIndex={-1}
              size="2"
              variant="surface"
              name="name"
              onChange={handleFormChange}
            />
          </TextField.Root>
        </label>
      </Box>
      <Box mb="5">
        <label>
          <Text as="div" size="2" weight="bold" mb="2">
            Email address
          </Text>
          <TextField.Root>
            <TextField.Input
              size="2"
              variant="surface"
              name="email"
              onChange={handleFormChange}
            />
          </TextField.Root>
        </label>
      </Box>
      <Box mb="5">
        <label>
          <Text as="div" size="2" weight="bold" mb="2">
            Password
          </Text>
          <TextField.Root>
            <TextField.Input
              type="password"
              size="2"
              variant="surface"
              name="password"
              onChange={handleFormChange}
            />
          </TextField.Root>
        </label>
      </Box>
      <Flex justify="end" gap="3" mt="6">
        <Button
          tabIndex={-1}
          size="2"
          variant="outline"
          onClick={handleFormSubmit}
        >
          Create an account
        </Button>
      </Flex>
    </>
  );
}
export default function RegisterPage() {
  return (
    <Container
      size="1"
      style={{
        height: "70vh",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Card size="4" variant="surface">
        <Box height="7" mb="4">
          <Heading as="h3" size="6" weight="bold">
            Sign in
          </Heading>
        </Box>
        <LoginForm />
      </Card>
    </Container>
  );
}
