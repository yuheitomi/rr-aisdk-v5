import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("test", "routes/test/route.tsx"),
	route("api/chat", "routes/api/chat.ts"),
	route("chat", "routes/chat/route.tsx"),
] satisfies RouteConfig;
