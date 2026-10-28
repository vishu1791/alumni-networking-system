
package com.pict.alumuniconnect.dto;

public class AlumniResponse {

    private Long id;
    private String fullName;
    private Integer graduationYear;
    private String department;
    private String degree;
    private String currentOrganisation;
    private String currentRole;
    private String location;
    private String bio;
    private String interests;
    private String skills;
    private String status;

    public AlumniResponse(Long id, String fullName,
                          Integer graduationYear, String department,
                          String degree, String currentOrganisation,
                          String currentRole, String location, String bio,
                          String interests, String skills, String status) {
        this.id = id;
        this.fullName = fullName;
        this.graduationYear = graduationYear;
        this.department = department;
        this.degree = degree;
        this.currentOrganisation = currentOrganisation;
        this.currentRole = currentRole;
        this.location = location;
        this.bio = bio;
        this.interests = interests;
        this.skills = skills;
        this.status = status;
    }

    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public Integer getGraduationYear() { return graduationYear; }
    public String getDepartment() { return department; }
    public String getDegree() { return degree; }
    public String getCurrentOrganisation() { return currentOrganisation; }
    public String getCurrentRole() { return currentRole; }
    public String getLocation() { return location; }
    public String getBio() { return bio; }
    public String getInterests() { return interests; }
    public String getSkills() { return skills; }
    public String getStatus() { return status; }
}
