
package cl.elvolcan.backend.controller;

import cl.elvolcan.backend.dto.OrdenCrearDTO;
import cl.elvolcan.backend.dto.OrdenEstadoDTO;
import cl.elvolcan.backend.dto.OrdenRespuestaDTO;
import cl.elvolcan.backend.entity.*;
import cl.elvolcan.backend.mapper.OrdenMapper;
import cl.elvolcan.backend.repository.ProductoRepository;
import cl.elvolcan.backend.repository.UsuarioRepository;
import cl.elvolcan.backend.service.OrdenService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordenes")
@Transactional
public class OrdenController {

    private final OrdenService ordenService;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    public OrdenController(
        OrdenService ordenService,
        ProductoRepository productoRepository,
        UsuarioRepository usuarioRepository
    ) {
        this.ordenService = ordenService;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public ResponseEntity<List<OrdenRespuestaDTO>> listar() {
        return ResponseEntity.ok(
            ordenService.listar().stream()
                .map(OrdenMapper::toDTO)
                .toList()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrdenRespuestaDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(
            OrdenMapper.toDTO(ordenService.buscarPorId(id))
        );
    }

    @GetMapping("/numero/{numeroOrden}")
    public ResponseEntity<OrdenRespuestaDTO> buscarPorNumero(
        @PathVariable String numeroOrden
    ) {
        return ResponseEntity.ok(
            OrdenMapper.toDTO(ordenService.buscarPorNumero(numeroOrden))
        );
    }

    @PostMapping
    public ResponseEntity<OrdenRespuestaDTO> crear(
        @Valid @RequestBody OrdenCrearDTO datos
    ) {
        Orden orden = new Orden();

        if (datos.userId() != null) {
            Usuario usuario = usuarioRepository.findById(datos.userId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            orden.setUsuario(usuario);
        }

        orden.setClienteNombre(datos.cliente().nombre());
        orden.setClienteEmail(datos.cliente().email());
        orden.setClienteTelefono(datos.cliente().telefono());
        orden.setDireccionCalle(datos.direccion().calle());
        orden.setDireccionDepto(datos.direccion().depto());
        orden.setDireccionComuna(datos.direccion().comuna());
        orden.setDireccionIndicaciones(datos.direccion().indicaciones());

        for (OrdenCrearDTO.ItemDTO itemDTO : datos.items()) {
            Producto producto = productoRepository.findById(itemDTO.productId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            DetalleOrden detalle = new DetalleOrden();
            detalle.setProducto(producto);
            detalle.setCantidad(itemDTO.cantidad());
            detalle.setOrden(orden);
            orden.getItems().add(detalle);
        }

        Orden creada = ordenService.crear(orden);

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(OrdenMapper.toDTO(creada));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<OrdenRespuestaDTO> actualizarEstado(
        @PathVariable Long id,
        @Valid @RequestBody OrdenEstadoDTO datos
    ) {
        return ResponseEntity.ok(
            OrdenMapper.toDTO(
                ordenService.actualizarEstado(id, datos.estado())
            )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        ordenService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
