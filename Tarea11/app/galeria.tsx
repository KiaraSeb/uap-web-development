import * as MediaLibrary from "expo-media-library";
import { useContext, useEffect } from "react";
import { Dimensions, FlatList, Image, Platform, StyleSheet, Text, View } from "react-native";
import { PhotosContext } from "./context/PhotosContext";

export default function Galeria() {
  const { photos, setPhotos } = useContext(PhotosContext);
  const isMobile = Platform.OS !== "web";

  useEffect(() => {
    if (!isMobile) return;
    (async () => {
      const album = await MediaLibrary.getAlbumAsync("Camera");
      if (album) {
        const media = await MediaLibrary.getAssetsAsync({
          album,
          sortBy: [["creationTime", false]],
          first: 50,
        });
        setPhotos(media.assets);
      }
    })();
  }, [isMobile]);

  if (!photos.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>
          {isMobile ? "No hay fotos todavía" : "La galería no está disponible en web"}
        </Text>
      </View>
    );
  }

  const numColumns = 3;
  const size = Dimensions.get("window").width / numColumns;

  return (
    <FlatList
      data={photos}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      renderItem={({ item }) => <Image source={{ uri: item.uri }} style={[styles.image, { width: size, height: size }]} />}
    />
  );
}

const styles = StyleSheet.create({
  image: { margin: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { color: "#000", fontSize: 16, textAlign: "center" },
});
