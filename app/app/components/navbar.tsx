"use client";

import { ActionIcon, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAuthState } from "react-firebase-hooks/auth";
import { IoMenu } from "react-icons/io5";
import { auth } from "../firebase";
import Setting from "./setting";

export default function Navbar() {
  const [user, loading] = useAuthState(auth);
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <nav className="flex sm:flex-row text-center sm:text-left sm:justify-between bg-black py-2 px-4 w-full">
      <div>
        <a href="/" className="text-2xl font-semibold no-underline text-white mr-8">
          {`Dart Quicktype`}
        </a>
      </div>
      <div className="flex flex-row">
        <a
          href="https://github.com/chunlee-thong/dart-quicktype"
          target="_blank"
          className="text-lg no-underline font-medium text-white mr-4 hover:bg-blue-400 p-2 rounded-md">
          Github
        </a>
        <a
          href="https://quicktype.io/"
          target="_blank"
          className="text-lg no-underline font-medium text-white mr-4 hover:bg-blue-400 p-2 rounded-md">
          Quicktype
        </a>
        <ActionIcon className="hover:bg-blue-400 rounded-md" size={"xl"} onClick={open}>
          <IoMenu size={24} />
        </ActionIcon>
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
