import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-300 bg-white px-4 py-6 lg:px-6">
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
        <p className="text-xs text-black uppercase">
          &copy; 2026 TaskFlow Quiet Productivity
        </p>
        <ul className="flex gap-2 md:gap-4 lg:gap-8">
          <Link href={`#`}>
            <li className="text-xs text-black uppercase">Privacy Policy</li>
          </Link>
          <Link href={`#`}>
            <li className="text-xs text-black uppercase">Terms Of Service</li>
          </Link>
          <Link href={`#`}>
            <li className="text-xs text-black uppercase">Contact</li>
          </Link>
        </ul>
      </div>
    </footer>
  );
}
