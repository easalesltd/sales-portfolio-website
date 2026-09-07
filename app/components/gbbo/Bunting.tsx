const FLAGS = ["#c23b5a", "#f0c75e", "#24584b", "#e8a0bf", "#7eb8d4", "#f4a261"];

export function Bunting() {
  return (
    <svg className="block w-full overflow-visible" viewBox="0 0 1440 70" aria-hidden="true">
      <path d="M0 14 C 240 34, 480 0, 720 18 S 1200 40, 1440 10" fill="none" stroke="#3d2b1f" strokeWidth="3" />
      {Array.from({ length: 18 }, (_, index) => {
        const x = 40 + index * 78;
        const y = 10 + Math.sin(index * 0.7) * 8;
        const color = FLAGS[index % FLAGS.length];
        return (
          <g key={index}>
            <polygon points={`${x},${y} ${x + 28},${y + 4} ${x + 14},${y + 42}`} fill={color} />
            <polygon points={`${x},${y} ${x + 28},${y + 4} ${x + 14},${y + 42}`} fill="rgba(255,255,255,0.18)" />
          </g>
        );
      })}
    </svg>
  );
}
