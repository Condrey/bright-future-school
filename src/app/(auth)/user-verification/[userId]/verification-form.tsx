"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { verifyUserSchema, VerifyUserSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { User } from "@prisma/client";
import { verifyUser } from "./action";
import { toast } from "@/hooks/use-toast";
import LoadingButton from "@/components/loading-button";
import { useTransition } from "react";
import { PasswordInput } from "@/components/password-input";

interface VerificationFormProps {
  user: User;
}
export default function VerificationForm({ user }: VerificationFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<VerifyUserSchema>({
    resolver: zodResolver(verifyUserSchema),
    defaultValues: {
      email: user.email || "",
      name: user.name || "",
      telephone: user.telephone || "",
      username: user.username || "",
      password: '',
      id: user.id || "",
    },
  });

  function onSubmit(input: VerifyUserSchema) {
    try {
      startTransition(() => {
        verifyUser(input);
      });
    } catch (error) {
      console.error(error);
      toast({
        description: "Failed to verify user, please try again!",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="enter your full name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="username goes here ..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Please enter an email ..."
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <FormField
          control={form.control}
          name="telephone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telephone</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="include your telephone number too"
                  type="tel"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />  <FormField
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
        <LoadingButton className="w-full" loading={isPending}>
          Continue
        </LoadingButton>
      </form>
    </Form>
  );
}
