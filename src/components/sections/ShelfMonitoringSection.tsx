import { MapPin, Clock, Filter } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/cn';
import type { Shelf, ShelfStatus } from '@/types';
import { formatTimeAgo, getStatusColor, getStatusLabel, getStockLevelColor } from '@/utils/helpers';

interface ShelfMonitoringSectionProps {
  shelves: Shelf[];
}

export function ShelfMonitoringSection({ shelves }: ShelfMonitoringSectionProps) {
  const { darkMode } = useTheme();
  const [filter, setFilter] = useState<ShelfStatus | 'all'>('all');
  const [selectedShelf, setSelectedShelf] = useState<Shelf | null>(null);
  
  const filteredShelves = filter === 'all' 
    ? shelves 
    : shelves.filter(s => s.status === filter);

  const filterOptions: { value: ShelfStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Shelves' },
    { value: 'fully-stocked', label: 'Fully Stocked' },
    { value: 'low-stock', label: 'Low Stock' },
    { value: 'empty', label: 'Empty' },
    { value: 'misplaced', label: 'Misplaced' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className={cn(
            "text-2xl font-bold",
            darkMode ? "text-white" : "text-slate-900"
          )}>Shelf Monitoring</h2>
          <p className={cn(
            "text-sm mt-1",
            darkMode ? "text-slate-400" : "text-slate-500"
          )}>Real-time shelf status and stock levels</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className={cn("w-4 h-4", darkMode ? "text-slate-400" : "text-slate-500")} />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as ShelfStatus | 'all')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-indigo-500",
              darkMode 
                ? "bg-slate-800 border-slate-600 text-white" 
                : "bg-white border-gray-200 text-slate-700"
            )}
          >
            {filterOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Shelf Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredShelves.map((shelf) => (
          <div
            key={shelf.id}
            onClick={() => setSelectedShelf(shelf)}
            className={cn(
              "p-4 rounded-xl border cursor-pointer transition-all hover:shadow-lg",
              darkMode 
                ? "bg-slate-800 border-slate-700 hover:border-indigo-500" 
                : "bg-white border-gray-200 hover:border-indigo-300",
              selectedShelf?.id === shelf.id && "ring-2 ring-indigo-500"
            )}
          >
            {/* Shelf Image */}
            <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
              <img
                src={shelf.imageUrl}
                alt={`Shelf ${shelf.id}`}
                className="w-full h-full object-cover"
              />
              <div className={cn(
                "absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold border",
                getStatusColor(shelf.status)
              )}>
                {getStatusLabel(shelf.status)}
              </div>
            </div>
            
            {/* Shelf Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className={cn(
                  "font-semibold",
                  darkMode ? "text-white" : "text-slate-900"
                )}>{shelf.id}</h3>
                <span className={cn(
                  "text-xs",
                  darkMode ? "text-slate-400" : "text-slate-500"
                )}>{shelf.zone}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <MapPin className={cn("w-3.5 h-3.5", darkMode ? "text-slate-400" : "text-slate-500")} />
                <span className={cn(darkMode ? "text-slate-300" : "text-slate-600")}>
                  {shelf.aisle}
                </span>
              </div>
              
              {/* Stock Level */}
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className={cn(darkMode ? "text-slate-400" : "text-slate-500")}>Stock Level</span>
                  <span className={cn("font-semibold", darkMode ? "text-white" : "text-slate-900")}>
                    {shelf.stockLevel}%
                  </span>
                </div>
                <div className={cn(
                  "h-2 rounded-full overflow-hidden",
                  darkMode ? "bg-slate-700" : "bg-gray-200"
                )}>
                  <div
                    className={cn("h-full rounded-full transition-all", getStockLevelColor(shelf.stockLevel))}
                    style={{ width: `${shelf.stockLevel}%` }}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-1 text-xs pt-1">
                <Clock className={cn("w-3 h-3", darkMode ? "text-slate-500" : "text-slate-400")} />
                <span className={cn(darkMode ? "text-slate-500" : "text-slate-400")}>
                  Updated {formatTimeAgo(shelf.lastUpdated)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Shelf Detail Modal */}
      {selectedShelf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedShelf(null)}>
          <div 
            className={cn(
              "w-full max-w-2xl rounded-2xl p-6 shadow-2xl",
              darkMode ? "bg-slate-800" : "bg-white"
            )}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className={cn(
                  "text-xl font-bold",
                  darkMode ? "text-white" : "text-slate-900"
                )}>Shelf Details: {selectedShelf.id}</h3>
                <p className={cn(
                  "text-sm",
                  darkMode ? "text-slate-400" : "text-slate-500"
                )}>{selectedShelf.zone} • {selectedShelf.aisle}</p>
              </div>
              <button
                onClick={() => setSelectedShelf(null)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  darkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"
                )}
              >
                ✕
              </button>
            </div>
            
            <img
              src={selectedShelf.imageUrl}
              alt={`Shelf ${selectedShelf.id}`}
              className="w-full h-64 object-cover rounded-xl mb-4"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div className={cn(
                "p-4 rounded-lg",
                darkMode ? "bg-slate-700" : "bg-gray-50"
              )}>
                <p className={cn("text-sm", darkMode ? "text-slate-400" : "text-slate-500")}>Status</p>
                <div className={cn(
                  "inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 border",
                  getStatusColor(selectedShelf.status)
                )}>
                  {getStatusLabel(selectedShelf.status)}
                </div>
              </div>
              <div className={cn(
                "p-4 rounded-lg",
                darkMode ? "bg-slate-700" : "bg-gray-50"
              )}>
                <p className={cn("text-sm", darkMode ? "text-slate-400" : "text-slate-500")}>Stock Level</p>
                <p className={cn("text-2xl font-bold mt-1", darkMode ? "text-white" : "text-slate-900")}>
                  {selectedShelf.stockLevel}%
                </p>
              </div>
            </div>
            
            <div className="mt-4 flex gap-3">
              <button className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                Request Restock
              </button>
              <button className={cn(
                "flex-1 px-4 py-2.5 rounded-lg font-medium border transition-colors",
                darkMode 
                  ? "border-slate-600 text-slate-300 hover:bg-slate-700" 
                  : "border-gray-200 text-slate-700 hover:bg-gray-50"
              )}>
                Manual Scan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
