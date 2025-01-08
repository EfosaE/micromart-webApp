import React from 'react';

interface CustomImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string; // Required source of the image
  width?: number; // Optional: Desired width for optimization
  height?: number; // Optional: Desired height for optimization
  quality?: number; // Optional: Image quality (1–100)
  optimizeBaseUrl?: string; // Optional: Base URL for optimization service
}

export const CustomImage: React.FC<CustomImageProps> = ({
  src,
  width,
  height,
  quality = 80,
  optimizeBaseUrl = 'https://res.cloudinary.com/your-cloud-name/image/fetch',
  ...rest
}) => {

  // Construct the optimized URL
  const optimizedSrc = `${optimizeBaseUrl}/q_auto${width ? `,w_${width}` : ''}${
    height ? `,h_${height}` : ''
  },c_fill/${encodeURIComponent(src)}`;

  return <img src={optimizedSrc} {...rest} />;
};
