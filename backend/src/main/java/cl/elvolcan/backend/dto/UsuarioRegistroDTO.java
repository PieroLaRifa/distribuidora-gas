
package cl.elvolcan.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioRegistroDTO(
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
    String password
) {}
