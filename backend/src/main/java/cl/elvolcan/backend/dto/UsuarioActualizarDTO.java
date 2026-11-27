package cl.elvolcan.backend.dto;

import cl.elvolcan.backend.enums.Rol;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

public record UsuarioActualizarDTO(
    @Schema(description = "Nombre completo", example = "María González Soto")
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100)
    String nombre,

    @Schema(description = "Correo electrónico", example = "maria.gonzalez@correo.cl")
    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo no es válido")
    @Size(max = 150)
    String email,

    @Schema(description = "Teléfono de contacto", example = "+56987654321")
    @NotBlank(message = "El teléfono es obligatorio")
    @Size(max = 30)
    String telefono,

    @Schema(description = "Nueva contraseña (opcional, mínimo 6 caracteres)", example = "demo456")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    String password,

    @Schema(description = "Rol del usuario", example = "CLIENTE", allowableValues = {"ADMIN", "CLIENTE"})
    @NotNull(message = "El rol es obligatorio")
    Rol rol
) {}