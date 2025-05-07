import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { WHEEL_ITEMS } from "../convex/wheel";

export function WheelGame() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const addSpin = useMutation(api.wheel.addSpin);
  const latestPrediction = useQuery(api.wheel.getLatestPrediction);

  const handlePredict = async () => {
    if (!selectedItem) return;
    await addSpin({ item: selectedItem });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Roda Gigante</h2>
        <p className="text-slate-600">Selecione o último item sorteado</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {WHEEL_ITEMS.map((item) => (
          <button
            key={item.emoji}
            onClick={() => setSelectedItem(item.emoji)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedItem === item.emoji
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 hover:border-blue-300"
            }`}
          >
            <div className="text-4xl mb-2">{item.emoji}</div>
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-slate-600">x{item.multiplier}</div>
          </button>
        ))}
      </div>

      <button
        onClick={handlePredict}
        disabled={!selectedItem}
        className="auth-button mt-4"
      >
        Verificar Próximo
      </button>

      {latestPrediction && (
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4">Previsões</h3>
          <div className="grid gap-2">
            {latestPrediction.predictions.map((pred) => (
              <div
                key={pred.item}
                className={`p-4 rounded-lg border ${
                  pred === latestPrediction.predictions[0]
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{pred.item}</span>
                    <span className="font-medium">
                      {WHEEL_ITEMS.find((i) => i.emoji === pred.item)?.name}
                    </span>
                  </div>
                  <div className="font-bold text-lg">
                    {pred.probability.toFixed(1)}%
                  </div>
                </div>
                <div className="mt-2 bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${pred.probability}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
