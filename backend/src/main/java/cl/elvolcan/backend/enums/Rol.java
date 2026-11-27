
package cl.elvolcan.backend.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Rol {
    ADMIN,
    CLIENTE;

    @JsonCreator
    public static Rol desdeValor(String valor) {
        return Rol.valueOf(valor.trim().toUpperCase());
    }
}
