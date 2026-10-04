import * as hb from "harfbuzzjs"

// Satori (next/og) lays glyphs out in typed order, so Bangla vowel signs and conjuncts come out
// wrong. HarfBuzz shapes the text properly; we emit the glyph outlines as an SVG image instead.
export function shapedTextSvg(text: string, fontData: Buffer, size: number, color: string) {
  const blob = new hb.Blob(fontData.buffer.slice(fontData.byteOffset, fontData.byteOffset + fontData.byteLength) as ArrayBuffer)
  const face = new hb.Face(blob)
  const font = new hb.Font(face)
  const buffer = new hb.Buffer()
  buffer.addText(text)
  buffer.guessSegmentProperties()
  hb.shape(font, buffer)

  const scale = size / face.upem
  const { ascender, descender } = font.hExtents()
  let x = 0
  const paths: string[] = []
  const infos = buffer.getGlyphInfos()
  const positions = buffer.getGlyphPositions()
  infos.forEach((info, i) => {
    const p = positions[i]
    const d = font.glyphToPath(info.codepoint)
    if (d) paths.push(`<path transform="translate(${x + p.xOffset} ${p.yOffset})" d="${d}"/>`)
    x += p.xAdvance
  })

  const width = Math.ceil(x * scale)
  const height = Math.ceil((ascender - descender) * scale)
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${x} ${ascender - descender}">` +
    `<g fill="${color}" transform="translate(0 ${ascender}) scale(1 -1)">${paths.join("")}</g></svg>`
  return { src: `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`, width, height }
}
