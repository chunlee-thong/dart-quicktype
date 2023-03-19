import { User, signInAnonymously } from "@firebase/auth";
import { addDoc, collection, getDocs, query, where } from "@firebase/firestore";
import { create } from "zustand";
import { auth, db } from "../firebase";
import useGeneratorStore from "./generator.store";

export interface History {
  className: string;
  jsonString: string;
  output: string;
  projectId?: string | undefined;
  userId?: string | undefined;
}

interface HistoryState {
  data: History[];
  loading: boolean;
  init: (user: User | undefined | null) => void;
  save: (value: History) => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  data: [],
  loading: true,
  save: async (value: History) => {
    const user = auth.currentUser;
    var data = [...get().data];
    data.splice(0, 0, value);
    if (user != null) {
      var projectsRef = collection(db, "projects");
      addDoc(projectsRef, { ...value, userId: user.uid, projectId: "" });
    } else {
      var json = JSON.stringify(data);
      localStorage.setItem("history", json);
    }
    set({ data: data });
  },
  init: async (user) => {
    if (user == null) {
      await signInAnonymously(auth);
      return;
    }
    var data;
    if (user != null) {
      var projectsRef = collection(db, "projects");
      const q = query(projectsRef, where("userId", "==", user.uid));
      var res = await getDocs(q);
      data = res.docs.map((e) => e.data());
    } else {
      var result = localStorage.getItem("history") ?? "[]";
      data = JSON.parse(result);
    }

    set({ data: data, loading: false });
    if (data.length > 0) {
      var generator = useGeneratorStore.getState();
      generator.init(data[0]);
    }
  },
}));
