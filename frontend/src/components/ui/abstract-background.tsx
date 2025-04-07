export function AbstractBackground() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* Simple gradient orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-grid-slate-200/25 [mask-image:linear-gradient(0deg,white,transparent)] dark:bg-grid-slate-700/25" />
    </div>
  );
} 