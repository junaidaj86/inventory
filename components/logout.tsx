'use client'
// Signout.js
import { signOut } from "next-auth/react";

export function Signout() {
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <button onClick={handleSignOut}>Sign Out</button>
  );
}
