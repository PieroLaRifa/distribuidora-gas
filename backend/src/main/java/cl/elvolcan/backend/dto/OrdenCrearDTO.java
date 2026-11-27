package cl.elvolcan.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

public record OrdenCrearDTO(
    @Schema(description = "Id del usuario registrado (opcional, vacío si compra sin cuenta)", example = "1")
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
    @Schema(name = "OrdenCrearCliente")
    public record ClienteDTO(
        @Schema(description = "Nombre del cliente", example = "Juan Pérez")
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100)
        String nombre,

        @Schema(description = "Correo del cliente", example = "juan.perez@correo.cl")
        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "El correo no es válido")
        @Size(max = 150)
        String email,

        @Schema(description = "Teléfono del cliente", example = "+56912345678")
        @NotBlank(message = "El teléfono es obligatorio")
        @Size(max = 30)
        String telefono
    ) {}

    @Schema(name = "OrdenCrearDireccion")
    public record DireccionDTO(
        @Schema(description = "Calle y número", example = "Av. Providencia 1234")
        @NotBlank(message = "La calle es obligatoria")
        @Size(max = 150)
        String calle,

        @Schema(description = "Departamento (opcional)", example = "Depto 56")
        @Size(max = 50)
        String depto,

        @Schema(description = "Comuna", example = "Providencia")
        @NotBlank(message = "La comuna es obligatoria")
        @Size(max = 100)
        String comuna,

        @Schema(description = "Indicaciones para el despacho (opcional)", example = "Llamar al llegar")
        @Size(max = 255)
        String indicaciones
    ) {}

    @Schema(name = "OrdenCrearItem")
    public record ItemDTO(
        @Schema(description = "Id de un producto existente", example = "1")
        @NotNull(message = "El producto es obligatorio")
        @Positive(message = "El producto no es válido")
        Long productId,

        @Schema(description = "Cantidad (mayor que cero)", example = "2")
        @NotNull(message = "La cantidad es obligatoria")
        @Positive(message = "La cantidad debe ser mayor a cero")
        Integer cantidad
    ) {}
}