import { getOrderInstructions } from "@/services/order-instruction.service";
import ConfirmationContent from "./components/ConfirmationContent";

export default async function ConfirmationPage() {
  const instructions = await getOrderInstructions();

  return <ConfirmationContent instructions={instructions} />;
}
