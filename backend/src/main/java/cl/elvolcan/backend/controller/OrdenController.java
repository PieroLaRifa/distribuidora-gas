
package cl.elvolcan.backend.controller;

import cl.elvolcan.backend.dto.OrdenCrearDTO;
import cl.elvolcan.backend.dto.OrdenEstadoDTO;
import cl.elvolcan.backend.dto.OrdenRespuestaDTO;
import cl.elvolcan.backend.mapper.OrdenMapper;
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

    public OrdenController(OrdenService ordenService) {
        this.ordenService = ordenService;
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
    public ResponseEntity<OrdenRespuestaDTO> buscarPorId(
        @PathVariable Long id
    ) {
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
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(OrdenMapper.toDTO(ordenService.crear(datos)));
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
