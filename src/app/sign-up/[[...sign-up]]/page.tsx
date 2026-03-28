import { SignUp } from "@clerk/nextjs";
import { Wheat } from "lucide-react";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2.5 mb-3">
          <Wheat className="w-8 h-8 text-primary" strokeWidth={2.5} />
          <h1 className="text-[32px] font-extrabold tracking-tight text-foreground">
            KisanVoice
          </h1>
        </div>
        <p className="text-[18px] text-muted font-medium">
          Create your account to get started
        </p>
      </div>
      <SignUp
        forceRedirectUrl="/"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg rounded-2xl",
          },
        }}
      />
    </main>
  );
}
