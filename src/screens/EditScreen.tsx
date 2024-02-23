import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  // メモを保存する
  const handleSave = async () => {
    try {
      const storedMemos = await AsyncStorage.getItem('memos');
      const memos = storedMemos ? JSON.parse(storedMemos) : [];
      let updateMemos;
      if (text.trim() !== "") {
        updateMemos = memos.map(memo => memo.id === id ? { ...memo, text: text.trim() } : memo);
	await AsyncStorage.setItem('memos', JSON.stringify(updateMemos));
      } else {
        await handleDelete();
	return;
      }
      navigation.goBack();
    } catch(e) {
      console.log(e);
      Alert.alert('エラー', 'メモの保存に失敗しました');
    }
  };
  
  // メモを削除する
  const handleDelete = async () => {
    try {
      const storedMemos = await AsyncStorage.getItem('memos');
      const memos = storedMemos ? JSON.parse(storedMemos) : [];
      const newMemos = memos.filter(memo => memo.id !== id);
      await AsyncStorage.setItem('memos', JSON.stringify(newMemos));
      navigation.goBack();
    } catch(e) {
      console.log(e);
      Alert.alert('エラー', 'メモの削除に失敗しました');
    }
  };

  useEffect(() => {
    const loadMemoContent = async () => {
      const storedMemos = await AsyncStorage.getItem('memos');
      const memos = storedMemos ? JSON.parse(storedMemos) : [];
      const selectedMemo = memos.find(memo => memo.id === id);
      // 選択されたメモを表示する
      if (selectedMemo) {
        setText(selectedMemo.text);
      }
    };
    loadMemoContent();
  }, [id]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        isFocused ? (
	<TouchableOpacity onPress={handleSave} style={{ marginRight: 20 }}>
          <Text style={{ color: 'rgb(255,150,150)', fontSize: 16 }}>完了</Text>
	</TouchableOpacity>
	) : (
        <TouchableOpacity onPress={showOptions} style={{ marginRight: 20 }}>
          <Text style={{ color: 'rgb(255,150,150)', fontSize: 24 }}>...</Text>
        </TouchableOpacity>
	)
      ),
    });
  }, [navigation, isFocused, handleSave]);

  const showOptions = () => {
    Alert.alert(
      'メモを削除しますか',
      null,
      [
        { text: '削除する', onPress: handleDelete, style: 'destructive' },
	{ text: 'キャンセル', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
	multiline={true}
	scrollEnabled={true}
	onFocus={handleFocus}
	onBlur={handleBlur}
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
    borderWidth: 0,
  },
});

export default EditScreen;
