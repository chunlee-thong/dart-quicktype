import { GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
import { Button } from "@mantine/core";
import { logEvent } from "firebase/analytics";
import { analytics, auth } from "../firebase";

const GoogleSignInButton = () => {
  return (
    <Button
      variant="filled"
      className="mt-4 bg-red-500"
      color="red"
      onClick={async () => {
        const provider = new GoogleAuthProvider();
        const user = await signInWithPopup(auth, provider);
        logEvent(analytics, "login", {
          provider: "google",
        });
        console.log(user);
      }}>
      Login with Google
    </Button>
  );
};

export default GoogleSignInButton;
