"use client";

import Login from "@/components/Login";
import Register from "@/components/Register";
import { useState } from "react";

export default function AuthPage() {
  const [tab, setTab] = useState("login");

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-background text-foreground text-sm transition-colors duration-300">
      <div className="w-[400px] flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-semibold text-twitter dark:text-white p-2">
          Mini Twitter
        </h1>
        <div className="p-4 mt-4">
          <div className="flex border-b border-border">
            <button
              onClick={() => setTab("login")}
              className={`w-1/2 font-semibold pb-2 border-b transition cursor-pointer
              ${
                tab === "login"
                  ? "border-(--color-twitter) text-(--color-twitter)"
                  : "border-transparent text-gray-500 hover:border-(--color-twitter) hover:text-(--color-twitter)"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setTab("register")}
              className={`w-1/2 font-semibold pb-2 border-b transition cursor-pointer
              ${
                tab === "register"
                  ? "border-(--color-twitter) text-(--color-twitter)"
                  : "border-transparent text-gray-500 hover:border-(--color-twitter) hover:text-(--color-twitter)"
              }`}
            >
              Cadastrar
            </button>
          </div>

          <div className="flex items-center">
            {tab === "login" ? <Login /> : <Register />}
          </div>
        </div>
      </div>
    </div>
  );
}
