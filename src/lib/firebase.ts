import {
  FieldValue,
  Query,
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  QuerySnapshot,
  Unsubscribe,
} from "firebase/firestore";
import type { FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { SetStateAction } from "react";

const config: FirebaseOptions = {
  apiKey: "AIzaSyAAdgHSm6OCb46JG9ZSu6f6WciJ4YVOfXU",
  authDomain: "footballkit-dd035.firebaseapp.com",
  projectId: "footballkit-dd035",
  storageBucket: "footballkit-dd035.appspot.com",
  messagingSenderId: "212353833653",
  appId: "1:212353833653:web:032d0847cf0f729246fcfc",
};

const app = initializeApp(config);

export const firestore = getFirestore(app);

export const auth = getAuth(app);

export interface User {
  uid: string;
  displayName: string;
}

export interface Event {
  player: string;
  action: Action;
  date: string;
}
export enum Action {
  Left = -1,
  Joined = 1,
}
export enum Role {
  Owner = 1,
  Moderator = 2,
}

export enum Visibility {
  Private = "-1",
  Public = "1",
}

export enum PlayerCount {
  Low = "12",
  Medium = "20",
  High = "30",
}

export interface Match {
  visibility: Visibility;
  players: PlayerCount;
}

const createMatch = (data: Match) => {
  return addDoc(collection(firestore, "activeMatches"), {
    players: parseInt(data.players),
    visibility: parseInt(data.visibility),
    date: new Date(),
  });
};

const createUser = (displayName: string, uid: string) => {
  return setDoc(doc(firestore, "users", uid), {
    displayName,
    matches: 0,
  });
};

const handlePlayerInteraction = async (
  player: string,
  matchId: string,
  updateCallback: typeof arrayUnion | typeof arrayRemove,
  action: Action
) => {
  await updateDoc(doc(firestore, "activeMatches", "UgsGuKQ5EB2dV4VoIk7B"), {
    players: updateCallback(player),
  });
  await addDoc(collection(firestore, "activeMatches", matchId, "activity"), {
    player,
    action,
    date: serverTimestamp(),
  });
};

const addPlayer = (player: string, matchId: string) =>
  handlePlayerInteraction(player, matchId, arrayUnion, Action.Joined);
const removePlayer = (player: string, matchId: string) =>
  handlePlayerInteraction(player, matchId, arrayRemove, Action.Left);

const getLatestMatch = async (setMatch: any, setLoading: any) => {
  const unsubscribe = onSnapshot(
    doc(firestore, "activeMatches", "UgsGuKQ5EB2dV4VoIk7B"),
    (doc) => {
      const match = doc.data();
      setMatch(match);
      setLoading(false);
    }
  );
  return unsubscribe;
};
const getLatestMatchActivity = async (setActivity: any, setLoading: any) => {
  const unsubscribe = onSnapshot(
    collection(firestore, "activeMatches", "UgsGuKQ5EB2dV4VoIk7B", "activity"),
    (snapshot) => {
      const activity: Event[] = [];
      snapshot.forEach((doc) => {
        activity.push({
          ...(doc.data() as Event),
          date: doc.data().date.toDate(),
        });
      });
      setActivity(activity);
      setLoading(false);
    }
  );
  return unsubscribe;
};
export {
  createMatch,
  createUser,
  getLatestMatch,
  getLatestMatchActivity,
  addPlayer,
  removePlayer,
};
