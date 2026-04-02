import Image from "next/image";
import Link from "next/link";

export default function ErrorePage() {
  return (
    <div className="min-h-dvh bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <Image
          src="/server_error.svg"
          alt="Servizio non disponibile"
          width={320}
          height={248}
          className="mx-auto mb-8"
        />
        <h1 className="font-bold mb-3" style={{ color: "#FECC01" }}>
          <span className="text-8xl font-black block">500</span>
          <span className="text-2xl">La festa non è ancora iniziata!</span>
        </h1>
        <p className="text-muted-foreground mb-6">
          Il sistema non sta accettando ordini in questo momento oppure non
          riesci a raggiungere il server. Rivolgiti al personale per assistenza.
        </p>
        <Link href="/" className="text-sm font-medium underline underline-offset-4" style={{ color: "#FECC01" }}>
          Torna alla home
        </Link>
      </div>
    </div>
  );
}
