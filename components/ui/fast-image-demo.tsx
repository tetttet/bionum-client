import React, { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";

const FastImageDemo = ({ source }: { source: any }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <View style={styles.container}>
      {!loaded && (
        <View style={styles.skeleton}>
          <ActivityIndicator size="large" color="#ccc" />
        </View>
      )}
      <Image
        source={source}
        style={styles.image}
        resizeMode="cover"
        onLoad={() => setLoaded(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 440,
    overflow: "hidden",
    paddingTop: 12,
  },
  skeleton: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 12,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default FastImageDemo;
