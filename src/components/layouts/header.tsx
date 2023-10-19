import dynamic from "next/dynamic";

const AuthUser = dynamic(() => import("./AuthUser"), {
  ssr: false,
});

export default function Header() {
  return (
    <header className="basis-10 w-full fixed top-0 mb-2 bg-slate-900 text-white">
      <div className="flex justify-center">DevTyp.i.ng</div>

      <div className="flex justify-end mr-5">
        <AuthUser />
      </div>
    </header>
  );
}
