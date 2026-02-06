import { $api } from "../api";

export const saveLocation = () => {
  return $api.useMutation("post", "/locations");
};

