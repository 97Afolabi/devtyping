export default function StaticPageLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="font-mono text-3xl font-bold mb-6">{title}</h1>
      <div className="space-y-4 leading-relaxed">{children}</div>
    </div>
  );
}
