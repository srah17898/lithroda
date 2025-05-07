import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export function Settings() {
  const user = useQuery(api.auth.loggedInUser);

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Configurações</h2>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Conta</h3>
        <div className="flex flex-col gap-2">
          <div>
            <span className="text-slate-600">Email:</span>
            <span className="ml-2">{user?.email}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Sobre</h3>
        <div className="flex flex-col gap-2">
          <div>
            <span className="text-slate-600">Versão:</span>
            <span className="ml-2">1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
