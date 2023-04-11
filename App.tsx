import React, { useState } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from "./Screens/Home";
import { QuestionScreen } from './Screens/QuestionScreen';
import { CountDown } from './Components/CountDown';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


export default function App() {
  const queryClient = new QueryClient()
  const Tab = createBottomTabNavigator();

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen component={HomeScreen} name="Home" options={{
            headerTitle: 'Home',
            headerTitleAlign: 'center',
          }}  />
          <Tab.Screen component={QuestionScreen} name="Trivia" options={{
            headerTitle: 'Quiz',
            headerTitleAlign: 'center',
          }}  />
        </Tab.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
