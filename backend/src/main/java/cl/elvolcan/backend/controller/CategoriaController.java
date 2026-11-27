
package cl.elvolcan.backend.controller;

import cl.elvolcan.backend.dto.CategoriaRequestDTO;
import cl.elvolcan.backend.dto.CategoriaRespuestaDTO;
import cl.elvolcan.backend.entity.Categoria;
import cl.elvolcan.backend.mapper.CategoriaMapper;
import cl.elvolcan.backend.service.CategoriaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @GetMapping
    public ResponseEntity<List<CategoriaRespuestaDTO>> listar() {
        List<CategoriaRespuestaDTO> categorias = categoriaService.listar()
            .stream()
            .map(CategoriaMapper::toDTO)
            .toList();

        return ResponseEntity.ok(categorias);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaRespuestaDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(
            CategoriaMapper.toDTO(categoriaService.buscarPorId(id))
        );
    }

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

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaRespuestaDTO> actualizar(
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        categoriaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
