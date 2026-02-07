import { useState, useEffect } from "react";
import type { Route } from "./+types/transportations";
import { Link } from "react-router";
import { SidebarNavigation } from "../components/SidebarNavigation";
import { Modal } from "../components/Modal";
import { Toast, type ToastType } from "../components/Toast";
import { getAllTransportations } from "../lib/api/transportation/getAllTransportations";
import { getAllLocations } from "../lib/api/location/getAllLocations";
import { saveTransportation } from "../lib/api/transportation/saveTransportation";
import { updateTransportation } from "../lib/api/transportation/updateTransportation";
import { deleteTransportation } from "../lib/api/transportation/deleteTransportation";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Transportations Library - Turkish Cargo CMS" },
    { name: "description", content: "Manage Transportations" },
  ];
}

// Helper function to convert day numbers to Turkish day names
const dayNumberToName: { [key: number]: string } = {
  1: "Pzt",
  2: "Salı",
  3: "Çar",
  4: "Prş",
  5: "Cuma",
  6: "Cmt",
  7: "Pzr",
};

const fullDayNames: { [key: string]: number } = {
  "pazartesi": 1,
  "pzt": 1,
  "salı": 2,
  "çarşamba": 3,
  "çar": 3,
  "perşembe": 4,
  "prş": 4,
  "cuma": 5,
  "cumartesi": 6,
  "cmt": 6,
  "pazar": 7,
  "pzr": 7,
};

const getDayNames = (dayNumbers: number[]): string => {
  // If empty array or contains all 7 days, show "All Days"
  if (dayNumbers.length === 0 || (dayNumbers.length === 7 && dayNumbers.every((day) => day >= 1 && day <= 7))) {
    return "All Days";
  }

  return dayNumbers
    .sort((a, b) => a - b)
    .map((day) => dayNumberToName[day] || "")
    .filter((day) => day !== "")
    .join(", ");
};

const getDayNumbers = (dayNames: string): number[] => {
  return dayNames
    .split(",")
    .map((name) => {
      const trimmedName = name.trim().toLowerCase();
      return fullDayNames[trimmedName];
    })
    .filter((num) => num !== undefined);
};

interface Transportation {
  id: number;
  type: string;
  origin: {
    id: number;
    locationCode: string;
    name: string;
    city: string;
    country: string;
  };
  destination: {
    id: number;
    locationCode: string;
    name: string;
    city: string;
    country: string;
  };
  operatingDays: number[];
  version: number;
}

interface TransportationFormData {
  type: string;
  originId: number;
  destinationId: number;
  operatingDays: number[];
}

