import { useState, useEffect } from "react";
import type { Route } from "./+types/locations";
import { Link } from "react-router";
import { SidebarNavigation } from "../components/SidebarNavigation";
import { Modal } from "../components/Modal";
import { LocationForm } from "../components/LocationForm";
import { Toast, type ToastType } from "../components/Toast";
import { saveLocation } from "../lib/api/location/saveLocation";
import { getAllLocations } from "../lib/api/location/getAllLocations";
import { updateLocation } from "../lib/api/location/updateLocation";
import { deleteLocation } from "../lib/api/location/deleteLocation";
import type { LocationFormData } from "../components/LocationForm";
import { LocationEditModal } from "../components/LocationEditModal";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Locations Library - Turkish Cargo CMS" },
    { name: "description", content: "Manage Locations" },
  ];
}

interface Location {
  id: string;
  code: string;
  airportCode: string;
  name: string;
  city: string;
  country: string;
  createdAt: string;
  color: "red" | "indigo" | "amber" | "emerald" | "purple" | "orange";
}

export default function Locations() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const saveLocationMutation = saveLocation();
  const updateLocationMutation = updateLocation();
  const deleteLocationMutation = deleteLocation();
  const { data: locationsResponse, isLoading, error, refetch } = getAllLocations();

  useEffect(() => {
    console.log("getAllLocations state:", { isLoading, error, locationsResponse });
    // If no response and not currently loading, trigger a refetch to force the request
    if (!locationsResponse && !isLoading) {
      refetch().catch((e) => console.warn("refetch failed:", e));
    }
  }, [isLoading, error, locationsResponse, refetch]);

  const handleCreateLocation = async (data: LocationFormData) => {
    try {
      console.log("Creating location:", data);

      // Call saveLocation API with request body
      const response = await saveLocationMutation.mutateAsync({
        body: {
          code: data.code,
          name: data.name,
          city: data.city,
          country: data.country,
        },
      });

      console.log("Location created successfully:", response);
      setIsModalOpen(false);
      refetch();
      // Show success toast
      setToast({
        message: "Lokasyon başarıyla eklendi!",
        type: "success",
      });
    } catch (error) {
      console.error("Error creating location:", error);

      // Show error toast
      setToast({
        message: "Lokasyon eklenirken bir hata oluştu.",
        type: "error",
      });
    }
  };

  const handleUpdateLocation = async (data: LocationFormData) => {
    if (!selectedLocation) return;

    try {
      console.log("Updating location:", { id: selectedLocation.id, data });

      // Call updateLocation API with request body
      const response = await updateLocationMutation.mutateAsync({
        params: {
          path: { id: selectedLocation.id }
        },
        body: {
          code: data.code,
          name: data.name,
          city: data.city,
          country: data.country,
        },
      });

      console.log("Location updated successfully:", response);
      setIsEditModalOpen(false);
      setSelectedLocation(null);
      refetch();
      // Show success toast
      setToast({
        message: "Lokasyon başarıyla güncellendi!",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating location:", error);

      // Show error toast
      setToast({
        message: "Lokasyon güncellenirken bir hata oluştu.",
        type: "error",
      });
    }
  };

  const handleDeleteLocation = async (locationId: string) => {
    if (!confirm("Bu lokasyonu silmek istediğinizden emin misiniz?")) {
      return;
    }

    try {
      console.log("Deleting location:", locationId);

      await deleteLocationMutation.mutateAsync({
        params: {
            path: { id: locationId },
        }
      });

      console.log("Location deleted successfully");
      await refetch();

      setToast({
        message: "Lokasyon başarıyla silindi!",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting location:", error);
      setToast({
        message: "Lokasyon silinirken bir hata oluştu.",
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
                placeholder="Search locations, codes, or shipments..."
                type="text"
              />
            </div>
          </div>
          {/* Right Actions */}
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

        {/* Page Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
            {/* Breadcrumbs & Title */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <nav className="flex text-sm font-medium text-gray-500 mb-2">
                  <Link to="/" className="hover:text-primary transition-colors">
                    Home
                  </Link>
                  <span className="mx-2 text-gray-300">/</span>
                  <span className="text-gray-900 dark:text-white">Locations</span>
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
                  Create New Location
                </button>
              </div>
            </div>
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-800 overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800">
                      <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider w-24">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                          ID
                          <span className="material-symbols-outlined text-[14px]">
                            unfold_more
                          </span>
                        </div>
                      </th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider w-32">
                        Code
                      </th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        City
                      </th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Country
                      </th>

                      <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {locationsResponse?.map((location) => (
                      <tr
                        key={location.id}
                        className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-500">
                          {location.id}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold border border-gray-200 dark:border-gray-700">
                            {location.locationCode}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${location.color === "red"
                                ? "bg-red-50 text-primary"
                                : `bg-${location.color}-50 text-${location.color}-600`
                                }`}
                            >
                              {location.airportCode}
                            </div>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {location.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {location.city}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {location.country}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              className="p-2 text-blue-900 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors cursor-pointer"
                              title="Edit"
                              onClick={() => {
                                setSelectedLocation(location);
                                setIsEditModalOpen(true);
                              }}
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                edit
                              </span>
                            </button>
                            <button
                              className="p-2 text-gray-400 hover:text-primary hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                              title="Delete"
                              onClick={() => handleDeleteLocation(location.id)}
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                delete
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
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
        {/* Modal */}
        {/* Modal */}
        {isModalOpen && (
          <Modal
            title="Create New Location"
            description="Add a new logistics hub to the network."
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
                  type="submit"
                  form="location-form"
                >
                  <span>Save Location</span>
                  <span className="material-symbols-outlined text-[20px]">
                    check
                  </span>
                </button>
              </>
            }
          >
            <LocationForm onSubmit={handleCreateLocation} />
          </Modal>
        )}

        {/* Edit Location Modal */}
        <LocationEditModal
          isOpen={isEditModalOpen}
          location={selectedLocation}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedLocation(null);
          }}
          onSubmit={handleUpdateLocation}
        />

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
