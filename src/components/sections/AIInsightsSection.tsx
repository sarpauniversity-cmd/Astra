import { Brain, CheckCircle, AlertCircle, TrendingUp, Eye } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/cn';
import type { AIInsight } from '@/types';
import { formatTimeAgo } from '@/utils/helpers';

interface AIInsightsSectionProps {
  insights: AIInsight[];
}

export function AIInsightsSection({ insights }: AIInsightsSectionProps) {
  const { darkMode } = useTheme();
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);

  const activeIssues = insights.filter(i => !i.resolved).length;
  const resolvedIssues = insights.filter(i => i.resolved).length;
  const avgConfidence = Math.round(insights.reduce((acc, i) => acc + i.confidence, 0) / insights.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={cn(
          "text-2xl font-bold",
          darkMode ? "text-white" : "text-slate-900"
        )}>AI Insights</h2>
        <p className={cn(
          "text-sm mt-1",
          darkMode ? "text-slate-400" : "text-slate-500"
        )}>AI-powered shelf analysis and detection results</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={cn(
          "p-5 rounded-xl border",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center gap-3 mb-2">
            <Brain className={cn("w-5 h-5", darkMode ? "text-indigo-400" : "text-indigo-600")} />
            <span className={cn("text-sm", darkMode ? "text-slate-400" : "text-slate-500")}>
              Total Detections
            </span>
          </div>
          <p className={cn("text-2xl font-bold", darkMode ? "text-white" : "text-slate-900")}>
            {insights.length}
          </p>
        </div>

        <div className={cn(
          "p-5 rounded-xl border",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className={cn("w-5 h-5", darkMode ? "text-amber-400" : "text-amber-600")} />
            <span className={cn("text-sm", darkMode ? "text-slate-400" : "text-slate-500")}>
              Active Issues
            </span>
          </div>
          <p className={cn("text-2xl font-bold", darkMode ? "text-white" : "text-slate-900")}>
            {activeIssues}
          </p>
        </div>

        <div className={cn(
          "p-5 rounded-xl border",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className={cn("w-5 h-5", darkMode ? "text-emerald-400" : "text-emerald-600")} />
            <span className={cn("text-sm", darkMode ? "text-slate-400" : "text-slate-500")}>
              Resolved
            </span>
          </div>
          <p className={cn("text-2xl font-bold", darkMode ? "text-white" : "text-slate-900")}>
            {resolvedIssues}
          </p>
        </div>

        <div className={cn(
          "p-5 rounded-xl border",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className={cn("w-5 h-5", darkMode ? "text-purple-400" : "text-purple-600")} />
            <span className={cn("text-sm", darkMode ? "text-slate-400" : "text-slate-500")}>
              Avg. Confidence
            </span>
          </div>
          <p className={cn("text-2xl font-bold", darkMode ? "text-white" : "text-slate-900")}>
            {avgConfidence}%
          </p>
        </div>
      </div>

      {/* Insights List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={cn(
              "p-5 rounded-xl border cursor-pointer transition-all hover:shadow-lg",
              insight.resolved
                ? darkMode ? "bg-slate-800/50 border-slate-700" : "bg-gray-50 border-gray-200"
                : darkMode ? "bg-slate-800 border-indigo-500/50" : "bg-white border-indigo-200",
              selectedInsight?.id === insight.id && "ring-2 ring-indigo-500"
            )}
            onClick={() => setSelectedInsight(insight)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Brain className={cn(
                  "w-5 h-5",
                  insight.resolved 
                    ? "text-gray-400" 
                    : darkMode ? "text-indigo-400" : "text-indigo-600"
                )} />
                <span className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-slate-400" : "text-slate-500"
                )}>Shelf {insight.shelfId}</span>
              </div>
              
              <span className={cn(
                "px-2.5 py-1 rounded-full text-xs font-semibold",
                insight.resolved
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              )}>
                {insight.resolved ? 'Resolved' : 'Active'}
              </span>
            </div>
            
            <p className={cn(
              "text-sm font-medium mb-2",
              darkMode ? "text-white" : "text-slate-900"
            )}>{insight.issue}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "px-2 py-0.5 rounded text-xs font-medium",
                  insight.confidence > 90
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : insight.confidence > 80
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                )}>
                  {insight.confidence}% confidence
                </div>
              </div>
              
              <span className={cn(
                "text-xs",
                darkMode ? "text-slate-500" : "text-slate-400"
              )}>{formatTimeAgo(insight.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedInsight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedInsight(null)}>
          <div 
            className={cn(
              "w-full max-w-4xl rounded-2xl p-6 shadow-2xl",
              darkMode ? "bg-slate-800" : "bg-white"
            )}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Brain className={cn("w-6 h-6", darkMode ? "text-indigo-400" : "text-indigo-600")} />
                  <h3 className={cn(
                    "text-xl font-bold",
                    darkMode ? "text-white" : "text-slate-900"
                  )}>AI Detection Details</h3>
                </div>
                <p className={cn(
                  "text-sm",
                  darkMode ? "text-slate-400" : "text-slate-500"
                )}>Shelf {selectedInsight.shelfId} • {formatTimeAgo(selectedInsight.timestamp)}</p>
              </div>
              <button
                onClick={() => setSelectedInsight(null)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  darkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"
                )}
              >
                ✕
              </button>
            </div>
            
            <div className={cn(
              "p-4 rounded-lg mb-6",
              darkMode ? "bg-slate-700" : "bg-gray-50"
            )}>
              <p className={cn(
                "text-lg font-medium",
                darkMode ? "text-white" : "text-slate-900"
              )}>{selectedInsight.issue}</p>
              
              <div className="flex items-center gap-4 mt-3">
                <div className={cn(
                  "px-3 py-1 rounded-full text-sm font-semibold",
                  selectedInsight.confidence > 90
                    ? "bg-emerald-100 text-emerald-700"
                    : selectedInsight.confidence > 80
                      ? "bg-blue-100 text-blue-700"
                      : "bg-amber-100 text-amber-700"
                )}>
                  Confidence: {selectedInsight.confidence}%
                </div>
                
                <span className={cn(
                  "px-3 py-1 rounded-full text-sm font-semibold",
                  selectedInsight.resolved
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                )}>
                  {selectedInsight.resolved ? '✓ Resolved' : '⚠ Active Issue'}
                </span>
              </div>
            </div>
            
            {/* Before/After Images */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className={cn(
                  "text-sm font-medium mb-2",
                  darkMode ? "text-slate-400" : "text-slate-500"
                )}>Before (Issue Detected)</p>
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={selectedInsight.beforeImageUrl}
                    alt="Before"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium">Issue Detected</span>
                  </div>
                </div>
              </div>
              
              <div>
                <p className={cn(
                  "text-sm font-medium mb-2",
                  darkMode ? "text-slate-400" : "text-slate-500"
                )}>After (Current State)</p>
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={selectedInsight.afterImageUrl}
                    alt="After"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-white text-sm font-medium">Current View</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              {!selectedInsight.resolved && (
                <button className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                  Mark as Resolved
                </button>
              )}
              <button className={cn(
                "flex-1 px-4 py-2.5 rounded-lg font-medium border transition-colors",
                darkMode 
                  ? "border-slate-600 text-slate-300 hover:bg-slate-700" 
                  : "border-gray-200 text-slate-700 hover:bg-gray-50"
              )}>
                Request Manual Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Accuracy Metrics */}
      <div className={cn(
        "p-6 rounded-xl border",
        darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
      )}>
        <h3 className={cn(
          "text-lg font-semibold mb-4",
          darkMode ? "text-white" : "text-slate-900"
        )}>Detection Accuracy Metrics</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Accuracy', value: '96.8%', color: 'emerald' },
            { label: 'Precision', value: '94.2%', color: 'blue' },
            { label: 'Recall', value: '92.5%', color: 'purple' },
            { label: 'F1 Score', value: '93.3%', color: 'indigo' },
          ].map((metric) => (
            <div key={metric.label} className={cn(
              "p-4 rounded-lg text-center",
              darkMode ? "bg-slate-700" : "bg-gray-50"
            )}>
              <p className={cn(
                "text-sm font-medium mb-1",
                darkMode ? "text-slate-400" : "text-slate-500"
              )}>{metric.label}</p>
              <p className={cn(
                "text-2xl font-bold",
                `text-${metric.color}-500`
              )}>{metric.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
