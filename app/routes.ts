import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("api/chat", "routes/api/chat.ts"),

  index("routes/home.tsx"),
  route("test", "routes/test/route.tsx"),
  route("chat", "routes/chat/route.tsx"),
] satisfies RouteConfig;
