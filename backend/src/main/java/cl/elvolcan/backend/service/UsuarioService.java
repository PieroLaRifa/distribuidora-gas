
package cl.elvolcan.backend.service;

import cl.elvolcan.backend.entity.Usuario;
import cl.elvolcan.backend.enums.Rol;
import cl.elvolcan.backend.exception.ConflictoNegocioException;
import cl.elvolcan.backend.exception.RecursoNoEncontradoException;
import cl.elvolcan.backend.repository.OrdenRepository;
import cl.elvolcan.backend.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

@Service
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final OrdenRepository ordenRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
        UsuarioRepository usuarioRepository,
        OrdenRepository ordenRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.usuarioRepository = usuarioRepository;
        this.ordenRepository = ordenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario registrar(Usuario usuario) {
        validarUsuario(usuario, true);

        String email = normalizarEmail(usuario.getEmail());

        if (usuarioRepository.existsByEmail(email)) {
            throw new ConflictoNegocioException(
                "El correo electrónico ya está registrado"
            );
        }

        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setRol(Rol.CLIENTE);

        return usuarioRepository.save(usuario);
    }

    public Usuario crearAdministrativo(Usuario usuario) {
        validarUsuario(usuario, true);

        if (usuario.getRol() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El rol es obligatorio"
            );
        }

        String email = normalizarEmail(usuario.getEmail());

        if (usuarioRepository.existsByEmail(email)) {
            throw new ConflictoNegocioException(
                "El correo electrónico ya está registrado"
            );
        }

        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        return usuarioRepository.save(usuario);
    }

    public Usuario actualizar(Long id, Usuario datos) {
        validarUsuario(datos, false);

        Usuario usuario = buscarPorId(id);
        String email = normalizarEmail(datos.getEmail());

        usuarioRepository.findByEmail(email).ifPresent(existente -> {
            if (!existente.getId().equals(id)) {
                throw new ConflictoNegocioException(
                    "El correo electrónico ya está registrado"
                );
            }
        });

        if (datos.getRol() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El rol es obligatorio"
            );
        }

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
        Usuario usuario = buscarPorId(id);

        if (ordenRepository.existsByUsuario_Id(id)) {
            throw new ConflictoNegocioException(
                "No se puede eliminar un usuario que tiene órdenes asociadas"
            );
        }

        usuarioRepository.delete(usuario);
    }

    @Transactional(readOnly = true)
    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException(
                "Usuario no encontrado"
            ));
    }

    @Transactional(readOnly = true)
    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(normalizarEmail(email))
            .orElseThrow(() -> new RecursoNoEncontradoException(
                "Usuario no encontrado"
            ));
    }

    @Transactional(readOnly = true)
    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    private String normalizarEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private void validarUsuario(Usuario usuario, boolean requierePassword) {
        if (usuario.getNombre() == null || usuario.getNombre().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El nombre es obligatorio"
            );
        }

        if (usuario.getEmail() == null || usuario.getEmail().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El correo electrónico es obligatorio"
            );
        }

        if (requierePassword &&
            (usuario.getPassword() == null || usuario.getPassword().isBlank())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "La contraseña es obligatoria"
            );
        }

        if (usuario.getPassword() != null &&
            !usuario.getPassword().isBlank() &&
            usuario.getPassword().length() < 6) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "La contraseña debe tener al menos 6 caracteres"
            );
        }

        if (usuario.getTelefono() == null || usuario.getTelefono().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El teléfono es obligatorio"
            );
        }
    }
}
