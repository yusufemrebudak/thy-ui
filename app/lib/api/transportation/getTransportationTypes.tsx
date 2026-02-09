import { $api } from "../api";

export const getTransportationTypes = () => {
  return $api.useQuery(
    "get",
    "/transportations/types",
  );
}
