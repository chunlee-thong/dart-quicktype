import { User } from "@firebase/auth";
import { collection, getDocs, query, setDoc, where } from "@firebase/firestore";
import { CollectionReference, DocumentData, deleteDoc, doc } from "firebase/firestore";
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
  delete(e: History): void;
  data: History[];
  loading: boolean;
  init: (user: User | undefined | null) => void;
  save: (value: History) => void;
  collectionRef: () => CollectionReference<DocumentData>;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  data: [],
  loading: true,
  collectionRef: () => {
    const env = process.env.NODE_ENV;
    console.log(env);
    const table = env == "development" ? "projects_dev" : "projects";
    const projectsRef = collection(db, table);
    return projectsRef;
  },
  delete: async (value: History) => {
    const user = auth.currentUser;
    var data = [...get().data];
    const index = data.indexOf(value);
    data.splice(index, 1);
    if (user != null) {
      const projectId = `${get().collectionRef().path}/${user.uid}-${value.className}`;
      deleteDoc(doc(db, projectId));
    } else {
      var json = JSON.stringify(data);
      localStorage.setItem("history", json);
    }
    set({ data: data });
  },
  save: async (value: History) => {
    const user = auth.currentUser;
    var data = [...get().data];
    var exist = data.find((e) => e.className == value.className);
    if (!exist) {
      data.splice(0, 0, value);
    }
    if (user != null) {
      const projectId = `${get().collectionRef().path}/${user.uid}-${value.className}`;
      setDoc(doc(db, projectId), {
        ...value,
        userId: user.uid,
        projectId: "",
      });
    } else {
      var json = JSON.stringify(data);
      localStorage.setItem("history", json);
    }
    set({ data: data });
  },
  init: async (user) => {
    var data;
    if (user != null) {
      const q = query(get().collectionRef(), where("userId", "==", user.uid));
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
