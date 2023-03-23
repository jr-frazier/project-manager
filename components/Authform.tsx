"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { register, signin } from "@/lib/api";

import Link from "next/link";
import Button from "./Button";
import Card from "./Card";
import Input from "./Input";

type FormContent = {
  linkurl: string;
  linkText: string;
  header: string;
  subheader: string;
  buttonText: string;
};

type FormFields = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

const registerContent: FormContent = {
  linkurl: "/signin",
  linkText: "Already have an account?",
  header: "Create a new account",
  subheader: "Just a few things to get started",
  buttonText: "Register",
};

const signinContent: FormContent = {
  linkurl: "/register",
  linkText: "Don't have an account?",
  header: "Welcome back!",
  subheader: "Enter your credentials to continue",
  buttonText: "Sign in",
};

const initial: FormFields = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
};

const AuthForm = ({ mode }: { mode: "signin" | "register" }) => {
  const [formState, setFormState] = useState(initial);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (mode === "register") {
      await register(formState);
    } else {
      await signin(formState);
    }

    setFormState(initial);

    // prevents user from going back to auth page
    router.replace("/home");
  };

  const content = mode === "register" ? registerContent : signinContent;

  return (
    <Card>
      <div className="w-full">
        <div className="text-center">
          <h2 className="text-3xl mb-2">{content.header}</h2>
          <p className="tex-lg text-black/25">{content.subheader}</p>
        </div>
        <form onSubmit={handleSubmit} className="py-10 w-full">
          {mode === "register" && (
            <div className="flex mb-8 justify-between">
              <div className="pr-2">
                <div className="text-lg mb-4 ml-2 text-black/50">
                  First Name
                </div>
                <Input
                  required
                  placeholder="First Name"
                  value={formState.firstName}
                  className="border-solid border-gray border-2 px-6 py-2 text-lg rounded-3xl w-full"
                  onChange={
                    (e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormState((s) => ({ ...s, firstName: e.target.value })) // TODO: Add Immer
                  }
                />
              </div>
              <div className="pl-2">
                <div className="text-lg mb-4 ml-2 text-black/50">Last Name</div>
                <Input
                  required
                  placeholder="Last Name"
                  value={formState.lastName}
                  className="border-solid border-gray border-2 px-6 py-2 text-lg rounded-3xl w-full"
                  onChange={
                    (e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormState((s) => ({ ...s, lastName: e.target.value })) // TODO: Add Immer
                  }
                />
              </div>
            </div>
          )}
          <div className="mb-8">
            <div className="text-lg mb-4 ml-2 text-black/50">Email</div>
            <Input
              required
              type="email"
              placeholder="Email"
              value={formState.email}
              className="border-solid border-gray border-2 px-6 py-2 text-lg rounded-3xl w-full"
              onChange={
                (e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormState((s) => ({ ...s, email: e.target.value })) // TODO: Add Immer
              }
            />
          </div>
          <div className="mb-8">
            <div className="text-lg mb-4 ml-2 text-black/50">Password</div>
            <Input
              required
              value={formState.password}
              type="password"
              placeholder="Password"
              className="border-solid border-gray border-2 px-6 py-2 text-lg rounded-3xl w-full"
              onChange={
                (e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormState((s) => ({ ...s, password: e.target.value })) // TODO: Add Immer
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span>
                <Link
                  href={content.linkurl}
                  className="text-blue-600 font-bold mr-10"
                >
                  {content.linkText}
                </Link>
              </span>
            </div>
            <div>
              <Button typeof="submit" intent="secondary">
                {content.buttonText}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default AuthForm;
