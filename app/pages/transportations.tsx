import type { Route } from "./+types/transportations";
import { Link } from "react-router";
import { SidebarNavigation } from "../components/SidebarNavigation";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Transportations" },
    { name: "description", content: "Manage Transportations" },
  ];
}

export default function Transportations() {
  return (
    <div className="font-[family-name:--font-display] bg-background-light dark:bg-background-dark text-slate-900 dark:text-white antialiased overflow-hidden h-screen flex">
      <SidebarNavigation />
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark relative">
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 pb-24 relative z-10">
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl font-bold mb-4">Transportations</h1>
            <p className="text-lg text-gray-600 mb-8">Manage your transportations here.</p>
            <Link to="/" className="text-blue-500 hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
