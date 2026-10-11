const BN = "০১২৩৪৫৬৭৮৯";

// 123 -> "১২৩"
export const toBn = (v) => String(v).replace(/\d/g, (d) => BN[+d]);

// "১,৮৫০" or 1850 -> 1850  (so sorting is numeric, not string-based)
export const toNum = (v) => {
  if (typeof v === "number") return v;
  const s = String(v ?? "")
    .replace(/[০-৯]/g, (d) => String(BN.indexOf(d)))
    .replace(/[^\d.]/g, "");
  return Number(s) || 0;
};

// 1850 -> "১,৮৫০"
export const formatPrice = (v) => {
  const [int, dec] = toNum(v).toString().split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return toBn(dec ? `${grouped}.${dec}` : grouped);
};

// 2.1 -> "২.১"
export const formatPct = (v) => toBn(Math.abs(toNum(v)).toString());

const UNITS = {
  kg: "কেজি",
  litre: "লিটার",
  liter: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
  pcs: "পিস",
  pc: "পিস",
  hali: "হালি",
};

export const unitLabel = (u) =>
  `প্রতি ${UNITS[(u ?? "").toLowerCase()] ?? u ?? "কেজি"}`;
