"use client"; //client component

import { z } from "zod"; //imports from zod lib
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import clsx from "clsx";

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

    cpassword: z
      .string({
        required_error: "Confirm password is required",
      })
      .min(6, { message: "Password must be at least 6 characters long" }),
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
  console.log("form.formState", form.formState);
  console.log("Dirty field", form.formState.dirtyFields);
  console.log("touch fields", form.formState.touchedFields);
  console.log("GET:::", form.formState.isValid);

  function onSubmit(values: z.infer<typeof formSchema>) {
    alert(JSON.stringify(values));
  }

  const getValidationColor = (
    fieldName: keyof typeof form.formState.touchedFields
  ) => {
    if (
      form.formState.touchedFields[fieldName] &&
      !form.formState.errors[fieldName] &&
      form.formState.dirtyFields[fieldName] &&
      form.formState.isSubmitted
    ) {
      return "text-green-500"; // Valid state
    } else if (form.formState.errors[fieldName]) {
      return "text-red-500"; // Error state
    }
    return "text-gray-500"; // Default state
  };

  const getValidationClass = (
    fieldName: keyof typeof form.formState.touchedFields
  ) => {
    if (
      form.formState.touchedFields[fieldName] &&
      !form.formState.errors[fieldName] &&
      form.formState.dirtyFields[fieldName] &&
      form.formState.isSubmitted
    ) {
      return "focus-visible:ring-green-400"; // Valid state
    } else if (form.formState.errors[fieldName]) {
      return "focus-visible:ring-red-400"; // Error state
    }
    return "focus-visible:ring-gray-800"; // Default state
  };

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
                  <Input
                    placeholder="shadcn"
                    {...field}
                    className={clsx("pr-10", getValidationClass("username"))}
                  />
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
                  <Input
                    placeholder="shadcn"
                    {...field}
                    className={clsx("pr-10", getValidationClass("email"))}
                  />
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
                    className={clsx("pr-10", getValidationClass("password"))}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-transparent"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff
                        className={clsx(
                          "w-5 h-5",
                          getValidationColor("password")
                        )}
                      />
                    ) : (
                      <Eye
                        className={clsx(
                          "w-5 h-5",
                          getValidationColor("password")
                        )}
                      />
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
                    className={clsx(
                      "pr-10 ", // Default border color
                      // form.formState.touchedFields.cpassword &&
                      //   !form.formState.errors.cpassword &&
                      //   form.formState.dirtyFields.cpassword &&
                      //   form.formState.isSubmitted
                      //   ? "focus-visible:ring-green-400"
                      //   : form.formState.errors.cpassword
                      //   ? "focus-visible:ring-red-400"
                      //   : "focus-visible:ring-gray-800" // Keep default border when untouched
                      getValidationClass("cpassword")
                    )}
                  />
                  {/* <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff
                        className={clsx(
                          "w-5 h-5",
                          getValidationColor("cpassword")
                        )}
                      />
                    ) : (
                      <Eye
                        className={clsx(
                          "w-5 h-5",
                          getValidationColor("cpassword")
                        )}
                      />
                    )}
                  </Button> */}
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("password") &&
            form.watch("cpassword") &&
            !form.formState.errors.cpassword &&
            form.watch("password") === form.watch("cpassword") && (
              <p className="text-green-600 text-sm">✅ Password Matched</p>
            )}

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
