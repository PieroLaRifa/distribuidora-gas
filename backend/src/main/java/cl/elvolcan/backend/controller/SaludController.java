
package cl.elvolcan.backend.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class SaludController {

    private final JdbcTemplate jdbcTemplate;

    public SaludController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/salud")
    public Map<String, Object> verificarSalud() {
        Integer resultado = jdbcTemplate.queryForObject("SELECT 1", Integer.class);

        return Map.of(
            "estado", "OK",
            "backend", "Funcionando",
            "baseDeDatos", resultado == 1 ? "Conectada" : "Error"
        );
    }
}
