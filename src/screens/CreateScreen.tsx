import React, { useState, useLayoutEffect, useCallback } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { v4 as uuidv4 } from 'uuid';

const CreateScreen = ({ navigation }) => {
  const [text, setText] = useState('');

  const handleSave = useCallback(async () => {
    try {
      // 既存のメモを取得
      const storedMemos = await AsyncStorage.getItem('memos');
      const memos = storedMemos ? JSON.parse(storedMemos) : [];
      // 新しいメモを追加
      if (text.trim() !== "") {
        const newMemo = { id: uuidv4(), text: text.trim() };
	memos.push(newMemo);
      }
      // 更新されたメモリストを保存
      await AsyncStorage.setItem('memos', JSON.stringify(memos));
    } catch (e) {
      console.error(e);
      Alert.alert('エラー', 'メモの保存に失敗しました。');
    }
  }, [text, navigation]);
  
  /**
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSave} style={{ marginRight: 20 }}>
	  <Text style={{ color: 'rgb(255,150,150)', fontSize: 16 }}>保存</Text>
	</TouchableOpacity>
      ),
    });
  }, [navigation, handleSave]);
  **/

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = async () => {
        await handleSave();
      };

      const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        // デフォルトのイベントをキャンセル
	e.preventDefault();

        onBackPress().then(() => {
	  // 保存処理後に元の画面遷移を実行
          navigation.dispatch(e.data.action);
        });
      });

      return unsubscribe;
    }, [navigation, text])
  );

  return (
    <View style={styles.container}>
      <TextInput
	style={styles.input}
        value={text}
        onChangeText={setText}
        multiline={true}
	scrollEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgb(255, 250, 250)'
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    fontSize: 16,
    borderWidth: 0
  },
});

export default CreateScreen;
