package com.devsync.v2.repo;

import com.devsync.v2.entity.ReportEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportsRepo extends JpaRepository<ReportEntity, Long> {
}
