package cl.elvolcan.backend.exception;

public class ConflictoNegocioException extends RuntimeException {

    public ConflictoNegocioException(String mensaje) {
        super(mensaje);
    }
}