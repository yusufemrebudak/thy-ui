import { Modal } from "./Modal";
import { LocationForm } from "./LocationForm";
import type { LocationFormData } from "./LocationForm";

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

interface LocationEditModalProps {
  isOpen: boolean;
  location: Location | null;
  onClose: () => void;
  onSubmit: (data: LocationFormData) => Promise<void>;
  isLoading?: boolean;
}

export function LocationEditModal({
  isOpen,
  location,
  onClose,
  onSubmit,
  isLoading = false,
}: LocationEditModalProps) {
  if (!isOpen || !location) return null;

  return (
    <Modal
      title="Edit Location"
      description="Update the location details."
      onClose={onClose}
      footer={
        <>
          <button
            className="w-full sm:w-auto px-6 h-12 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium hover:bg-white dark:hover:bg-gray-800 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 focus:outline-none transition-all cursor-pointer disabled:opacity-50"
            type="button"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="w-full sm:w-auto px-8 h-12 rounded-full bg-primary text-white font-semibold shadow-[0_4px_10px_rgba(232,23,47,0.3)] hover:bg-primary-dark hover:shadow-[0_6px_15px_rgba(232,23,47,0.4)] active:transform active:scale-95 focus:ring-4 focus:ring-primary/30 focus:outline-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            type="submit"
            form="location-edit-form"
            disabled={isLoading}
          >
            <span>{isLoading ? "Updating..." : "Update Location"}</span>
            <span className="material-symbols-outlined text-[20px]">
              {isLoading ? "hourglass_empty" : "check"}
            </span>
          </button>
        </>
      }
    >
      <LocationForm
        onSubmit={onSubmit}
        initialData={{
          code: location.locationCode,
          name: location.name,
          city: location.city,
          country: location.country,
        }}
        formId="location-edit-form"
      />
    </Modal>
  );
}

