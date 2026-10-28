package com.pict.alumuniconnect.repository;

import com.pict.alumuniconnect.entity.AlumniProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AlumniRepository extends JpaRepository<AlumniProfile, Long> {

    Optional<AlumniProfile> findByEmail(String email);

    List<AlumniProfile> findByGraduationYear(Integer graduationYear);

    List<AlumniProfile> findByDepartmentIgnoreCase(String department);

    @Query("SELECT DISTINCT a FROM AlumniProfile a " +
           "LEFT JOIN a.skills s " +
           "WHERE (:name IS NULL OR :name = '' OR LOWER(a.fullName) LIKE LOWER(CONCAT('%', :name, '%'))) " +
           "AND (:company IS NULL OR :company = '' OR LOWER(a.currentOrganisation) LIKE LOWER(CONCAT('%', :company, '%'))) " +
           "AND (:graduationYear IS NULL OR a.graduationYear = :graduationYear) " +
           "AND (:skill IS NULL OR :skill = '' OR LOWER(s.name) LIKE LOWER(CONCAT('%', :skill, '%')))")
    List<AlumniProfile> searchAlumni(
            @Param("name") String name,
            @Param("company") String company,
            @Param("graduationYear") Integer graduationYear,
            @Param("skill") String skill
    );
}
