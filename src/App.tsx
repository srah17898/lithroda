import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState } from "react";
import { WheelGame } from "./WheelGame";
import { History } from "./History";
import { Settings } from "./Settings";

export default function App() {
  const [page, setPage] = useState<"game" | "history" | "settings">("game");
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold accent-text">RRL</h2>
        <nav className="flex gap-4">
          <button 
            onClick={() => setPage("game")}
            className={`link-text ${page === "game" ? "text-blue-700" : ""}`}
          >
            Jogo
          </button>
          <button 
            onClick={() => setPage("history")}
            className={`link-text ${page === "history" ? "text-blue-700" : ""}`}
          >
            Histórico
          </button>
          <button 
            onClick={() => setPage("settings")}
            className={`link-text ${page === "settings" ? "text-blue-700" : ""}`}
          >
            Configurações
          </button>
        </nav>
        <SignOutButton />
      </header>
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl mx-auto">
          <Content page={page} />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function Content({ page }: { page: string }) {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Unauthenticated>
        <div className="text-center">
          <h1 className="text-5xl font-bold accent-text mb-4">RRL</h1>
          <p className="text-xl text-slate-600">Entre para começar</p>
        </div>
        <SignInForm />
      </Unauthenticated>
      
      <Authenticated>
        {page === "game" && <WheelGame />}
        {page === "history" && <History />}
        {page === "settings" && <Settings />}
      </Authenticated>
    </div>
  );
}
