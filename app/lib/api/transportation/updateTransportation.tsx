import { $api } from "../api";

export const updateTransportation = () => {
  return $api.useMutation("put", "/transportations/{id}");
};

