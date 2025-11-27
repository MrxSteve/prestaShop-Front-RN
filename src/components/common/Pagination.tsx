import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
}

interface PaginationProps {
    paginationInfo: PaginationInfo;
    onPageChange: (page: number) => void;
    loading?: boolean;
    mode?: 'compact' | 'full';
}

const COLORS = {
    primary: '#007AFF',
    background: '#FFFFFF',
    border: '#E0E0E0',
    text: '#333333',
    secondaryText: '#757575',
    disabled: '#CCCCCC',
    lightGray: '#F7F7F7',
};

export const Pagination: React.FC<PaginationProps> = ({
    paginationInfo,
    onPageChange,
    loading = false,
    mode = 'full'
}) => {
    const { currentPage, totalPages, totalElements, pageSize } = paginationInfo;

    if (totalPages <= 1) {
        return null;
    }

    const handlePrevious = () => {
        if (currentPage > 0 && !loading) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages - 1 && !loading) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageNumber = (pageNumber: number) => {
        if (pageNumber !== currentPage && !loading) {
            onPageChange(pageNumber);
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = mode === 'compact' ? 3 : 5;
        const halfVisible = Math.floor(maxVisiblePages / 2);
        
        let startPage = Math.max(0, currentPage - halfVisible);
        let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(0, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        
        return pages;
    };

    const startItem = currentPage * pageSize + 1;
    const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

    if (mode === 'compact') {
        const isPrevDisabled = currentPage === 0 || loading;
        const isNextDisabled = currentPage === totalPages - 1 || loading;

        return (
            <View style={styles.compactContainer}>
                <TouchableOpacity
                    style={[
                        styles.compactButton, 
                        isPrevDisabled && styles.disabledButton,
                    ]}
                    onPress={handlePrevious}
                    disabled={isPrevDisabled}
                >
                    <Ionicons 
                        name="chevron-back" 
                        size={24} 
                        color={isPrevDisabled ? COLORS.disabled : COLORS.primary} 
                    />
                </TouchableOpacity>
                
                <Text style={styles.compactText}>
                    <Text style={styles.compactCurrentPageText}>{currentPage + 1}</Text> de {totalPages}
                </Text>
                
                <TouchableOpacity
                    style={[
                        styles.compactButton, 
                        isNextDisabled && styles.disabledButton,
                    ]}
                    onPress={handleNext}
                    disabled={isNextDisabled}
                >
                    <Ionicons 
                        name="chevron-forward" 
                        size={24} 
                        color={isNextDisabled ? COLORS.disabled : COLORS.primary} 
                    />
                </TouchableOpacity>
            </View>
        );
    }

    const isPrevDisabled = currentPage === 0 || loading;
    const isNextDisabled = currentPage === totalPages - 1 || loading;
    
    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                    Mostrando {startItem}-{endItem} de {totalElements} elementos
                </Text>
            </View>
            
            <View style={styles.controlsContainer}>
                <TouchableOpacity
                    style={[
                        styles.button, 
                        styles.navigationButton, 
                        isPrevDisabled && styles.disabledButton,
                        { marginRight: 8 }
                    ]}
                    onPress={handlePrevious}
                    disabled={isPrevDisabled}
                >
                    <Ionicons 
                        name="chevron-back" 
                        size={18} 
                        color={isPrevDisabled ? COLORS.disabled : COLORS.secondaryText} 
                        style={{ marginRight: 4 }}
                    />
                    <Text style={[
                        styles.buttonText, 
                        isPrevDisabled && styles.disabledText
                    ]}>
                        Anterior
                    </Text>
                </TouchableOpacity>

                <View style={styles.pageNumbersContainer}>
                    {getPageNumbers().map((pageNumber) => {
                        const isActive = pageNumber === currentPage;
                        return (
                            <TouchableOpacity
                                key={pageNumber}
                                style={[
                                    styles.button,
                                    styles.pageButton,
                                    isActive && styles.activeButton,
                                    (loading && !isActive) && styles.disabledButton
                                ]}
                                onPress={() => handlePageNumber(pageNumber)}
                                disabled={loading}
                            >
                                <Text style={[
                                    styles.buttonText,
                                    styles.pageButtonText,
                                    isActive ? styles.activeButtonText : styles.pageNumberText,
                                ]}>
                                    {pageNumber + 1}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <TouchableOpacity
                    style={[
                        styles.button,
                        styles.navigationButton,
                        isNextDisabled && styles.disabledButton,
                        { marginLeft: 8 }
                    ]}
                    onPress={handleNext}
                    disabled={isNextDisabled}
                >
                    <Text style={[
                        styles.buttonText,
                        isNextDisabled && styles.disabledText
                    ]}>
                        Siguiente
                    </Text>
                    <Ionicons 
                        name="chevron-forward" 
                        size={18} 
                        color={isNextDisabled ? COLORS.disabled : COLORS.secondaryText}
                        style={{ marginLeft: 4 }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.background,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    infoContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    infoText: {
        fontSize: 14,
        color: COLORS.secondaryText,
        fontWeight: '400',
    },
    controlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pageNumbersContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8,
    },
    button: {
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 40,
        backgroundColor: COLORS.lightGray,
    },
    navigationButton: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        minWidth: 100,
    },
    pageButton: {
        marginHorizontal: 4,
        width: 40,
        backgroundColor: COLORS.lightGray,
    },
    activeButton: {
        backgroundColor: COLORS.primary,
    },
    disabledButton: {
        backgroundColor: COLORS.lightGray,
        opacity: 0.5,
    },
    buttonText: {
        fontSize: 14,
        color: COLORS.secondaryText,
        fontWeight: '500',
    },
    pageButtonText: {
        textAlign: 'center',
    },
    pageNumberText: {
        color: COLORS.text,
        fontWeight: '600',
    },
    activeButtonText: {
        color: COLORS.background,
        fontWeight: '700',
    },
    disabledText: {
        color: COLORS.disabled,
    },
    compactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: COLORS.background,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    compactButton: {
        padding: 8,
        borderRadius: 4,
        backgroundColor: COLORS.background,
    },
    compactText: {
        fontSize: 16,
        color: COLORS.secondaryText,
        marginHorizontal: 16,
        fontWeight: '400',
    },
    compactCurrentPageText: {
        color: COLORS.text,
        fontWeight: '600',
    }
});