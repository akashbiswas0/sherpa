import Image from "next/image";

interface TrekImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function TrekImage({
  src,
  alt,
  width,
  height,
  fill,
  priority,
  className,
  style,
}: TrekImageProps) {
  const fallback = "/placeholder-trek.jpg";

  return (
    <Image
      src={src || fallback}
      alt={alt}
      width={fill ? undefined : (width ?? 400)}
      height={fill ? undefined : (height ?? 300)}
      fill={fill}
      priority={priority}
      className={className}
      style={style}
      onError={(e) => {
        (e.target as HTMLImageElement).src = fallback;
      }}
    />
  );
}
