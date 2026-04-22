"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoginForm } from './components/login-form';
import Footer from "@/components/Footer";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col">
      <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-4xl">
          <LoginForm />
        </div>

        <div className="absolute bottom-20 text-sm text-muted-foreground select-none">
          <Link href={"https://www.mysagra.com/"} target="_blank" rel="noopener noreferrer">
            {"Powered by"}
            <Button variant={"link"} className="text-primary p-1.5">
              {"MySagra"}
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
