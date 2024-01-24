package com.ll.eitcharge.domain.report.report.entity;

import com.ll.eitcharge.domain.member.member.entity.Member;
import com.ll.eitcharge.domain.station.station.entity.Station;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import static jakarta.persistence.FetchType.*;
import static lombok.AccessLevel.PROTECTED;

@Entity
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder
@Getter
@Setter
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = LAZY)
    private Station station;

    @ManyToOne(fetch = LAZY)
    private Member member;

    private String content;
    private String reportType;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
}
