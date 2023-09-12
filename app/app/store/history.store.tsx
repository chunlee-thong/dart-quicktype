import { collection, getDocs, query, setDoc, where } from "@firebase/firestore";
import { User } from "firebase/auth";
import { CollectionReference, DocumentData, and, deleteDoc, doc, or } from "firebase/firestore";
import { create } from "zustand";
import { auth, db } from "../firebase";
import { ClassOption } from "../generator";
import useGeneratorStore from "./generator.store";

export interface History {
  id: string | null | undefined;
  className: string;
  jsonString: string;
  output: string;
  options: ClassOption;
  projectId?: string | undefined;
  userId?: string | undefined;
  active: boolean;
}

export interface Project {
  id: string;
  name: string;
  userId?: string | undefined;
}

interface HistoryState {
  delete(e: History): void;
  models: History[];
  projects: Project[];
  project: Project | null;
  loading: boolean;
  init: (user: User | null | undefined) => void;
  saveHistory: (value: History) => void;
  saveProject: (value: Project) => void;
  setProject: (value: string | null) => void;
  collectionRef: (name: string) => CollectionReference<DocumentData>;
  update: (data: Partial<HistoryState>) => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  models: [],
  projects: [],
  project: null,
  loading: true,
  setProject: (name) => {
    var project: Project | undefined = get().projects.find((p) => p.name === name);
    set({
      project: project,
    });
    localStorage.setItem("project", name!);
  },
  saveProject: (p) => {
    set({
      projects: [...get().projects, p],
    });
    get().setProject(p.name);
    const user = auth.currentUser;
    if (user != null) {
      const docId = `${get().collectionRef("projects").path}/${p.id}`;
      setDoc(doc(db, docId), p);
    }
  },
  update: (data: Partial<HistoryState>) => {
    set({
      ...data,
    });
  },
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
      const docId = `${get().collectionRef("models").path}/${value.id}`;
      deleteDoc(doc(db, docId));
    } else {
      var json = JSON.stringify(data);
      localStorage.setItem("histories", json);
    }
    set({ models: data });
  },
  saveHistory: async (value: History) => {
    const user = auth.currentUser;
    value.id = value.id ?? doc(get().collectionRef("models")).id;
    var data = [...get().models];
    var exist = data.find((e) => e.className == value.className);
    console.log(value);
    if (!exist) {
      data.splice(0, 0, value);
    } else {
      const index = data.findIndex((e) => e.className == value.className);
      data[index] = value;
    }
    value.projectId = get().project?.name ?? "";
    if (user != null) {
      const path = get().collectionRef("models").path + "/" + value.id;
      setDoc(doc(db, path), {
        ...value,
        userId: user.uid,
        active: true,
      });
    } else {
      var json = JSON.stringify(data);
      localStorage.setItem("histories", json);
    }
    set({ models: data });
  },
  init: async () => {
    set({ loading: true });
    var models: History[];
    const user = auth.currentUser;
    var projects: Project[];
    if (user != null) {
      const projectQuery = query(get().collectionRef("projects"), where("userId", "==", user.uid));
      projects = (await getDocs(projectQuery)).docs.map((e) => e.data() as Project);
      const q = query(
        get().collectionRef("models"),
        and(
          where("userId", "==", user.uid),
          where("active", "==", true),
          or(where("projectId", "==", get().project?.name ?? ""), where("projectId", "==", ""))
        )
      );
      models = (await getDocs(q)).docs.map((e) => {
        var model: History;
        const { className, active, jsonString, output, projectId, userId, options } = e.data();
        model = {
          id: e.id,
          className,
          active,
          jsonString,
          ///New field in 3.0.0
          options: options ?? { ignoreClasses: "", headers: "" },
          output,
          userId,
          projectId,
        };
        return model;
      });
    } else {
      var historiesJson = localStorage.getItem("histories") ?? "[]";
      var projectsJson = localStorage.getItem("projects") ?? "[]";
      models = JSON.parse(historiesJson);
      models = models.filter(
        (m) => m.projectId == "" || m.projectId == (get().project?.name ?? "")
      );
      projects = JSON.parse(projectsJson);
    }

    set({ models: models, loading: false, projects: projects });
    if (models.length > 0) {
      var generator = useGeneratorStore.getState();
      generator.init(models[0]);
    }
    if (projects.length > 0) {
      var saved = localStorage.getItem("project");
      var p = projects.find((e) => e.name == saved);
      set({
        project: get().project ?? p ?? projects[0],
      });
    }

    set({ loading: false });
  },
}));
