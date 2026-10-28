package com.pict.alumuniconnect.service;

import com.pict.alumuniconnect.dto.AlumniRequest;
import com.pict.alumuniconnect.entity.AlumniProfile;
import com.pict.alumuniconnect.entity.ProfileStatus;
import com.pict.alumuniconnect.entity.Skill;
import com.pict.alumuniconnect.exception.ResourceNotFoundException;
import com.pict.alumuniconnect.repository.AlumniRepository;
import com.pict.alumuniconnect.repository.SkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class AlumniService {

    private final AlumniRepository alumniRepository;
    private final SkillRepository skillRepository;

    public AlumniService(AlumniRepository alumniRepository, SkillRepository skillRepository) {
        this.alumniRepository = alumniRepository;
        this.skillRepository = skillRepository;
    }

    @Transactional
    public AlumniProfile registerAlumni(AlumniRequest request) {
        if (alumniRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already registered: " + request.getEmail());
        }

        AlumniProfile profile = new AlumniProfile();
        mapRequestToEntity(request, profile);
        profile.setStatus(ProfileStatus.APPROVED);

        if (request.getSkillNames() != null && !request.getSkillNames().isEmpty()) {
            profile.setSkills(resolveSkills(request.getSkillNames()));
        }

        return alumniRepository.save(profile);
    }

    @Transactional
    public AlumniProfile registerAlumni(AlumniProfile alumni) {
        if (alumniRepository.findByEmail(alumni.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already registered: " + alumni.getEmail());
        }
        if (alumni.getStatus() == null) {
            alumni.setStatus(ProfileStatus.APPROVED);
        }
        return alumniRepository.save(alumni);
    }

    public List<AlumniProfile> getAllAlumni() {
        return alumniRepository.findAll();
    }

    public AlumniProfile getAlumniById(Long id) {
        return alumniRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alumni not found with ID: " + id));
    }

    @Transactional
    public AlumniProfile updateAlumni(Long id, AlumniRequest request) {
        AlumniProfile existing = getAlumniById(id);

        if (!existing.getEmail().equalsIgnoreCase(request.getEmail())
                && alumniRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already in use by another alumni: " + request.getEmail());
        }

        mapRequestToEntity(request, existing);

        if (request.getSkillNames() != null) {
            existing.setSkills(resolveSkills(request.getSkillNames()));
        }

        return alumniRepository.save(existing);
    }

    public List<AlumniProfile> searchAlumni(String name, String company, Integer graduationYear, String skill) {
        String cleanName = (name != null && !name.trim().isEmpty()) ? name.trim() : null;
        String cleanCompany = (company != null && !company.trim().isEmpty()) ? company.trim() : null;
        String cleanSkill = (skill != null && !skill.trim().isEmpty()) ? skill.trim() : null;

        return alumniRepository.searchAlumni(cleanName, cleanCompany, graduationYear, cleanSkill);
    }

    public Set<Skill> resolveSkills(List<String> skillNames) {
        Set<Skill> skills = new HashSet<>();
        for (String rawName : skillNames) {
            if (rawName == null || rawName.trim().isEmpty()) continue;
            String trimmed = rawName.trim();
            Skill skill = skillRepository.findByNameIgnoreCase(trimmed)
                    .orElseGet(() -> skillRepository.save(new Skill(trimmed)));
            skills.add(skill);
        }
        return skills;
    }

    private void mapRequestToEntity(AlumniRequest request, AlumniProfile entity) {
        entity.setFullName(request.getFullName());
        entity.setEmail(request.getEmail());
        entity.setPhone(request.getPhone());
        entity.setGraduationYear(request.getGraduationYear());
        entity.setDepartment(request.getDepartment());
        entity.setDegree(request.getDegree());
        entity.setCurrentOrganisation(request.getCurrentOrganisation());
        entity.setCurrentRole(request.getCurrentRole());
        entity.setLocation(request.getLocation());
        entity.setBio(request.getBio());
        entity.setInterests(request.getInterests());
    }
}
