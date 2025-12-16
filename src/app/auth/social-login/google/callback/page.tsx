"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { API_BASE_URL } from "@/service/core";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setJwt } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Successfully logged with the provider
        // Now logging with strapi by using the access_token (given by the provider) in props.location.search
        const response = await fetch(
          `${API_BASE_URL}/auth/google/callback${window.location.search}`
        );
        if (!response.ok || response.status !== 200) {
          console.error("Couldn't login to Strapi. Status:", response.status);
          router.push("/?error=oauth_failed");
          return;
        }
        const data = await response.json();
        const accessToken = data.jwt;
        const userData = data.user;

        // Transform Strapi user to our User format
        const user = {
          id: String(userData.id),
          name: userData.username || userData.email?.split("@")[0] || "User",
          email: userData.email,
          picture: undefined, // Strapi doesn't provide picture by default
        };

        // Store user and JWT token
        setUser(user);
        setJwt(accessToken);

        // Redirect to home page
        router.push("/");
      } catch (error) {
        console.error("Callback error:", error);
        router.push("/?error=auth_failed");
      }
    };

    handleCallback();
  }, [searchParams, router, setUser, setJwt]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Completing login...</p>
      </div>
    </div>
  );
}
