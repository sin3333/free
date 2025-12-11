import { Stack } from 'expo-router';

export default function TestStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Test Menu' }} />
      <Stack.Screen name="test1" options={{ title: 'Test 1' }} />
      <Stack.Screen name="test2" options={{ title: 'Test 2' }} />
      <Stack.Screen name="test3" options={{ title: 'Test 3' }} />
    </Stack>
  );
}
