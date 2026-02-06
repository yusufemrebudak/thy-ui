import { $api } from "../api";

export const findRoutes = (originId: number, destinationId: number, date?: string) => {
  return $api.useQuery(
    "get",
    "/routes",
    {
      params: {
        query: {
          originId,
          destinationId,
          ...(date && { date }),
        },
      },
    }
  );
};

