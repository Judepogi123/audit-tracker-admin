import { useState, useEffect } from "react";

//ui
import { Image as MainImage, Typography } from "antd";

//interface
interface ImageProps {
  src: string;
  local: boolean | undefined;
  style?: React.CSSProperties | undefined;
}

const Img = ({ src, local, style }: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  if (local) {
    return <MainImage src={src} style={style} alt={`${src}`} />;
  }

  useEffect(() => {
    const handleImageLoad = () => setIsLoading(false);
    const handleImageError = () => setError("Image failed to load.");

    const image = new Image();
    image.onload = handleImageLoad;
    image.onerror = handleImageError;
    image.src = src;

    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, [src]);

  if (isLoading) {
    return (
      <div style={{ width: "100%", height: "auto", display: "grid" }}>
        <Typography style={{ fontWeight: 600, fontSize: "1.1rem" }}>
          Image is loading...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: "100%", height: "auto", display: "grid" }}>
        <Typography
          style={{
            fontWeight: 600,
            fontSize: "1.1rem",
            color: "red",
            textAlign: "justify",
          }}
        >Failed to load the Image: 
          {error}
        </Typography>
      </div>
    );
  }

  return (
    <MainImage
      src={src}
      style={style}
      alt={`${src}`}
      onError={(e) => {
        (e.target as HTMLImageElement).src = "placeholder.svg";
      }}
    />
  );
};

export default Img;
