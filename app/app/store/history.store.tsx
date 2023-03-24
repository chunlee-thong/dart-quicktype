import { User } from "@firebase/auth";
import { collection, getDocs, query, setDoc, where } from "@firebase/firestore";
import { CollectionReference, DocumentData, doc, updateDoc } from "firebase/firestore";
import { create } from "zustand";
import { auth, db } from "../firebase";
import useGeneratorStore from "./generator.store";

export interface History {
  className: string;
  jsonString: string;
  output: string;
  projectId?: string | undefined;
  userId?: string | undefined;
  active: boolean;
}

export interface Project {
  name: string;
  userId?: string | undefined;
}

interface HistoryState {
  delete(e: History): void;
  models: History[];
  projects: Project[];
  project: Project | null;
  loading: boolean;
  init: (user: User | undefined | null) => void;
  save: (value: History) => void;
  setProject: (value: string | null) => void;
  collectionRef: (name: string) => CollectionReference<DocumentData>;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  models: [],
  projects: [],
  project: null,
  loading: true,
  setProject: (p) => {},
  collectionRef: (name) => {
    const env = process.env.NODE_ENV;
    const table = env == "development" ? name + "_dev" : name;
    const projectsRef = collection(db, table);
    return projectsRef;
  },
  delete: async (value: History) => {
    const user = auth.currentUser;
    var data = [...get().models];
    const index = data.indexOf(value);
    data.splice(index, 1);
    if (user != null) {
      const docId = `${get().collectionRef("models").path}/${user.uid}-${value.className}`;
      updateDoc(doc(db, docId), {
        active: false,
      });
    } else {
      var json = JSON.stringify(data);
      localStorage.setItem("history", json);
    }
    set({ models: data });
  },
  save: async (value: History) => {
    const user = auth.currentUser;
    var data = [...get().models];
    var exist = data.find((e) => e.className == value.className);
    if (!exist) {
      data.splice(0, 0, value);
    }
    if (user != null) {
      const docId = `${get().collectionRef("models").path}/${user.uid}-${value.className}`;
      setDoc(doc(db, docId), {
        ...value,
        userId: user.uid,
        projectId: "",
        active: true,
      });
    } else {
      var json = JSON.stringify(data);
      localStorage.setItem("history", json);
    }
    set({ models: data });
  },
  init: async (user) => {
    var models;
    var projects: Project[];
    if (user != null) {
      const projectQuery = query(get().collectionRef("projects"), where("userId", "==", user.uid));
      projects = (await getDocs(projectQuery)).docs.map((e) => e.data() as Project);
      const q = query(
        get().collectionRef("models"),
        where("userId", "==", user.uid),
        where("active", "==", true)
      );
      models = (await getDocs(q)).docs.map((e) => e.data());
    } else {
      var result = localStorage.getItem("history") ?? "[]";
      models = JSON.parse(result);
      projects = [{ name: "Default", userId: "Default" }];
    }

    set({ models: models, loading: false, projects: projects });
    if (models.length > 0) {
      var generator = useGeneratorStore.getState();
      generator.init(models[0]);
    }
  },
}));
