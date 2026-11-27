
package cl.elvolcan.backend.mapper;

import cl.elvolcan.backend.dto.UsuarioRespuestaDTO;
import cl.elvolcan.backend.entity.Usuario;
import java.util.Locale;

public class UsuarioMapper {

    public static UsuarioRespuestaDTO toDTO(Usuario usuario) {
        return new UsuarioRespuestaDTO(
            usuario.getId(),
            usuario.getNombre(),
            usuario.getEmail(),
            usuario.getTelefono(),
            usuario.getRol().name().toLowerCase(Locale.ROOT),
            usuario.getFechaRegistro()
        );
    }
}
