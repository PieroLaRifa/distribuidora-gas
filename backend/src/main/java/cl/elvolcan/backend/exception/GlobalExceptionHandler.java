package cl.elvolcan.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<Map<String, String>> manejarNoEncontrado(
        RecursoNoEncontradoException ex
    ) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of("mensaje", ex.getMessage()));
    }

    @ExceptionHandler(ConflictoNegocioException.class)
    public ResponseEntity<Map<String, String>> manejarConflicto(
        ConflictoNegocioException ex
    ) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(Map.of("mensaje", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> manejarValidacion(
        MethodArgumentNotValidException ex
    ) {
        String mensaje = ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage();

        return ResponseEntity.badRequest()
            .body(Map.of("mensaje", mensaje));
    }
}