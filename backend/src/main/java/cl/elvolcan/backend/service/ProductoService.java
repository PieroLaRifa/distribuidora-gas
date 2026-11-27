
package cl.elvolcan.backend.service;

import cl.elvolcan.backend.entity.Categoria;
import cl.elvolcan.backend.entity.Producto;
import cl.elvolcan.backend.exception.ConflictoNegocioException;
import cl.elvolcan.backend.exception.RecursoNoEncontradoException;
import cl.elvolcan.backend.repository.CategoriaRepository;
import cl.elvolcan.backend.repository.DetalleOrdenRepository;
import cl.elvolcan.backend.repository.ProductoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final DetalleOrdenRepository detalleOrdenRepository;

    public ProductoService(
        ProductoRepository productoRepository,
        CategoriaRepository categoriaRepository,
        DetalleOrdenRepository detalleOrdenRepository
    ) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
        this.detalleOrdenRepository = detalleOrdenRepository;
    }

    @Transactional(readOnly = true)
    public List<Producto> listar() {
        return productoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Producto buscarPorId(Long id) {
        return productoRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException(
                "Producto no encontrado"
            ));
    }

    @Transactional(readOnly = true)
    public Categoria buscarCategoriaPorId(Long id) {
        return buscarCategoria(id);
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

        if (detalleOrdenRepository.existsByProducto_Id(id)) {
            throw new ConflictoNegocioException(
                "No se puede eliminar un producto asociado a una orden"
            );
        }

        productoRepository.delete(producto);
    }

    private Categoria buscarCategoria(Long id) {
        return categoriaRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException(
                "Categoría no encontrada"
            ));
    }

    private void validarProducto(Producto producto) {
        if (producto.getNombre() == null || producto.getNombre().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El nombre del producto es obligatorio"
            );
        }

        if (producto.getPrecio() == null ||
            producto.getPrecio().compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El precio debe ser mayor o igual a cero"
            );
        }

        if (producto.getStock() == null || producto.getStock() < 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El stock debe ser mayor o igual a cero"
            );
        }

        if (producto.getCategoria() == null ||
            producto.getCategoria().getId() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Debe seleccionar una categoría"
            );
        }
    }
}
