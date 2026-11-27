
package cl.elvolcan.backend.controller;

import cl.elvolcan.backend.dto.OrdenCrearDTO;
import cl.elvolcan.backend.dto.OrdenEstadoDTO;
import cl.elvolcan.backend.dto.OrdenRespuestaDTO;
import cl.elvolcan.backend.mapper.OrdenMapper;
import cl.elvolcan.backend.service.OrdenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordenes")
@Transactional
@Tag(name = "Órdenes", description = "Creación y gestión de órdenes de compra (cliente, dirección, productos y estado)")
public class OrdenController {

    private final OrdenService ordenService;

    public OrdenController(OrdenService ordenService) {
        this.ordenService = ordenService;
    }

    @Operation(summary = "Listar órdenes", description = "Devuelve todas las órdenes registradas.")
    @ApiResponse(
        responseCode = "200",
        description = "Lista de órdenes (puede venir vacía)",
        content = @Content(
            mediaType = "application/json",
            array = @ArraySchema(schema = @Schema(implementation = OrdenRespuestaDTO.class))
        )
    )
    @GetMapping
    public ResponseEntity<List<OrdenRespuestaDTO>> listar() {
        return ResponseEntity.ok(
            ordenService.listar().stream()
                .map(OrdenMapper::toDTO)
                .toList()
        );
    }

    @Operation(summary = "Buscar orden por id", description = "Devuelve una orden según su identificador interno.")
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Orden encontrada",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = OrdenRespuestaDTO.class)
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "La orden no existe. Actualmente el backend responde 500 porque no hay un manejador global de errores; lo esperable es 404.",
            content = @Content
        )
    })
    @GetMapping("/{id}")
    public ResponseEntity<OrdenRespuestaDTO> buscarPorId(
        @Parameter(description = "Id de la orden", example = "1")
        @PathVariable Long id
    ) {
        return ResponseEntity.ok(
            OrdenMapper.toDTO(ordenService.buscarPorId(id))
        );
    }

    @Operation(
        summary = "Buscar orden por número de orden",
        description = "Devuelve una orden según el número de orden que se le entregó al cliente (campo numeroOrden de la respuesta)."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Orden encontrada",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = OrdenRespuestaDTO.class)
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "No existe una orden con ese número (esperable: 404)",
            content = @Content
        )
    })
    @GetMapping("/numero/{numeroOrden}")
    public ResponseEntity<OrdenRespuestaDTO> buscarPorNumero(
        @Parameter(description = "Número de orden devuelto al crear la orden")
        @PathVariable String numeroOrden
    ) {
        return ResponseEntity.ok(
            OrdenMapper.toDTO(ordenService.buscarPorNumero(numeroOrden))
        );
    }

    @Operation(
        summary = "Crear orden",
        description = "Registra una orden nueva con los datos del cliente, la dirección de entrega y uno o más productos con su cantidad. userId es opcional (compra sin cuenta). Los productos y el usuario indicados deben existir."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "201",
            description = "Orden creada",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = OrdenRespuestaDTO.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Datos inválidos",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "500",
            description = "El usuario o algún producto indicado no existe (esperable: 404)",
            content = @Content
        )
    })
    @PostMapping
    public ResponseEntity<OrdenRespuestaDTO> crear(
        @Valid @RequestBody OrdenCrearDTO datos
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(OrdenMapper.toDTO(ordenService.crear(datos)));
    }

    @Operation(
        summary = "Actualizar estado de una orden",
        description = "Cambia solo el estado de la orden mediante PATCH. Requiere rol ADMIN."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Estado actualizado"),
        @ApiResponse(responseCode = "400", description = "El estado viene vacío"),
        @ApiResponse(responseCode = "500", description = "La orden no existe (esperable: 404)")
    })
    @PatchMapping("/{id}/estado")
    public ResponseEntity<OrdenRespuestaDTO> actualizarEstado(
        @Parameter(description = "Id de la orden", example = "1")
        @PathVariable Long id,
        @Valid @RequestBody OrdenEstadoDTO datos
    ) {
        return ResponseEntity.ok(
            OrdenMapper.toDTO(
                ordenService.actualizarEstado(id, datos.estado())
            )
        );
    }

    @Operation(summary = "Eliminar orden", description = "Elimina una orden por su id. No devuelve cuerpo.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Orden eliminada"),
        @ApiResponse(responseCode = "500", description = "La orden no existe o no se puede eliminar")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
        @Parameter(description = "Id de la orden a eliminar", example = "1")
        @PathVariable Long id
    ) {
        ordenService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
