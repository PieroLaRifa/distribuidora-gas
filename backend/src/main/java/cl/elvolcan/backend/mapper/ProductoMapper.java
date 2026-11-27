
package cl.elvolcan.backend.mapper;

import cl.elvolcan.backend.dto.ProductoRespuestaDTO;
import cl.elvolcan.backend.entity.Producto;

public class ProductoMapper {

    public static ProductoRespuestaDTO toDTO(Producto producto) {
        return new ProductoRespuestaDTO(
            producto.getId(),
            producto.getNombre(),
            producto.getDescripcion(),
            producto.getPrecio(),
            producto.getStock(),
            producto.getImagen(),
            producto.getDestacado(),
            producto.getCategoria().getId()
        );
    }
}
