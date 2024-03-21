"use client";
import { signOut } from "@firebase/auth";
import { Avatar, Button, Checkbox, Paper, SimpleGrid } from "@mantine/core";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import useSettingStore from "../store/setting.store";
import GoogleSignInButton from "./google_sign_in";

const Setting = () => {
  const store = useSettingStore();
  const [user, loading] = useAuthState(auth);

  return (
    <div className="mb-4">
      <hr className="mb-4"></hr>
      <SimpleGrid cols={2} spacing={8}>
        <Checkbox
          label="Generate toJSON method"
          checked={store.setting.generateToJson}
          onChange={(e) => {
            store.updateValue({
              ...store.setting,
              generateToJson: e.target.checked,
            });
          }}
        />
        <Checkbox
          label="Use JSONSerializable"
          checked={store.setting.useSerializable}
          onChange={(e) => {
            store.updateValue({
              ...store.setting,
              useSerializable: e.target.checked,
            });
          }}
        />
        <Checkbox
          label="Generate copyWith method"
          checked={store.setting.generateCopyWith}
          onChange={(e) => {
            store.updateValue({
              ...store.setting,
              generateCopyWith: e.target.checked,
            });
          }}
        />
        <Checkbox
          label="Use Equatable"
          checked={store.setting.useEquatable}
          onChange={(e) => {
            store.updateValue({
              ...store.setting,
              useEquatable: e.target.checked,
            });
          }}
        />
        <Checkbox
          label="Generate toString method"
          checked={store.setting.generateToString}
          onChange={(e) => {
            store.updateValue({
              ...store.setting,
              generateToString: e.target.checked,
            });
          }}
        />
        <Checkbox
          label="Use default value"
          checked={store.setting.useDefaultValue}
          onChange={(e) => {
            store.updateValue({
              ...store.setting,
              useDefaultValue: e.target.checked,
            });
          }}
        />
        <Checkbox
          label="Generate JSON keys"
          checked={store.setting.generateKey}
          onChange={(e) => {
            store.updateValue({
              ...store.setting,
              generateKey: e.target.checked,
            });
          }}
        />
        <Checkbox
          label="Generate json as comment"
          checked={store.setting.generateJsonComment}
          onChange={(e) => {
            store.updateValue({
              ...store.setting,
              generateJsonComment: e.target.checked,
            });
          }}
        />
        <Checkbox
          label="Always use num type for number"
          checked={store.setting.useNum}
          onChange={(e) => {
            store.updateValue({
              ...store.setting,
              useNum: e.target.checked,
            });
          }}
        />
      </SimpleGrid>
      <hr className="my-8"></hr>
      {user == null ? (
        <GoogleSignInButton />
      ) : (
        <Paper radius="md" withBorder p="lg">
          <Avatar src={user.photoURL} size={120} radius={120} mx="auto" />
          <p>{user.displayName}</p>
          <p>{user.email ?? "Anonymous"}</p>

          {user.isAnonymous ? (
            <GoogleSignInButton />
          ) : (
            <Button
              variant="filled"
              fullWidth
              className="mt-4 bg-red-500"
              color="red"
              onClick={() => signOut(auth)}>
              Logout
            </Button>
          )}
        </Paper>
      )}
      <p className="my-8">Version: 3.3.0</p>
    </div>
  );
};

export default Setting;
