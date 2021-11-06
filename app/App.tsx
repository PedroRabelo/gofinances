import 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import React from 'react';
import {ThemeProvider} from 'styled-components';

import {Poppins_400Regular, Poppins_500Medium, Poppins_700Bold, useFonts} from '@expo-google-fonts/poppins';

import theme from './src/global/styles/theme';

import {NavigationContainer} from '@react-navigation/native'
import {AppRoutes} from './src/routes/app.routes';

import AppLoading from 'expo-app-loading';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  if (!fontsLoaded) {
    return <AppLoading/>
  }

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <AppRoutes />
      </NavigationContainer>
    </ThemeProvider>
  );
}
