import { Loader } from "@mantine/core";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
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
        <Loader className="flex flex-row justify-center align-items-center" />
      ) : (
        <div className="rounded bg-white flex-grow-1 overflow-scroll">
          {history.data.length == 0 ? (
            <h1 className="p-8 text-black text-center">Empty</h1>
          ) : (
            history.data.map((e) => {
              return (
                <div
                  className="cursor-pointer bg-white hover:bg-gray-50"
                  onClick={() => {
                    generator.init(e);
                  }}>
                  <div className="p-2 text-black text-md">{e.className}</div>
                  <hr></hr>
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
