package cl.elvolcan.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ProductoRequestDTO(
    @Schema(description = "Nombre del producto", example = "Cilindro de gas 15 kg")
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 150)
    String nombre,

    @Schema(description = "Descripción opcional", example = "Cilindro de gas licuado de 15 kg")
    @Size(max = 500)
    String descripcion,

    @Schema(description = "Precio (debe ser mayor que cero)", example = "24990")
    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor que cero")
    BigDecimal precio,

    @Schema(description = "Unidades disponibles (no puede ser negativo)", example = "50")
    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    Integer stock,

    @Schema(description = "URL o ruta de la imagen", example = "/img/cilindro-15kg.png")
    @Size(max = 500)
    String imagen,

    @Schema(description = "Si se muestra como producto destacado", example = "true")
    @NotNull(message = "Debe indicar si el producto es destacado")
    Boolean destacado,

    @Schema(description = "Id de una categoría existente", example = "1")
    @NotNull(message = "Debe seleccionar una categoría")
    @Positive(message = "La categoría no es válida")
    Long categoriaId
) {}