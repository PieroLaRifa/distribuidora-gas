
package cl.elvolcan.backend.dto;

public record LoginRespuestaDTO(
    String token,
    String tipo,
    Long id,
    String nombre,
    String email,
    String rol
) {}
