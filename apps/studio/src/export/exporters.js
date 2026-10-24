/**
 * Exporters adapted directly from the Magic Patterns Character Export Kit.
 * Provides lossless PNG download, self-contained SVG with embedded data URL,
 * and copyable React component code snippets for all companions.
 */

const SIZE = 1024;

async function fetchBlob(url) {
  const res = await fetch(url, { mode: "cors" });
  if (!res.ok) throw new Error("fetch failed");
  return res.blob();
}

function save(blob, filename) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function toDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

/**
 * Re-encodes the original pixels losslessly as PNG — no resizing or edits.
 */
export async function downloadPng(character) {
  const blob = await fetchBlob(character.url);
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0);
  const png = await new Promise((res, rej) =>
    canvas.toBlob((b) => (b ? res(b) : rej(new Error("encode failed"))), "image/png"),
  );
  save(png, `${character.id}.png`);
}

/**
 * Self-contained SVG with the original image embedded — looks identical anywhere in vector tools.
 */
export async function downloadSvg(character) {
  const blob = await fetchBlob(character.url);
  const data = await toDataUrl(blob);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <title>${character.name}</title>
  <image width="${SIZE}" height="${SIZE}" href="${data}" xlink:href="${data}"/>
</svg>`;
  save(new Blob([svg], { type: "image/svg+xml" }), `${character.id}.svg`);
}

/**
 * Generate copyable React component code snippet.
 */
export function reactSnippet(character) {
  const comp = character.name.replace(/[^a-zA-Z0-9]/g, "");
  return `export function ${comp}({ size = 256 }: { size?: number }) {
  return (
    <img
      src="${character.url}"
      alt="${character.name}"
      width={size}
      height={size}
      style={{ display: "block", objectFit: "contain" }}
    />
  );
}
`;
}
