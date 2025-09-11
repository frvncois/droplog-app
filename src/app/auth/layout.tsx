export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding/Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
        <div className="relative z-10 flex items-center justify-center w-full">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">Droplog</h1>
            <p className="text-slate-300 text-lg max-w-md">
              Web-based project management and annotation platform for teams
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:hidden">
            <h1 className="text-3xl font-bold">Droplog</h1>
            <p className="text-muted-foreground mt-2">
              Project management made simple
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}