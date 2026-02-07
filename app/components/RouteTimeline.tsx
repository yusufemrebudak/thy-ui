import React from "react";

interface TimelineStop {
  name: string;
  locationCode: string;
  city: string;
}

interface RouteTimelineProps {
  stops: TimelineStop[];
  transports: string[];
}

// Helper function to get transportation icon
const getTransportationIcon = (type: string) => {
  switch (type) {
    case "FLIGHT":
      return "flight";
    case "BUS":
      return "directions_bus";
    case "UBER":
      return "local_taxi";
    case "SUBWAY":
      return "train";
    default:
      return "directions";
  }
};

// Helper function to get transport badge color
const getTransportBadgeClass = (type: string) => {
  switch (type) {
    case "FLIGHT":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
    case "BUS":
      return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
    case "UBER":
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400";
    case "SUBWAY":
      return "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400";
    default:
      return "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400";
  }
};

// Helper function to get transport icon color
const getTransportIconClass = (type: string) => {
  switch (type) {
    case "FLIGHT":
      return "text-blue-600 dark:text-blue-400";
    case "BUS":
      return "text-green-600 dark:text-green-400";
    case "UBER":
      return "text-yellow-600 dark:text-yellow-400";
    case "SUBWAY":
      return "text-purple-600 dark:text-purple-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
};

export function RouteTimeline({ stops, transports }: RouteTimelineProps) {
  return (
    <div className="flex flex-col">
      {stops.map((stop, index) => {
        const isFirst = index === 0;
        const isLast = index === stops.length - 1;
        const transport = transports[index]; // Transport AFTER this stop

        return (
          <React.Fragment key={index}>
            {/* Stop Row - Icon and Name on same row */}
            <div className="flex items-center gap-3">
              {/* Stop Circle */}
              <div
                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                  isFirst
                    ? "bg-primary border-primary"
                    : isLast
                    ? "bg-gray-400 dark:bg-gray-500 border-gray-400 dark:border-gray-500"
                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                }`}
              />

              {/* Stop Name - Same row as circle */}
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                  {stop.name}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {stop.city} {stop.locationCode && `• ${stop.locationCode}`}
                </span>
              </div>
            </div>

            {/* Transport Section - Between two stops */}
            {!isLast && (
              <div className="flex items-center gap-3 py-3">
                {/* Dotted Line Column */}
                <div className="w-4 flex justify-center">
                  <div className="w-0.5 h-8 border-l-2 border-dotted border-gray-300 dark:border-gray-600"></div>
                </div>

                {/* Transport Badge - Centered */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide shadow-sm ${getTransportBadgeClass(
                    transport
                  )}`}
                >
                  <span
                    className={`material-symbols-outlined text-[16px] ${getTransportIconClass(
                      transport
                    )}`}
                  >
                    {getTransportationIcon(transport)}
                  </span>
                  <span>{transport}</span>
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

