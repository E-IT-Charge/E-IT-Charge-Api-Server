package com.ll.eitcharge.domain.chargingStation.chargingStation.service;

import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationItemDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationItemsDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationResponseDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.chargingStation.chargingStation.repository.ChargingStationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChargingStationApiService {

    private final ChargingStationRepository chargingStationRepository;
    private final RestTemplate restTemplate;

    public ChargingStation findById(Long id) {
        Optional< ChargingStation > oc = chargingStationRepository.findById(id);
        if(oc.isEmpty()){
            new EntityNotFoundException("id가" + id + "인 충전소는 존재하지 않습니다.");
        }
        return oc.get();
    }

    public ResponseEntity< ChargingStationResponseDto > findfromApi(String stateId){

//        ChargingStation findChargingStation = findById(id);
//        String statId = findChargingStation.getStatId();
        String url = makeApiUrl(100, 1, stateId);

        ResponseEntity< ChargingStationResponseDto > ChargingStationResp = restTemplate.getForEntity(url, ChargingStationResponseDto.class);
        ChargingStationItemDto[] items = ChargingStationResp.getBody().getItems().getItem();


        //TODO stateId받아와서 정보 넘기기, 해당 정보를 update해주기



        System.out.println(ChargingStationResp);
        return ChargingStationResp;
    }

    public String makeApiUrl(int numOfRows, int pageNo, String stateId){
        String key = "%2B61CsEc7Nmo65NvzqtjoQh0FPR0CAdc45WlyZDPkxYDqeSxUJ4E1ncpqn2H2qyN%2BHFXNqJD6JbNbghaWu9Tctw%3D%3D";
        String url = "https://apis.data.go.kr/B552584/EvCharger/getChargerInfo?serviceKey="+key+"&numOfRows="+numOfRows+"&pageNo="+pageNo+"&statId="+stateId+"&dataType=JSON";
        return url;
    }






}
