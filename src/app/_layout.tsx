import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "react-native";
import DBProvider from "@/database/sqlite";
import { colors } from "@/theme/colors";
import { useFonts } from "expo-font"
import { useEffect } from "react";
import {
    Sora_600SemiBold,
    Sora_700Bold,
    Sora_800ExtraBold,
} from "@expo-google-fonts/sora"
import {
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
} from "@expo-google-fonts/manrope";

SplashScreen.preventAutoHideAsync();


export default function Layout() {

    const [fontsLoaded] = useFonts({
        Sora_600SemiBold,
        Sora_700Bold,
        Sora_800ExtraBold,
        Manrope_400Regular,
        Manrope_500Medium,
        Manrope_600SemiBold,
        Manrope_700Bold,
    })

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <>
        <DBProvider>
            <StatusBar barStyle={"light-content"}/>
            <Stack screenOptions={{headerShown: false}}/>
        </DBProvider>
        </>
    )
}