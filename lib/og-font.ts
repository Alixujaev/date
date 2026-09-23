/**
 * OG rasm uchun Google Fonts'dan faqat kerakli harflarni (`text=`) TTF sifatida yuklaydi.
 * Satori woff2'ni o'qiy olmaydi — css2 API user-agent'siz so'ralsa TTF qaytaradi.
 *
 * Tarmoq bo'lmasa `null` qaytadi: rasm standart shrift bilan chiziladi, build buzilmaydi.
 */
export async function loadGoogleFont(
  family: string,
  weight: number,
  text: string,
): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!src) return null;

    const font = await fetch(src);
    return font.ok ? await font.arrayBuffer() : null;
  } catch {
    return null;
  }
}
