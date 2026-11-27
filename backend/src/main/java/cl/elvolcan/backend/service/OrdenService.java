
package cl.elvolcan.backend.service;

import cl.elvolcan.backend.entity.*;
import cl.elvolcan.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
@Transactional
public class OrdenService {

    private final OrdenRepository ordenRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    private static final Set<String> ESTADOS = Set.of(
        "Pagada", "Preparando", "En despacho", "Entregada", "Cancelada"
    );

    public OrdenService(
        OrdenRepository ordenRepository,
        ProductoRepository productoRepository,
        UsuarioRepository usuarioRepository
    ) {
        this.ordenRepository = ordenRepository;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Orden crear(Orden orden) {
        if (orden.getItems() == null || orden.getItems().isEmpty()) {
            throw new RuntimeException("La orden debe contener productos");
        }

        validarDatosCliente(orden);

        if (orden.getUsuario() != null && orden.getUsuario().getId() != null) {
            Usuario usuario = usuarioRepository.findById(orden.getUsuario().getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            orden.setUsuario(usuario);
        } else {
            orden.setUsuario(null);
        }

        Map<Long, Integer> cantidades = new LinkedHashMap<>();

        for (DetalleOrden item : orden.getItems()) {
            if (item.getProducto() == null || item.getProducto().getId() == null) {
                throw new RuntimeException("Producto inválido");
            }
            if (item.getCantidad() == null || item.getCantidad() <= 0) {
                throw new RuntimeException("La cantidad debe ser mayor a cero");
            }

            cantidades.merge(
                item.getProducto().getId(),
                item.getCantidad(),
                Integer::sum
            );
        }

        List<DetalleOrden> detalles = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (Map.Entry<Long, Integer> entrada : cantidades.entrySet()) {
            Producto producto = productoRepository.buscarPorIdConBloqueo(entrada.getKey())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            Integer cantidad = entrada.getValue();

            if (producto.getStock() < cantidad) {
                throw new RuntimeException(
                    "Stock insuficiente para: " + producto.getNombre()
                );
            }

            BigDecimal subtotal = producto.getPrecio()
                .multiply(BigDecimal.valueOf(cantidad));

            DetalleOrden detalle = new DetalleOrden();
            detalle.setOrden(orden);
            detalle.setProducto(producto);
            detalle.setNombreProducto(producto.getNombre());
            detalle.setPrecioUnitario(producto.getPrecio());
            detalle.setCantidad(cantidad);
            detalle.setSubtotal(subtotal);

            producto.setStock(producto.getStock() - cantidad);
            detalles.add(detalle);
            total = total.add(subtotal);
        }

        orden.getItems().clear();
        orden.getItems().addAll(detalles);
        orden.setTotal(total);
        orden.setNumeroOrden(generarNumeroOrden());
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

    public Orden actualizarEstado(Long id, String nuevoEstado) {
        if (!ESTADOS.contains(nuevoEstado)) {
            throw new RuntimeException("Estado de orden no válido");
        }

        Orden orden = buscarPorId(id);

        if ("Cancelada".equals(orden.getEstado())) {
            throw new RuntimeException("No se puede modificar una orden cancelada");
        }

        if ("Cancelada".equals(nuevoEstado)) {
            for (DetalleOrden detalle : orden.getItems()) {
                Producto producto = productoRepository.buscarPorIdConBloqueo(
                    detalle.getProducto().getId()
                ).orElseThrow(() -> new RuntimeException("Producto no encontrado"));

                producto.setStock(producto.getStock() + detalle.getCantidad());
            }
        }

        orden.setEstado(nuevoEstado);
        return ordenRepository.save(orden);
    }

    public void eliminar(Long id) {
        Orden orden = buscarPorId(id);

        if (!"Cancelada".equals(orden.getEstado())) {
            throw new RuntimeException("Solo se pueden eliminar órdenes canceladas");
        }

        ordenRepository.delete(orden);
    }

    private String generarNumeroOrden() {
        String numero;

        do {
            numero = UUID.randomUUID().toString()
                .replace("-", "")
                .substring(0, 12)
                .toUpperCase(Locale.ROOT);
        } while (ordenRepository.findByNumeroOrden(numero).isPresent());

        return numero;
    }

    private void validarDatosCliente(Orden orden) {
        if (orden.getClienteNombre() == null || orden.getClienteNombre().isBlank()
            || orden.getClienteEmail() == null || orden.getClienteEmail().isBlank()
            || orden.getClienteTelefono() == null || orden.getClienteTelefono().isBlank()
            || orden.getDireccionCalle() == null || orden.getDireccionCalle().isBlank()
            || orden.getDireccionComuna() == null || orden.getDireccionComuna().isBlank()) {
            throw new RuntimeException("Faltan datos del cliente o de la dirección");
        }
    }
}
