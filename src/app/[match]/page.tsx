"use client";
import Activity from "@/components/Activity";
import Players from "@/components/Players";
import { Match, getLatestMatch, getLatestMatchActivity } from "@/lib/firebase";
import { Container, Flex } from "@radix-ui/themes";
import { useContext } from "react";
import { createContext } from "react";
import { useState, useEffect } from "react";

const MatchContext = createContext<MatchContextType>({
  match: null,
  loading: true,
});
export const useLatestMatch = () => useContext(MatchContext);
type MatchContextType = {
  match: Match | null;
  loading: boolean;
};
export default function MatchPage() {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(async () => {
    const unsubscribe = await getLatestMatch(setMatch, setLoading);
    return () => unsubscribe();
  }, []);

  return (
    <MatchContext.Provider value={{ match, loading }}>
      <Container>
        {!loading && (
          <Flex justify="between">
            <Players players={match?.players} />
            <Activity />
          </Flex>
        )}
      </Container>
    </MatchContext.Provider>
  );
}
