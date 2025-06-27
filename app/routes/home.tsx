export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <p className="text-center text-lg text-stone-600">
        <span className="font-bold">Vercel AI SDK v5</span> Playground with{" "}
        <span className="font-bold">React Router v7</span>
      </p>
    </div>
  );
}
