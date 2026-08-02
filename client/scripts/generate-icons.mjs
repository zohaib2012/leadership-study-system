import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const iconsDir = path.join(__dirname, '..', 'public', 'icons')

async function generate() {
  await sharp(path.join(iconsDir, 'icon-192.svg'))
    .resize(192, 192)
    .png()
    .toFile(path.join(iconsDir, 'icon-192.png'))

  await sharp(path.join(iconsDir, 'icon-512.svg'))
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'icon-512.png'))

  await sharp(path.join(iconsDir, 'icon-512-maskable.svg'))
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'icon-512-maskable.png'))

  console.log('Icons generated successfully')
}

generate().catch((err) => {
  console.error(err)
  process.exit(1)
})
