
package cl.elvolcan.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrdenRespuestaDTO(
    Long id,
    String numeroOrden,
    ClienteDTO cliente,
    DireccionDTO direccion,
    List<ItemDTO> items,
    BigDecimal total,
    String estado,
    LocalDateTime fecha
) {
    public record ClienteDTO(
        String nombre,
        String email,
        String telefono
    ) {}

    public record DireccionDTO(
        String calle,
        String depto,
        String comuna,
        String indicaciones
    ) {}

    public record ItemDTO(
        Long productId,
        String nombre,
        BigDecimal precioUnitario,
        Integer cantidad,
        BigDecimal subtotal
    ) {}
}
