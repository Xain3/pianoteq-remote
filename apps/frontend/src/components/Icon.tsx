const paths = {
  search: 'm21 21-4.6-4.6M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0',
  refresh: 'M20 7v5h-5M4 17v-5h5M5.1 8a7.5 7.5 0 0 1 12.5-3L20 8M4 16l2.4 3A7.5 7.5 0 0 0 19 16',
  volume: 'M11 4 6 8H2v8h4l5 4V4M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14',
  settings: 'M4 7h16M4 17h16M8 4v6M16 14v6',
  check: 'm5 12 4 4L19 6',
  arrow: 'M5 12h14m-5-5 5 5-5 5',
};

export function Icon({ name }: { name: keyof typeof paths }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
