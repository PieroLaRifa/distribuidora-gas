
package cl.elvolcan.backend.dto;

import cl.elvolcan.backend.enums.Rol;
import jakarta.validation.constraints.*;

public record UsuarioAdminCrearDTO(
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100)
    String nombre,

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo no es válido")
    @Size(max = 150)
    String email,

    @NotBlank(message = "El teléfono es obligatorio")
    @Size(max = 30)
    String telefono,

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    String password,

    @NotNull(message = "El rol es obligatorio")
    Rol rol
) {}
