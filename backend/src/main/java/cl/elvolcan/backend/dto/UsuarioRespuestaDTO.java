
package cl.elvolcan.backend.dto;

import java.time.LocalDateTime;

public record UsuarioRespuestaDTO(
    Long id,
    String nombre,
    String email,
    String telefono,
    String rol,
    LocalDateTime fechaRegistro
) {}
