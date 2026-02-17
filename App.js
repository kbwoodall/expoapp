import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import VoiceTest from './components/VoiceTest';

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  if (currentView === 'voiceTest') {
    return <VoiceTest onBack={() => setCurrentView('home')} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>React Native Testing Area</Text>
      <Image source={require('./assets/favicon.png')} style={styles.image} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => setCurrentView('voiceTest')}
      >
        <Text style={styles.buttonText}>Open Voice Test</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'mediumseagreen',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 30,
    color: '#fff', // Added for better contrast on green
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    marginTop: 20,
    marginBottom: 30, // Added spacing for the button
    width: 50,
    height: 50,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: 'mediumseagreen',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
