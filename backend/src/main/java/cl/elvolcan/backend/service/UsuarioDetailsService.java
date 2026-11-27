
package cl.elvolcan.backend.service;

import cl.elvolcan.backend.entity.Usuario;
import cl.elvolcan.backend.repository.UsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email.trim().toLowerCase())
            .orElseThrow(() -> new UsernameNotFoundException(
                "Usuario no encontrado"
            ));

        return User.builder()
            .username(usuario.getEmail())
            .password(usuario.getPassword())
            .authorities(List.of(
                new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name())
            ))
            .build();
    }
}
