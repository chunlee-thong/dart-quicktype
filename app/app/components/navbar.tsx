"use client";

import { Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import Setting from "./setting";

export default function Navbar() {
  const [user, loading] = useAuthState(auth);
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <nav className="flex sm:flex-row text-center sm:text-left sm:justify-between bg-black py-4 px-4 w-full">
      <div>
        <a href="/" className="text-2xl font-semibold no-underline text-white mr-8">
          Dart Quicktype
        </a>
      </div>
      <div>
        <a
          href="https://github.com/chunlee-thong/dart-quicktype"
          target="_blank"
          className="text-lg no-underline text-white mr-8">
          Github
        </a>
        <a
          href="https://quicktype.io/"
          target="_blank"
          className="text-lg no-underline text-white  mr-4">
          Quicktype
        </a>
        <Button className="text-lg no-underline text-white" onClick={open} variant="filled">
          Setting
        </Button>
      </div>
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size={500}
        title="Settings"
        styles={{
          title: {
            fontSize: "1.5rem",
            fontWeight: "bold",
          },
        }}
        overlayProps={{ opacity: 0.5, blur: 4 }}>
        {<Setting />}
      </Drawer>
    </nav>
  );
}
