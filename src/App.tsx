import { useState, useEffect } from "react";
import { Asset } from "./types";
import { INITIAL_HOLDINGS } from "./data";
import AssetChart from "./components/AssetChart";
import AddAssetForm from "./components/AddAssetForm";
import HoldingsList from "./components/HoldingsList";
import { Coins, Sparkles, AlertCircle, RefreshCw, Archive, PlusCircle, Check } from "lucide-react";

export default function App() {
  const [holdings, setHoldings] = useState<Asset[]>(() => {
    try {
      const stored = localStorage.getItem("crypto_assets_v1");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error reading localStorage", e);
    }
    return INITIAL_HOLDINGS;
  });

  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem("crypto_assets_v1", JSON.stringify(holdings));
    } catch (e) {
      console.error("Error writing localStorage", e);
    }
  }, [holdings]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAddAsset = (newAssetData: Omit<Asset, "id" | "createdAt">) => {
    const existingIndex = holdings.findIndex(
      (h) => h.coinSymbol.toUpperCase() === newAssetData.coinSymbol.toUpperCase()
    );

    if (existingIndex > -1) {
      const updated = [...holdings];
      const prev = updated[existingIndex];
      const newQty = prev.amountOwned + newAssetData.amountOwned;
      
      updated[existingIndex] = {
        ...prev,
        amountOwned: newQty,
        currentPrice: newAssetData.currentPrice,
      };
      setHoldings(updated);
      triggerToast(`Increased ${newAssetData.coinName} position by ${newAssetData.amountOwned}`);
    } else {
      const brandNew: Asset = {
        ...newAssetData,
        id: `coin-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setHoldings([brandNew, ...holdings]);
      triggerToast(`Added ${newAssetData.coinName} position`);
    }
  };

  const handleDeleteAsset = (id: string) => {
    const assetToRemove = holdings.find((h) => h.id === id);
    setHoldings(holdings.filter((h) => h.id !== id));
    if (selectedAssetId === id) {
      setSelectedAssetId(null);
    }
    if (assetToRemove) {
      triggerToast(`Removed ${assetToRemove.coinName}`);
    }
  };

  const handleUpdatePrice = (id: string, newPrice: number) => {
    setHoldings(
      holdings.map((h) => {
        if (h.id === id) {
          return { ...h, currentPrice: newPrice };
        }
        return h;
      })
    );
  };

  const handleResetPresets = () => {
    if (window.confirm("Revert your portfolio state to the default preset samples? Your current edits will be substituted.")) {
      setHoldings(INITIAL_HOLDINGS);
      setSelectedAssetId(null);
      triggerToast("Demo presets restored");
    }
  };

  const handleClearPortfolio = () => {
    if (window.confirm("Empty your portfolio? This deletes all your logged assets.")) {
      setHoldings([]);
      setSelectedAssetId(null);
      triggerToast("Portfolio fully cleared");
    }
  };

  const totalValue = holdings.reduce(
    (sum, asset) => sum + asset.amountOwned * asset.currentPrice,
    0
  );

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col font-serif antialiased selection:bg-slate-200 selection:text-slate-950">
      
      {/* Toast alert system */}
      {toastMessage && (
        <div id="toast-notif" className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white shadow-xl rounded-lg px-4 py-3 flex items-center gap-2.5 animate-toast-in border border-slate-850">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-[11px] font-semibold tracking-wide font-mono">{toastMessage}</span>
        </div>
      )}

      {/* Main navigation header */}
      <header className="border-b border-slate-200/60 bg-white sticky top-0 z-40 shadow-[0_1px_2px_0_rgba(0,0,0,0.01)]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-slate-100 border border-slate-200 rounded-lg">
              <Coins className="w-4 h-4 text-slate-700" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900 font-mono">
                Asset Ledger
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleResetPresets}
              className="px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer border border-slate-200 bg-white font-medium flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Load sample assets</span>
            </button>
            <button
              onClick={handleClearPortfolio}
              className="px-2.5 py-1.5 rounded-lg text-xs hover:bg-red-50 text-rose-600 transition-colors cursor-pointer font-medium"
            >
              Clear tracker
            </button>
          </div>
        </div>
      </header>

      {/* Page Content layout wrapper */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-8 space-y-6">
        
        {/* Core Portfolio Valuation Stats */}
        <section id="portfolio-metric-cards" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Net Value (USD)
            </span>
            <p className="text-3xl font-bold tracking-tight text-slate-900 font-mono mt-1.5">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Positions registered
            </span>
            <p className="text-3xl font-bold tracking-tight text-slate-900 font-mono mt-1.5">
              {holdings.length}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] hidden md:block">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Sandbox storage
            </span>
            <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Active in local storage
            </p>
          </div>
        </section>

        {/* Dashboard columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main detailed holdings list */}
          <div className="col-span-1 lg:col-span-7 space-y-6">
            <HoldingsList
              assets={holdings}
              selectedId={selectedAssetId}
              onSelectId={setSelectedAssetId}
              onDeleteAsset={handleDeleteAsset}
              onUpdatePrice={handleUpdatePrice}
            />
          </div>

          {/* Allocation visualization and creation forms */}
          <div className="col-span-1 lg:col-span-5 space-y-6">
            <AssetChart
              assets={holdings}
              totalValue={totalValue}
              selectedId={selectedAssetId}
              onSelectId={setSelectedAssetId}
            />
            <AddAssetForm onAddAsset={handleAddAsset} />
          </div>

        </div>

      </main>

      {/* Footer bar */}
      <footer className="border-t border-slate-200/50 bg-white py-6 mt-12 text-center text-xs text-slate-400 font-mono">
        <div>All values persist locally in your browser's Cache interface.</div>
      </footer>
    </div>
  );
}
