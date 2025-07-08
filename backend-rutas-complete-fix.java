// CORRECCIONES NECESARIAS PARA EL BACKEND DE RUTAS

// 1. ACTUALIZAR RutaController.java

@PostMapping("/inserciones")
public ResponseEntity<String> registrar(@RequestBody RutaDTO rDTO) {
    try {
        // Verificar que el usuario autenticado puede crear rutas
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        
        ModelMapper m = new ModelMapper();
        Ruta r = m.map(rDTO, Ruta.class);
        
        // Si no es admin, solo puede crear rutas para sí mismo
        if (!isAdmin) {
            // Buscar el usuario actual y asignarlo a la ruta
            Users currentUser = usersService.findOneByUsername(currentUsername);
            if (currentUser != null) {
                r.setUsuario(currentUser);
            } else {
                return ResponseEntity.badRequest().body("Usuario no encontrado");
            }
        }
        
        rS.insert(r);
        return ResponseEntity.ok("Ruta registrada correctamente");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al registrar la ruta: " + e.getMessage());
    }
}

@PutMapping
public ResponseEntity<String> modificar(@RequestBody RutaDTO rDTO) {
    try {
        Ruta existingRuta = rS.listId(rDTO.getIdRuta());
        if (existingRuta == null) {
            return ResponseEntity.notFound().build();
        }

        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        
        boolean isOwner = existingRuta.getUsuario() != null && 
                         existingRuta.getUsuario().getUsername().equals(currentUsername);
        
        if (!isAdmin && !isOwner) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("No tiene permisos para actualizar esta ruta");
        }

        ModelMapper m = new ModelMapper();
        Ruta r = m.map(rDTO, Ruta.class);
        rS.update(r);
        return ResponseEntity.ok("Ruta actualizada correctamente");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al actualizar la ruta: " + e.getMessage());
    }
}

@DeleteMapping("/{idRuta}")
public ResponseEntity<String> eliminar(@PathVariable("idRuta") int idRuta) {
    try {
        Ruta ruta = rS.listId(idRuta);
        if (ruta == null) {
            return ResponseEntity.notFound().build();
        }

        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        
        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Sin permisos");
        }

        rS.delete(idRuta);
        return ResponseEntity.ok("Ruta eliminada");
    } catch (DataIntegrityViolationException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Ruta tiene datos relacionados");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al eliminar");
    }
}

// 2. AGREGAR ESTOS IMPORTS EN RutaController.java:
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import upc.com.visiontech2.serviceinterfaces.IUsersService;

// 3. AGREGAR ESTA DEPENDENCIA EN RutaController.java:
@Autowired
private IUsersService usersService;

// 4. ASEGURAR QUE EN LA ENTIDAD Ruta.java TIENES:
@ManyToOne
@JoinColumn(name = "usuario_id")
private Users usuario;

// 5. EN RutaDTO.java ASEGURAR QUE TIENES:
private Users usuario;
// O si prefieres solo el ID:
private Long usuarioId;
