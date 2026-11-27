package cl.elvolcan.backend.service;

import cl.elvolcan.backend.entity.*;
import cl.elvolcan.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class OrdenService {

    private final OrdenRepository ordenRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    public OrdenService(OrdenRepository ordenRepository, ProductoRepository productoRepository,
                        UsuarioRepository usuarioRepository) {
        this.ordenRepository = ordenRepository;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Orden crear(Orden orden) {
        if (orden.getItems() == null || orden.getItems().isEmpty()) {
            throw new RuntimeException("La orden debe contener productos");
        }

        if (orden.getUsuario() != null && orden.getUsuario().getId() != null) {
            Usuario usuario = usuarioRepository.findById(orden.getUsuario().getId())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            orden.setUsuario(usuario);
        } else {
            orden.setUsuario(null);
        }

        BigDecimal total = BigDecimal.ZERO;

        for (DetalleOrden item : orden.getItems()) {
            if (item.getProducto() == null || item.getProducto().getId() == null) {
                throw new RuntimeException("Producto inválido");
            }

            if (item.getCantidad() == null || item.getCantidad() <= 0) {
                throw new RuntimeException("La cantidad debe ser mayor a cero");
            }

            Producto producto = productoRepository.buscarPorIdConBloqueo(
                    item.getProducto().getId()
            ).orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            if (producto.getStock() < item.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para: " + producto.getNombre());
            }

            BigDecimal subtotal = producto.getPrecio()
                    .multiply(BigDecimal.valueOf(item.getCantidad()));

            item.setProducto(producto);
            item.setNombreProducto(producto.getNombre());
            item.setPrecioUnitario(producto.getPrecio());
            item.setSubtotal(subtotal);
            item.setOrden(orden);

            producto.setStock(producto.getStock() - item.getCantidad());

            total = total.add(subtotal);
        }

        orden.setTotal(total);
        orden.setNumeroOrden(UUID.randomUUID().toString().substring(0, 12).toUpperCase());
        orden.setEstado("Pagada");

        return ordenRepository.save(orden);
    }

    @Transactional(readOnly = true)
    public Orden buscarPorId(Long id) {
        return ordenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
    }

    @Transactional(readOnly = true)
    public List<Orden> listar() {
        return ordenRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Orden buscarPorNumero(String numeroOrden) {
        return ordenRepository.findByNumeroOrden(numeroOrden)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
    }
}