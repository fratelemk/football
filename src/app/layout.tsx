"use client";
import { Match, User, auth } from "@/lib/firebase";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { onAuthStateChanged } from "firebase/auth";
import {
  ReactNode,
  useContext,
  useEffect,
  useState,
  createContext,
} from "react";

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const clear = () => {
    setUser(null);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(true);
      if (!user) {
        clear();
        return;
      }
      console.log();
      setUser({
        uid: user.uid,
        displayName: user.displayName!,
      });
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, loading };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useFirebaseAuth();
  console.log(auth);
  return (
    <html lang="en">
      <body>
        <Theme suppressHydrationWarning appearance="dark">
          <AuthContext.Provider value={auth}>
            {!auth.loading && children}
          </AuthContext.Provider>
        </Theme>
      </body>
    </html>
  );
}
