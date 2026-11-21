import { writeFile, copyFile, mkdir } from 'node:fs/promises'
import world from '@svg-maps/world'
const optimized = {
  label: world.label,
  viewBox: world.viewBox,
  locations: world.locations.map((location) => ({
    ...location,
    path: location.path.replace(/-?\d*\.\d+(?:e[+-]?\d+)?/gi, (value) =>
      String(Math.round(Number(value) * 1000) / 1000),
    ),
  })),
}
await mkdir('public/assets/data', { recursive: true })
await writeFile('public/assets/data/world.json', JSON.stringify(optimized))
await mkdir('public/assets/licenses', { recursive: true })
await copyFile('node_modules/@svg-maps/world/LICENSE.md', 'public/assets/licenses/world-map.txt')
console.log(
  'Prepared',
  optimized.locations.length,
  'countries; paths rounded to 0.001 viewBox units for the UI map.',
)
