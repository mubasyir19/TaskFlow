"use client";

import SignIn from "@/components/Auth/SignIn";
import SignUp from "@/components/Auth/SignUp";
import Image from "next/image";
import { useState } from "react";

const tabs = [
  {
    name: "signin",
    label: "Sign In",
  },
  {
    name: "register",
    label: "Register",
  },
];

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("signin");

  const handleClikTab = (name: string) => {
    setActiveTab(name);
  };

  const handleRegisterSuccess = () => {
    setActiveTab("signin");
  };

  const renderTab = () => {
    switch (activeTab) {
      case "signin":
        return <SignIn />;
      case "register":
        return <SignUp onSuccess={handleRegisterSuccess} />;
      default:
        return <SignIn />;
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="bg-cream hidden h-full w-full py-6 md:block md:py-8 lg:py-16 xl:py-24">
        <div className="flex h-full flex-col justify-between lg:mx-auto lg:w-3/4 xl:w-1/2">
          <div className="space-y-2">
            <h1 className={`text-secondary text-3xl font-bold`}>TaskFlow</h1>
            <p className="text-base text-black italic">
              Organize your day, achieve more
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-primary/5 h-96 w-full border border-[#BFC9C1] p-6">
              <Image
                src={`/images/auth.png`}
                width={500}
                height={500}
                alt="auth"
                loading="eager"
                className="h-full w-full object-cover object-bottom"
              />
            </div>
            <p className="text-lg text-black italic">
              &quot;Simplicity is the ultimate sophistication.&quot; — <br />{" "}
              Leonardo da Vinci
            </p>
          </div>
          <div className="">
            <p className="text-xs text-black uppercase">
              EST. 2026 &copy; TaskFlow Quiet Productivity
            </p>
          </div>
        </div>
      </div>
      <div className="h-full w-full bg-white p-6 md:py-8 lg:mx-auto lg:w-3/4 lg:py-16 xl:w-1/2">
        <div className="grid w-full grid-cols-2">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => handleClikTab(tab.name)}
              className={`cursor-pointer border-b-2 px-4 py-4 text-center font-medium ${activeTab === tab.name ? "border-secondary" : "border-gray-300"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center">
          {renderTab()}
        </div>
      </div>
    </div>
  );
}
