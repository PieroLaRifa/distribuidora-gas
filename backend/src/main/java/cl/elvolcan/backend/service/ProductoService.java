package cl.elvolcan.backend.service;

import cl.elvolcan.backend.entity.Categoria;
import cl.elvolcan.backend.entity.Producto;
import cl.elvolcan.backend.repository.CategoriaRepository;
import cl.elvolcan.backend.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    public ProductoService(ProductoRepository productoRepository, CategoriaRepository categoriaRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional(readOnly = true)
    public List<Producto> listar() {
        return productoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Producto buscarPorId(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    public Producto crear(Producto producto) {
        validarProducto(producto);
        producto.setCategoria(buscarCategoria(producto.getCategoria().getId()));
        return productoRepository.save(producto);
    }

    public Producto actualizar(Long id, Producto datos) {
        validarProducto(datos);
        Producto producto = buscarPorId(id);
        producto.setNombre(datos.getNombre());
        producto.setDescripcion(datos.getDescripcion());
        producto.setPrecio(datos.getPrecio());
        producto.setStock(datos.getStock());
        producto.setImagen(datos.getImagen());
        producto.setDestacado(datos.getDestacado());
        producto.setCategoria(buscarCategoria(datos.getCategoria().getId()));
        return productoRepository.save(producto);
    }

    public void eliminar(Long id) {
        Producto producto = buscarPorId(id);
        productoRepository.delete(producto);
    }

    private Categoria buscarCategoria(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
    }

    private void validarProducto(Producto producto) {
        if (producto.getNombre() == null || producto.getNombre().isBlank()) {
            throw new RuntimeException("El nombre del producto es obligatorio");
        }
        if (producto.getPrecio() == null || producto.getPrecio().compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("El precio debe ser mayor o igual a cero");
        }
        if (producto.getStock() == null || producto.getStock() < 0) {
            throw new RuntimeException("El stock debe ser mayor o igual a cero");
        }
        if (producto.getCategoria() == null || producto.getCategoria().getId() == null) {
            throw new RuntimeException("Debe seleccionar una categoría");
        }
    }
}