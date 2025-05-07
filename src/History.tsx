import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { WHEEL_ITEMS } from "../convex/wheel";

export function History() {
  const spins = useQuery(api.wheel.getRecentSpins) || [];

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Histórico</h2>
        <p className="text-slate-600">Últimos {spins.length} resultados</p>
      </div>

      <div className="overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Item</th>
              <th className="p-2 text-left">Nome</th>
              <th className="p-2 text-left">Multiplicador</th>
              <th className="p-2 text-left">Data/Hora</th>
            </tr>
          </thead>
          <tbody>
            {spins.map((spin) => {
              const item = WHEEL_ITEMS.find((i) => i.emoji === spin.item);
              return (
                <tr key={spin._id} className="border-b">
                  <td className="p-2 text-2xl">{spin.item}</td>
                  <td className="p-2">{item?.name}</td>
                  <td className="p-2">x{item?.multiplier}</td>
                  <td className="p-2">
                    {new Date(spin.timestamp).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
