import { GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
import { Button } from "@mantine/core";
import { auth } from "../firebase";

const GoogleSignInButton = () => {
  return (
    <Button
      variant="filled"
      className="mt-4 bg-red-500"
      color="red"
      onClick={async () => {
        const provider = new GoogleAuthProvider();
        const user = await signInWithPopup(auth, provider);
        console.log(user);
      }}>
      Login with Google
    </Button>
  );
};

export default GoogleSignInButton;
