import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const ListScreen = () => {
  const [memos, setMemos] = useState([]);
  const navigation = useNavigation();
  
  const loadMemos = async () => {
    try {
      // 既存のメモを取得
      const storedMemos = await AsyncStorage.getItem('memos');
        if (storedMemos) {
          const memosData = JSON.parse(storedMemos);
          setMemos(memosData);
        }
    } catch (error) {
        console.error('Error loading memos:', error);
    }
  };

  // コンポーネントがマウントされた時
  useEffect(() => {
    loadMemos();
  }, []);

  // 画面戻った時
  useFocusEffect(
    useCallback(() => {
      loadMemos();
    }, [])
  );
  
  // メモの一覧をレンダリング
  const renderMemoItem = ({ item }) => (
    <TouchableOpacity
       style={styles.memoItem}
       onPress={() => navigation.navigate('Edit', { id: item.id })}
    >
       <Text style={styles.memoText} numberOfLines={1}>{item.text}</Text>
    </TouchableOpacity>
  );

  const ItemSeparator = () => (
    <View style={styles.itemSeparator} />
  );

  return (
    <View style={styles.container}>
       <FlatList
          data={memos}
	  renderItem={renderMemoItem}
	  keyExtractor={(item) => item.id.toString()}
	  ItemSeparatorComponent={ItemSeparator}
	  contentContainerStyle={styles.listContainer}
       />
       <TouchableOpacity
          style={styles.addButton}
	  onPress={() => navigation.navigate('Create')}>
	  <Text style={styles.addButtonText}>+</Text>
       </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(255, 250, 250)'
  },
  listContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20
  },
  memoItem: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5
  },
  memoText: {
    fontSize: 16
  },
  itemSeparator: {
    height: 1,
    width: '100%',
    backgroundColor: '#dedede'
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(255, 150, 150)',
    borderRadius: 30
  },
  addButtonText: {
    fontSize: 24,
    color: 'rgb(255, 255, 255)'
  },
});

export default ListScreen;
