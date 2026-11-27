
package cl.elvolcan.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ProductoRequestDTO(
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 150)
    String nombre,

    @Size(max = 500)
    String descripcion,

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor que cero")
    BigDecimal precio,

    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    Integer stock,

    @Size(max = 500)
    String imagen,

    @NotNull(message = "Debe indicar si el producto es destacado")
    Boolean destacado,

    @NotNull(message = "Debe seleccionar una categoría")
    @Positive(message = "La categoría no es válida")
    Long categoriaId
) {}
