
package cl.elvolcan.backend.mapper;

import cl.elvolcan.backend.dto.OrdenRespuestaDTO;
import cl.elvolcan.backend.entity.DetalleOrden;
import cl.elvolcan.backend.entity.Orden;

import java.util.stream.Collectors;

public class OrdenMapper {

    public static OrdenRespuestaDTO toDTO(Orden orden) {
        return new OrdenRespuestaDTO(
            orden.getId(),
            orden.getNumeroOrden(),
            new OrdenRespuestaDTO.ClienteDTO(
                orden.getClienteNombre(),
                orden.getClienteEmail(),
                orden.getClienteTelefono()
            ),
            new OrdenRespuestaDTO.DireccionDTO(
                orden.getDireccionCalle(),
                orden.getDireccionDepto(),
                orden.getDireccionComuna(),
                orden.getDireccionIndicaciones()
            ),
            orden.getItems().stream()
                .map(OrdenMapper::toItemDTO)
                .collect(Collectors.toList()),
            orden.getTotal(),
            orden.getEstado(),
            orden.getFecha()
        );
    }

    private static OrdenRespuestaDTO.ItemDTO toItemDTO(DetalleOrden item) {
        return new OrdenRespuestaDTO.ItemDTO(
            item.getProducto().getId(),
            item.getNombreProducto(),
            item.getPrecioUnitario(),
            item.getCantidad(),
            item.getSubtotal()
        );
    }
}
