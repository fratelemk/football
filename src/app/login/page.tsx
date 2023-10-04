"use client";
import { auth } from "@/lib/firebase";
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
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/cordova";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

interface FormData {
  email: string;
  password: string;
}

function LoginForm() {
  const [form, setForm] = useState<FormData>({
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
      await signInWithEmailAndPassword(auth, form.email, form.password);
      router.push("/");
    } catch (e) {
      console.error(e);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Box my="5">
        <Button
          tabIndex={-1}
          size="2"
          variant="solid"
          onClick={handleGoogleAuth}
        >
          Sign in with Google
        </Button>
      </Box>
      <Box mb="5">
        <label>
          <Text as="div" size="2" weight="bold" mb="2">
            Email address
          </Text>
          <TextField.Root>
            <TextField.Input
              tabIndex={-1}
              size="2"
              variant="surface"
              name="email"
              onChange={handleFormChange}
            />
          </TextField.Root>
        </label>
      </Box>
      <Box mb="5" position="relative">
        <Box
          position="absolute"
          top="0"
          right="0"
          style={{ marginTop: "-2px" }}
        >
          <Link tabIndex={-1} size="2">
            Forgot Password?
          </Link>
        </Box>
        <label>
          <Text as="div" size="2" weight="bold" mb="2">
            Password
          </Text>
          <TextField.Root>
            <TextField.Input
              type="password"
              tabIndex={-1}
              size="2"
              variant="surface"
              name="password"
              onChange={handleFormChange}
            />
          </TextField.Root>
        </label>
      </Box>
      <Flex justify="end" gap="3" mt="6">
        <Button tabIndex={-1} size="2" variant="outline">
          Create an account
        </Button>
        <Button
          tabIndex={-1}
          size="2"
          variant="solid"
          onClick={handleFormSubmit}
        >
          Sign in
        </Button>
      </Flex>
    </>
  );
}
export default function LoginPage() {
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
