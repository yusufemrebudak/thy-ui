import { $api } from "../api";

export const saveTransportation = () => {
  return $api.useMutation("post", "/transportations");
}
