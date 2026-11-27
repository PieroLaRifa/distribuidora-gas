
package cl.elvolcan.backend.mapper;

import cl.elvolcan.backend.dto.CategoriaRespuestaDTO;
import cl.elvolcan.backend.entity.Categoria;

public class CategoriaMapper {

    public static CategoriaRespuestaDTO toDTO(Categoria categoria) {
        return new CategoriaRespuestaDTO(
            categoria.getId(),
            categoria.getNombre(),
            categoria.getDescripcion()
        );
    }
}
