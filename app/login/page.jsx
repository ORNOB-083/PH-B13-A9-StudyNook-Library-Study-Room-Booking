"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import {
    Button,
    Card,
    Description,
    FieldError,
    Form,
    Input,
    Label,
    TextField,
} from "@heroui/react";
import { GrGoogle } from "react-icons/gr";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
export default function SignInPage() {
    const router = useRouter();

    const onSubmit = async (e) => {
        e.preventDefault();

        const email = e.target.email.value;
        const password = e.target.password.value;

        console.log("Login attempt:", { email, password });

        try {
            const { data, error } = await authClient.signIn.email({
                email,
                password,
                callbackURL: "/",
            });

            console.log({ data, error });

            if (!error) {
                toast.success("✅ Welcome back!");
            } else {
                toast.error(error.message || "Login failed. Please check your credentials.");
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            toast.error("Something went wrong. Please try again later.");
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await authClient.signIn.social({
                provider: "google",
            });
            toast.success("✅ Signed in with Google!");
        } catch (err) {
            console.error("Google sign-in error:", err);
            toast.error("Google sign-in failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-[#1a2438] flex items-center justify-center py-10 px-4">
            <Card className="w-full max-w-md border border-[#4a3d34] bg-[#1a2438] py-8 px-6">
                <h1 className="text-center text-3xl font-bold text-[#b79c8d] mb-6">
                    Welcome Back
                </h1>

                <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
                    <TextField
                        isRequired
                        name="email"
                        type="email"
                        validate={(value) => {
                            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                                return "Please enter a valid email address";
                            }
                            return null;
                        }}
                    >
                        <Label className="text-[#b79c8d]">Email</Label>
                        <Input
                            placeholder="john@example.com"
                            className="bg-[#4a3d34] text-[#b79c8d] border-[#8b756c] focus:border-[#b79c8d]"
                        />
                        <FieldError className="text-red-400" />
                    </TextField>

                    <TextField
                        isRequired
                        minLength={8}
                        name="password"
                        type="password"
                        validate={(value) => {
                            if (value.length < 8) {
                                return "Password must be at least 8 characters";
                            }
                            if (!/[A-Z]/.test(value)) {
                                return "Password must contain at least one uppercase letter";
                            }
                            if (!/[0-9]/.test(value)) {
                                return "Password must contain at least one number";
                            }
                            return null;
                        }}
                    >
                        <Label className="text-[#b79c8d]">Password</Label>
                        <Input
                            placeholder="Enter your password"
                            className="bg-[#4a3d34] text-[#b79c8d] border-[#8b756c] focus:border-[#b79c8d]"
                        />
                        <Description className="text-[#8b756c]">
                            At least 8 characters with 1 uppercase and 1 number
                        </Description>
                        <FieldError className="text-red-400" />
                    </TextField>

                    <div className="flex gap-2 mt-2">
                        <Button
                            type="submit"
                            className="flex-1 bg-[#b79c8d] text-[#1a2438] hover:bg-[#8b756c]"
                        >
                            <Check className="mr-2 h-4 w-4" />
                            Sign In
                        </Button>
                        <Button
                            type="reset"
                            variant="bordered"
                            className="border-[#4a3d34] text-[#b79c8d] hover:bg-[#4a3d34]"
                        >
                            Reset
                        </Button>
                    </div>
                </Form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#4a3d34]" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-[#1a2438] text-[#8b756c]">or</span>
                    </div>
                </div>

                <Button
                    onClick={handleGoogleSignIn}
                    variant="bordered"
                    className="w-full border-[#4a3d34] text-[#b79c8d] hover:bg-[#4a3d34]"
                >
                    <GrGoogle className="mr-2" />
                    Sign In with Google
                </Button>

                <p className="mt-6 text-center text-sm text-[#8b756c]">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="text-[#b79c8d] hover:underline font-semibold"
                    >
                        Sign Up
                    </Link>
                </p>
            </Card>
        </div>
    );
}