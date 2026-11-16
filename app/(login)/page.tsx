import Link from "next/link";
import { redirect } from "next/navigation";
import { getSettings } from "@/services/settings.service";
import { Button } from "@/components/ui/button";
import { LoginForm } from './components/login-form';
import Footer from "@/components/Footer";
import { OrderingNotice } from "@/components/OrderingNotice";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default async function LoginPage() {
  // Ordering CLOSED: skip customer data entry and go straight to the view-only menu
  const settings = await getSettings();
  if (settings.ordering.mode === "CLOSED") {
    redirect("/menu");
  }

  return (
    <div className="relative bg-muted flex min-h-svh flex-col">
      <div className="absolute top-0 right-0 m-4 z-10">
        <LanguageSwitcher />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-4xl">
          <OrderingNotice variant="pill" className="mb-3" />
          <LoginForm />
        </div>
      </div>

      <div className="flex flex-col w-full items-center space-y-0">
        <div className="text-sm text-muted-foreground select-none">
          <Link href={"https://www.mysagra.com/"} target="_blank" rel="noopener noreferrer">
            {"Powered by"}
            <Button variant={"link"} className="text-primary p-1.5">
              {"MySagra"}
            </Button>
          </Link>
        </div>

        <div className="w-full">
          <Footer />
        </div>
        
      </div>


    </div>
  );
}
