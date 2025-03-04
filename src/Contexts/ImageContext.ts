// ImageContext.ts
import React, { createContext, useContext, useState } from "react";

type ImageContextType = {
  images: File[];
  setImages: (images: File[]) => void;
};

// Crie o contexto
const ImageContext = createContext<ImageContextType>({
  images: [],
  setImages: () => {},
});

// Exporte o contexto e o hook personalizado
export const useImageContext = () => useContext(ImageContext);
export default ImageContext;