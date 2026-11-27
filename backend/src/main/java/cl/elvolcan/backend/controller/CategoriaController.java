package cl.elvolcan.backend.controller;

import cl.elvolcan.backend.dto.CategoriaRequestDTO;
import cl.elvolcan.backend.dto.CategoriaRespuestaDTO;
import cl.elvolcan.backend.entity.Categoria;
import cl.elvolcan.backend.mapper.CategoriaMapper;
import cl.elvolcan.backend.service.CategoriaService;
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
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@Tag(name = "Categorías", description = "CRUD de categorías de productos (ej: gas licuado, accesorios)")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @Operation(
        summary = "Listar categorías",
        description = "Devuelve todas las categorías registradas."
    )
    @ApiResponse(
        responseCode = "200",
        description = "Lista de categorías (puede venir vacía)",
        content = @Content(
            mediaType = "application/json",
            array = @ArraySchema(schema = @Schema(implementation = CategoriaRespuestaDTO.class))
        )
    )
    @GetMapping
    public ResponseEntity<List<CategoriaRespuestaDTO>> listar() {
        List<CategoriaRespuestaDTO> categorias = categoriaService.listar()
            .stream()
            .map(CategoriaMapper::toDTO)
            .toList();

        return ResponseEntity.ok(categorias);
    }

    @Operation(
        summary = "Buscar categoría por id",
        description = "Devuelve una categoría según su identificador."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Categoría encontrada",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = CategoriaRespuestaDTO.class)
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "La categoría no existe. Actualmente el backend responde 500 "
                + "porque no hay un manejador global de errores; lo esperable es 404.",
            content = @Content
        )
    })
    @GetMapping("/{id}")
    public ResponseEntity<CategoriaRespuestaDTO> buscarPorId(
        @Parameter(description = "Id de la categoría", example = "1")
        @PathVariable Long id
    ) {
        return ResponseEntity.ok(
            CategoriaMapper.toDTO(categoriaService.buscarPorId(id))
        );
    }

    @Operation(
        summary = "Crear categoría",
        description = "Registra una categoría nueva. El nombre es obligatorio (máx. 100 caracteres)."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "201",
            description = "Categoría creada",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = CategoriaRespuestaDTO.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Datos inválidos (por ejemplo, nombre vacío)",
            content = @Content
        )
    })
    @PostMapping
    public ResponseEntity<CategoriaRespuestaDTO> crear(
        @Valid @RequestBody CategoriaRequestDTO datos
    ) {
        Categoria categoria = new Categoria();
        categoria.setNombre(datos.nombre());
        categoria.setDescripcion(datos.descripcion());

        Categoria creada = categoriaService.crear(categoria);

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(CategoriaMapper.toDTO(creada));
    }

    @Operation(
        summary = "Actualizar categoría",
        description = "Reemplaza el nombre y la descripción de una categoría existente."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Categoría actualizada",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = CategoriaRespuestaDTO.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Datos inválidos",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "500",
            description = "La categoría no existe (esperable: 404, ver nota en GET por id)",
            content = @Content
        )
    })
    @PutMapping("/{id}")
    public ResponseEntity<CategoriaRespuestaDTO> actualizar(
        @Parameter(description = "Id de la categoría a actualizar", example = "1")
        @PathVariable Long id,
        @Valid @RequestBody CategoriaRequestDTO datos
    ) {
        Categoria categoria = new Categoria();
        categoria.setNombre(datos.nombre());
        categoria.setDescripcion(datos.descripcion());

        return ResponseEntity.ok(
            CategoriaMapper.toDTO(categoriaService.actualizar(id, categoria))
        );
    }

    @Operation(
        summary = "Eliminar categoría",
        description = "Elimina una categoría por su id. No devuelve cuerpo."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Categoría eliminada"),
        @ApiResponse(
            responseCode = "500",
            description = "La categoría no existe o no se puede eliminar",
            content = @Content
        )
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
        @Parameter(description = "Id de la categoría a eliminar", example = "1")
        @PathVariable Long id
    ) {
        categoriaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}