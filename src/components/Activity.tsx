"use client";
import { Box, Flex, Link, ScrollArea, Separator, Text } from "@radix-ui/themes";
import { Action, Event, getLatestMatchActivity } from "@/lib/firebase";
import { useEffect } from "react";
import { useState } from "react";
const DAY_MILLISECONDS = 1000 * 60 * 60 * 24;

function getRelativeTime(time: number) {
  const rtf = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });
  const daysDifference = Math.round(
    (time - new Date().getTime()) / DAY_MILLISECONDS
  );

  return rtf.format(daysDifference, "day");
}
export default function Activity() {
  const [activity, setActivity] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(async () => {
    const unsubscribe = await getLatestMatchActivity(setActivity, setLoading);
    return () => unsubscribe();
  }, []);

  return (
    !loading && (
      <ScrollArea scrollbars="vertical" style={{ height: 280, width: 540 }}>
        <Flex justify="start" direction="column" p="2" pr="8" width="100%">
          {activity
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((event, index) => {
              return (
                <>
                  <Flex direction="column" justify="start" gap="3" mb="5">
                    <Flex align="center" justify="between">
                      <Flex align="center" justify="start" gap="3">
                        <Box>
                          <Text size="2" weight="bold">
                            {event.player}
                          </Text>
                          <Text
                            as="div"
                            size="2"
                            color={
                              event.action === Action.Joined ? "green" : "red"
                            }
                          >
                            {Action[event.action]}
                            <Link tabIndex={-1}></Link>
                          </Text>
                        </Box>
                      </Flex>
                      <Text size="2" color="gray">
                        {getRelativeTime(new Date(event.date).getTime())}
                      </Text>
                    </Flex>
                  </Flex>
                </>
              );
            })}
        </Flex>
      </ScrollArea>
    )
  );
}
