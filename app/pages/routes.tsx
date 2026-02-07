import type { Route } from "./+types/routes";
import { Link } from "react-router";
import { useState, useMemo } from "react";
import { SidebarNavigation } from "../components/SidebarNavigation";
import { getAllLocations } from "../lib/api/location/getAllLocations";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Route Finder Dashboard Variant 3" },
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
  ];
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap",
  }
];

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

interface RoutesResponse extends Array<Route> {}

export default function Routes() {
  const [directFlightsOnly, setDirectFlightsOnly] = useState(false);
  const [cargoPriority, setCargoPriority] = useState(false);
  const [originSearch, setOriginSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState<Location | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Location | null>(null);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [routesData, setRoutesData] = useState<RoutesResponse | null>(null);

  const { data: locationsResponse } = getAllLocations();

  // Handle both direct array and wrapped response
  const locations: Location[] = Array.isArray(locationsResponse)
    ? locationsResponse
    : (locationsResponse as any)?.data || [];

  // Helper function to get route summary
  const getRouteSummary = (route: Route) => {
    if (route.steps.length === 0) return null;

    const firstStep = route.steps[0];
    const lastStep = route.steps[route.steps.length - 1];

    return {
      origin: firstStep.origin,
      destination: lastStep.destination,
      totalSteps: route.steps.length,
      transportationTypes: route.steps.map(step => step.type),
      isDirect: route.steps.length === 1
    };
  };

  // Helper function to format transportation type
  const getTransportationIcon = (type: string) => {
    switch (type) {
      case 'FLIGHT': return 'flight';
      case 'BUS': return 'directions_bus';
      case 'UBER': return 'local_taxi';
      case 'SUBWAY': return 'train';
      default: return 'directions';
    }
  };

  // Helper function to get route color
  const getRouteColor = (type: string) => {
    switch (type) {
      case 'FLIGHT': return 'text-blue-600 dark:text-blue-400';
      case 'BUS': return 'text-green-600 dark:text-green-400';
      case 'UBER': return 'text-yellow-600 dark:text-yellow-400';
      case 'SUBWAY': return 'text-purple-600 dark:text-purple-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const handleSearchRoutes = async () => {
    if (!selectedOrigin || !selectedDestination) {
      alert("Lütfen hem origin hem de destination seçiniz.");
      return;
    }

    if (selectedOrigin.id === selectedDestination.id) {
      alert("Origin ve destination aynı olamaz.");
      return;
    }

    try {
      setIsSearching(true);
      console.log("Searching routes:", {
        originId: selectedOrigin.id,
        originName: selectedOrigin.name,
        destinationId: selectedDestination.id,
        destinationName: selectedDestination.name,
      });

      // Direct API call to backend
      const response = await fetch(
        `http://localhost:8080/routes?originId=${selectedOrigin.id}&destinationId=${selectedDestination.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RoutesResponse = await response.json();
      console.log("Routes found:", data);
      setRoutesData(data);
    } catch (error) {
      console.error("Error searching routes:", error);
      alert("Rotalar aranırken bir hata oluştu.");
    } finally {
      setIsSearching(false);
    }
  };

  // Filter origins based on search
  const filteredOrigins = useMemo(() => {
    return locations.filter((location) =>
      location.name.toLowerCase().includes(originSearch.toLowerCase()) ||
      location.locationCode.toLowerCase().includes(originSearch.toLowerCase()) ||
      location.city.toLowerCase().includes(originSearch.toLowerCase())
    );
  }, [originSearch, locations]);

  // Filter destinations based on search
  const filteredDestinations = useMemo(() => {
    return locations.filter((location) =>
      location.name.toLowerCase().includes(destinationSearch.toLowerCase()) ||
      location.locationCode.toLowerCase().includes(destinationSearch.toLowerCase()) ||
      location.city.toLowerCase().includes(destinationSearch.toLowerCase())
    );
  }, [destinationSearch, locations]);

  return (
    <div className="font-[family-name:--font-display] bg-background-light dark:bg-background-dark text-slate-900 dark:text-white antialiased overflow-hidden h-screen flex">
      <SidebarNavigation />
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark relative">
        {/* Global Header */}
        <header className="h-20 bg-surface-light dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-8 shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-primary">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <nav className="flex items-center text-sm font-medium text-gray-400">
              <a className="hover:text-primary transition-colors" href="#">
                Planning
              </a>
              <span className="mx-2 text-gray-300">/</span>
              <span className="text-primary font-semibold">Route Finder</span>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <span className="material-symbols-outlined text-gray-400 text-[24px]">
                notifications
              </span>
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary border-2 border-white"></span>
            </div>
            <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700"></div>
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                IST (Istanbul)
              </p>
              <p className="text-xs text-gray-500">Main Hub</p>
            </div>
          </div>
        </header>
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 pb-24 relative z-10">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Hero Search Section */}
            <section className="flex flex-col gap-8">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-light text-slate-900 dark:text-white tracking-tight">
                  Where do you want to{" "}
                  <span className="font-bold text-slate-900 dark:text-white">
                    fly next?
                  </span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-light text-lg">
                  Calculate optimal routes and aircraft availability.
                </p>
              </div>
              <div className="bg-surface-light dark:bg-surface-dark p-6 md:p-8 rounded-xl shadow-soft dark:shadow-none dark:border dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                  <div className="md:col-span-4 relative group">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
                      Origin
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-primary text-[24px] pointer-events-none">
                        flight_takeoff
                      </span>
                      <input
                        className="w-full h-16 pl-14 pr-6 rounded-full bg-background-light dark:bg-background-dark border-0 text-lg font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 placeholder:text-gray-300 transition-all"
                        placeholder="City or Airport (e.g. IST)"
                        type="text"
                        value={originSearch}
                        onChange={(e) => {
                          setOriginSearch(e.target.value);
                          setShowOriginDropdown(true);
                        }}
                        onFocus={() => setShowOriginDropdown(true)}
                        onBlur={() => setTimeout(() => setShowOriginDropdown(false), 200)}
                      />

                      {/* Origin Dropdown */}
                      {showOriginDropdown && filteredOrigins.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#211113] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                          {filteredOrigins.map((location) => (
                            <button
                              key={location.id}
                              className="w-full text-left px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 last:border-b-0 transition-colors"
                              onClick={() => {
                                setOriginSearch(`${location.name} (${location.locationCode})`);
                                setSelectedOrigin(location);
                                setShowOriginDropdown(false);
                              }}
                            >
                              <div className="font-medium text-slate-900 dark:text-white">{location.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{location.city}, {location.country} • {location.locationCode}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Destination */}
                  <div className="md:col-span-4 relative group">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
                      Destination
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary text-[24px] pointer-events-none transition-colors">
                        flight_land
                      </span>
                      <input
                        className="w-full h-16 pl-14 pr-6 rounded-full bg-background-light dark:bg-background-dark border-0 text-lg font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 placeholder:text-gray-300 transition-all"
                        placeholder="City or Airport (e.g. JFK)"
                        type="text"
                        value={destinationSearch}
                        onChange={(e) => {
                          setDestinationSearch(e.target.value);
                          setShowDestinationDropdown(true);
                        }}
                        onFocus={() => setShowDestinationDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDestinationDropdown(false), 200)}
                      />

                      {/* Destination Dropdown */}
                      {showDestinationDropdown && filteredDestinations.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#211113] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                          {filteredDestinations.map((location) => (
                            <button
                              key={location.id}
                              className="w-full text-left px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 last:border-b-0 transition-colors"
                              onClick={() => {
                                setDestinationSearch(`${location.name} (${location.locationCode})`);
                                setSelectedDestination(location);
                                setShowDestinationDropdown(false);
                              }}
                            >
                              <div className="font-medium text-slate-900 dark:text-white">{location.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{location.city}, {location.country} • {location.locationCode}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Search Button */}
                  <div className="md:col-span-3">
                    <button
                      className="cursor-pointer w-full h-16 rounded-full bg-primary hover:bg-red-700 text-white font-bold text-lg shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleSearchRoutes}
                      disabled={isSearching || !selectedOrigin || !selectedDestination}
                    >
                      <span>{isSearching ? "Searching..." : "Find Routes"}</span>
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                        {isSearching ? "hourglass_empty" : "arrow_forward"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
            {/* Results Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {routesData && routesData.length > 0
                    ? `Found ${routesData.length} Route${routesData.length > 1 ? 's' : ''}`
                    : 'Suggested Routes'
                  }
                </h2>
              </div>

              {/* Cards Container */}
              <div className="grid grid-cols-1 gap-6">
                {routesData && routesData.length > 0 ? (
                  routesData.map((route, index) => {
                    const summary = getRouteSummary(route);
                    if (!summary) return null;

                    return (
                      <div key={index} className="group bg-surface-light dark:bg-surface-dark rounded-xl p-1 shadow-card hover:shadow-lg transition-all duration-300 border border-transparent hover:border-primary/10">
                        <div className="flex flex-col md:flex-row items-center gap-6 p-6">
                          {/* Flight Path Visual */}
                          <div className="flex flex-1 items-center justify-between w-full md:w-auto gap-4 md:gap-12">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                                {summary.origin.locationCode || summary.origin.name.substring(0, 3).toUpperCase()}
                              </div>
                              <div className="text-xs text-gray-400 font-medium uppercase mt-1">
                                {summary.origin.city}
                              </div>
                            </div>

                            <div className="flex-1 flex flex-col items-center px-4 relative min-w-[120px]">
                              <div className="text-xs font-bold text-gray-400 mb-2">
                                {summary.totalSteps} Step{summary.totalSteps > 1 ? 's' : ''}
                              </div>
                              <div className="w-full h-[2px] bg-gray-200 dark:bg-gray-700 relative">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary"></div>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-light dark:bg-surface-dark px-2 text-primary">
                                  <span className={`material-symbols-outlined text-[20px] ${getRouteColor(summary.transportationTypes[0])}`}>
                                    {getTransportationIcon(summary.transportationTypes[0])}
                                  </span>
                                </span>
                              </div>
                              <div className="mt-2 flex gap-1 items-center flex-wrap justify-center">
                                {summary.isDirect ? (
                                  <span className="px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase tracking-wide">
                                    Direct
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-bold uppercase tracking-wide">
                                    {summary.totalSteps - 1} Stop{summary.totalSteps > 2 ? 's' : ''}
                                  </span>
                                )}
                                {/* Transportation type badges */}
                                {[...new Set(summary.transportationTypes)].map((type, typeIndex) => (
                                  <span key={typeIndex} className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                    type === 'FLIGHT' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                                    type === 'BUS' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                                    type === 'UBER' ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                                    type === 'SUBWAY' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                                    'bg-gray-50 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
                                  }`}>
                                    {type}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="text-center">
                              <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                                {summary.destination.locationCode || summary.destination.name.substring(0, 3).toUpperCase()}
                              </div>
                              <div className="text-xs text-gray-400 font-medium uppercase mt-1">
                                {summary.destination.city}
                              </div>
                            </div>
                          </div>

                          {/* Divider (Desktop) */}
                          <div className="hidden md:block w-[1px] h-16 bg-gray-100 dark:bg-gray-700"></div>

                          {/* Route Info & Actions */}
                          <div className="flex flex-row md:flex-col lg:flex-row items-center justify-between w-full md:w-auto gap-6 md:gap-8 flex-shrink-0">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                <span className="material-symbols-outlined">
                                  {getTransportationIcon(summary.transportationTypes[0])}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">
                                  Route #{index + 1}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {summary.totalSteps} Transportation{summary.totalSteps > 1 ? 's' : ''}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button className="cursor-pointer w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors">
                                <span className="material-symbols-outlined text-[20px]">
                                  bookmark
                                </span>
                              </button>
                              <button className="cursor-pointer h-10 px-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all shadow-lg shadow-gray-200 dark:shadow-none">
                                Select
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Route Steps Details */}
                        <div className="px-6 pb-6">
                          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Route Details:</h4>
                            <div className="space-y-2">
                              {route.steps.map((step, stepIndex) => (
                                <div key={stepIndex} className="flex items-center gap-3 text-xs">
                                  <span className={`material-symbols-outlined text-[16px] ${getRouteColor(step.type)}`}>
                                    {getTransportationIcon(step.type)}
                                  </span>
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {step.origin.name} → {step.destination.name}
                                  </span>
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    step.type === 'FLIGHT' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                                    step.type === 'BUS' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                                    step.type === 'UBER' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                                    step.type === 'SUBWAY' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                                    'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
                                  }`}>
                                    {step.type}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  /* No routes message */
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl text-gray-400">
                        search_off
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      No routes found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {selectedOrigin && selectedDestination
                        ? "Try searching for routes between different locations."
                        : "Select origin and destination to search for routes."
                      }
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
