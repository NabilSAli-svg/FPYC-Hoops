export default function Skeleton({ width = '100%', height = 16, style, dark }) {
  return (
    <div
      className={dark ? 'skel-dark' : 'skel'}
      style={{ width, height, borderRadius: 6, flexShrink: 0, display: 'block', ...style }}
    />
  );
}
