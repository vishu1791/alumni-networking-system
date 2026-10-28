package com.pict.alumuniconnect.repository;

import com.pict.alumuniconnect.entity.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {

    List<JobPosting> findAllByOrderByPostedAtDesc();

    List<JobPosting> findByPostedByIdOrderByPostedAtDesc(Long alumniId);
}

