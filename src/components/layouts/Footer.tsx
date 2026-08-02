import Link from "next/link";

const links = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/attribution", label: "Attribution" },
];

export default function Footer() {
  return (
    <footer className="w-full text-center bg-slate-900 text-white py-4">
      <Link
        href="/"
        className="font-mono text-xl font-weight-700 tracking-tight hover:underline"
      >
        DevTyp.i.ng
      </Link>
      <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 text-sm font-mono">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="hover:underline">
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
