
package cl.elvolcan.backend.controller;

import cl.elvolcan.backend.dto.ProductoRequestDTO;
import cl.elvolcan.backend.dto.ProductoRespuestaDTO;
import cl.elvolcan.backend.entity.Producto;
import cl.elvolcan.backend.mapper.ProductoMapper;
import cl.elvolcan.backend.service.ProductoService;
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
@RequestMapping("/api/productos")
@Tag(name = "Productos", description = "CRUD del catálogo de productos (precio, stock, categoría)")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @Operation(summary = "Listar productos", description = "Devuelve todos los productos del catálogo.")
    @ApiResponse(
        responseCode = "200",
        description = "Lista de productos (puede venir vacía)",
        content = @Content(
            mediaType = "application/json",
            array = @ArraySchema(schema = @Schema(implementation = ProductoRespuestaDTO.class))
        )
    )
    @GetMapping
    public ResponseEntity<List<ProductoRespuestaDTO>> listar() {
        return ResponseEntity.ok(
            productoService.listar().stream()
                .map(ProductoMapper::toDTO)
                .toList()
        );
    }

    @Operation(summary = "Buscar producto por id", description = "Devuelve un producto según su identificador.")
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Producto encontrado",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ProductoRespuestaDTO.class)
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "El producto no existe. Actualmente el backend responde 500 porque no hay un manejador global de errores; lo esperable es 404.",
            content = @Content
        )
    })
    @GetMapping("/{id}")
    public ResponseEntity<ProductoRespuestaDTO> buscarPorId(
        @Parameter(description = "Id del producto", example = "1")
        @PathVariable Long id
    ) {
        return ResponseEntity.ok(
            ProductoMapper.toDTO(productoService.buscarPorId(id))
        );
    }

    @Operation(
        summary = "Crear producto",
        description = "Registra un producto nuevo. Requiere una categoría existente (categoriaId). Precio mayor que cero y stock mayor o igual a cero."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "201",
            description = "Producto creado",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ProductoRespuestaDTO.class)
            )
        ),
        @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content),
        @ApiResponse(responseCode = "500", description = "La categoría indicada no existe (esperable: 404)", content = @Content)
    })
    @PostMapping
    public ResponseEntity<ProductoRespuestaDTO> crear(
        @Valid @RequestBody ProductoRequestDTO datos
    ) {
        Producto creado = productoService.crear(convertirEntidad(datos));

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ProductoMapper.toDTO(creado));
    }

    @Operation(
        summary = "Actualizar producto",
        description = "Reemplaza todos los datos de un producto existente."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Producto actualizado",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ProductoRespuestaDTO.class)
            )
        ),
        @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content),
        @ApiResponse(responseCode = "500", description = "El producto o la categoría no existe (esperable: 404)", content = @Content)
    })
    @PutMapping("/{id}")
    public ResponseEntity<ProductoRespuestaDTO> actualizar(
        @Parameter(description = "Id del producto a actualizar", example = "1")
        @PathVariable Long id,
        @Valid @RequestBody ProductoRequestDTO datos
    ) {
        Producto actualizado = productoService.actualizar(
            id,
            convertirEntidad(datos)
        );

        return ResponseEntity.ok(ProductoMapper.toDTO(actualizado));
    }

    @Operation(summary = "Eliminar producto", description = "Elimina un producto por su id. No devuelve cuerpo.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Producto eliminado"),
        @ApiResponse(responseCode = "500", description = "El producto no existe o no se puede eliminar")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
        @Parameter(description = "Id del producto a eliminar", example = "1")
        @PathVariable Long id
    ) {
        productoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    private Producto convertirEntidad(ProductoRequestDTO datos) {
        Producto producto = new Producto();

        producto.setNombre(datos.nombre());
        producto.setDescripcion(datos.descripcion());
        producto.setPrecio(datos.precio());
        producto.setStock(datos.stock());
        producto.setImagen(datos.imagen());
        producto.setDestacado(datos.destacado());
        producto.setCategoria(
            productoService.buscarCategoriaPorId(datos.categoriaId())
        );

        return producto;
    }
}
