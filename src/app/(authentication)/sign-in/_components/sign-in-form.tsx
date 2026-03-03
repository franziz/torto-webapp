"use client";

import React, { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { TextInput } from "@/core/presentations/components/text-input";
import { ErrorDisplay } from "@/core/presentations/components/error-display";

export function SignInForm() {
  const { signIn, isLoaded, setActive } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded || loading) return;

    setLoading(true);
    setError(null);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/home");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage ?? "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      {error && <ErrorDisplay>{error}</ErrorDisplay>}

      <TextInput
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={setEmail}
        required
      />

      <TextInput
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={setPassword}
        required
      />

      <FilledButton type="submit" loading={loading}>
        Sign In
      </FilledButton>
    </form>
  );
}
