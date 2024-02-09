package com.ll.eitcharge.domain.chargingStation.chargingStation.service;

import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ll.eitcharge.domain.charger.charger.entity.Charger;
import com.ll.eitcharge.domain.charger.charger.entity.ChargerType;
import com.ll.eitcharge.domain.charger.charger.repository.ChargerRepository;
import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargerStateDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationSearchItemResponseDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationSearchResponseDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationSearchWithDistanceResponseDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationWithDistanceDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.WithExecTime;
import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.chargingStation.chargingStation.repository.ChargingStationRepository;
import com.ll.eitcharge.domain.chargingStation.chargingStation.repository.ChargingStationSearchRepository;
import com.ll.eitcharge.domain.operatingCompany.operatingCompany.service.OperatingCompanyService;
import com.ll.eitcharge.domain.region.regionDetail.service.RegionDetailService;
import com.ll.eitcharge.domain.region.service.RegionService;
import com.ll.eitcharge.global.exceptions.GlobalException;
import com.ll.eitcharge.global.rsData.RsData;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ChargingStationService {
	private final ObjectMapper objectMapper;
	private final RegionService regionService;
	private final ChargerRepository chargerRepository;
	private final RegionDetailService regionDetailService;
	private final OperatingCompanyService operatingCompanyService;
	private final ChargingStationRepository chargingStationRepository;
	private final ChargingStationSearchRepository chargingStationSearchRepository;

	// 엔티티 조회용
	public ChargingStation findById(String id) {
		return chargingStationRepository.findById(id).orElseThrow(GlobalException.E404::new);
	}

	// 엔티티 조회용
	public Optional<ChargingStation> findByIdOptional(String statId) {
		return chargingStationRepository.findById(statId);
	}

	public List<ChargingStationSearchResponseDto> findByLatBetweenAndLngBetween(double swLat, double swLng, double neLat, double neLng) {
		List<ChargingStation> chargingStations = chargingStationRepository.findByLatBetweenAndLngBetween(swLat, neLat, swLng, neLng);
		return chargingStations.stream()
				.map(ChargingStationSearchResponseDto::new)
				.toList();
	}

	public List<ChargingStation> findByReportEditKw(String kw) {
		return chargingStationRepository.findByReportEditKw(kw);
	}

	public RsData<Object> findFromApi(String statId) {
		WebClient webClient = WebClient.create();

		String serviceKey = "%2B61CsEc7Nmo65NvzqtjoQh0FPR0CAdc45WlyZDPkxYDqeSxUJ4E1ncpqn2H2qyN%2BHFXNqJD6JbNbghaWu9Tctw%3D%3D";
		String numOfRows = "100";
		String pageNo = "1";

		URI uri = UriComponentsBuilder.fromUriString("https://apis.data.go.kr/B552584/EvCharger/getChargerInfo")
			.queryParam("serviceKey", serviceKey)
			.queryParam("numOfRows", numOfRows)
			.queryParam("pageNo", pageNo)
			.queryParam("statId", statId)
			.build(true)
			.toUri();

		String response = webClient.get()
			.uri(uri)
			.header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
			.retrieve()
			.bodyToMono(String.class)
			.block();

		HashMap hashMap = null;
		try {
			hashMap = objectMapper.readValue(response, HashMap.class);
		} catch (JsonProcessingException e) {
			throw new RuntimeException("JSON 파싱 오류", e);
		}

		RsData<Object> rsData = RsData.of(hashMap.get("items"));

		return rsData;
	}

	public ChargingStationSearchItemResponseDto getSearchMenuBaseItem() {
		return new ChargingStationSearchItemResponseDto(
			regionService.getZcodeList(),
			regionService.getRegionNameList(),
			operatingCompanyService.getPrimaryBusiIdList(),
			operatingCompanyService.getPrimaryBnmList(),
			ChargerType.values()
		);
	}

	public ChargingStationSearchItemResponseDto getSearchMenuRegionDetailItem(String zcode) {
		return new ChargingStationSearchItemResponseDto(
			regionDetailService.getZscodeListByZcode(zcode),
			regionDetailService.getRegionDetailNamesListByZcode(zcode)
		);
	}

	public WithExecTime<Page<ChargingStationSearchResponseDto>> search(
		String limitYn,
		String parkingFree,
		String zcode,
		String zscode,
		String isPrimary,
		List<String> busiIds,
		List<String> chgerTypes,
		String kw,
		int page,
		int pageSize
	) {
		List<Sort.Order> sorts = new ArrayList<>();
		sorts.add(Sort.Order.desc("statId"));
		Pageable pageable = PageRequest.of(page - 1, pageSize, Sort.by(sorts));

		long startTime = System.nanoTime();
		Page<ChargingStation> chargingStations = chargingStationRepository.search(limitYn, parkingFree, zcode, zscode,
			isPrimary, busiIds, chgerTypes, kw, pageable);
		long endTime = System.nanoTime();

		return WithExecTime.of(
			calculateExecutionTime(startTime, endTime),
			chargingStations.map(ChargingStationSearchResponseDto::new));
	}

	private String calculateExecutionTime(long startTime, long endTime) {
		long executionTimeInNano = endTime - startTime;
		return String.format("[네이티브 쿼리] 실행 시간 (ns): %d , 실행시간 (ms): %d , 실행시간 : %d 초",
			executionTimeInNano,
			executionTimeInNano / 1_000_000,
			(long) (executionTimeInNano / 1_000_000_000.0));
	}

	public List<ChargerStateDto> chargerStateSearch(String statId) {

		List<Charger> chargerStates = chargerRepository.findByChargingStationStatId(statId);
		return chargerStates.stream()
				.map(ChargerStateDto::new)
				.collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public WithExecTime<Page<ChargingStationSearchResponseDto>> searchlist(
		String limitYn,
		String parkingFree,
		String zcode,
		String zscode,
		String isPrimary,
		List<String> busiIds,
		List<String> chgerTypes,
		String kw,
		int page,
		int pageSize,
		double lng,
		double lat
	) {

		Pageable pageable = PageRequest.of(page - 1, pageSize);

		long startTime = System.nanoTime();
		Page<ChargingStationWithDistanceDto> chargingStations = chargingStationSearchRepository.searchList(limitYn, parkingFree, zcode,
			zscode, isPrimary, busiIds, chgerTypes, kw, lat, lng, pageable);
		long endTime = System.nanoTime();

		return WithExecTime.of(
			calculateExecutionTime(startTime, endTime),
			chargingStations.map(this::convertToSearchResponseDto)
		);

	}

	public ChargingStationSearchResponseDto convertToSearchResponseDto(
		ChargingStationWithDistanceDto chargingStationDto) {
		return (
			new ChargingStationSearchWithDistanceResponseDto(
				findById(chargingStationDto.getId()), chargingStationDto.getDistance()));
	}
}
