import { ActionIcon, Loader, Select } from "@mantine/core";
import { event } from "nextjs-google-analytics";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { IoTrashBinOutline } from "react-icons/io5";
import { auth } from "../firebase";
import useGeneratorStore from "../store/generator.store";
import { Project, useHistoryStore } from "../store/history.store";
import Title from "./title";

const History = () => {
  const history = useHistoryStore();
  const generator = useGeneratorStore();
  const [user, loading, error] = useAuthState(auth);

  const onSaveProject = (projectName: string) => {
    var project: Project = {
      name: projectName,
      userId: user?.uid,
      id: `${user!.uid}-${projectName}`,
    };
    history.saveProject(project);
  };

  useEffect(() => {
    if (!loading) {
      history.init(user);
    }
  }, [user, loading, history.project]);
  return (
    <div className="flex flex-col h-[88vh]">
      <Title title="History" />
      {loading || history.loading ? (
        <Loader
          color="teal"
          className="flex flex-row justify-center align-items-center w-100 text-center ml-24"
        />
      ) : (
        <>
          {user && (
            <Select
              placeholder="Project"
              className="mb-4"
              creatable
              searchable
              getCreateLabel={(query) => `+ Create ${query}`}
              onCreate={(query) => {
                const item = { value: query, label: query };
                event("create_project");
                onSaveProject(query);
                return item;
              }}
              value={history.project?.name}
              onChange={history.setProject}
              size="sm"
              data={history.projects.map((e) => {
                return { value: e.name, label: e.name };
              })}
            />
          )}
          <div className="rounded bg-white flex-grow-1 overflow-scroll">
            {history.models.length == 0 ? (
              <h1 className="p-8 text-red-500 text-center text-sm">No data!</h1>
            ) : (
              history.models.map((e) => {
                var selected = e.className == generator.className;
                return (
                  <div
                    key={e.className}
                    className={`cursor-pointer hover:bg-blue-100 ${
                      selected ? "bg-blue-300" : "bg-white"
                    }`}
                    onClick={() => generator.init(e)}>
                    <div className="px-4 py-1.5 text-black text-md flex flex-row justify-between">
                      <p className="flex-grow font-semibold">{e.className}</p>
                      <ActionIcon onClick={() => history.delete(e)}>
                        <IoTrashBinOutline className="text-red-400" />
                      </ActionIcon>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default History;
