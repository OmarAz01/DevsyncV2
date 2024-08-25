package com.devsync.v2.dto;

import com.devsync.v2.entity.ReportEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportDTO {
    private Long reportId;
    private String reportedBy;
    private String reportedUser;
    private String reason;
    private String status;
    private String createdAt;

    public static ReportDTO convertToDTO(ReportEntity report) {
        return new ReportDTO(
                report.getReportId(),
                report.getReportedBy().getUsername(),
                report.getReportedUser().getUsername(),
                report.getReason(),
                report.getStatus(),
                report.getCreatedAt().toString()
        );
    }
}
