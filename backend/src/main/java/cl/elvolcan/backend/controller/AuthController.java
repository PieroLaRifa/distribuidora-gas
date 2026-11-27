
package cl.elvolcan.backend.controller;

import cl.elvolcan.backend.dto.LoginRequestDTO;
import cl.elvolcan.backend.dto.LoginRespuestaDTO;
import cl.elvolcan.backend.entity.Usuario;
import cl.elvolcan.backend.repository.UsuarioRepository;
import cl.elvolcan.backend.service.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    public AuthController(
        AuthenticationManager authenticationManager,
        UsuarioRepository usuarioRepository,
        JwtService jwtService
    ) {
        this.authenticationManager = authenticationManager;
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginRespuestaDTO> login(
        @Valid @RequestBody LoginRequestDTO datos
    ) {
        String email = datos.email().trim().toLowerCase(Locale.ROOT);

        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                email,
                datos.password()
            )
        );

        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow();

        String token = jwtService.generarToken(usuario);

        return ResponseEntity.ok(
            new LoginRespuestaDTO(
                token,
                "Bearer",
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getRol().name().toLowerCase(Locale.ROOT)
            )
        );
    }
}
