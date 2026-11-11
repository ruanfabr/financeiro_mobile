import { colors } from "@/theme/colors";
import React from "react";
import { Keyboard, ScrollView, View } from "react-native";
import { KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export function ScreenWrapper({ children }: { children: React.ReactNode }) {

    return(
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS == 'ios' ? 64 : 0}
        >
        <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        >
            {children}
        </ScrollView>
        </KeyboardAvoidingView>
        </SafeAreaView>
    )
}