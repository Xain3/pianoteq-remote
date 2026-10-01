export function PianoMark() {
  return (
    <svg
      className="piano-mark"
      viewBox="0 0 320 110"
      role="img"
      aria-label="Piano keyboard illustration"
    >
      <rect
        x="5"
        y="5"
        width="310"
        height="100"
        rx="10"
        fill="var(--key-fill)"
        stroke="var(--key-frame)"
      />
      {Array.from({ length: 13 }, (_, index) => (
        <path key={index} d={`M${27 + index * 22} 9v90`} stroke="var(--key-line)" />
      ))}
      {[1, 2, 4, 5, 6, 8, 9, 11, 12, 13].map((index) => (
        <rect
          key={index}
          x={index * 22 - 3}
          y="5"
          width="14"
          height="61"
          rx="3"
          fill="var(--key-dark)"
        />
      ))}
    </svg>
  );
}
