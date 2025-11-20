import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

import { productoService } from "@/src/services/productoService";
import { categoryService } from "@/src/services/categoryService";

import { ProductoResponse } from "@/src/types/producto";
import { CategoriaResponse } from "@/src/types/catalog";

import ProductoCard from "@/src/components/CatProductCliente/ProductoCard";
import BuscadorProducto from "@/src/components/CatProductCliente/BuscadorProducto";
import FiltroPrecio from "@/src/components/CatProductCliente/FiltroPrecio";
import CategoriaSelector from "@/src/components/CatProductCliente/CategoriaSelector";
import { Pagination, PaginationInfo } from "@/src/components/common/Pagination";

export default function ClienteCatalogoScreen() {
  const [productos, setProductos] = useState<ProductoResponse[]>([]);
  const [categorias, setCategorias] = useState<CategoriaResponse[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [nombreBuscar, setNombreBuscar] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [precioMin, setPrecioMin] = useState<number | null>(null);
  const [precioMax, setPrecioMax] = useState<number | null>(null);

  // Paginación
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 0,
    totalPages: 1,
    totalElements: 0,
    pageSize: 8,
  });

  // Cargar categorías
  useEffect(() => {
    async function cargarCategorias() {
      try {
        const resp = await categoryService.listarTodasSinPaginacion();
        setCategorias(resp);
      } catch {
        console.log("Error cargando categorías");
      }
    }
    cargarCategorias();
  }, []);

  // Cargar productos
  async function cargarProductos(page: number = 0) {
    try {
      setLoading(true);
      setError(null);

      const resp = await productoService.listarTodos(page, pagination.pageSize);

      setProductos(resp.content);
      setPagination({
        currentPage: resp.number,
        totalPages: resp.totalPages,
        totalElements: resp.totalElements,
        pageSize: resp.size,
      });
    } catch (e: any) {
      setError(e?.message || "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  }

  // Buscar productos por nombre
  async function buscarProductos(page: number = 0) {
    if (nombreBuscar.trim() === "") {
      return cargarProductos();
    }

    try {
      setLoading(true);
      const resp = await productoService.buscarPorNombre(
        nombreBuscar,
        page,
        pagination.pageSize
      );

      setProductos(resp.content);
      setPagination({
        currentPage: resp.number,
        totalPages: resp.totalPages,
        totalElements: resp.totalElements,
        pageSize: resp.size,
      });
    } catch {
      setProductos([]);
      setError("No se encontraron productos");
    } finally {
      setLoading(false);
    }
  }

  // Filtrar por categoría
  async function filtrarPorCategoria(id: number | null, page: number = 0) {
    setCategoriaId(id);

    if (id === null) {
      cargarProductos();
      return;
    }

    try {
      setLoading(true);
      const resp = await productoService.obtenerPorCategoria(
        id,
        page,
        pagination.pageSize
      );

      setProductos(resp.content);
      setPagination({
        currentPage: resp.number,
        totalPages: resp.totalPages,
        totalElements: resp.totalElements,
        pageSize: resp.size,
      });
    } catch {
      setProductos([]);
      setError("No se encontraron productos en esta categoría");
    } finally {
      setLoading(false);
    }
  }


  // Filtrar por precio
  async function filtrarPorPrecio(min: number, max: number, page: number = 0) {
    setPrecioMin(min);
    setPrecioMax(max);

    try {
      setLoading(true);
      setError(null);

      const resp = await productoService.buscarPorRangoPrecio(
        min,
        max,
        page,
        pagination.pageSize
      );

      setProductos(resp.content);
      setPagination({
        currentPage: resp.number,
        totalPages: resp.totalPages,
        totalElements: resp.totalElements,
        pageSize: resp.size,
      });
    } catch {
      setProductos([]);
      setError("No se encontraron productos dentro del rango de precios");
    } finally {
      setLoading(false);
    }
  }


  // Reset al limpiar el buscador

  useEffect(() => {
    if (nombreBuscar.trim() === "") {
      setPrecioMin(null);
      setPrecioMax(null);
      cargarProductos();
    }
  }, [nombreBuscar]);


  // Cargar productos al abrir pantalla
 
  useEffect(() => {
    cargarProductos();
  }, []);


  // Paginación combinada

  const handlePageChange = (page: number) => {
    if (precioMin !== null && precioMax !== null) {
      filtrarPorPrecio(precioMin, precioMax, page);
    } else if (categoriaId !== null) {
      filtrarPorCategoria(categoriaId, page);
    } else if (nombreBuscar.trim() !== "") {
      buscarProductos(page);
    } else {
      cargarProductos(page);
    }
  };

  // RENDER
  return (
    <View style={{ flex: 1 }}>
      {/* Buscador */}
      <BuscadorProducto
        value={nombreBuscar}
        onChange={setNombreBuscar}
        onSubmit={() => buscarProductos(0)}
      />

      {/* Selector de Categoría */}
      <CategoriaSelector
        categorias={categorias}
        categoriaSeleccionada={categoriaId}
        onSelect={(id) => filtrarPorCategoria(id, 0)}
      />

      {/* Filtro de Precio */}
      <FiltroPrecio onAplicar={(min, max) => filtrarPorPrecio(min, max, 0)} />

      {/* Contenido */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#6A1B9A" />
          <Text>Cargando catálogo...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={{ color: "red" }}>{error}</Text>
          <TouchableOpacity style={styles.btnRecargar} onPress={() => cargarProductos()}>
            <Text style={styles.btnRecargarText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={productos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ProductoCard producto={item} />}
            numColumns={2}
            contentContainerStyle={styles.lista}
          />

          {/* Paginación */}
          <Pagination
            paginationInfo={pagination}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  lista: {
    padding: 10,
    paddingBottom: 30,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btnRecargar: {
    backgroundColor: "#6A1B9A",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  btnRecargarText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
