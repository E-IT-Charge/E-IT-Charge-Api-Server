package com.ll.eitcharge.domain.inquiry.inquiry.controller;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.Bucket;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.ll.eitcharge.domain.inquiry.inquiry.dto.InquiryRequestDto;
import com.ll.eitcharge.domain.inquiry.inquiry.dto.InquiryResponseDto;
import com.ll.eitcharge.domain.inquiry.inquiry.entity.Inquiry;
import com.ll.eitcharge.domain.inquiry.inquiry.service.InquiryService;
import com.ll.eitcharge.domain.report.report.dto.ReportRequestDto;
import com.ll.eitcharge.domain.report.report.dto.ReportResponseDto;
import com.ll.eitcharge.global.exceptions.GlobalException;
import com.ll.eitcharge.global.rsData.RsData;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;


@Slf4j
@RestController
@RequestMapping(value = "/api/v1/inquiry")
@Tag(name = "InquiryController", description = "문의게시판 컨트롤러 API")
@RequiredArgsConstructor
public class InquiryController {
    private final InquiryService inquiryService;
    private final AmazonS3 amazonS3;

    private static String IMG_DIR_NAME = "img1";
    private static String region = "ap-northeast-2";
    private static String bucket = "dev-bucket-eticharge-1";
//    private static String fileurl = "https://" + bucket + ".s3." + region + ".amazonaws.com/";

    @GetMapping("/list")
    public ResponseEntity<Page<InquiryResponseDto>> getList(
            @RequestParam(value="page", defaultValue = "0") int page,
            @RequestParam(value="pageSize", defaultValue = "10") int pageSize
    ) {
        inquiryService.updateStatus();
        Page<InquiryResponseDto> inquiryList = inquiryService.getList(page, pageSize);
        return ResponseEntity.ok(inquiryList);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/create")
    public ResponseEntity<InquiryRequestDto> create(
            @RequestBody @Valid InquiryRequestDto requestDto,
            Principal principal
    ) {
        String fileurl;
        System.out.println("파일이름이 뭔데" + requestDto.getS3fileName());
        if(requestDto.getS3fileName() == null)
            fileurl = null;
        else
            fileurl = "https://" + bucket + ".s3." + region + ".amazonaws.com/" + requestDto.getS3fileName();

        inquiryService.create(requestDto, principal.getName(), fileurl);

        return ResponseEntity.ok(requestDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InquiryResponseDto> getInquiry(@PathVariable Long id) {
        InquiryResponseDto inquiry = inquiryService.getInquiryById(id);

        return ResponseEntity.ok(inquiry);
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{id}")
    public ResponseEntity<InquiryResponseDto> modify(
            @PathVariable Long id,
            @RequestBody InquiryRequestDto inquiryRequestDto,
            Principal principal) {

        return ResponseEntity.ok(inquiryService.modify(id, inquiryRequestDto, principal.getName()));
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id,
            Principal principal) {
        inquiryService.delete(id, principal.getName());
    }





    @GetMapping("/")
    public List<String> listBuckets() {
        // S3 버킷 리스트를 가져옵니다.
        List<Bucket> buckets = amazonS3.listBuckets();

        // 버킷 이름만 추출하여 리스트로 반환합니다.
        return buckets.stream().map(Bucket::getName).collect(Collectors.toList());
    }



    @PostMapping("/fileupload")
    @ResponseBody
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileName=file.getOriginalFilename();


            ObjectMetadata metadata= new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());
            amazonS3.putObject(bucket,fileName,file.getInputStream(),metadata);
            return ResponseEntity.ok("업로드 완료");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
//
//    @PostMapping("/upload")
//    @ResponseBody
//    public String upload(
//            MultipartFile file
//    ) throws IOException {
//        // 파일을 S3에 업로드합니다.
//        // ObjectMetadata 객체 생성 및 설정
//        ObjectMetadata objectMetadata = new ObjectMetadata();
//        objectMetadata.setContentType(file.getContentType());
//        objectMetadata.setContentLength(file.getSize());
//
//        // PutObjectRequest 객체 생성
//        PutObjectRequest putObjectRequest = new PutObjectRequest(
//                BUCKET_NAME,
//                IMG_DIR_NAME + "/" + file.getOriginalFilename(),
//                file.getInputStream(),
//                objectMetadata
//        );
//
//        // Amazon S3에 파일 업로드
//        amazonS3.putObject(putObjectRequest);
//
//        return """
//                <img src="%s">
//                <hr>
//                <div>업로드 완료</div>
//                """.formatted(getS3FileUrl(IMG_DIR_NAME + "/" + file.getOriginalFilename()));
//
//    }

    @GetMapping("/deleteFile")
    public String showDeleteFile() {
        return """
                <form action="/deleteFile" method="post">
                    <input type="text" name="fileName">
                    <input type="submit" value="delete">
                </form>
                """;
    }

    @PostMapping("/deleteFile")
    @ResponseBody
    public String deleteFile(String fileName) {
        // 파일을 S3에서 삭제합니다.
        amazonS3.deleteObject(bucket, IMG_DIR_NAME + "/" + fileName);

        return "파일이 삭제되었습니다.";
    }


}
