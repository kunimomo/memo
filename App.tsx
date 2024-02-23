import * as React from 'react';
import 'react-native-get-random-values';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ListScreen from './src/screens/ListScreen';
import CreateScreen from './src/screens/CreateScreen';
import EditScreen from './src/screens/EditScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
       <Stack.Navigator
        screenOptions={{
          headerTintColor: 'rgb(255, 150, 150)',
        }}
       >
          <Stack.Screen name="List" component={ListScreen} options={{ title: 'メモ一覧' }} />
          <Stack.Screen name="Create" component={CreateScreen} options={{ title: '新規作成' }} />
          <Stack.Screen name="Edit" component={EditScreen} options={{ title: '編集' }} />
       </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