export default function Transportations() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTransportation, setSelectedTransportation] = useState<Transportation | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const [formData, setFormData] = useState<TransportationFormData>({
    type: "",
    originId: 0,
    destinationId: 0,
    operatingDays: [],
  });
  const [sortConfig, setSortConfig] = useState<{
    key: "id" | "type" | "origin" | "destination" | "operatingDays";
    direction: "asc" | "desc";
  }>({ key: "id", direction: "asc" });

  const saveTransportationMutation = saveTransportation();
  const updateTransportationMutation = updateTransportation();
  const deleteTransportationMutation = deleteTransportation();
  const { data: transportationsResponse, isLoading, error, refetch } = getAllTransportations();
  const { data: locationsResponse } = getAllLocations();

  // Handle both direct array and wrapped response
  const transportationsData: Transportation[] = Array.isArray(transportationsResponse)
    ? transportationsResponse
    : (transportationsResponse as any)?.data || [];
  const locations = Array.isArray(locationsResponse)
    ? locationsResponse
    : (locationsResponse as any)?.data || [];

  // Sort transportations based on sortConfig
  const transportations = [...transportationsData].sort((a, b) => {
    let aValue: any = a[sortConfig.key];
    let bValue: any = b[sortConfig.key];

    // Handle nested properties
    if (sortConfig.key === "origin") {
      aValue = a.origin.name;
      bValue = b.origin.name;
    } else if (sortConfig.key === "destination") {
      aValue = a.destination.name;
      bValue = b.destination.name;
    } else if (sortConfig.key === "operatingDays") {
      aValue = getDayNames(a.operatingDays);
      bValue = getDayNames(b.operatingDays);
    }

    // Compare values
    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = (bValue as string).toLowerCase();
      return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    if (sortConfig.direction === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (key: "id" | "type" | "origin" | "destination" | "operatingDays") => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }));
  };

  useEffect(() => {
    console.log("getAllTransportations state:", { isLoading, error, transportationsResponse });
    if (!transportationsResponse && !isLoading) {
      refetch().catch((e) => console.warn("refetch failed:", e));
    }
  }, [isLoading, error, transportationsResponse, refetch]);

  const handleCreateTransportation = async () => {
    try {
      console.log("Creating transportation:", formData);

      await saveTransportationMutation.mutateAsync({
        body: {
          type: formData.type,
          originId: formData.originId,
          destinationId: formData.destinationId,
          operatingDays: formData.operatingDays,
        },
      });

      setIsModalOpen(false);
      setFormData({ type: "", originId: 0, destinationId: 0, operatingDays: [] });
      await refetch();

      setToast({
        message: "Rota başarıyla eklendi!",
        type: "success",
      });
    } catch (error: any) {
      console.error("Error creating transportation:", error);

      // Get API error message or fallback to default message
      const errorMessage = error?.response?.data?.message ||
                          error?.message ||
                          "Rota eklenirken bir hata oluştu.";

      setToast({
        message: errorMessage,
        type: "error",
      });
    }
  };

  const handleUpdateTransportation = async () => {
    if (!selectedTransportation) return;

    try {
      console.log("Updating transportation:", { id: selectedTransportation.id, operatingDays: formData.operatingDays });

      await updateTransportationMutation.mutateAsync({
        params: {
            path:{
                id: selectedTransportation.id
                }
          },
        body: {
          operatingDays: formData.operatingDays,
        },
      });

      setIsEditModalOpen(false);
      setSelectedTransportation(null);
      setFormData({ type: "", originId: 0, destinationId: 0, operatingDays: [] });
      await refetch();

      setToast({
        message: "Rota başarıyla güncellendi!",
        type: "success",
      });
    } catch (error: any) {
      console.error("Error updating transportation:", error);

      // Get API error message or fallback to default message
      const errorMessage = error?.response?.data?.message ||
                          error?.message ||
                          "Rota güncellenirken bir hata oluştu.";

      setToast({
        message: errorMessage,
        type: "error",
      });
    }
  };

  const handleDeleteTransportation = async (transportationId: string) => {
    if (!confirm("Bu rotayı silmek istediğinizden emin misiniz?")) {
      return;
    }

    try {
      console.log("Deleting transportation:", transportationId);

      await deleteTransportationMutation.mutateAsync({
        params: {
            path: {
          id: transportationId,
        }},
      });

      await refetch();

      setToast({
        message: "Rota başarıyla silindi!",
        type: "success",
      });
    } catch (error: any) {
      console.error("Error deleting transportation:", error);

      // Get API error message or fallback to default message
      const errorMessage = error?.response?.data?.message ||
                          error?.message ||
                          "Rota silinirken bir hata oluştu.";

      setToast({
        message: errorMessage,
        type: "error",
      });
    }
  };

  return (
    <div className="font-[family-name:--font-display] bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 font-display overflow-hidden h-screen flex">
      <SidebarNavigation />
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        <header className="h-20 bg-white dark:bg-[#1E1E1E] border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-8 z-10 flex-shrink-0">
          <div className="flex-1 max-w-lg">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">
                  search
                </span>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2.5 border-none rounded-xl bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm"
                placeholder="Search transportations..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 ml-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-white/5">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-white dark:border-[#1E1E1E]"></span>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-white/5">
              <span className="material-symbols-outlined">help</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <nav className="flex text-sm font-medium text-gray-500 mb-2">
                  <Link to="/" className="hover:text-primary transition-colors">
                    Home
                  </Link>
                  <span className="mx-2 text-gray-300">/</span>
                  <span className="text-gray-900 dark:text-white">Transportations</span>
                </nav>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-full hover:bg-red-700 hover:shadow-lg hover:shadow-primary/30 transition-all shadow-md group cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
                  <span className="material-symbols-outlined text-[20px] group-hover:rotate-90 transition-transform duration-300">
                    add
                  </span>
                  Create New Transportation
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-800 overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800">
                      <th
                        className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        onClick={() => handleSort("id")}
                      >
                        <div className="flex items-center gap-1">
                          ID
                          <span className="material-symbols-outlined text-[14px]">
                            {sortConfig.key === "id" ? (sortConfig.direction === "asc" ? "arrow_upward" : "arrow_downward") : "unfold_more"}
                          </span>
                        </div>
                      </th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Origin</th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Destination</th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Operating Days</th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined animate-spin">hourglass_empty</span>
                            <span className="text-gray-500">Yükleniyor...</span>
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-red-500">error</span>
                            <span className="text-gray-500">Taşımalar yüklenirken bir hata oluştu.</span>
                          </div>
                        </td>
                      </tr>
                    ) : transportations.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">Taşıma bulunamadı.</td>
                      </tr>
                    ) : (
                      transportations.map((transportation) => (
                        <tr
                          key={transportation.id}
                          className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-500">{transportation.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{transportation.type}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{transportation.origin.name}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{transportation.destination.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{getDayNames(transportation.operatingDays)}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button
                                className="p-2 text-blue-900 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors cursor-pointer"
                                title="Edit"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTransportation(transportation);
                                  setFormData({
                                    type: transportation.type,
                                    originId: transportation.origin.id,
                                    destinationId: transportation.destination.id,
                                    operatingDays: transportation.operatingDays,
                                  });
                                  setIsEditModalOpen(true);
                                }}
                              >
                                <span className="material-symbols-outlined text-[20px]">edit</span>
                              </button>
                              <button
                                className="p-2 text-gray-400 hover:text-primary hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                                title="Delete"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTransportation(transportation.id.toString());
                                }}
                              >
                                <span className="material-symbols-outlined text-[20px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <footer className="mt-8 mb-4 flex justify-between items-center text-xs text-gray-400">
              <p>© 2026 Turkish Airlines Cargo. All rights reserved.</p>
              <div className="flex gap-4">
                <a className="hover:text-primary transition-colors" href="#">
                  Privacy Policy
                </a>
                <a className="hover:text-primary transition-colors" href="#">
                  Terms of Service
                </a>
              </div>
            </footer>
          </div>
        </div>

        {/* Create Transportation Modal */}
        {isModalOpen && (
          <Modal
            title="Create New Route"
            description="Add a new transportation route to the network."
            onClose={() => setIsModalOpen(false)}
            footer={
              <>
                <button
                  className="w-full sm:w-auto px-6 h-12 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium hover:bg-white dark:hover:bg-gray-800 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 focus:outline-none transition-all cursor-pointer"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="w-full sm:w-auto px-8 h-12 rounded-full bg-primary text-white font-semibold shadow-[0_4px_10px_rgba(232,23,47,0.3)] hover:bg-primary-dark hover:shadow-[0_6px_15px_rgba(232,23,47,0.4)] active:transform active:scale-95 focus:ring-4 focus:ring-primary/30 focus:outline-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                  onClick={handleCreateTransportation}
                >
                  <span>Save Route</span>
                  <span className="material-symbols-outlined text-[20px]">check</span>
                </button>
              </>
            }
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="type">
                  Type
                </label>
                <select
                  className="w-full h-12 px-4 bg-gray-50 dark:bg-[#211113] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="">Select Type...</option>
                  <option value="FLIGHT">FLIGHT</option>
                  <option value="BUS">BUS</option>
                  <option value="UBER">UBER</option>
                  <option value="SUBWAY">SUBWAY</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="origin">
                  Origin Location
                </label>
                <select
                  className="w-full h-12 px-4 bg-gray-50 dark:bg-[#211113] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                  id="origin"
                  value={formData.originId}
                  onChange={(e) => setFormData({ ...formData, originId: parseInt(e.target.value) || 0 })}
                >
                  <option value="">Select Origin...</option>
                  {locations.map((location: any) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="destination">
                  Destination Location
                </label>
                <select
                  className="w-full h-12 px-4 bg-gray-50 dark:bg-[#211113] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                  id="destination"
                  value={formData.destinationId}
                  onChange={(e) => setFormData({ ...formData, destinationId: parseInt(e.target.value) || 0 })}
                >
                  <option value="">Select Destination...</option>
                  {locations.map((location: any) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Operating Days
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { num: 1, name: "Pzt" },
                    { num: 2, name: "Salı" },
                    { num: 3, name: "Çar" },
                    { num: 4, name: "Prş" },
                    { num: 5, name: "Cuma" },
                    { num: 6, name: "Cmt" },
                    { num: 7, name: "Pzr" },
                  ].map((day) => (
                    <label key={day.num} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.operatingDays.includes(day.num)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              operatingDays: [...formData.operatingDays, day.num].sort((a, b) => a - b),
                            });
                          } else {
                            setFormData({
                              ...formData,
                              operatingDays: formData.operatingDays.filter((d) => d !== day.num),
                            });
                          }
                        }}
                        className="w-4 h-4 rounded accent-primary cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{day.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* Edit Transportation Modal */}
        {isEditModalOpen && selectedTransportation && (
          <Modal
            title="Edit Route"
            description="Update the route details."
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedTransportation(null);
              setFormData({ type: "", originId: 0, destinationId: 0, operatingDays: [] });
            }}
            footer={
              <>
                <button
                  className="w-full sm:w-auto px-6 h-12 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium hover:bg-white dark:hover:bg-gray-800 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 focus:outline-none transition-all cursor-pointer"
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedTransportation(null);
                    setFormData({ type: "", originId: 0, destinationId: 0, operatingDays: [] });
                  }}
                >
                  Cancel
                </button>
                <button
                  className="w-full sm:w-auto px-8 h-12 rounded-full bg-primary text-white font-semibold shadow-[0_4px_10px_rgba(232,23,47,0.3)] hover:bg-primary-dark hover:shadow-[0_6px_15px_rgba(232,23,47,0.4)] active:transform active:scale-95 focus:ring-4 focus:ring-primary/30 focus:outline-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                  onClick={handleUpdateTransportation}
                >
                  <span>Update Route</span>
                  <span className="material-symbols-outlined text-[20px]">check</span>
                </button>
              </>
            }
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="edit-type">
                  Type
                </label>
                <select
                  className="w-full h-12 px-4 bg-gray-50 dark:bg-[#211113] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-500 focus:outline-none transition-all appearance-none cursor-not-allowed opacity-60"
                  id="edit-type"
                  value={formData.type}
                  disabled
                >
                  <option value={formData.type}>{formData.type}</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="edit-origin">
                  Origin Location
                </label>
                <select
                  className="w-full h-12 px-4 bg-gray-50 dark:bg-[#211113] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-500 placeholder-gray-400 focus:outline-none transition-all appearance-none cursor-not-allowed opacity-60"
                  id="edit-origin"
                  value={formData.originId}
                  disabled
                >
                  <option value={formData.originId}>{selectedTransportation?.origin.name}</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="edit-destination">
                  Destination Location
                </label>
                <select
                  className="w-full h-12 px-4 bg-gray-50 dark:bg-[#211113] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-500 placeholder-gray-400 focus:outline-none transition-all appearance-none cursor-not-allowed opacity-60"
                  id="edit-destination"
                  value={formData.destinationId}
                  disabled
                >
                  <option value={formData.destinationId}>{selectedTransportation?.destination.name}</option>
                </select>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Operating Days
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { num: 1, name: "Pzt" },
                    { num: 2, name: "Salı" },
                    { num: 3, name: "Çar" },
                    { num: 4, name: "Prş" },
                    { num: 5, name: "Cuma" },
                    { num: 6, name: "Cmt" },
                    { num: 7, name: "Pzr" },
                  ].map((day) => (
                    <label key={day.num} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.operatingDays.includes(day.num)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              operatingDays: [...formData.operatingDays, day.num].sort((a, b) => a - b),
                            });
                          } else {
                            setFormData({
                              ...formData,
                              operatingDays: formData.operatingDays.filter((d) => d !== day.num),
                            });
                          }
                        }}
                        className="w-4 h-4 rounded accent-primary cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{day.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </main>
    </div>
  );
}
