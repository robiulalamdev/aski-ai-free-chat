import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-4">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 mb-6">
          <span className="text-3xl font-bold text-white">404</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Page Not Found</h1>
        <p className="mt-2 text-sm text-zinc-500 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-violet-600/20 transition-all hover:brightness-110 hover:shadow-violet-600/30 active:scale-[0.98]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
