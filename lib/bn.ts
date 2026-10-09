const BN = "০১২৩৪৫৬৭৮৯";

export const toBn = (v: string | number) => String(v).replace(/\d/g, (d) => BN[+d]);

// "১,৮৫০" or 1850 -> 1850 (so sorting is numeric, not string-based)
export const toNum = (v: unknown): number => {
  if (typeof v === "number") return v;
  const s = String(v ?? "")
    .replace(/[০-৯]/g, (d) => String(BN.indexOf(d)))
    .replace(/[^\d.]/g, "");
  return Number(s) || 0;
};

export const formatPrice = (v: unknown) => {
  const [int, dec] = toNum(v).toString().split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return toBn(dec ? `${grouped}.${dec}` : grouped);
};

export const formatPct = (v: unknown) => toBn(Math.abs(toNum(v)).toString());

const UNITS: Record<string, string> = {
  kg: "কেজি", litre: "লিটার", liter: "লিটার",
  dozen: "ডজন", piece: "পিস", pcs: "পিস", pc: "পিস", hali: "হালি",
};
export const unitLabel = (u?: string) =>
  `প্রতি ${UNITS[(u ?? "").toLowerCase()] ?? u ?? "কেজি"}`;