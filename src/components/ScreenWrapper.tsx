import React from "react";
import { Keyboard, View } from "react-native";
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from "react-native";




export function ScreenWrapper({ children }: { children: React.ReactNode }) {

    return(
        <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS == 'ios' ? 64 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flexGrow: 1 }}>
                    {children}
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}