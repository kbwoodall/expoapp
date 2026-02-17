import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { Audio } from 'expo-av';
import * as Sharing from 'expo-sharing';

export default function VoiceTest({ onBack }) {
    const [recording, setRecording] = useState();
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [sound, setSound] = useState();
    const [recordingUri, setRecordingUri] = useState(null);

    async function startRecording() {
        try {
            if (!permissionResponse || permissionResponse.status !== 'granted') {
                console.log('Requesting permission..');
                await requestPermission();
            }

            // Clear previous transcript
            setTranscript('');

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log('Starting recording..');
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
            Alert.alert('Error', 'Failed to start recording');
        }
    }

    async function stopRecording() {
        console.log('Stopping recording..');
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
        });
        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);
        setRecordingUri(uri);

        // Simulate Transcription Processing
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setTranscript("This is a simulated transcription of your voice recording. In a real app, this text would come from a speech-to-text API (like OpenAI Whisper or Google Cloud Speech) based on the audio file.");
        }, 2000);
    }

    async function playRecording() {
        if (!recordingUri) return;

        try {
            console.log('Loading Sound');
            const { sound } = await Audio.Sound.createAsync(
                { uri: recordingUri }
            );
            setSound(sound);

            console.log('Playing Sound');
            await sound.playAsync();
        } catch (error) {
            console.error('Error playing sound', error);
            Alert.alert('Error', 'Could not play recording');
        }
    }

    async function shareRecording() {
        if (!recordingUri) return;
        try {
            if (!(await Sharing.isAvailableAsync())) {
                Alert.alert('Sharing', 'Sharing is not available on this platform');
                return;
            }
            await Sharing.shareAsync(recordingUri);
        } catch (error) {
            console.error('Error sharing', error);
            Alert.alert('Error', 'Could not share recording');
        }
    }

    useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Voice to Text Test</Text>

            <View style={styles.transcriptContainer}>
                {isProcessing ? (
                    <View style={styles.processingContainer}>
                        <ActivityIndicator size="large" color="#2196F3" />
                        <Text style={styles.processingText}>Processing audio...</Text>
                    </View>
                ) : (
                    <Text style={styles.transcriptText}>
                        {transcript || "Press the microphone button to start recording..."}
                    </Text>
                )}
            </View>

            <TouchableOpacity
                style={[styles.recordButton, recording ? styles.recordingActive : styles.recordingInactive]}
                onPress={recording ? stopRecording : startRecording}
                disabled={isProcessing}
            >
                <Text style={styles.recordButtonText}>
                    {recording ? 'Stop Recording' : 'Start Recording'}
                </Text>
            </TouchableOpacity>

            {recordingUri && !recording && !isProcessing && (
                <>
                    <TouchableOpacity style={styles.playButton} onPress={playRecording}>
                        <Text style={styles.playButtonText}>Play Last Recording</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareButton} onPress={shareRecording}>
                        <Image source={require('../assets/photo.png')} style={styles.shareImage} resizeMode="contain" />
                    </TouchableOpacity>
                </>
            )}

            <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Text style={styles.backButtonText}>Back to Home</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
    },
    transcriptContainer: {
        width: '100%',
        height: 200,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    transcriptText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        lineHeight: 24,
    },
    processingContainer: {
        alignItems: 'center',
    },
    processingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    recordButton: {
        width: 200,
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    recordingInactive: {
        backgroundColor: '#2196F3', // Blue for start
    },
    recordingActive: {
        backgroundColor: '#F44336', // Red for stop
    },
    recordButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        padding: 15,
    },
    backButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
    playButton: {
        marginTop: 10,
        marginBottom: 20,
        paddingVertical: 12,
        paddingHorizontal: 30,
        backgroundColor: '#4CAF50',
        borderRadius: 25,
        elevation: 3,
    },
    playButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    shareButton: {
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shareImage: {
        width: 100, // Adjust size as needed
        height: 100, // Adjust size as needed
    },
});
