import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/locations.tsx"),
  route("transportations", "pages/transportations.tsx"),
  route("routes", "pages/routes.tsx"),
] satisfies RouteConfig;
