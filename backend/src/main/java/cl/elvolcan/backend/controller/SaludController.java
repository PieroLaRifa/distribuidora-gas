package cl.elvolcan.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Salud", description = "Verificación del estado del backend y de la base de datos")
public class SaludController {

    private final JdbcTemplate jdbcTemplate;

    public SaludController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Operation(
        summary = "Verificar estado del sistema",
        description = "Ejecuta una consulta simple (SELECT 1) contra MySQL para confirmar "
            + "que el backend responde y que la base de datos está conectada."
    )
    @ApiResponse(
        responseCode = "200",
        description = "Backend y base de datos operativos",
        content = @Content(
            mediaType = "application/json",
            examples = @ExampleObject(
                value = "{\"estado\":\"OK\",\"backend\":\"Funcionando\",\"baseDeDatos\":\"Conectada\"}"
            )
        )
    )
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