import { $api } from "../api";

export const getTransportation = (id: number) => {
  return $api.useQuery(
    "get",
    "/transportations/{id}",
    {
      params: {
        path: {
          id,
        },
      },
    }
  );
};

