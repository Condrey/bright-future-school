"use client";

import LoadingButton from "@/components/loading-button";
import { PasswordInput } from "@/components/password-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, LoginValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { login } from "./actions";

export default function LoginForm() {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    values: {
      username: "",
      password: "",
    },
  });
  async function onSubmit(values: LoginValues) {
    setError(undefined);
    const { error } = await login(values!);
    startTransition(() => {
      if (error) setError(error);
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {error && <p className="text-center text-destructive">{error}</p>}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="name goes here ..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  placeholder="Your password goes here ..."
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          loading={form.formState.isSubmitting}
          type="submit"
          className="w-full"
        >
          Log in
        </LoadingButton>
      </form>
    </Form>
  );
}
