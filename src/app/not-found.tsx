import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 z-10">
      <h2 className="text-2xl font-bold text-slate-200">404 - Page Not Found</h2>
      <p className="text-slate-400 mt-2">Could not find requested page</p>
      <Link
        href="/"
        className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm hover:bg-cyan-600 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
