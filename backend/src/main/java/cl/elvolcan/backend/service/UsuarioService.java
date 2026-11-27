package cl.elvolcan.backend.service;

import cl.elvolcan.backend.entity.Usuario;
import cl.elvolcan.backend.enums.Rol;
import cl.elvolcan.backend.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario registrar(Usuario usuario) {
        validarUsuario(usuario);

        String email = usuario.getEmail().trim().toLowerCase();

        if (usuarioRepository.existsByEmail(email)) {
            throw new RuntimeException("El correo electrónico ya está registrado");
        }

        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setRol(Rol.CLIENTE);

        return usuarioRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Transactional(readOnly = true)
    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Transactional(readOnly = true)
    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    private void validarUsuario(Usuario usuario) {
        if (usuario.getNombre() == null || usuario.getNombre().isBlank()) {
            throw new RuntimeException("El nombre es obligatorio");
        }
        if (usuario.getEmail() == null || usuario.getEmail().isBlank()) {
            throw new RuntimeException("El correo electrónico es obligatorio");
        }
        if (usuario.getPassword() == null || usuario.getPassword().isBlank()) {
            throw new RuntimeException("La contraseña es obligatoria");
        }
    }
}