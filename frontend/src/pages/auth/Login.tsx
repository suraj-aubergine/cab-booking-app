import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/useToast";
import { useAuthStore } from "@/stores/useAuthStore";
import { UserRole } from "@/types/auth";
import { BackgroundBeams } from "@/components/ui/background-beams";
import React from "react";
import { BackgroundImage } from "@/components/ui/background-image";
import { AbstractBackground } from "@/components/ui/abstract-background";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const token = useAuthStore((state) => state.token);

  // Redirect if already logged in
  React.useEffect(() => {
    if (token) {
      navigate('/app');
    }
  }, [token, navigate]);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const login = useMutation({
    mutationFn: async (data: LoginForm) => {
      try {
        const response = await api.post("/auth/login", data);
        if (!response.data?.data?.token) {
          throw new Error("Invalid response from server");
        }
        return response.data.data;
      } catch (error: any) {
        // Handle different types of errors
        if (error.response?.status === 401) {
          throw new Error("Invalid email or password");
        } else if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        } else {
          throw new Error("Failed to login. Please try again.");
        }
      }
    },
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user);
      toast({
        title: "Welcome back!",
        description: "Successfully logged in",
      });
      
      // Redirect based on user role
      switch (data.user.role) {
        case UserRole.ADMIN:
          navigate("/app/admin");
          break;
        case UserRole.DRIVER:
          navigate("/app/driver");
          break;
        default:
          navigate("/app");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  function onSubmit(data: LoginForm) {
    login.mutate(data);
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative isolate overflow-hidden">
      <AbstractBackground />
      <BackgroundImage />
      <BackgroundBeams />
      
      <div className="w-full max-w-md p-8 space-y-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-200/50 dark:border-gray-700/50 relative z-10">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
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
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={login.isPending}
            >
              {login.isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link
            to="/register"
            className="text-primary hover:underline font-medium"
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
} 