import Link from "next/link";

export function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        backgroundColor: "white",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <Link href="/" className="text-xl font-bold text-green-700">
        TrekMapper
      </Link>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Link href="/" className="text-sm text-gray-600 hover:text-green-700">
          Destinations
        </Link>
      </div>
    </nav>
  );
}
