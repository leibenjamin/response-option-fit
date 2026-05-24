/* Data for the "Zoom to the right altitude" puzzle (Example 02,
   business/industry, broad bucket). The CPS field asks "What kind of business
   or industry is this?" as one open text box. The visitor plays the industry
   coder: one worker's answer can be coded at several "altitudes" — the specific
   employer, the kind of workplace, the industry, the broad sector — and every
   one is defensible, so two careful coders file the same words differently and
   the column mixes levels.

   Faithfulness: the field and its broad-bucket failure are from the
   hand-verified specimen (`business-industry`). The worker's answer and the
   altitude codes are AUTHORED TEACHING content (labeled), illustrating the real
   finding that "workplace type, industry, product line, and work activity can
   all look acceptable in one answer space." No invented source claim. */

export type Altitude = {
  id: string;
  /* "broad" | "specific" ordering label for the zoom track. */
  label: string;
  /* What this answer would be coded as at this altitude. */
  code: string;
  /* Why a careful coder could defensibly stop here. */
  defensible: string;
};

/* The worker's verbatim-style entry (authored teaching case). */
export const zoomAnswer = "I work at a hospital.";
export const zoomField = "What kind of business or industry is this?";

/* Ordered specific → broad, the way a coder zooms out. */
export const zoomAltitudes: [Altitude, Altitude, Altitude, Altitude] = [
  {
    id: "employer",
    label: "Employer",
    code: "Mercy General Hospital",
    defensible: "The exact place they work. Defensible — it is literally true."
  },
  {
    id: "workplace",
    label: "Workplace",
    code: "Hospital",
    defensible: "The kind of establishment — and the closest match to what they actually wrote."
  },
  {
    id: "industry",
    label: "Industry",
    code: "Health care",
    defensible: "The industry the workplace belongs to — the level the field is reaching for."
  },
  {
    id: "sector",
    label: "Sector",
    code: "Services",
    defensible: "The broad economic sector. Defensible — just coarser."
  }
];
