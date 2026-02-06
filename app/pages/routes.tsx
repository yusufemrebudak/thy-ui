import type { Route } from "./+types/routes";
import { Link } from "react-router";
import { useState } from "react";
import { SidebarNavigation } from "../components/SidebarNavigation";

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

export default function Routes() {
  const [directFlightsOnly, setDirectFlightsOnly] = useState(false);
  const [cargoPriority, setCargoPriority] = useState(false);

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
                  Where is your cargo{" "}
                  <span className="font-bold text-slate-900 dark:text-white">
                    flying next?
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
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-5 text-primary text-[24px]">
                        flight_takeoff
                      </span>
                      <input
                        className="w-full h-16 pl-14 pr-6 rounded-full bg-background-light dark:bg-background-dark border-0 text-lg font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 placeholder:text-gray-300 transition-all"
                        placeholder="City or Airport (e.g. IST)"
                        type="text"
                        defaultValue="Istanbul (IST)"
                      />
                    </div>
                  </div>
                  {/* Destination */}
                  <div className="md:col-span-4 relative group">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
                      Destination
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-5 text-gray-400 group-focus-within:text-primary text-[24px] transition-colors">
                        flight_land
                      </span>
                      <input
                        className="w-full h-16 pl-14 pr-6 rounded-full bg-background-light dark:bg-background-dark border-0 text-lg font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 placeholder:text-gray-300 transition-all"
                        placeholder="City or Airport (e.g. JFK)"
                        type="text"
                      />
                    </div>
                  </div>
                  {/* Search Button */}
                  <div className="md:col-span-3">
                    <button className="cursor-pointer w-full h-16 rounded-full bg-primary hover:bg-red-700 text-white font-bold text-lg shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 group">
                      <span>Find Routes</span>
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                        arrow_forward
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
                  Suggested Routes
                </h2>
              </div>
              {/* Cards Container */}
              <div className="grid grid-cols-1 gap-6">
                {/* Route Card 1 */}
                <div className="group bg-surface-light dark:bg-surface-dark rounded-xl p-1 shadow-card hover:shadow-lg transition-all duration-300 border border-transparent hover:border-primary/10">
                  <div className="flex flex-col md:flex-row items-center gap-6 p-6">
                    {/* Flight Path Visual */}
                    <div className="flex flex-1 items-center justify-between w-full md:w-auto gap-4 md:gap-12">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                          IST
                        </div>
                        <div className="text-xs text-gray-400 font-medium uppercase mt-1">
                          Istanbul
                        </div>
                        <div className="text-sm font-semibold text-primary mt-2">
                          10:45 AM
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col items-center px-4 relative min-w-[120px]">
                        <div className="text-xs font-bold text-gray-400 mb-2">
                          10h 45m
                        </div>
                        <div className="w-full h-[2px] bg-gray-200 dark:bg-gray-700 relative">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary"></div>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-light dark:bg-surface-dark px-2 text-primary">
                            <span className="material-symbols-outlined rotate-90 text-[20px]">
                              flight
                            </span>
                          </span>
                        </div>
                        <div className="mt-2 flex gap-1 items-center">
                          <span className="px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase tracking-wide">
                            Direct
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                          JFK
                        </div>
                        <div className="text-xs text-gray-400 font-medium uppercase mt-1">
                          New York
                        </div>
                        <div className="text-sm font-semibold text-gray-500 mt-2">
                          03:30 PM
                        </div>
                      </div>
                    </div>
                    {/* Divider (Desktop) */}
                    <div className="hidden md:block w-[1px] h-16 bg-gray-100 dark:bg-gray-700"></div>
                    {/* Plane Info & Actions */}
                    <div className="flex flex-row md:flex-col lg:flex-row items-center justify-between w-full md:w-auto gap-6 md:gap-8 flex-shrink-0">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                          <span className="material-symbols-outlined">
                            airplane_ticket
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white">
                            Airbus A330
                          </div>
                          <div className="text-xs text-gray-400">
                            Wide Body • Cargo Capable
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
                </div>
                {/* Route Card 2 */}
                <div className="group bg-surface-light dark:bg-surface-dark rounded-xl p-1 shadow-card hover:shadow-lg transition-all duration-300 border border-transparent hover:border-primary/10">
                  <div className="flex flex-col md:flex-row items-center gap-6 p-6">
                    {/* Flight Path Visual */}
                    <div className="flex flex-1 items-center justify-between w-full md:w-auto gap-4 md:gap-12">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                          IST
                        </div>
                        <div className="text-xs text-gray-400 font-medium uppercase mt-1">
                          Istanbul
                        </div>
                        <div className="text-sm font-semibold text-primary mt-2">
                          08:15 AM
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col items-center px-4 relative min-w-[120px]">
                        <div className="text-xs font-bold text-gray-400 mb-2">
                          4h 05m
                        </div>
                        <div className="w-full h-[2px] bg-gray-200 dark:bg-gray-700 relative">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary"></div>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-light dark:bg-surface-dark px-2 text-primary">
                            <span className="material-symbols-outlined rotate-90 text-[20px]">
                              flight
                            </span>
                          </span>
                        </div>
                        <div className="mt-2 flex gap-1 items-center">
                          <span className="px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase tracking-wide">
                            Direct
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wide">
                            Daily
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                          LHR
                        </div>
                        <div className="text-xs text-gray-400 font-medium uppercase mt-1">
                          London
                        </div>
                        <div className="text-sm font-semibold text-gray-500 mt-2">
                          10:20 AM
                        </div>
                      </div>
                    </div>
                    {/* Divider (Desktop) */}
                    <div className="hidden md:block w-[1px] h-16 bg-gray-100 dark:bg-gray-700"></div>
                    {/* Plane Info & Actions */}
                    <div className="flex flex-row md:flex-col lg:flex-row items-center justify-between w-full md:w-auto gap-6 md:gap-8 flex-shrink-0">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                          <span className="material-symbols-outlined">
                            airlines
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white">
                            Boeing 777
                          </div>
                          <div className="text-xs text-gray-400">
                            Long Range • High Cap
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
                </div>
                {/* Route Card 3 */}
                <div className="group bg-surface-light dark:bg-surface-dark rounded-xl p-1 shadow-card hover:shadow-lg transition-all duration-300 border border-transparent hover:border-primary/10">
                  <div className="flex flex-col md:flex-row items-center gap-6 p-6">
                    {/* Flight Path Visual */}
                    <div className="flex flex-1 items-center justify-between w-full md:w-auto gap-4 md:gap-12">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                          IST
                        </div>
                        <div className="text-xs text-gray-400 font-medium uppercase mt-1">
                          Istanbul
                        </div>
                        <div className="text-sm font-semibold text-primary mt-2">
                          11:30 PM
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col items-center px-4 relative min-w-[120px]">
                        <div className="text-xs font-bold text-gray-400 mb-2">
                          4h 25m
                        </div>
                        <div className="w-full h-[2px] bg-gray-200 dark:bg-gray-700 relative">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary"></div>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-light dark:bg-surface-dark px-2 text-primary">
                            <span className="material-symbols-outlined rotate-90 text-[20px]">
                              flight
                            </span>
                          </span>
                        </div>
                        <div className="mt-2 flex gap-1 items-center">
                          <span className="px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-bold uppercase tracking-wide">
                            1 Stop
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                          DXB
                        </div>
                        <div className="text-xs text-gray-400 font-medium uppercase mt-1">
                          Dubai
                        </div>
                        <div className="text-sm font-semibold text-gray-500 mt-2">
                          04:55 AM
                        </div>
                      </div>
                    </div>
                    {/* Divider (Desktop) */}
                    <div className="hidden md:block w-[1px] h-16 bg-gray-100 dark:bg-gray-700"></div>
                    {/* Plane Info & Actions */}
                    <div className="flex flex-row md:flex-col lg:flex-row items-center justify-between w-full md:w-auto gap-6 md:gap-8 flex-shrink-0">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                          <span className="material-symbols-outlined">
                            flight
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white">
                            Airbus A321 Neo
                          </div>
                          <div className="text-xs text-gray-400">
                            Narrow Body • Eco
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
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
