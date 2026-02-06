import { $api } from "../api";

export const updateLocation = () => {
  return $api.useMutation("put", "/locations/{id}");
};

