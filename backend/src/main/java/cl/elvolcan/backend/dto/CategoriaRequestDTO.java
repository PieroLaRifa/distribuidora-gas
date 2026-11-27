
package cl.elvolcan.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoriaRequestDTO(
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100)
    String nombre,

    @Size(max = 255)
    String descripcion
) {}
