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

export const Pagination: React.FC<PaginationProps> = ({
    paginationInfo,
    onPageChange,
    loading = false,
    mode = 'full'
}) => {
    const { currentPage, totalPages, totalElements, pageSize } = paginationInfo;

    if (totalPages <= 1) {
        return null; // No mostrar paginación si solo hay una página
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
        
        // Ajustar el inicio si no tenemos suficientes páginas al final
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
        return (
            <View style={styles.compactContainer}>
                <TouchableOpacity
                    style={[styles.compactButton, currentPage === 0 && styles.disabledButton]}
                    onPress={handlePrevious}
                    disabled={currentPage === 0 || loading}
                >
                    <Ionicons name="chevron-back" size={20} color={currentPage === 0 ? '#ccc' : '#666'} />
                </TouchableOpacity>
                
                <Text style={styles.compactText}>
                    {currentPage + 1} de {totalPages}
                </Text>
                
                <TouchableOpacity
                    style={[styles.compactButton, currentPage === totalPages - 1 && styles.disabledButton]}
                    onPress={handleNext}
                    disabled={currentPage === totalPages - 1 || loading}
                >
                    <Ionicons name="chevron-forward" size={20} color={currentPage === totalPages - 1 ? '#ccc' : '#666'} />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Información de elementos */}
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                    Mostrando {startItem}-{endItem} de {totalElements} elementos
                </Text>
            </View>
            
            {/* Controles de paginación */}
            <View style={styles.controlsContainer}>
                {/* Botón anterior */}
                <TouchableOpacity
                    style={[styles.button, styles.navigationButton, currentPage === 0 && styles.disabledButton]}
                    onPress={handlePrevious}
                    disabled={currentPage === 0 || loading}
                >
                    <Ionicons name="chevron-back" size={16} color={currentPage === 0 ? '#ccc' : '#666'} />
                    <Text style={[styles.buttonText, currentPage === 0 && styles.disabledText]}>
                        Anterior
                    </Text>
                </TouchableOpacity>

                {/* Números de página */}
                <View style={styles.pageNumbersContainer}>
                    {getPageNumbers().map((pageNumber) => (
                        <TouchableOpacity
                            key={pageNumber}
                            style={[
                                styles.button,
                                styles.pageButton,
                                pageNumber === currentPage && styles.activeButton
                            ]}
                            onPress={() => handlePageNumber(pageNumber)}
                            disabled={loading}
                        >
                            <Text style={[
                                styles.buttonText,
                                styles.pageButtonText,
                                pageNumber === currentPage && styles.activeButtonText
                            ]}>
                                {pageNumber + 1}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Botón siguiente */}
                <TouchableOpacity
                    style={[
                        styles.button,
                        styles.navigationButton,
                        currentPage === totalPages - 1 && styles.disabledButton
                    ]}
                    onPress={handleNext}
                    disabled={currentPage === totalPages - 1 || loading}
                >
                    <Text style={[
                        styles.buttonText,
                        currentPage === totalPages - 1 && styles.disabledText
                    ]}>
                        Siguiente
                    </Text>
                    <Ionicons 
                        name="chevron-forward" 
                        size={16} 
                        color={currentPage === totalPages - 1 ? '#ccc' : '#666'} 
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    infoContainer: {
        alignItems: 'center',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
    },
    controlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pageNumbersContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    button: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        minWidth: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navigationButton: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 16,
        minWidth: 80,
    },
    pageButton: {
        marginHorizontal: 4,
        backgroundColor: '#f5f5f5',
        minWidth: 40,
    },
    activeButton: {
        backgroundColor: '#4CAF50',
    },
    disabledButton: {
        backgroundColor: '#f9f9f9',
        opacity: 0.6,
    },
    buttonText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    pageButtonText: {
        textAlign: 'center',
    },
    activeButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    disabledText: {
        color: '#ccc',
    },
    // Estilos para modo compacto
    compactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    compactButton: {
        padding: 8,
        borderRadius: 4,
        backgroundColor: '#f5f5f5',
    },
    compactText: {
        fontSize: 14,
        color: '#666',
        marginHorizontal: 16,
        fontWeight: '500',
    },
});
