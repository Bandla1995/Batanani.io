import Image from "next/image";
import { SignUpButton, SignedOut, SignedIn,SignOutButton} from "@clerk/nextjs";
export default function Home() {
  return (
    <div>
      <h1>Home page</h1>
      <SignedOut>
        <SignUpButton mode="modal">Sign Up</SignUpButton>
        
      </SignedOut>

      <SignedIn>
        <SignOutButton> Logout </SignOutButton>
      </SignedIn>
    </div>
  );
}
