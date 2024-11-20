import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import Image from "next/image";
import cal_image from "@/lib/cal_image1.jpg";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <div className="flex p-5">
        <div className="w-1/2 relative">
          <Image src={cal_image} alt="Left side image" priority />
        </div>
        <div className="w-1/2 flex items-center justify-center p-8">
          <div className="bg-white rounded-xl shadow-[0_10px_20px_rgba(8,_112,_184,_0.7)] p-6 max-w-md w-full transform transition-all hover:scale-101">
            <form className="flex flex-col min-w-64 max-w-64 mx-auto">
              <h1 className="text-2xl font-medium">Sign up</h1>
              <p className="text-sm text text-foreground">
                Already have an account?{" "}
                <Link
                  className="text-primary font-medium underline"
                  href="/sign-in"
                >
                  Sign in
                </Link>
              </p>
              <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                <Label htmlFor="email">Email</Label>
                <Input name="email" placeholder="you@example.com" required />
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Your password"
                  minLength={6}
                  required
                />
                <SubmitButton
                  formAction={signUpAction}
                  pendingText="Signing up..."
                >
                  Sign up
                </SubmitButton>
                <FormMessage message={searchParams} />
              </div>
            </form>
          </div>
        </div>
      </div>
      <SmtpMessage />
    </>
  );
}
