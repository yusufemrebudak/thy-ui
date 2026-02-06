import { $api } from "../api";

export const getAllTransportations = () => {
  return $api.useQuery(
    "get",
    "/transportations",
  );
}