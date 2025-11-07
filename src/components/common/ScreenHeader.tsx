import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ScreenHeaderProps {
    title: string;
    backgroundColor?: string;
    showMenuButton?: boolean;
    showBackButton?: boolean;
    rightComponent?: React.ReactNode;
    onBackPress?: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
    title,
    backgroundColor = '#2196F3',
    showMenuButton = true,
    showBackButton = false,
    rightComponent,
    onBackPress,
}) => {
    const navigation = useNavigation();

    const handleMenuPress = () => {
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
            <StatusBar 
                barStyle="light-content" 
                backgroundColor={backgroundColor} 
                translucent={false}
            />
            <View style={styles.headerContent}>
                {showMenuButton && (
                    <TouchableOpacity 
                        style={styles.actionButton} 
                        onPress={handleMenuPress}
                    >
                        <Ionicons name="menu" size={28} color="#fff" />
                    </TouchableOpacity>
                )}
                
                {showBackButton && (
                    <TouchableOpacity 
                        style={styles.actionButton} 
                        onPress={handleBackPress}
                    >
                        <Ionicons name="arrow-back" size={28} color="#fff" />
                    </TouchableOpacity>
                )}
                
                <Text style={styles.headerTitle}>{title}</Text>
                
                <View style={styles.headerRight}>
                    {rightComponent || <View style={styles.placeholder} />}
                </View>
            </View>
        </View>
    );
};

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
        paddingTop: 45, // Para el notch/status bar
        minHeight: 70,
    },
    actionButton: {
        padding: 8,
        marginRight: 16,
        borderRadius: 20,
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerRight: {
        minWidth: 44,
        alignItems: 'flex-end',
    },
    placeholder: {
        width: 44,
    },
});