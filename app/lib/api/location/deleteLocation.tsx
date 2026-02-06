import { $api } from "../api";

export const deleteLocation = () => {
  return $api.useMutation("delete", "/locations/{id}");
};

