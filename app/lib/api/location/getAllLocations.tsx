import { $api } from "../api";

export const getAllLocations = () => {
  return $api.useQuery(
    "get",
    "/locations",
  );
};

