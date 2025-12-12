import React from 'react';
import { View, Button, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function TestIndexScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, backgroundColor: '#fff' }}>
      <>
        <Text style={{ fontSize: 24, marginBottom: 16 }}>テストメニュー</Text>
        <Text>勝手にテストファイル作って自由に使ってね</Text>
      </>

      <Button
        title="Test1:テスト"
        onPress={() => router.push('/test/test1')}
      />

      <Button
        title="Test2:カレンダーUI"
        onPress={() => router.push('/test/test2')}
      />

      <Button
        title="Test3:メイン機能まだ途中"
        onPress={() => router.push('/test/test3')}
      />
      <Button
        title="Test4:chatGPTが作ったやつ"
        onPress={() => router.push('/test/test4')}
      />
      <Button
        title="Test5:三目並べ練習"
        onPress={() => router.push('/test/test5')}
      />
    </View>
  );
}

