package cl.elvolcan.backend.controller;

import cl.elvolcan.backend.dto.*;
import cl.elvolcan.backend.entity.Usuario;
import cl.elvolcan.backend.mapper.UsuarioMapper;
import cl.elvolcan.backend.service.UsuarioService;
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
@RequestMapping("/api/usuarios")
@Tag(name = "Usuarios", description = "Registro y administración de usuarios (roles ADMIN y CLIENTE)")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @Operation(
        summary = "Registrar cliente",
        description = "Registro público de un usuario nuevo. El rol se asigna en el servidor, "
            + "no se envía en la petición. La contraseña debe tener al menos 6 caracteres."
    )
        @ApiResponses({
        @ApiResponse(
            responseCode = "201",
            description = "Usuario registrado (la respuesta nunca incluye la contraseña)",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = UsuarioRespuestaDTO.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Datos inválidos (nombre vacío, correo mal formado, contraseña corta, etc.)",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "500",
            description = "El correo ya está registrado. Actualmente el backend responde 500 "
                + "porque no hay un manejador global de errores; lo esperable es 409.",
            content = @Content
        )
    })
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

    @Operation(
        summary = "Listar usuarios",
        description = "Devuelve todos los usuarios. Pensado para el rol ADMIN "
            + "(la restricción se aplicará cuando se integre JWT)."
    )
    @ApiResponse(
        responseCode = "200",
        description = "Lista de usuarios (sin contraseñas)",
        content = @Content(
            mediaType = "application/json",
            array = @ArraySchema(schema = @Schema(implementation = UsuarioRespuestaDTO.class))
        )
    )
    @GetMapping
    public ResponseEntity<List<UsuarioRespuestaDTO>> listar() {
        return ResponseEntity.ok(
            usuarioService.listar().stream()
                .map(UsuarioMapper::toDTO)
                .toList()
        );
    }

    @Operation(
        summary = "Buscar usuario por id",
        description = "Devuelve un usuario según su identificador."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Usuario encontrado",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = UsuarioRespuestaDTO.class)
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "El usuario no existe. Actualmente el backend responde 500 "
                + "porque no hay un manejador global de errores; lo esperable es 404.",
            content = @Content
        )
    })
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioRespuestaDTO> buscarPorId(
        @Parameter(description = "Id del usuario", example = "1")
        @PathVariable Long id
    ) {
        return ResponseEntity.ok(
            UsuarioMapper.toDTO(usuarioService.buscarPorId(id))
        );
    }

    @Operation(
        summary = "Crear usuario (administrador)",
        description = "Crea un usuario indicando su rol (ADMIN o CLIENTE). "
            + "Pensado para el rol ADMIN (la restricción se aplicará cuando se integre JWT)."
    )
        @ApiResponses({
        @ApiResponse(
            responseCode = "201",
            description = "Usuario creado",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = UsuarioRespuestaDTO.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Datos inválidos (por ejemplo, rol ausente o contraseña corta)",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "500",
            description = "El correo ya está registrado (esperable: 409)",
            content = @Content
        )
    })
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

    @Operation(
        summary = "Actualizar usuario",
        description = "Reemplaza los datos de un usuario existente. "
            + "La contraseña es opcional: si se envía, debe tener al menos 6 caracteres."
    )
        @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Usuario actualizado",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = UsuarioRespuestaDTO.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Datos inválidos",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "500",
            description = "El usuario no existe (esperable: 404)",
            content = @Content
        )
    })
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioRespuestaDTO> actualizar(
        @Parameter(description = "Id del usuario a actualizar", example = "1")
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

    @Operation(
        summary = "Eliminar usuario",
        description = "Elimina un usuario por su id. No devuelve cuerpo."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Usuario eliminado"),
        @ApiResponse(
            responseCode = "500",
            description = "El usuario no existe o no se puede eliminar",
            content = @Content
        )
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
        @Parameter(description = "Id del usuario a eliminar", example = "1")
        @PathVariable Long id
    ) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}