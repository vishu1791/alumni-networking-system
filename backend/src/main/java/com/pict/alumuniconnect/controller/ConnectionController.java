package com.pict.alumuniconnect.controller;

import com.pict.alumuniconnect.dto.ConnectionRequestDto;
import com.pict.alumuniconnect.entity.AlumniProfile;
import com.pict.alumuniconnect.entity.Connection;
import com.pict.alumuniconnect.service.ConnectionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    private final ConnectionService connectionService;

    public ConnectionController(ConnectionService connectionService) {
        this.connectionService = connectionService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Connection sendRequest(@Valid @RequestBody ConnectionRequestDto dto) {
        return connectionService.sendRequest(dto);
    }

    @PutMapping("/{id}/accept")
    public Connection acceptRequest(@PathVariable Long id) {
        return connectionService.acceptRequest(id);
    }

    @PutMapping("/{id}/reject")
    public Connection rejectRequest(@PathVariable Long id) {
        return connectionService.rejectRequest(id);
    }

    @GetMapping("/alumni/{alumniId}")
    public List<Connection> getAlumniConnections(@PathVariable Long alumniId) {
        return connectionService.getAlumniConnections(alumniId);
    }

    @GetMapping("/alumni/{alumniId}/connected")
    public List<AlumniProfile> getConnectedAlumni(@PathVariable Long alumniId) {
        return connectionService.getConnectedAlumni(alumniId);
    }
}

