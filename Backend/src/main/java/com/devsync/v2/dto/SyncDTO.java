package com.devsync.v2.dto;

import com.devsync.v2.entity.SyncEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SyncDTO {
    private Long syncId;
    private String message;
    private String status;
    private String dateOfSync;
    private String senderUsername;
    private String recipientUsername;

    public static SyncDTO convertToDTO(SyncEntity sync) {
        return new SyncDTO(
                sync.getSyncId(),
                sync.getMessage(),
                sync.getStatus(),
                sync.getDateOfSync().toString(),
                sync.getSender().getUsername(),
                sync.getRecipient().getUsername()
        );
    }
}
