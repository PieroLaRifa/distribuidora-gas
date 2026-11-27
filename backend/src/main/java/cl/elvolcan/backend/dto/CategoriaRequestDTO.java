package cl.elvolcan.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoriaRequestDTO(
    @Schema(description = "Nombre de la categoría", example = "Gas licuado")
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100)
    String nombre,

    @Schema(description = "Descripción opcional", example = "Cilindros de gas licuado de petróleo")
    @Size(max = 255)
    String descripcion
) {}