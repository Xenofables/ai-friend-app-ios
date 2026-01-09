import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Button, Platform, Text, View } from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  type Permission,
  type PermissionStatus,
} from 'react-native-permissions';
import { configureAEC } from '../audio/configureAEC';

export default function MicTestScreen(): React.JSX.Element {
  const micPermission: Permission = useMemo(() => {
    return Platform.select({
      ios: PERMISSIONS.IOS.MICROPHONE,
      android: PERMISSIONS.ANDROID.RECORD_AUDIO,
      default: PERMISSIONS.IOS.MICROPHONE,
    }) as Permission;
  }, []);

  const [perm, setPerm] = useState<PermissionStatus>(
    'unavailable' as PermissionStatus,
  );
  const [aecStatus, setAecStatus] = useState<
    'not-run' | 'configured' | 'failed'
  >('not-run');

  const onCheck = useCallback(async () => {
    const res = await check(micPermission);
    setPerm(res);
  }, [micPermission]);

  const onRequest = useCallback(async () => {
    const res = await request(micPermission);
    setPerm(res);

    if (res !== RESULTS.GRANTED && res !== RESULTS.LIMITED) {
      Alert.alert('Mic permission', `Not granted: ${res}`);
    }
  }, [micPermission]);

  const onConfigureAEC = useCallback(async () => {
    try {
      await configureAEC();
      setAecStatus('configured');
      Alert.alert(
        'AEC',
        'configureAEC() complete. Check Xcode logs for category/mode.',
      );
    } catch (e) {
      setAecStatus('failed');
      Alert.alert('AEC', `Failed: ${String(e)}`);
    }
  }, []);

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 12 }}>Mic / AEC Test</Text>

      <Text>Mic permission: {perm}</Text>
      <Text>AEC status: {aecStatus}</Text>

      <View style={{ height: 12 }} />
      <Button title="Check mic permission" onPress={onCheck} />
      <View style={{ height: 12 }} />
      <Button title="Request mic permission" onPress={onRequest} />
      <View style={{ height: 12 }} />
      <Button title="Run configureAEC()" onPress={onConfigureAEC} />
    </View>
  );
}
