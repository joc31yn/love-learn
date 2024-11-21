import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import cal_image from "@/lib/cal_image2.jpg";
import Link from "next/link"; 
import GoogleLogin from "@/components/googlelogin";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex p-5">
      <div className="w-1/2 relative">
        <Image
          src={cal_image}
          alt="Left side image"
          objectFit="cover"
          priority
        />
      </div>
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="bg-white rounded-xl shadow-[0_20px_20px_rgba(223,_247,_231,_0.9)] p-6 max-w-md w-full transform transition-all hover:scale-101">
          <form className="flex-1 flex flex-col min-w-64">
            <h1 className="text-2xl font-medium">Sign in</h1>
            <p className="text-sm text-foreground">
              Don't have an account?{" "}
              <Link
                className="text-foreground font-medium underline"
                href="/sign-up"
              >
                Sign up
              </Link>
            </p>
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
              <Label htmlFor="email">Email</Label>
              <Input name="email" placeholder="you@example.com" required />
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  className="text-xs text-foreground underline"
                  href="/forgot-password"
                >
                  Forgot Password?
                </Link>
              </div>
              <Input
                type="password"
                name="password"
                placeholder="Your password"
                required
              />
              <SubmitButton
                pendingText="Signing In..."
                formAction={signInAction}
              >
                Sign in
              </SubmitButton>
              <FormMessage message={searchParams} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
