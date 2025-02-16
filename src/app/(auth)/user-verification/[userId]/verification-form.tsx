'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { verifyUserSchema, VerifyUserSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { User } from "@prisma/client";
import { verifyUser } from "./action";
import { toast } from "@/hooks/use-toast";

interface VerificationFormProps{
  user:User
}
export default function VerificationForm({user}:VerificationFormProps){
    const form = useForm<VerifyUserSchema>(
        {
            resolver:zodResolver(verifyUserSchema),
            defaultValues:{
                email:user.email||'',
                name:user.name||'',
                telephone:user.telephone||'',
                username:user.username||''
            }
        }
    );

    async function onSubmit(input:VerifyUserSchema){
      try {
        await verifyUser(input)
      } catch (error) {
        console.error(error)
        toast({
          description:'Failed to verify user, please try again!',
          variant:'destructive'
        })
      }
    }

    return <Form {...form}>
<form onSubmit={form.handleSubmit(onSubmit)}
className="space-y-4">
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
        />  <FormField
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
        />  <FormField
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
      /> 
</form>
    </Form>
}