package com.ll.eitcharge.global.initData;

import java.util.stream.IntStream;
import java.util.stream.LongStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.transaction.annotation.Transactional;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.chargingStation.chargingStation.service.ChargingStationService;
import com.ll.eitcharge.domain.member.member.entity.Member;
import com.ll.eitcharge.domain.member.member.service.MemberService;
import com.ll.eitcharge.domain.report.report.dto.ReportRequestDto;
import com.ll.eitcharge.domain.report.report.dto.ReportCompleteRequestDto;
import com.ll.eitcharge.domain.report.report.entity.ReportType;
import com.ll.eitcharge.domain.report.report.service.ReportService;
import com.ll.eitcharge.domain.technicalManager.technicalManager.service.TechnicalManagerService;
import com.ll.eitcharge.global.rsData.RsData;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

@Configuration
@Profile("!dev")
@Slf4j
@RequiredArgsConstructor
public class Dev {
	@Autowired
	@Lazy
	private Dev self;
	private final ReportService reportService;
	private final MemberService memberService;
	private final ChargingStationService chargingStationService;
	private final TechnicalManagerService technicalManagerService;

	@Bean
	@Order(3)
	@SneakyThrows(RuntimeException.class)
	public ApplicationRunner initNotProd() {
		return args -> {
			try {
				self.makeTestUser();
				self.makeTestTechnicalManager();
				self.makeTestReport();
				self.makeTestReportResult();
			} catch (Exception e) {
				e.printStackTrace();
				log.error("샘플 데이터 생성 중 에러 발생");
			}
		};

	}

	@Transactional
	@SneakyThrows(RuntimeException.class)
	public void makeTestUser() {
		// 이미 회원이 존재하는 경우 초기화를 수행하지 않음
		if (memberService.findByUsername("user1").isPresent())
			return;

		IntStream.rangeClosed(1, 10).forEach(i -> {
			memberService.join("user" + i, "123");
		});
	}

	// 샘플 TechnicalManager 생성
	@Transactional
	@SneakyThrows(RuntimeException.class)
	public void makeTestTechnicalManager() {
		if (technicalManagerService.findByNameOptional("manager1").isPresent())
			return;

		RsData<Member> memberRsData = memberService.join("manager1", "123");

		technicalManagerService.create(memberRsData.getData(), chargingStationService.findById("ACAC0001"));
	}

	// 신고내역 샘플 데이터 생성
	@Transactional
	@SneakyThrows(RuntimeException.class)
	public void makeTestReport() {
		if (reportService.findByIdOptional(1L).isPresent()) return;
		ChargingStation chargingStation = chargingStationService.findById("ACAC0001");

		IntStream.rangeClosed(1, 20).forEach(i -> {
				ReportRequestDto requestDto = ReportRequestDto.builder()
					.title(String.format("테스트 신고 %d", i))
					.content(String.format("테스트 신고 내용 %d", i))
					.reportType(ReportType.SYSTEM_FIX.getValue())
					.statId(chargingStation.getStatId())
					.statNm(chargingStation.getStatNm())
					.build();
				reportService.create(requestDto, "user1");
			}
		);
	}

	// 신고 처리결과 샘플 데이터 생성
	@Transactional
	@SneakyThrows(RuntimeException.class)
	public void makeTestReportResult() {
		if (reportService.findByIdOptional(1L).isPresent()) {
			if (reportService.findById(1L).getReplier() != null) return;
		}

		LongStream.rangeClosed(1L, 10L).forEach(i -> {
				ReportCompleteRequestDto requestDto = ReportCompleteRequestDto.builder()
					.reply(String.format("테스트 처리 결과 %d", i))
					.build();
				reportService.complete(requestDto, i, "manager1");
			}
		);
	}
}
