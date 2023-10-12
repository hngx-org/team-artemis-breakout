import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './Navigation/Navigation';
import { useEffect } from 'react';
import { Audio } from 'expo-av';

export default function App() {
  useEffect(() => {
    // Load and play background music
    const backgroundMusic = new Audio.Sound();
    const loadBackgroundMusic = async () => {
      try {
        await backgroundMusic.loadAsync(require("./assets/ronaldo.mp3"));
        await backgroundMusic.setIsLoopingAsync(true); // Set the music to loop
        await backgroundMusic.playAsync();
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true, // For iOS, play in silent mode
          allowsRecordingIOS: false,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false, // Make sure it plays through the speaker on Android
        });
      } catch (error) {
        console.error("Error loading background music:", error);
      }
    };

    loadBackgroundMusic();

    return () => {
      // Unload the background music when the component unmounts
      backgroundMusic.stopAsync();
      backgroundMusic.unloadAsync();
    };
  }, []);
  return (
    <Navigation />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
