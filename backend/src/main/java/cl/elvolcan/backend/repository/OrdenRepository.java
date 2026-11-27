package cl.elvolcan.backend.repository;

import cl.elvolcan.backend.entity.Orden;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OrdenRepository extends JpaRepository<Orden, Long> {
    Optional<Orden> findByNumeroOrden(String numeroOrden);
}