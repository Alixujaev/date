import { ImageResponse } from "next/og";

import { BRAND, ICON_SIZES } from "@/lib/site";

export const contentType = "image/png";

export function generateImageMetadata() {
  return ICON_SIZES.map((px) => ({
    id: String(px),
    size: { width: px, height: px },
    contentType,
  }));
}

export default async function Icon({ id }: { id: Promise<string> | string }) {
  const px = Number(await id);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${BRAND.blush}, #9b76f5)`,
          borderRadius: px * 0.25,
          fontSize: px * 0.62,
        }}
      >
        💌
      </div>
    ),
    { width: px, height: px },
  );
}
