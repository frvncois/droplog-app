export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Droplog</h1>
          <p className="text-muted-foreground mt-2">
            Project management made simple
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
