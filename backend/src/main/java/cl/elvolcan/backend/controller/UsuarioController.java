
package cl.elvolcan.backend.controller;

import cl.elvolcan.backend.dto.*;
import cl.elvolcan.backend.entity.Usuario;
import cl.elvolcan.backend.mapper.UsuarioMapper;
import cl.elvolcan.backend.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/registro")
    public ResponseEntity<UsuarioRespuestaDTO> registrar(
        @Valid @RequestBody UsuarioRegistroDTO datos
    ) {
        Usuario usuario = new Usuario();
        usuario.setNombre(datos.nombre());
        usuario.setEmail(datos.email());
        usuario.setTelefono(datos.telefono());
        usuario.setPassword(datos.password());

        Usuario registrado = usuarioService.registrar(usuario);

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(UsuarioMapper.toDTO(registrado));
    }

    @GetMapping
    public ResponseEntity<List<UsuarioRespuestaDTO>> listar() {
        return ResponseEntity.ok(
            usuarioService.listar().stream()
                .map(UsuarioMapper::toDTO)
                .toList()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioRespuestaDTO> buscarPorId(
        @PathVariable Long id
    ) {
        return ResponseEntity.ok(
            UsuarioMapper.toDTO(usuarioService.buscarPorId(id))
        );
    }

    @PostMapping
    public ResponseEntity<UsuarioRespuestaDTO> crear(
        @Valid @RequestBody UsuarioAdminCrearDTO datos
    ) {
        Usuario usuario = new Usuario();
        usuario.setNombre(datos.nombre());
        usuario.setEmail(datos.email());
        usuario.setTelefono(datos.telefono());
        usuario.setPassword(datos.password());
        usuario.setRol(datos.rol());

        Usuario creado = usuarioService.crearAdministrativo(usuario);

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(UsuarioMapper.toDTO(creado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioRespuestaDTO> actualizar(
        @PathVariable Long id,
        @Valid @RequestBody UsuarioActualizarDTO datos
    ) {
        Usuario usuario = new Usuario();
        usuario.setNombre(datos.nombre());
        usuario.setEmail(datos.email());
        usuario.setTelefono(datos.telefono());
        usuario.setPassword(datos.password());
        usuario.setRol(datos.rol());

        return ResponseEntity.ok(
            UsuarioMapper.toDTO(usuarioService.actualizar(id, usuario))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
