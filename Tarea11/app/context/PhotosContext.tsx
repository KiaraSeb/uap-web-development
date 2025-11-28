import * as MediaLibrary from "expo-media-library";
import React, { createContext, ReactNode, useState } from "react";

type PhotosContextType = {
  photos: MediaLibrary.Asset[];
  addPhoto: (photo: MediaLibrary.Asset) => void;
  setPhotos: (photos: MediaLibrary.Asset[]) => void;
};

export const PhotosContext = createContext<PhotosContextType>({
  photos: [],
  addPhoto: () => {},
  setPhotos: () => {},
});

export const PhotosProvider = ({ children }: { children: ReactNode }) => {
  const [photos, setPhotosState] = useState<MediaLibrary.Asset[]>([]);

  const addPhoto = (photo: MediaLibrary.Asset) => {
    setPhotosState((prev) => [photo, ...prev]);
  };

  return (
    <PhotosContext.Provider value={{ photos, addPhoto, setPhotos: setPhotosState }}>
      {children}
    </PhotosContext.Provider>
  );
};
