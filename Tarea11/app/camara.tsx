import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PhotosContext } from "./context/PhotosContext";

export default function CamaraScreen() {
  const { addPhoto } = useContext(PhotosContext);
  const isWeb = Platform.OS === "web";

  // Móvil
  const [cameraType, setCameraType] = useState<"front" | "back">("back");
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [hasMediaPermission, setHasMediaPermission] = useState<boolean | null>(null);

  // Web
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isWeb) {
      (async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (e) {
          Alert.alert("Error", "No se pudo acceder a la cámara del navegador");
        }
      })();
    } else {
      (async () => {
        if (!permission) await requestPermission();
        const mediaStatus = await MediaLibrary.requestPermissionsAsync();
        setHasMediaPermission(mediaStatus.status === "granted");
      })();
    }
  }, []);

  const flash = () => {
    Animated.sequence([
      Animated.timing(flashAnim, { toValue: 0.8, duration: 50, useNativeDriver: true }),
      Animated.timing(flashAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const tomarFoto = async () => {
    flash();
    if (isWeb) {
      if (!canvasRef.current || !videoRef.current) return;
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      addPhoto({ id: Date.now().toString(), uri: dataUrl } as any);
      Alert.alert("Foto tomada", "Se capturó la foto en la web");
    } else {
      if (!cameraRef.current) return;
      const photo = await cameraRef.current.takePictureAsync();
      if (!photo?.uri) return Alert.alert("Error", "No se pudo tomar la foto");
      if (hasMediaPermission) {
        const asset = await MediaLibrary.createAssetAsync(photo.uri);
        addPhoto(asset);
        Alert.alert("Foto guardada", "La foto se guardó en la galería");
      } else {
        Alert.alert("Permiso denegado", "No se puede guardar la foto en la galería");
      }
    }
  };

  if (!isWeb && !permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Solicitando permisos...</Text>
      </View>
    );
  }

  if (!isWeb && !permission?.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>No tienes permiso para usar la cámara</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isWeb ? (
        <>
          <video ref={videoRef} autoPlay style={styles.camera as any} />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </>
      ) : (
        <CameraView ref={cameraRef} style={styles.camera} facing={cameraType} />
      )}

      <Animated.View style={[styles.flashOverlay, { opacity: flashAnim }]} />

      <View style={styles.controls}>
        {!isWeb && (
          <TouchableOpacity
            style={styles.flipButton}
            onPress={() =>
              setCameraType(cameraType === "back" ? "front" : "back")
            }
          >
            <Text style={styles.buttonText}>Flip</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.captureButton} onPress={tomarFoto}>
          <View style={styles.innerCircle} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1, width: "100%", backgroundColor: "#000" },
  flashOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    zIndex: 10,
  },
  controls: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  flipButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: 12,
    borderRadius: 50,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#fff" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  text: { color: "#fff", fontSize: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
