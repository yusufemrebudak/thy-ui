import { useForm, type SubmitHandler } from "react-hook-form";

export interface LocationFormData {
  code: string;
  name: string;
  country: string;
  city: string;
}

interface LocationFormProps {
  onSubmit: SubmitHandler<LocationFormData>;
  initialData?: Partial<LocationFormData>;
  formId?: string;
}

export function LocationForm({ onSubmit, initialData, formId = "location-form" }: LocationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LocationFormData>({
    defaultValues: initialData,
  });

  return (
    <form
      id={formId}
      className="flex flex-col gap-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-semibold text-gray-700 dark:text-gray-200"
          htmlFor="code"
        >
          Location Code (IATA) <span className="text-gray-400">(Optional)</span>
        </label>
        <div className="relative group">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">
              flight_takeoff
            </span>
          </span>
          <input
            className={`w-full h-12 pl-11 pr-4 bg-gray-50 dark:bg-[#211113] border rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all uppercase tracking-wider font-medium ${errors.code
              ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
              : "border-gray-200 dark:border-gray-700"
              }`}
            id="code"
            maxLength={3}
            placeholder="e.g. IST"
            type="text"
            {...register("code", {
              minLength: {
                value: 3,
                message: "Must be exactly 3 characters",
              },
              maxLength: {
                value: 3,
                message: "Must be exactly 3 characters",
              },
              pattern: {
                value: /^[A-Za-z]{3}$/,
                message: "Must confirm to IATA format (3 letters)",
              },
            })}
          />
        </div>
        {errors.code ? (
          <p className="text-xs text-red-500">{errors.code.message}</p>
        ) : (
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Optional 3-letter IATA code.
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-semibold text-gray-700 dark:text-gray-200"
          htmlFor="name"
        >
          Location Name
        </label>
        <div className="relative group">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">
              warehouse
            </span>
          </span>
          <input
            className={`w-full h-12 pl-11 pr-4 bg-gray-50 dark:bg-[#211113] border rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${errors.name
              ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
              : "border-gray-200 dark:border-gray-700"
              }`}
            id="name"
            placeholder="e.g. Istanbul Airport Hub"
            type="text"
            {...register("name", { required: "Location name is required" })}
          />
        </div>
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-semibold text-gray-700 dark:text-gray-200"
            htmlFor="country"
          >
            Country
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined text-[20px]">
                public
              </span>
            </span>
            <input
              className={`w-full h-12 pl-11 pr-4 bg-gray-50 dark:bg-[#211113] border rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${errors.country
                ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                : "border-gray-200 dark:border-gray-700"
                }`}
              id="country"
              placeholder="e.g. Turkey"
              type="text"
              {...register("country", { required: "Country is required" })}
            />
          </div>
          {errors.country && (
            <p className="text-xs text-red-500">{errors.country.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-semibold text-gray-700 dark:text-gray-200"
            htmlFor="city"
          >
            City
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined text-[20px]">
                location_city
              </span>
            </span>
            <input
              className={`w-full h-12 pl-11 pr-4 bg-gray-50 dark:bg-[#211113] border rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${errors.city
                ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                : "border-gray-200 dark:border-gray-700"
                }`}
              id="city"
              placeholder="e.g. Istanbul"
              type="text"
              {...register("city", { required: "City is required" })}
            />
          </div>
          {errors.city && (
            <p className="text-xs text-red-500">{errors.city.message}</p>
          )}
        </div>
      </div>
    </form>
  );
}

