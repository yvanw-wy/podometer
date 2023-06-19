import { StatusBar } from 'expo-status-bar';
import { useCallback } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import HomeScreen from './screens/Home/HomeScreen';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import colors from './assets/styles/colors';
import spacing from './assets/styles/spacing';
import LoginScreen from './screens/Login/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Signup from './screens/Signup/Signup';
import SaveGoogle from './screens/SaveGoogle/SaveGoogle';
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

const prefix = Linking.createURL('/');
const config = {
  screens: {
    SaveGoogle: "register",
    Home: "home",
    Signup: "signup",
    Login: "login"
  },
}
const linking = {
  prefixes: [
    prefix
  ],
  config,
};

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter': require('./assets/loadedFonts/Inter-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={{ width: '100%', height: '100%' }}>
      <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
        <Stack.Navigator>
          {/* <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
          <Stack.Screen name="Signup" component={Signup} options={{headerShown: false}} /> */}
          <Stack.Screen name="Home" options={{headerShown: false}} >
            {(props : any) => <HomeScreen {...props} />}
          </Stack.Screen>
          <Stack.Screen name="SaveGoogle" component={SaveGoogle} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  
});
