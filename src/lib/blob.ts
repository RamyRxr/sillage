type Point = readonly [number, number]

/** A smooth organic loop through 8 wobbling points (Catmull-Rom spline as cubic Béziers). */
export function blobPath(cx: number, cy: number, r: number, wobble: number, phase: number): string {
  const points: Point[] = Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 8
    const radius = r * (1 + wobble * Math.sin(3 * a + phase) + 0.6 * wobble * Math.cos(2 * a + phase * 1.7))
    return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)] as const
  })
  const round = (n: number) => Math.round(n * 10) / 10
  const segments = points.map((p1, i) => {
    const p0 = points[(i + 7) % 8]
    const p2 = points[(i + 1) % 8]
    const p3 = points[(i + 2) % 8]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    return `C${round(c1[0])},${round(c1[1])} ${round(c2[0])},${round(c2[1])} ${round(p2[0])},${round(p2[1])}`
  })
  return `M${round(points[0][0])},${round(points[0][1])} ${segments.join(' ')} Z`
}
