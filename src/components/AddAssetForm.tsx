import { useState, FormEvent } from "react";
import { Asset, CoinSuggestion } from "../types";
import { COIN_SUGGESTIONS, PALETTE_COLORS } from "../data";
import { Plus, Check, HelpCircle } from "lucide-react";

interface AddAssetFormProps {
  onAddAsset: (asset: Omit<Asset, "id" | "createdAt">) => void;
}

export default function AddAssetForm({ onAddAsset }: AddAssetFormProps) {
  // Input fields state
  const [coinName, setCoinName] = useState("");
  const [coinSymbol, setCoinSymbol] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [amountOwned, setAmountOwned] = useState("");
  const [selectedColor, setSelectedColor] = useState(PALETTE_COLORS[0]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSelectSuggestion = (suggestion: CoinSuggestion) => {
    setCoinName(suggestion.name);
    setCoinSymbol(suggestion.symbol);
    setCurrentPrice(suggestion.defaultPrice.toString());
    setSelectedColor(suggestion.color);
    setErrors({});
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!coinName.trim()) {
      newErrors.coinName = "Required";
    }
    
    const symbolStr = coinSymbol.trim().toUpperCase();
    if (!symbolStr) {
      newErrors.coinSymbol = "Required";
    }

    const priceNum = parseFloat(currentPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      newErrors.currentPrice = "Must be positive";
    }

    const qtyNum = parseFloat(amountOwned);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      newErrors.amountOwned = "Must be positive";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAddAsset({
      coinName: coinName.trim(),
      coinSymbol: symbolStr,
      currentPrice: priceNum,
      amountOwned: qtyNum,
      color: selectedColor,
    });

    // Reset inputs but choose a new random color for next entry
    setCoinName("");
    setCoinSymbol("");
    setCurrentPrice("");
    setAmountOwned("");
    const nextColorIndex = PALETTE_COLORS.indexOf(selectedColor) + 1;
    setSelectedColor(PALETTE_COLORS[nextColorIndex % PALETTE_COLORS.length]);
    setErrors({});
  };

  return (
    <div id="add-asset-component" className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] space-y-5">
      <div>
        <h3 className="text-slate-900 font-semibold text-sm">Add custom position</h3>
        <p className="text-xs text-slate-500">Record a cryptocurrency holding in your sandbox portfolio</p>
      </div>

      {/* Suggested popular assets strip */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Suggested presets
        </label>
        <div className="flex flex-wrap gap-1.5">
          {COIN_SUGGESTIONS.map((coin) => (
            <button
              key={coin.symbol}
              type="button"
              onClick={() => handleSelectSuggestion(coin)}
              className="px-2.5 py-1.5 rounded-md text-xs font-medium bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: coin.color }}
              />
              <span>{coin.symbol}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Coin Name & Symbol row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 block">Asset Name</label>
            <input
              type="text"
              placeholder="e.g. Bitcoin"
              value={coinName}
              onChange={(e) => {
                setCoinName(e.target.value);
                // Simple auto-fill helper for quick entries
                const match = COIN_SUGGESTIONS.find(c => c.name.toLowerCase() === e.target.value.toLowerCase());
                if (match) {
                  setCoinSymbol(match.symbol);
                  setCurrentPrice(match.defaultPrice.toString());
                  setSelectedColor(match.color);
                }
                if (errors.coinName) setErrors((prev) => ({ ...prev, coinName: "" }));
              }}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
            />
            {errors.coinName && <p className="text-[10px] text-red-500 font-medium">{errors.coinName}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 block">Symbol</label>
            <input
              type="text"
              placeholder="e.g. BTC"
              value={coinSymbol}
              onChange={(e) => {
                setCoinSymbol(e.target.value);
                if (errors.coinSymbol) setErrors((prev) => ({ ...prev, coinSymbol: "" }));
              }}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] uppercase font-mono"
            />
            {errors.coinSymbol && <p className="text-[10px] text-red-500 font-medium">{errors.coinSymbol}</p>}
          </div>
        </div>

        {/* Price & Quantity Owned */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 block">Cost per coin</label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">$</span>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                value={currentPrice}
                onChange={(e) => {
                  setCurrentPrice(e.target.value);
                  if (errors.currentPrice) setErrors((prev) => ({ ...prev, currentPrice: "" }));
                }}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg pl-6 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] font-mono"
              />
            </div>
            {errors.currentPrice && <p className="text-[10px] text-red-500 font-medium">{errors.currentPrice}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 block">Quantity held</label>
            <input
              type="number"
              step="any"
              placeholder="0.0"
              value={amountOwned}
              onChange={(e) => {
                setAmountOwned(e.target.value);
                if (errors.amountOwned) setErrors((prev) => ({ ...prev, amountOwned: "" }));
              }}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] font-mono"
            />
            {errors.amountOwned && <p className="text-[10px] text-red-500 font-medium">{errors.amountOwned}</p>}
          </div>
        </div>

        {/* Color Marker Selector */}
        <div className="space-y-1.5 pt-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Chart label color
          </label>
          <div className="flex flex-wrap gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-200">
            {PALETTE_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                style={{ backgroundColor: color }}
                className="w-5 h-5 rounded-full hover:scale-105 active:scale-95 transition-all outline-none flex items-center justify-center border border-white/40 cursor-pointer shadow-sm relative"
              >
                {selectedColor === color && (
                  <Check className="w-3 h-3 text-white stroke-[3px] filter drop-shadow-sm" />
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg py-2.5 mt-2 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Add position
        </button>
      </form>
    </div>
  );
}
