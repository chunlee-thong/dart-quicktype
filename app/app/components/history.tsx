import { ActionIcon, Loader } from "@mantine/core";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Trash } from "tabler-icons-react";
import { auth } from "../firebase";
import useGeneratorStore from "../store/generator.store";
import { useHistoryStore } from "../store/history.store";
import Title from "./title";

const History = () => {
  const history = useHistoryStore();
  const generator = useGeneratorStore();
  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    if (!loading) {
      history.init(user);
    }
  }, [user, loading]);
  return (
    <div className="flex flex-col h-[88vh]">
      <Title title="History" />
      {loading || history.loading ? (
        <Loader className="p-8 text-black text-center" />
      ) : (
        <div className="rounded bg-white flex-grow-1 overflow-scroll">
          {history.data.length == 0 ? (
            <h1 className="p-8 text-blue-500 text-center text-sm">No data!</h1>
          ) : (
            history.data.map((e) => {
              return (
                <div key={e.className} className="cursor-pointer bg-white hover:bg-blue-200">
                  <div className="px-4 py-1.5 text-black text-md flex flex-row justify-between">
                    <p onClick={() => generator.init(e)} className="flex-grow font-semibold">
                      {e.className}
                    </p>
                    <ActionIcon onClick={() => history.delete(e)}>
                      <Trash className="text-red-400" />
                    </ActionIcon>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default History;
