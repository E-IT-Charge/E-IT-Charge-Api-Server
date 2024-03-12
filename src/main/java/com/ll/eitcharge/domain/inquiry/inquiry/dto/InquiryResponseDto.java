package com.ll.eitcharge.domain.inquiry.inquiry.dto;

import com.ll.eitcharge.domain.inquiry.inquiry.entity.Inquiry;
import lombok.*;

import java.time.LocalDateTime;

import static lombok.AccessLevel.PROTECTED;

@Getter
@Setter
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
public class InquiryResponseDto {
    private Long id;
    private String title;
    private String content;
    private String writer;
    private String inquiryState;
    private String inquiryType;
    private Boolean isPublished;
    private int viewCount;
    private LocalDateTime createdDate;
    private String S3fileUrl;

    public InquiryResponseDto(Inquiry entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.content = entity.getContent();
        this.writer = entity.getWriter().getUsername();
        this.inquiryState = entity.getInquiryState();
        this.inquiryType = entity.getInquiryType();
        this.isPublished = entity.getIsPublished();
        this.viewCount = entity.getViewCount();
        this.createdDate = entity.getCreatedDate();
        this.S3fileUrl = entity.getS3fileUrl();
    }
}
