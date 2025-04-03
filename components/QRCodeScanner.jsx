import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useRouter } from "expo-router";

const QRScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  
  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    console.log(`QR Scanned: ${data}`);
  
    if (data.includes("razorpay")) {
      Alert.alert("QR Code Scanned", "Redirecting to payment...");
      router.push({
        pathname: "/razorpayWebView",
        params: { paymentUrl: data },
      });
    } else {
      Alert.alert("Invalid QR Code", "This is not a Razorpay payment QR code.");
    }
  };
  

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title="Scan Again" onPress={() => setScanned(false)} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
});

export default QRScannerScreen;
