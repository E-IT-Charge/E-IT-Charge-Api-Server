package com.ll.eitcharge.domain.charger.chargerScheduler;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.chargingStation.chargingStation.service.ChargingStationService;
import lombok.RequiredArgsConstructor;

import java.io.*;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.Set;

@RequiredArgsConstructor
public class UniqueItemWriter {

    private static final String INPUT_FILE_PATH = "batch/NoChargingStation.txt";
    private static final String OUTPUT_FILE_PATH = "batch/UniqueNoChargingStation.txt";

    public static void main(String[] args)  {
        // 파일 경로 설정
        Path inputPath = Paths.get(System.getProperty("user.dir"), INPUT_FILE_PATH);
        Path outputPath = Paths.get(System.getProperty("user.dir"), OUTPUT_FILE_PATH);

        // 파일 읽기
        try (BufferedReader reader = new BufferedReader(new FileReader(inputPath.toString()))) {
            Set<String> uniqueLines = new HashSet<>();
            String line;
            while ((line = reader.readLine()) != null) {
                uniqueLines.add(line.trim()); // 공백 제거 후 저장
            }



            // 중복 제거된 내용 출력
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(outputPath.toString()))) {
                for (String uniqueLine : uniqueLines) {
                    writer.write(uniqueLine);
                    writer.newLine();
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
