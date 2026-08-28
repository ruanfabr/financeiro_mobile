import React from "react";
import { Keyboard } from "react-native";
import { KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/theme/colors";




export function ScreenWrapper({ children }: { children: React.ReactNode }) {

    return(
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS == 'ios' ? 64 : 0}
        >
            <Pressable onPress={Keyboard.dismiss}
            style={{ flexGrow: 1, backgroundColor: colors.background }}
            >
                {children}
            </Pressable>
        </KeyboardAvoidingView>
        </SafeAreaView>
    )
}