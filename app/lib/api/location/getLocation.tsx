import { $api } from "../api";

export const getLocation = (id: number) => {
  return $api.useQuery(
    "get",
    "/locations/{id}",
    {
      params: {
        path: {
          id,
        },
      },
    }
  );
};

