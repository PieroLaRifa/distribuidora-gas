
package cl.elvolcan.backend.service;

import cl.elvolcan.backend.entity.Usuario;
import cl.elvolcan.backend.enums.Rol;
import cl.elvolcan.backend.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
        UsuarioRepository usuarioRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario registrar(Usuario usuario) {
        validarUsuario(usuario);

        String email = normalizarEmail(usuario.getEmail());

        if (usuarioRepository.existsByEmail(email)) {
            throw new RuntimeException("El correo electrónico ya está registrado");
        }

        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setRol(Rol.CLIENTE);

        return usuarioRepository.save(usuario);
    }

    public Usuario crearAdministrativo(Usuario usuario) {
        validarUsuario(usuario);

        String email = normalizarEmail(usuario.getEmail());

        if (usuarioRepository.existsByEmail(email)) {
            throw new RuntimeException("El correo electrónico ya está registrado");
        }

        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        return usuarioRepository.save(usuario);
    }

    public Usuario actualizar(Long id, Usuario datos) {
        Usuario usuario = buscarPorId(id);
        String email = normalizarEmail(datos.getEmail());

        usuarioRepository.findByEmail(email).ifPresent(existente -> {
            if (!existente.getId().equals(id)) {
                throw new RuntimeException("El correo electrónico ya está registrado");
            }
        });

        usuario.setNombre(datos.getNombre());
        usuario.setEmail(email);
        usuario.setTelefono(datos.getTelefono());
        usuario.setRol(datos.getRol());

        if (datos.getPassword() != null && !datos.getPassword().isBlank()) {
            usuario.setPassword(passwordEncoder.encode(datos.getPassword()));
        }

        return usuarioRepository.save(usuario);
    }

    public void eliminar(Long id) {
        usuarioRepository.delete(buscarPorId(id));
    }

    @Transactional(readOnly = true)
    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Transactional(readOnly = true)
    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(normalizarEmail(email))
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Transactional(readOnly = true)
    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    private String normalizarEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
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
        if (usuario.getTelefono() == null || usuario.getTelefono().isBlank()) {
            throw new RuntimeException("El teléfono es obligatorio");
        }
    }
}
