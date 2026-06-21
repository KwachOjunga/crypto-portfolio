import { useState } from "react";
import { Asset } from "../types";

interface AssetChartProps {
  assets: Asset[];
  totalValue: number;
  selectedId: string | null;
  onSelectId: (id: string | null) => void;
}

export default function AssetChart({
  assets,
  totalValue,
  selectedId,
  onSelectId,
}: AssetChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (assets.length === 0 || totalValue === 0) {
    return (
      <div id="empty-chart" className="flex flex-col items-center justify-center py-12 px-6 bg-white border border-slate-200 rounded-xl text-center shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] h-64">
        <svg className="w-10 h-10 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="9" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M12 8v4l3 3" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <p className="text-slate-700 text-xs font-semibold">No assets recorded</p>
        <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">Add a custom position in the form below to visualize asset allocation.</p>
      </div>
    );
  }

  // Calculate allocation percentages
  const slices = assets.map((asset) => {
    const value = asset.amountOwned * asset.currentPrice;
    const percentage = value / totalValue;
    return {
      ...asset,
      value,
      percentage,
    };
  });

  // Calculate coordinates for SVG Sector Paths
  let accumulatedPercent = 0;
  const radius = 80;
  const strokeWidth = 16;
  
  const chartSlices = slices.map((slice, index) => {
    const startAngle = accumulatedPercent * 2 * Math.PI - Math.PI / 2;
    accumulatedPercent += slice.percentage;
    const endAngle = accumulatedPercent * 2 * Math.PI - Math.PI / 2;

    const startX = radius * Math.cos(startAngle);
    const startY = radius * Math.sin(startAngle);
    const endX = radius * Math.cos(endAngle);
    const endY = radius * Math.sin(endAngle);

    const isFullCircle = slice.percentage >= 0.999;
    const largeArcFlag = slice.percentage > 0.5 ? 1 : 0;

    let pathData = "";
    if (isFullCircle) {
      pathData = `
        M 0 ${-radius} 
        A ${radius} ${radius} 0 1 1 -0.01 ${-radius} 
        Z
      `;
    } else {
      pathData = `
        M 0 0 
        L ${startX} ${startY} 
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} 
        Z
      `;
    }

    return {
      ...slice,
      pathData,
      index,
    };
  });

  const activeAssetIndex = hoveredIndex !== null ? hoveredIndex : null;
  const activeAsset = activeAssetIndex !== null ? chartSlices[activeAssetIndex] : (selectedId ? chartSlices.find(s => s.id === selectedId) : null);

  return (
    <div id="portfolio-chart" className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-slate-900 font-semibold text-sm">Asset Distribution</h3>
          <p className="text-xs text-slate-500">Relative allocation by current total value</p>
        </div>
        <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[10px] font-medium text-slate-600 font-mono">
          {assets.length} {assets.length === 1 ? "position" : "positions"}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        {/* Interactive SVG Rendering */}
        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
          <svg
            viewBox="-100 -100 220 220"
            className="w-full h-full transform hover:scale-[1.01] transition-transform duration-300"
          >
            <g>
              {chartSlices.map((slice) => {
                const isSelected = selectedId === slice.id;
                const isHovered = hoveredIndex === slice.index;
                const offset = isSelected || isHovered ? 4 : 0;
                
                const midAngle = (slice.percentage / 2 + (chartSlices.slice(0, slice.index).reduce((acc, curr) => acc + curr.percentage, 0))) * 2 * Math.PI - Math.PI / 2;
                const tx = offset * Math.cos(midAngle);
                const ty = offset * Math.sin(midAngle);

                return (
                  <path
                    key={slice.id}
                    d={slice.pathData}
                    fill={slice.color}
                    className="cursor-pointer transition-all duration-350 stroke-white"
                    strokeWidth={slices.length > 1 ? 1.5 : 0}
                    transform={`translate(${tx}, ${ty})`}
                    onClick={() => {
                      onSelectId(selectedId === slice.id ? null : slice.id);
                    }}
                    onMouseEnter={() => setHoveredIndex(slice.index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                );
              })}
            </g>

            {/* Donut mask center */}
            <circle cx="0" cy="0" r={radius - strokeWidth} className="fill-white" />
          </svg>

          {/* Center text details */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-4">
            {activeAsset ? (
              <div className="animate-fade-in">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 font-mono uppercase">
                  {activeAsset.coinSymbol}
                </span>
                <span className="block text-base font-extrabold text-slate-800 font-mono mt-0.5 leading-none">
                  {(activeAsset.percentage * 100).toFixed(1)}%
                </span>
                <span className="block text-[10px] text-slate-500 font-mono mt-1">
                  ${activeAsset.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Hover
                </span>
                <span className="text-[11px] font-semibold text-slate-600 mt-1">
                  Slices
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Legend Indicators */}
        <div className="flex-grow w-full max-h-[176px] overflow-y-auto pr-1 custom-scrollbar space-y-1.5">
          {slices.map((slice) => {
            const isSelected = selectedId === slice.id;
            return (
              <button
                key={slice.id}
                onClick={() => onSelectId(isSelected ? null : slice.id)}
                className={`w-full flex items-center justify-between text-left px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-slate-50 border-slate-300 shadow-sm"
                    : "bg-transparent border-transparent hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-inner"
                    style={{ backgroundColor: slice.color }}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate leading-none">
                      {slice.coinName}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono leading-none">
                      {slice.coinSymbol}
                    </span>
                  </div>
                </div>
                <div className="text-right ml-2 shrink-0">
                  <p className="text-xs font-bold text-slate-800 font-mono leading-none">
                    {(slice.percentage * 100).toFixed(1)}%
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
