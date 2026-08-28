import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import DBProvider from "@/database/sqlite";


export default function Layout() {
    return (
        <>
        <DBProvider>
            <StatusBar barStyle={"light-content"}/>
            <Stack screenOptions={{headerShown: false}}/>
        </DBProvider>
        </>
    )
}