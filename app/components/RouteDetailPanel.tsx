import React from "react";
import { RouteTimeline } from "./RouteTimeline";

interface Location {
  id: number;
  locationCode: string;
  name: string;
  city: string;
  country: string;
}

interface RouteStep {
  transportationId: number;
  type: string;
  origin: Location;
  destination: Location;
  operatingDays: number[];
}

interface Route {
  steps: RouteStep[];
}

interface RouteDetailPanelProps {
  isOpen: boolean;
  route: Route | null;
  onClose: () => void;
}

export function RouteDetailPanel({ isOpen, route, onClose }: RouteDetailPanelProps) {
  if (!isOpen || !route) return null;

  const firstStep = route.steps[0];
  const lastStep = route.steps[route.steps.length - 1];
  const totalSteps = route.steps.length;
  const transportationTypes = [...new Set(route.steps.map((step) => step.type))];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white/95 dark:bg-[#1E1E1E]/95 backdrop-blur-md shadow-2xl z-50 transform transition-transform duration-300 ease-out overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Route Details
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {firstStep.origin.name} → {lastStep.destination.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
              close
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Route Summary */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-center">
                <div className="text-xl font-bold text-slate-900 dark:text-white">
                  {firstStep.origin.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {firstStep.origin.city}
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center px-4">
                <div className="flex items-center gap-1">
                  {transportationTypes.map((type, index) => (
                    <span
                      key={index}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        type === "FLIGHT"
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : type === "BUS"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                          : type === "UBER"
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                          : type === "SUBWAY"
                          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                          : "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {totalSteps} Step{totalSteps > 1 ? "s" : ""}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-slate-900 dark:text-white">
                  {lastStep.destination.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {lastStep.destination.city}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
              Journey Timeline
            </h3>
            <RouteTimeline
              stops={[
                route.steps[0].origin,
                ...route.steps.map((step) => step.destination),
              ]}
              transports={route.steps.map((step) => step.type)}
            />
          </div>

          {/* Step Details */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
              Transportation Details
            </h3>
            <div className="space-y-3">
              {route.steps.map((step, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                        step.type === "FLIGHT"
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : step.type === "BUS"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                          : step.type === "UBER"
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                          : step.type === "SUBWAY"
                          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                          : "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      Step {index + 1}: {step.type}
                    </span>
                    <span className="text-xs text-gray-400">
                      ID: {step.transportationId}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-slate-900 dark:text-white">
                      {step.origin.name}
                    </span>
                    <span className="material-symbols-outlined text-gray-400 text-[16px]">
                      arrow_forward
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {step.destination.name}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {step.origin.city}, {step.origin.country} → {step.destination.city}, {step.destination.country}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full h-12 rounded-full bg-primary text-white font-bold hover:bg-red-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

