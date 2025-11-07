import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CustomHeaderProps {
    title: string;
    backgroundColor?: string;
    rightActions?: React.ReactNode;
    showBackButton?: boolean;
    onBackPress?: () => void;
}

export default function CustomHeader({
    title,
    backgroundColor = '#2196F3',
    rightActions,
    showBackButton = false,
    onBackPress
}: CustomHeaderProps) {
    const navigation = useNavigation();

    const toggleDrawer = () => {
        navigation.dispatch(DrawerActions.toggleDrawer());
    };

    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            navigation.goBack();
        }
    };

    return (
        <View style={[styles.header, { backgroundColor }]}>
            <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />
            <View style={styles.headerContent}>
                <TouchableOpacity 
                    style={styles.menuButton} 
                    onPress={showBackButton ? handleBackPress : toggleDrawer}
                >
                    <Ionicons 
                        name={showBackButton ? "arrow-back" : "menu"} 
                        size={28} 
                        color="#fff" 
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title}</Text>
                <View style={styles.headerRight}>
                    {rightActions}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: 45,
    },
    menuButton: {
        padding: 8,
        marginRight: 16,
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerRight: {
        width: 44,
        alignItems: 'flex-end',
    },
});