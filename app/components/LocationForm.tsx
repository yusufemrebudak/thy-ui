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
    setValue,
    formState: { errors },
  } = useForm<LocationFormData>({
    defaultValues: initialData,
  });

  const handleLocationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
    setValue('code', value);
  };

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
          Location Code <span className="text-gray-400">(Optional)</span>
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
            maxLength={5}
            placeholder="e.g. IST"
            type="text"
            {...register("code", {
              minLength: {
                value: 2,
                message: "Must be between 2-5 characters",
              },
              maxLength: {
                value: 5,
                message: "Must be between 2-5 characters",
              },
              pattern: {
                value: /^[A-Z]{2,5}$/,
                message: "Must contain only letters (2-5 characters)",
              },
            })}
            onChange={handleLocationCodeChange}
          />
        </div>
        {errors.code ? (
          <p className="text-xs text-red-500">{errors.code.message}</p>
        ) : (
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Optional 2-5 letter location code (automatically converted to uppercase).
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

