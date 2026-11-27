
package cl.elvolcan.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ordenes")
public class Orden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String numeroOrden;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(nullable = false, length = 100)
    private String clienteNombre;

    @Column(nullable = false, length = 150)
    private String clienteEmail;

    @Column(length = 30)
    private String clienteTelefono;

    @Column(nullable = false, length = 150)
    private String direccionCalle;

    @Column(length = 50)
    private String direccionDepto;

    @Column(nullable = false, length = 100)
    private String direccionComuna;

    @Column(length = 255)
    private String direccionIndicaciones;

    @OneToMany(mappedBy = "orden", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleOrden> items = new ArrayList<>();

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal total;

    @Column(nullable = false, length = 30)
    private String estado = "Pagada";

    @Column(nullable = false)
    private LocalDateTime fecha;

    @PrePersist
    public void prePersist() {
        fecha = LocalDateTime.now();
    }

    public Orden() {}

    public Long getId() {
        return id;
    }

    public String getNumeroOrden() {
        return numeroOrden;
    }

    public void setNumeroOrden(String numeroOrden) {
        this.numeroOrden = numeroOrden;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getClienteNombre() {
        return clienteNombre;
    }

    public void setClienteNombre(String clienteNombre) {
        this.clienteNombre = clienteNombre;
    }

    public String getClienteEmail() {
        return clienteEmail;
    }

    public void setClienteEmail(String clienteEmail) {
        this.clienteEmail = clienteEmail;
    }

    public String getClienteTelefono() {
        return clienteTelefono;
    }

    public void setClienteTelefono(String clienteTelefono) {
        this.clienteTelefono = clienteTelefono;
    }

    public String getDireccionCalle() {
        return direccionCalle;
    }

    public void setDireccionCalle(String direccionCalle) {
        this.direccionCalle = direccionCalle;
    }

    public String getDireccionDepto() {
        return direccionDepto;
    }

    public void setDireccionDepto(String direccionDepto) {
        this.direccionDepto = direccionDepto;
    }

    public String getDireccionComuna() {
        return direccionComuna;
    }

    public void setDireccionComuna(String direccionComuna) {
        this.direccionComuna = direccionComuna;
    }

    public String getDireccionIndicaciones() {
        return direccionIndicaciones;
    }

    public void setDireccionIndicaciones(String direccionIndicaciones) {
        this.direccionIndicaciones = direccionIndicaciones;
    }

    public List<DetalleOrden> getItems() {
        return items;
    }

    public void setItems(List<DetalleOrden> items) {
        this.items = items;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }
}
