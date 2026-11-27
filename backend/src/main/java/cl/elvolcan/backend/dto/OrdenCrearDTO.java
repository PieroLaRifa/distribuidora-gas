
package cl.elvolcan.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

public record OrdenCrearDTO(
    Long userId,

    @NotNull(message = "Los datos del cliente son obligatorios")
    @Valid
    ClienteDTO cliente,

    @NotNull(message = "La dirección es obligatoria")
    @Valid
    DireccionDTO direccion,

    @NotEmpty(message = "La orden debe contener productos")
    List<@Valid ItemDTO> items
) {
    public record ClienteDTO(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100)
        String nombre,

        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "El correo no es válido")
        @Size(max = 150)
        String email,

        @NotBlank(message = "El teléfono es obligatorio")
        @Size(max = 30)
        String telefono
    ) {}

    public record DireccionDTO(
        @NotBlank(message = "La calle es obligatoria")
        @Size(max = 150)
        String calle,

        @Size(max = 50)
        String depto,

        @NotBlank(message = "La comuna es obligatoria")
        @Size(max = 100)
        String comuna,

        @Size(max = 255)
        String indicaciones
    ) {}

    public record ItemDTO(
        @NotNull(message = "El producto es obligatorio")
        @Positive(message = "El producto no es válido")
        Long productId,

        @NotNull(message = "La cantidad es obligatoria")
        @Positive(message = "La cantidad debe ser mayor a cero")
        Integer cantidad
    ) {}
}
