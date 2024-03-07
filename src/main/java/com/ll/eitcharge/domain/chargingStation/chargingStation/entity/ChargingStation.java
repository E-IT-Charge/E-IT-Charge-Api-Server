package com.ll.eitcharge.domain.chargingStation.chargingStation.entity;

import static jakarta.persistence.FetchType.*;
import static lombok.AccessLevel.*;

import java.util.ArrayList;
import java.util.List;

import com.ll.eitcharge.domain.charger.charger.entity.Charger;
import com.ll.eitcharge.domain.operatingCompany.operatingCompany.entity.OperatingCompany;
import com.ll.eitcharge.domain.region.regionDetail.entity.RegionDetail;
import com.ll.eitcharge.domain.report.report.entity.Report;
import com.ll.eitcharge.domain.review.review.entity.Review;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder
@Getter
public class ChargingStation {
    //충전소 id
    @Id
    private String statId;
    //지역코드, 지역코드 상세
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "zscode")
    private RegionDetail regionDetail;

    @OneToMany(mappedBy = "chargingStation")
    private List<Charger> chargers = new ArrayList<>();

    @OneToMany(mappedBy = "chargingStation")
    private List<Report> reports = new ArrayList<>();

    @OneToMany(mappedBy = "chargingStation")
    private List<Review> reviews = new ArrayList<>();

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "busi_id")
    private OperatingCompany operatingCompany;

    //충전소명
    private String statNm;
    //주소
    private String addr;
    //상세위치
    private String location;
    //이용가능 시간
    private String useTime;
    //위도
    private double lat;
    //경도
    private double lng;
    //운영업체 이름
    private String busiNm;
    //기관 전화번호
    private String busiCall;
    //주차료여부
    private String parkingFree;
    //충전소 안내
    private String note;
    //이용자 제한 여부
    private String limitYn;
    //이용자 제한 사유
    private String limitDetail;
    //충전기 정보 삭제 여부 TODO 최근 삭제된 충전기 정보 제공한다고 하니 찾아볼것
    private String delYn;
    //충전기 정보 삭제 사유
    private String delDetail;
    //편의제공여부
    private String trafficYn;
    //충전소 구분 코드
    private String kind;
    //충전소 구분 상세 코드
    private String kindDetail;

}
