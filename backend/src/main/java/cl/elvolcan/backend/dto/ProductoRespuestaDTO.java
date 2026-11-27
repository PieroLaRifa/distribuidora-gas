
package cl.elvolcan.backend.dto;

import java.math.BigDecimal;

public record ProductoRespuestaDTO(
    Long id,
    String nombre,
    String descripcion,
    BigDecimal precio,
    Integer stock,
    String imagen,
    Boolean destacado,
    Long categoriaId
) {}
