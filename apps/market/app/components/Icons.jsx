/** Small line icons (stroke follows the text colour). */
const base = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, focusable: "false" };

export const SearchIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

export const ChevronIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);

/** The "by Oyklane" mark: a filled seal with a tick. */
export const VerifiedIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path fill="currentColor" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" d="M12.00 1.40 14.72 3.63 18.23 3.42 19.12 6.83 22.08 8.72 20.80 12.00 22.08 15.28 19.12 17.17 18.23 20.58 14.72 20.37 12.00 22.60 9.28 20.37 5.77 20.58 4.88 17.17 1.92 15.28 3.20 12.00 1.92 8.72 4.88 6.83 5.77 3.42 9.28 3.63Z" />
    <path d="M7.8 12.2l2.8 2.8 5.6-5.8" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
