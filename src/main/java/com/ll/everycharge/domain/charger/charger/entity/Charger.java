package com.ll.everycharge.domain.charger.charger.entity;

import static jakarta.persistence.FetchType.*;
import static lombok.AccessLevel.*;

import java.time.LocalDateTime;

import org.springframework.format.annotation.DateTimeFormat;

import com.ll.everycharge.domain.charger.charger.form.ChargerApiItemForm;
import com.ll.everycharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.everycharge.global.jpa.entity.BaseTime;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder(toBuilder = true)
@Getter
//@Table(indexes = @Index(name="idx_charger_type", columnList ="chger_type"))
public class Charger extends BaseTime {
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "stat_id")
    private ChargingStation chargingStation;
    //충전기 id
    private String chgerId;
    //충전기 타입(완속 급속 콤보 등)
    private String chgerType;
    //충전기 상태
    private String stat;
    //충전기 상태 갱신 일시
    @DateTimeFormat(pattern = "yyyyMMddHHmmss")
    private LocalDateTime statUpdDt;
    //마지막 충전 시작일
    @DateTimeFormat(pattern = "yyyyMMddHHmmss")
    private LocalDateTime lastTsdt;
    //마지막 충전종료일시
    @DateTimeFormat(pattern = "yyyyMMddHHmmss")
    private LocalDateTime lastTedt;
    //충전중 시작일시
    @DateTimeFormat(pattern = "yyyyMMddHHmmss")
    private LocalDateTime nowTsdt;
    //충전 용량
    private String output;
    //충전 방식
    private String method;
    //삭제 여부
    private String delYn;
    //삭제 사유
    private String delDetail;

    // 배치 활용 로직, 인서트 시 사용 편의 생성자
    public Charger(ChargerApiItemForm item, ChargingStation station) {
        this.chgerId = item.getChgerId();
        this.chgerType = item.getChgerType();
        this.stat = item.getStat();
        this.statUpdDt = item.getStatUpdDt();
        this.lastTsdt = item.getLastTsdt();
        this.lastTedt = item.getLastTedt();
        this.nowTsdt = item.getNowTsdt();
        this.method = item.getMethod();
        this.output = item.getOutput();
        this.delYn = item.getDelYn();
        this.delDetail = item.getDelDetail();
        this.chargingStation = station;
    }

    // 배치 업데이트 시 사용 편의 메소드
    public void update(ChargerApiItemForm item, ChargingStation station) {
        this.chgerId = item.getChgerId();
        this.chgerType = item.getChgerType();
        this.stat = item.getStat();
        this.statUpdDt = item.getStatUpdDt();
        this.lastTsdt = item.getLastTsdt();
        this.lastTedt = item.getLastTedt();
        this.nowTsdt = item.getNowTsdt();
        this.method = item.getMethod();
        this.output = item.getOutput();
        this.delYn = item.getDelYn();
        this.delDetail = item.getDelDetail();
        this.chargingStation = station;
    }
}
