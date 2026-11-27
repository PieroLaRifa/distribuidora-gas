package cl.elvolcan.backend.service;

import cl.elvolcan.backend.entity.Categoria;
import cl.elvolcan.backend.repository.CategoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional(readOnly = true)
    public List<Categoria> listar() {
        return categoriaRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Categoria buscarPorId(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
    }

    public Categoria crear(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    public Categoria actualizar(Long id, Categoria datos) {
        Categoria categoria = buscarPorId(id);
        categoria.setNombre(datos.getNombre());
        categoria.setDescripcion(datos.getDescripcion());
        return categoriaRepository.save(categoria);
    }

    public void eliminar(Long id) {
        Categoria categoria = buscarPorId(id);

        if (!categoria.getProductos().isEmpty()) {
            throw new RuntimeException("No se puede eliminar una categoría que tiene productos asociados");
        }

        categoriaRepository.delete(categoria);
    }
}