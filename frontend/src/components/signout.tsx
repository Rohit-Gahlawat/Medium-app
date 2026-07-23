import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignOut() {
  const [signingout, setSigningOut] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    setSigningOut(true);
    localStorage.removeItem("token");
    localStorage.removeItem("name");

    setTimeout(() => {
      navigate("/signin");
    }, 500);
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={signingout}
      className="text-xs sm:text-sm text-gray-500 hover:text-gray-800 px-2 sm:px-3 py-1 rounded-full cursor-pointer whitespace-nowrap flex items-center gap-1.5 disabled:opacity-50"
      aria-label="Sign out"
    >
      {signingout ? (
        <>
          <div className="h-3.5 w-3.5 rounded-full border-2 border-gray-200 border-t-gray-600 animate-spin" />
          Signing out...
        </>
      ) : (
        "Sign out"
      )}
    </button>
  );
}
