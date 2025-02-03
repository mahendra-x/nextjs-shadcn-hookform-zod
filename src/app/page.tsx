"use client"; //client component

import { string, z } from "zod"; //imports from zod lib
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const formSchema = z
  .object({
    username: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .min(4, { message: "Minimum 4 characters required" })
      .superRefine((val, ctx) => {
        const trimmedVal = val.trim();

        if (!isNaN(Number(trimmedVal))) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Username cannot be a number",
          });
        }

        // Check for duplicate characters
        if (trimmedVal.length !== new Set(trimmedVal).size) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "No duplicate characters allowed",
          });
        }
      }),
    email: z.string().email(),
    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      .min(6, { message: "Password must be at least 6 characters long" }),

    cpassword: z.string({
      required_error: "Confirm password is required",
    }),
  })
  .refine((data) => data.password === data.cpassword, {
    message: "Passwords do not match",
    path: ["cpassword"],
  });

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      cpassword: "",
    },
  });

  const {
    formState: { errors },
  } = form;

  function onSubmit(values: z.infer<typeof formSchema>) {
    alert(JSON.stringify(values));
  }
  return (
    <div className="flex flex-col justify-center items-center min-h-screen justify-self-center bg-white rounded-lg shadow-md p-8">
      {/* <h1 className="text-3xl font-bold text-gray-800 w-max">Hello NextJs</h1> */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Welcome To Clover
        </h1>
        <p className="mb-4">Clover Forms</p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-[400px]"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage
                  className={!errors.username ? "text-green-500" : ""}
                />
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
                  <Input placeholder="shadcn" {...field} />
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
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-transparent"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </Button>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cpassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <div className="relative">
                  <Input
                    {...field}
                    type={showConfirmPassword ? "text" : "password"}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </Button>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
