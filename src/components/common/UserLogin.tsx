"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuthStore } from "@/lib/stores/authStore";
import LoginPopup from "./LoginPopup";

export default function UserLogin() {
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setIsLoginPopupOpen(true);
    } else {
      // User is logged in - you can navigate to profile page or show user menu
      // For now, we'll just show the popup again (you can change this behavior)
      // window.location.href = "/profile";
    }
  };

  return (
    <>
      <button onClick={handleClick} className="p-1" aria-label="User account">
        {isAuthenticated && user?.picture ? (
          <Image
            priority
            src={user.picture}
            height={22}
            width={22}
            alt={user.name || "User"}
            className="max-w-[22px] max-h-[22px] rounded-full"
          />
        ) : (
          <Image
            priority
            src="/icons/user.svg"
            height={100}
            width={100}
            alt="user"
            className="max-w-[22px] max-h-[22px]"
          />
        )}
      </button>
      <LoginPopup open={isLoginPopupOpen} onOpenChange={setIsLoginPopupOpen} />
    </>
  );
}
