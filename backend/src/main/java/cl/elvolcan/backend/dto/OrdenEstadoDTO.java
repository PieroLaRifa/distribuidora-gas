
package cl.elvolcan.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record OrdenEstadoDTO(
    @NotBlank(message = "El estado es obligatorio")
    @Size(max = 30)
    String estado
) {}
