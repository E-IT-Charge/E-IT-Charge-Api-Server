package com.ll.eitcharge.domain.charger.chargerScheduler;

import com.ll.eitcharge.domain.charger.charger.service.ChargerService;
import com.ll.eitcharge.domain.chargingStation.chargingStation.service.ChargingStationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class ChargerStatusScheduler {

    private final ChargerService chargerService;
    private final ChargingStationService chargingStationService;

    @Scheduled(initialDelay = 5 * 60 * 1000, fixedRate = 3 * 60 * 1000) // 초기 지연 시간 5분, 그 후 3분마다 실행
    public void updateChargerStatus() {
        chargerService.updateChargerStatus();

        removeDuplicateLines();
    }

    public void removeDuplicateLines(){
        Path inputPath = Paths.get(System.getProperty("user.dir"), "batch/NoChargingStation.txt");

        // 파일 읽기
        try (BufferedReader reader = new BufferedReader(new FileReader(inputPath.toString()))) {
            Set<String> uniqueLines = new HashSet<>();
            String line;
            while ((line = reader.readLine()) != null) {
                uniqueLines.add(line.trim()); // 공백 제거 후 저장
            }


            // 중복 제거된 충전소 아이디로 api요청하여 새 데이터 생성
            try {
                for (String uniqueLine : uniqueLines) {
                    chargingStationService.chargerStatusUpdate(uniqueLine);
                }
            }catch (Exception e){
                e.printStackTrace();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
