import React from 'react';
import { SafeAreaView } from 'react-native';
import MicTestScreen from './src/screens/micTestScreen';

export default function App(): React.JSX.Element {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MicTestScreen />
    </SafeAreaView>
  );
}
