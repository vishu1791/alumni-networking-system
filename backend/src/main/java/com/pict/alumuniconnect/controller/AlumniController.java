package com.pict.alumuniconnect.controller;

import com.pict.alumuniconnect.dto.AlumniRequest;
import com.pict.alumuniconnect.entity.AlumniProfile;
import com.pict.alumuniconnect.service.AlumniService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alumni")
public class AlumniController {

    private final AlumniService alumniService;

    public AlumniController(AlumniService alumniService) {
        this.alumniService = alumniService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AlumniProfile registerAlumni(@Valid @RequestBody AlumniRequest request) {
        return alumniService.registerAlumni(request);
    }

    @GetMapping
    public List<AlumniProfile> getAllAlumni() {
        return alumniService.getAllAlumni();
    }

    @GetMapping("/{id}")
    public AlumniProfile getAlumniById(@PathVariable Long id) {
        return alumniService.getAlumniById(id);
    }

    @PutMapping("/{id}")
    public AlumniProfile updateAlumni(
            @PathVariable Long id,
            @Valid @RequestBody AlumniRequest request) {
        return alumniService.updateAlumni(id, request);
    }

    @GetMapping("/search")
    public List<AlumniProfile> searchAlumni(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String company,
            @RequestParam(required = false) Integer graduationYear,
            @RequestParam(required = false) String skill) {
        return alumniService.searchAlumni(name, company, graduationYear, skill);
    }
}
