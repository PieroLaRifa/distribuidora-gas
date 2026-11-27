package cl.elvolcan.backend.repository;

import cl.elvolcan.backend.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}