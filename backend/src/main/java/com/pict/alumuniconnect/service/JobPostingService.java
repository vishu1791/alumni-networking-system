package com.pict.alumuniconnect.service;

import com.pict.alumuniconnect.dto.JobPostingRequestDto;
import com.pict.alumuniconnect.entity.AlumniProfile;
import com.pict.alumuniconnect.entity.JobPosting;
import com.pict.alumuniconnect.exception.ResourceNotFoundException;
import com.pict.alumuniconnect.repository.AlumniRepository;
import com.pict.alumuniconnect.repository.JobPostingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class JobPostingService {

    private final JobPostingRepository jobPostingRepository;
    private final AlumniRepository alumniRepository;

    public JobPostingService(JobPostingRepository jobPostingRepository, AlumniRepository alumniRepository) {
        this.jobPostingRepository = jobPostingRepository;
        this.alumniRepository = alumniRepository;
    }

    @Transactional
    public JobPosting createJob(JobPostingRequestDto dto) {
        AlumniProfile poster = alumniRepository.findById(dto.getPostedById())
                .orElseThrow(() -> new ResourceNotFoundException("Poster alumni not found with ID: " + dto.getPostedById()));

        JobPosting job = new JobPosting();
        job.setTitle(dto.getTitle());
        job.setCompany(dto.getCompany());
        job.setLocation(dto.getLocation());
        job.setJobType(dto.getJobType());
        job.setExperienceLevel(dto.getExperienceLevel());
        job.setDescription(dto.getDescription());
        job.setApplicationUrl(dto.getApplicationUrl());
        job.setPostedBy(poster);
        job.setPostedAt(LocalDateTime.now());

        return jobPostingRepository.save(job);
    }

    public List<JobPosting> getAllJobs() {
        return jobPostingRepository.findAllByOrderByPostedAtDesc();
    }

    public JobPosting getJobById(Long id) {
        return jobPostingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job opportunity not found with ID: " + id));
    }

    @Transactional
    public void deleteJob(Long id) {
        if (!jobPostingRepository.existsById(id)) {
            throw new ResourceNotFoundException("Job opportunity not found with ID: " + id);
        }
        jobPostingRepository.deleteById(id);
    }
}

