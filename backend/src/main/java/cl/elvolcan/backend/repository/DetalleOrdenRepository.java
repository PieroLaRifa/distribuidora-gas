package cl.elvolcan.backend.repository;

import cl.elvolcan.backend.entity.DetalleOrden;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DetalleOrdenRepository extends JpaRepository<DetalleOrden, Long> {
}