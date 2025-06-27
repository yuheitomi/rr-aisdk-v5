import type { Route } from "./+types/route";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const params = searchParams.get("q") || "";
  return { params };
}

export default function TestRoute({ loaderData }: Route.ComponentProps) {
  const { params } = loaderData;
  return (
    <div>
      <h1>Test Route</h1>
      <p>This is the test route page.</p>
      <p>Query parameter: {params}</p>
    </div>
  );
}
