import { $api } from "../api";

export const deleteTransportation = () => {
  return $api.useMutation("delete", "/transportations/{id}");
};

