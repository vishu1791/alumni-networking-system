package com.pict.alumuniconnect.controller;

import com.pict.alumuniconnect.dto.JobPostingRequestDto;
import com.pict.alumuniconnect.entity.JobPosting;
import com.pict.alumuniconnect.service.JobPostingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobPostingController {

    private final JobPostingService jobPostingService;

    public JobPostingController(JobPostingService jobPostingService) {
        this.jobPostingService = jobPostingService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobPosting createJob(@Valid @RequestBody JobPostingRequestDto dto) {
        return jobPostingService.createJob(dto);
    }

    @GetMapping
    public List<JobPosting> getAllJobs() {
        return jobPostingService.getAllJobs();
    }

    @GetMapping("/{id}")
    public JobPosting getJobById(@PathVariable Long id) {
        return jobPostingService.getJobById(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteJob(@PathVariable Long id) {
        jobPostingService.deleteJob(id);
    }
}

