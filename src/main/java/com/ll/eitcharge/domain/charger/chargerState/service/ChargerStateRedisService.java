package com.ll.eitcharge.domain.charger.chargerState.service;

import static lombok.AccessLevel.*;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ll.eitcharge.domain.charger.charger.entity.Charger;
import com.ll.eitcharge.domain.charger.chargerState.dto.ChargerStateUpdateDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChargerStateRedisService {
	private final StringRedisTemplate redisTemplate;

	@Getter
	@Setter
	@Builder
	@NoArgsConstructor(access = PROTECTED)
	@AllArgsConstructor(access = PROTECTED)
	public static class RedisMap {
		private String key;
		private String value;
	}

	/**
	 * 충전소 리스트를 입력받아 해당 충전소의 모든 충전기 상태 정보를 레디스에 저장한다.
	 * @param 충전소 리스트
	 * redis (key, value) : 충전소ID_충전기ID, 충전기 상태
	 * [참고] 최초 스프링부트 실행 시 모든 충전기 정보를 저장할 시 사용
	 */
	public void setChargersToRedisByChargingStationList(List<ChargingStation> list) {
		List<RedisMap> listConvertedByMap = list.stream().flatMap(
				chargingStation ->
					chargingStation.getChargers().stream().map(
						charger -> {
							String key = chargingStation.getStatId() + "_" + charger.getChgerId();
							String value = charger.getStat();

							return RedisMap.builder()
								.key(key)
								.value(value)
								.build();
						}))
			.toList();

		redisTemplate.executePipelined((RedisCallback<Object>)connection -> {
				listConvertedByMap.forEach(map ->
					redisTemplate.opsForValue().set(map.getKey(), map.getValue())
				);
				log.info("Redis : 충전소_충전기 / 상태정보 " + listConvertedByMap.size() + "건 저장 완료");
				return null;
			}
		);
	}

	/**
	 * 충전기 리스트를 입력받아 해당 충전기의 모든 충전기 상태 정보를 레디스에 저장한다.
	 * redis (key, value) 충전소ID_충전기ID : 충전기 상태
	 */
	public void setChargersToRedisByChargerList(List<Charger> list) {
		List<RedisMap> listConvertedByMap = list.stream().map(charger -> {
				String key = charger.getChargingStation().getStatId() + "_" + charger.getChgerId();
				String value = charger.getStat();

				return RedisMap.builder()
					.key(key)
					.value(value)
					.build();
			})
			.toList();

		redisTemplate.executePipelined((RedisCallback<Object>)connection -> {
				listConvertedByMap.forEach(map ->
					redisTemplate.opsForValue().set(map.getKey(), map.getValue())
				);
				log.info("Redis(초기 세팅) : 충전기 상태 {}건 저장 완료", listConvertedByMap.size());
				return null;
			}
		);
	}

	/**
	 * Redis에 존재하는 key값에 한해 인자의 hashMap의 value로 업데이트 후 업데이트된 hashMap을 리턴한다.
	 * @param list : 오픈API로 갱신된 충전소ID, 충전기ID, 충전기 상태, 업데이트 날짜
	 * @return list : redis에 갱신된 충전소ID, 충전기ID, 충전기 상태, 업데이트 날짜
	 */
	public List<ChargerStateUpdateDto> updateExistingChargersToRedis(List<ChargerStateUpdateDto> list) {
		List<ChargerStateUpdateDto> updatedList = new ArrayList<>();

		redisTemplate.executePipelined((RedisCallback<Void>)connection -> {
			for (ChargerStateUpdateDto dto : list) {
				// dto에서 statId와 chgerId를 key로, %s_%s로 묶어서, value는 stat로 추출해서 넣어줘
				String key = String.format("%s_%s", dto.getStatId(), dto.getChgerId());
				String value = dto.getStat();

				if (redisTemplate.hasKey(key) && !redisTemplate.opsForValue().get(key).equals(value)) {
					redisTemplate.opsForValue().set(key, value);
					// 업데이트된 해당 Dto를 리스트에 추가해서 리턴해줘
					updatedList.add(dto);
				}
			}
			return null;
		});

		log.info("Redis(정기 업데이트) : 충전기 상태 {}건 중 변화 감지 {}건 저장 완료", list.size(), updatedList.size());
		return updatedList;
	}
}