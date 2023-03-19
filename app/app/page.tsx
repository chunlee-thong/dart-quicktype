"use client";
import { Grid } from "@mantine/core";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import History from "./components/history";
import Navbar from "./components/navbar";
import useSettingStore from "./store/setting.store";

const Editor = dynamic(() => import("./components/editor"), {
  ssr: false,
});

const Output = dynamic(() => import("./components/output"), {
  ssr: false,
});

export default function Home() {
  var store = useSettingStore();
  useEffect(() => {
    console.log(process.env);
    store.init();
  }, []);
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="px-4 py-2">
        <Grid className="h-screen">
          <Grid.Col span={2}>
            <History />
          </Grid.Col>
          <Grid.Col span={5}>
            <Editor />
          </Grid.Col>
          <Grid.Col span={5}>
            <Output />
          </Grid.Col>
        </Grid>
      </div>
    </div>
  );
}
