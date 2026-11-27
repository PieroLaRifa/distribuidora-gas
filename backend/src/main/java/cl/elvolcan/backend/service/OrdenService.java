
package cl.elvolcan.backend.service;

import cl.elvolcan.backend.dto.OrdenCrearDTO;
import cl.elvolcan.backend.entity.*;
import cl.elvolcan.backend.exception.ConflictoNegocioException;
import cl.elvolcan.backend.exception.RecursoNoEncontradoException;
import cl.elvolcan.backend.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

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

    public Orden crear(OrdenCrearDTO datos) {
        Orden orden = new Orden();

        if (datos.userId() != null) {
            Usuario usuario = usuarioRepository.findById(datos.userId())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                    "Usuario no encontrado"
                ));
            orden.setUsuario(usuario);
        }

        orden.setClienteNombre(datos.cliente().nombre());
        orden.setClienteEmail(datos.cliente().email());
        orden.setClienteTelefono(datos.cliente().telefono());
        orden.setDireccionCalle(datos.direccion().calle());
        orden.setDireccionDepto(datos.direccion().depto());
        orden.setDireccionComuna(datos.direccion().comuna());
        orden.setDireccionIndicaciones(datos.direccion().indicaciones());

        Map<Long, Integer> cantidades = new LinkedHashMap<>();

        for (OrdenCrearDTO.ItemDTO item : datos.items()) {
            cantidades.merge(
                item.productId(),
                item.cantidad(),
                Math::addExact
            );
        }

        BigDecimal total = BigDecimal.ZERO;

        for (Map.Entry<Long, Integer> entrada : cantidades.entrySet()) {
            Producto producto = productoRepository
                .buscarPorIdConBloqueo(entrada.getKey())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                    "Producto no encontrado"
                ));

            Integer cantidad = entrada.getValue();

            if (producto.getStock() < cantidad) {
                throw new ConflictoNegocioException(
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

            orden.getItems().add(detalle);
            producto.setStock(producto.getStock() - cantidad);
            total = total.add(subtotal);
        }

        orden.setTotal(total);
        orden.setNumeroOrden(generarNumeroOrden());
        orden.setEstado("Pagada");

        return ordenRepository.save(orden);
    }

    @Transactional(readOnly = true)
    public Orden buscarPorId(Long id) {
        return ordenRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException(
                "Orden no encontrada"
            ));
    }

    @Transactional(readOnly = true)
    public List<Orden> listar() {
        return ordenRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Orden buscarPorNumero(String numeroOrden) {
        return ordenRepository.findByNumeroOrden(numeroOrden)
            .orElseThrow(() -> new RecursoNoEncontradoException(
                "Orden no encontrada"
            ));
    }

    public Orden actualizarEstado(Long id, String nuevoEstado) {
        if (nuevoEstado == null || !ESTADOS.contains(nuevoEstado)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Estado de orden no válido"
            );
        }

        Orden orden = buscarPorId(id);

        if ("Cancelada".equals(orden.getEstado())) {
            throw new ConflictoNegocioException(
                "No se puede modificar una orden cancelada"
            );
        }

        if ("Cancelada".equals(nuevoEstado)) {
            for (DetalleOrden detalle : orden.getItems()) {
                Producto producto = productoRepository
                    .buscarPorIdConBloqueo(detalle.getProducto().getId())
                    .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Producto no encontrado"
                    ));

                producto.setStock(producto.getStock() + detalle.getCantidad());
            }
        }

        orden.setEstado(nuevoEstado);
        return ordenRepository.save(orden);
    }

    public void eliminar(Long id) {
        Orden orden = buscarPorId(id);

        if (!"Cancelada".equals(orden.getEstado())) {
            throw new ConflictoNegocioException(
                "Solo se pueden eliminar órdenes canceladas"
            );
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
}
