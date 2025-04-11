"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { register as registerUser } from "../store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordStrengthText, setPasswordStrengthText] = useState("");

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Function to evaluate password strength
  const evaluatePasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordStrengthText("");
      return;
    }

    let strength = 0;

    // Length check
    if (password.length >= 6) strength += 20;
    if (password.length >= 10) strength += 10;

    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 20; // Has uppercase
    if (/[a-z]/.test(password)) strength += 15; // Has lowercase
    if (/[0-9]/.test(password)) strength += 15; // Has number
    if (/[^A-Za-z0-9]/.test(password)) strength += 20; // Has special char

    // Update strength text
    let strengthText = "";
    if (strength < 30) strengthText = "Very Weak";
    else if (strength < 50) strengthText = "Weak";
    else if (strength < 70) strengthText = "Medium";
    else if (strength < 90) strengthText = "Strong";
    else strengthText = "Very Strong";

    setPasswordStrength(strength);
    setPasswordStrengthText(strengthText);
  };

  // Watch for password changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "password") {
        evaluatePasswordStrength(value.password || "");
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const { name, email, password } = data;
      await dispatch(registerUser({ name, email, password }) as any);
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressColor = () => {
    if (passwordStrength < 30) return "bg-destructive";
    if (passwordStrength < 50) return "bg-orange-500";
    if (passwordStrength < 70) return "bg-yellow-500";
    if (passwordStrength < 90) return "bg-green-500";
    return "bg-green-600";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-primary">TaskMaster</CardTitle>
          <CardDescription>Create an account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
                      <Input placeholder="email@example.com" {...field} />
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
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    {field.value && (
                      <div className="mt-2 space-y-1">
                        <Progress value={passwordStrength} className="h-1">
                          <div className={`h-full transition-all ${getProgressColor()}`} style={{ width: `${passwordStrength}%` }} />
                        </Progress>
                        <p className="text-xs text-muted-foreground">
                          Password strength: <span className="font-medium">{passwordStrengthText}</span>
                        </p>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
