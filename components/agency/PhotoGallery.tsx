import { TrekImage } from "@/components/shared/TrekImage";

interface PhotoGalleryProps {
  images: Array<{ imageUrl: string; altText: string }>;
}

export function PhotoGallery({ images }: PhotoGalleryProps) {
  if (images.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      {images.map((img, i) => (
        <div
          key={i}
          style={{
            position: "relative",
            width: 120,
            height: 90,
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <TrekImage src={img.imageUrl} alt={img.altText} fill className="object-cover" />
        </div>
      ))}
    </div>
  );
}
