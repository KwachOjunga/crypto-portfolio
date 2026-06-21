import { useState } from "react";
import { Asset } from "../types";
import { Search, ArrowUpDown, Trash2, TrendingUp, TrendingDown } from "lucide-react";

interface HoldingsListProps {
  assets: Asset[];
  selectedId: string | null;
  onSelectId: (id: string | null) => void;
  onDeleteAsset: (id: string) => void;
  onUpdatePrice: (id: string, newPrice: number) => void;
}

type SortField = "name" | "price" | "qty" | "value";
type SortDirection = "asc" | "desc";

export default function HoldingsList({
  assets,
  selectedId,
  onSelectId,
  onDeleteAsset,
  onUpdatePrice,
}: HoldingsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("value");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handlePriceScale = (asset: Asset, factor: number) => {
    const freshVal = parseFloat((asset.currentPrice * factor).toFixed(4));
    onUpdatePrice(asset.id, Math.max(0, freshVal));
  };

  const filteredAssets = assets.filter((asset) => {
    const q = searchQuery.toLowerCase();
    return (
      asset.coinName.toLowerCase().includes(q) ||
      asset.coinSymbol.toLowerCase().includes(q)
    );
  });

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    const valA = a.amountOwned * a.currentPrice;
    const valB = b.amountOwned * b.currentPrice;

    let comp = 0;
    if (sortField === "name") {
      comp = a.coinName.localeCompare(b.coinName);
    } else if (sortField === "price") {
      comp = a.currentPrice - b.currentPrice;
    } else if (sortField === "qty") {
      comp = a.amountOwned - b.amountOwned;
    } else if (sortField === "value") {
      comp = valA - valB;
    }

    return sortDirection === "asc" ? comp : -comp;
  });

  return (
    <div id="holdings-list-component" className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] space-y-4">
      {/* Header filter controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-slate-900 font-semibold text-sm">Asset Positions</h3>
          <p className="text-xs text-slate-500">Overview of holdings with market rates</p>
        </div>
        
        {/* Simple search bar */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            placeholder="Filter by ticket or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-slate-800 transition-all font-mono"
          />
        </div>
      </div>

      {assets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
          <p className="text-slate-500 text-xs font-semibold">Empty portfolio</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Your cryptocurrency allocations will be listed here after you log them.</p>
        </div>
      ) : sortedAssets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-slate-500 text-xs font-semibold">No positions found</p>
          <button onClick={() => setSearchQuery("")} className="text-xs text-slate-900 font-semibold mt-1.5 hover:underline">
            Clear filter query
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Table Sorting Column Titles */}
          <div className="hidden md:grid grid-cols-12 gap-2.5 px-3 py-1.5 bg-slate-50/50 rounded-md border-b border-b-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            <button
              onClick={() => handleSortChange("name")}
              className="col-span-4 flex items-center gap-1 hover:text-slate-800 justify-start"
            >
              Asset
              <ArrowUpDown className="w-2.5 h-2.5" />
            </button>
            <button
              onClick={() => handleSortChange("price")}
              className="col-span-3 flex items-center gap-1 hover:text-slate-800 justify-end"
            >
              Price (USD)
              <ArrowUpDown className="w-2.5 h-2.5" />
            </button>
            <button
              onClick={() => handleSortChange("qty")}
              className="col-span-2 flex items-center gap-1 hover:text-slate-800 justify-end"
            >
              Holdings
              <ArrowUpDown className="w-2.5 h-2.5" />
            </button>
            <button
              onClick={() => handleSortChange("value")}
              className="col-span-2 flex items-center gap-1 hover:text-slate-800 justify-end"
            >
              Holdings Value
              <ArrowUpDown className="w-2.5 h-2.5" />
            </button>
            <span className="col-span-1 text-right">Delete</span>
          </div>

          {/* List Rows */}
          <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
            {sortedAssets.map((asset) => {
              const holdingValue = asset.amountOwned * asset.currentPrice;
              const isSelected = selectedId === asset.id;

              return (
                <div
                  key={asset.id}
                  onClick={() => onSelectId(isSelected ? null : asset.id)}
                  className={`border transition-all duration-150 rounded-lg overflow-hidden cursor-pointer ${
                    isSelected
                      ? "bg-slate-50 border-slate-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                      : "bg-white border-slate-100 hover:bg-slate-50/40 hover:border-slate-200"
                  }`}
                >
                  <div className="p-3.5 grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                    {/* Position Label & Icon info */}
                    <div className="col-span-1 md:col-span-4 flex items-center gap-2.5min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
                        style={{ backgroundColor: asset.color }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-800 truncate">
                            {asset.coinName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono font-bold leading-none bg-slate-100 px-1 py-0.5 rounded">
                            {asset.coinSymbol}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Cost details + Micro quick adjust scale tool */}
                    <div className="col-span-1 md:col-span-3 flex items-center justify-between md:justify-end gap-2.5">
                      <span className="text-[10px] text-slate-400 md:hidden font-mono">Price</span>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-slate-800 font-mono">
                          ${asset.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                        </p>
                        
                        {/* Interactive slight price offset tools */}
                        <div className="flex items-center justify-end gap-1 mt-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handlePriceScale(asset, 0.95)}
                            title="Simulate 5% drop"
                            className="p-1 rounded bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-500 transition-colors cursor-pointer"
                          >
                            <TrendingDown className="w-2.5 h-2.5 text-rose-500" />
                          </button>
                          <span className="text-[9px] text-slate-400 font-mono px-0.5">Adjust</span>
                          <button
                            onClick={() => handlePriceScale(asset, 1.05)}
                            title="Simulate 5% rise"
                            className="p-1 rounded bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-500 transition-colors cursor-pointer"
                          >
                            <TrendingUp className="w-2.5 h-2.5 text-emerald-600" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Amount Owned */}
                    <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end">
                      <span className="text-[10px] text-slate-400 md:hidden font-mono">Holdings</span>
                      <span className="text-xs text-slate-600 font-mono">
                        {asset.amountOwned.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                      </span>
                    </div>

                    {/* Calculated total value columns */}
                    <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end">
                      <span className="text-[10px] text-slate-400 md:hidden font-mono">Total Value</span>
                      <span className="text-xs font-bold text-slate-900 font-mono">
                        ${holdingValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Remove Action Column */}
                    <div
                      className="col-span-1 md:col-span-1 flex items-center justify-end border-t border-slate-105 md:border-t-0 pt-2 md:pt-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onDeleteAsset(asset.id)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 border border-transparent transition-colors cursor-pointer"
                        title="Delete asset position"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
