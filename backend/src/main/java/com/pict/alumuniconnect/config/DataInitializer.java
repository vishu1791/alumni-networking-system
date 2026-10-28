package com.pict.alumuniconnect.config;

import com.pict.alumuniconnect.dto.AlumniRequest;
import com.pict.alumuniconnect.dto.ConnectionRequestDto;
import com.pict.alumuniconnect.dto.JobPostingRequestDto;
import com.pict.alumuniconnect.entity.AlumniProfile;
import com.pict.alumuniconnect.repository.AlumniRepository;
import com.pict.alumuniconnect.service.AlumniService;
import com.pict.alumuniconnect.service.ConnectionService;
import com.pict.alumuniconnect.service.JobPostingService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final AlumniRepository alumniRepository;
    private final AlumniService alumniService;
    private final ConnectionService connectionService;
    private final JobPostingService jobPostingService;

    public DataInitializer(AlumniRepository alumniRepository,
                           AlumniService alumniService,
                           ConnectionService connectionService,
                           JobPostingService jobPostingService) {
        this.alumniRepository = alumniRepository;
        this.alumniService = alumniService;
        this.connectionService = connectionService;
        this.jobPostingService = jobPostingService;
    }

    @Override
    public void run(String... args) {
        // Only seed if database is fresh and has no alumni
        if (alumniRepository.count() > 0) {
            return;
        }

        try {
            System.out.println("Seeding initial PICT demo alumni profiles...");

            // 1. Aditi Kulkarni
            AlumniRequest a1 = new AlumniRequest();
            a1.setFullName("Aditi Kulkarni");
            a1.setEmail("aditi.kulkarni@google.com");
            a1.setPhone("+91 98230 11223");
            a1.setGraduationYear(2021);
            a1.setDepartment("Computer Engineering");
            a1.setDegree("B.E.");
            a1.setCurrentOrganisation("Google");
            a1.setCurrentRole("Software Engineer II");
            a1.setLocation("Bengaluru, Karnataka");
            a1.setBio("PICT 2021 Computer Engineering alumna. Working on large-scale distributed cloud infrastructure.");
            a1.setInterests("System Design, Distributed Systems, Cloud Architecture, Mentorship");
            a1.setSkillNames(Arrays.asList("Java", "Spring Boot", "Distributed Systems", "GCP", "Kubernetes"));
            AlumniProfile p1 = alumniService.registerAlumni(a1);

            // 2. Rohan Mehta
            AlumniRequest a2 = new AlumniRequest();
            a2.setFullName("Rohan Mehta");
            a2.setEmail("rohan.mehta@microsoft.com");
            a2.setPhone("+91 97654 33211");
            a2.setGraduationYear(2022);
            a2.setDepartment("Information Technology");
            a2.setDegree("B.E.");
            a2.setCurrentOrganisation("Microsoft");
            a2.setCurrentRole("Frontend Engineer");
            a2.setLocation("Hyderabad, Telangana");
            a2.setBio("Building scalable web applications with React, TypeScript and modern web standards.");
            a2.setInterests("Frontend Architecture, UI/UX, Web Performance");
            a2.setSkillNames(Arrays.asList("React", "TypeScript", "Tailwind CSS", "Next.js", "GraphQL"));
            AlumniProfile p2 = alumniService.registerAlumni(a2);

            // 3. Pooja Patil
            AlumniRequest a3 = new AlumniRequest();
            a3.setFullName("Pooja Patil");
            a3.setEmail("pooja.patil@phonepe.com");
            a3.setPhone("+91 91234 56789");
            a3.setGraduationYear(2020);
            a3.setDepartment("Electronics & Telecommunication");
            a3.setDegree("B.E.");
            a3.setCurrentOrganisation("PhonePe");
            a3.setCurrentRole("Data Engineer");
            a3.setLocation("Pune, Maharashtra");
            a3.setBio("Designing transaction ingestion pipelines and financial data analytics platforms.");
            a3.setInterests("Data Pipelines, Apache Spark, Financial Tech");
            a3.setSkillNames(Arrays.asList("Python", "PostgreSQL", "Apache Spark", "Kafka", "Data Engineering"));
            AlumniProfile p3 = alumniService.registerAlumni(a3);

            // 4. Siddharth Joshi
            AlumniRequest a4 = new AlumniRequest();
            a4.setFullName("Siddharth Joshi");
            a4.setEmail("siddharth.joshi@barclays.com");
            a4.setPhone("+91 99887 76655");
            a4.setGraduationYear(2023);
            a4.setDepartment("Computer Engineering");
            a4.setDegree("B.E.");
            a4.setCurrentOrganisation("Barclays");
            a4.setCurrentRole("Graduate Analyst");
            a4.setLocation("Pune, Maharashtra");
            a4.setBio("Working on core payments and microservices at Barclays Pune Tech Center.");
            a4.setInterests("Backend Engineering, Spring Boot, Microservices");
            a4.setSkillNames(Arrays.asList("Java", "Spring Boot", "Microservices", "Docker", "REST API"));
            AlumniProfile p4 = alumniService.registerAlumni(a4);

            // Seed sample connection
            connectionService.sendRequest(new ConnectionRequestDto(p1.getId(), p2.getId()));

            // Seed sample jobs
            JobPostingRequestDto j1 = new JobPostingRequestDto();
            j1.setTitle("Backend Developer (Payments Platform)");
            j1.setCompany("Barclays");
            j1.setLocation("Pune, Maharashtra");
            j1.setJobType("Full-time");
            j1.setExperienceLevel("Entry-level (0-2 years)");
            j1.setDescription("Looking for fresh graduates with strong foundations in Java, Data Structures, and Spring Boot. Referral available for PICT alumni.");
            j1.setApplicationUrl("https://home.barclays/careers");
            j1.setPostedById(p4.getId());
            jobPostingService.createJob(j1);

            JobPostingRequestDto j2 = new JobPostingRequestDto();
            j2.setTitle("Frontend Engineering Intern");
            j2.setCompany("Microsoft");
            j2.setLocation("Hyderabad / Remote");
            j2.setJobType("Internship");
            j2.setExperienceLevel("Entry-level (0-2 years)");
            j2.setDescription("Summer 2027 internship opportunity in Microsoft 365 web apps team. Proficiency with React, TypeScript and CSS required.");
            j2.setApplicationUrl("https://careers.microsoft.com");
            j2.setPostedById(p2.getId());
            jobPostingService.createJob(j2);

            System.out.println("Demo seed data successfully initialized.");
        } catch (Exception ex) {
            System.err.println("Notice: Sample data seeding skipped or failed: " + ex.getMessage());
        }
    }
}

