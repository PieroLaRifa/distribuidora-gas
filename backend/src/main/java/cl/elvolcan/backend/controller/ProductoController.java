
package cl.elvolcan.backend.controller;

import cl.elvolcan.backend.dto.ProductoRequestDTO;
import cl.elvolcan.backend.dto.ProductoRespuestaDTO;
import cl.elvolcan.backend.entity.Producto;
import cl.elvolcan.backend.mapper.ProductoMapper;
import cl.elvolcan.backend.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public ResponseEntity<List<ProductoRespuestaDTO>> listar() {
        return ResponseEntity.ok(
            productoService.listar().stream()
                .map(ProductoMapper::toDTO)
                .toList()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoRespuestaDTO> buscarPorId(
        @PathVariable Long id
    ) {
        return ResponseEntity.ok(
            ProductoMapper.toDTO(productoService.buscarPorId(id))
        );
    }

    @PostMapping
    public ResponseEntity<ProductoRespuestaDTO> crear(
        @Valid @RequestBody ProductoRequestDTO datos
    ) {
        Producto creado = productoService.crear(convertirEntidad(datos));

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ProductoMapper.toDTO(creado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoRespuestaDTO> actualizar(
        @PathVariable Long id,
        @Valid @RequestBody ProductoRequestDTO datos
    ) {
        Producto actualizado = productoService.actualizar(
            id,
            convertirEntidad(datos)
        );

        return ResponseEntity.ok(ProductoMapper.toDTO(actualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
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
