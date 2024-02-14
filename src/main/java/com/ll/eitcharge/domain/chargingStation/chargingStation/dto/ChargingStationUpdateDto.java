package com.ll.eitcharge.domain.chargingStation.chargingStation.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChargingStationUpdateDto {
    private String statId;
    private String statNm;
    private String addr;
    private String location;
    private String useTime;
    private Double lat;
    private Double lng;
    private String busiNm;
    private String zscode;
    private String kind;
    private String kindDetail;
    private String parkingFree;
    private String note;
    private String limitYn;
    private String limitDetail;
    private String delYn;
    private String delDetail;
    private String trafficYn;

    private String busiid;
    private String busiCall;
}
