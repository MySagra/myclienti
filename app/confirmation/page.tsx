import { getOrderInstructions } from "@/services/order-instruction.service";
import ConfirmationContent from "./components/ConfirmationContent";
import Footer from "@/components/Footer";

export default async function ConfirmationPage() {
  const instructions = await getOrderInstructions();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <ConfirmationContent instructions={instructions} />
      </div>
      <Footer />
    </div>
  );
}
