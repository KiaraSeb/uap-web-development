import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { PhotosProvider } from "./context/PhotosContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <PhotosProvider>
      <View style={styles.container}>{children}</View>
    </PhotosProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa", 
  },
});
