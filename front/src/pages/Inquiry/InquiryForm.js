import React, { useState, useEffect } from 'react';
import { HttpPostWithFile } from '../../services/HttpService';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material';

function InquiryForm() {
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [inquiryType, setInquiryType] = useState(null); 
  const navigate = useNavigate();
  const [files, setFiles] = useState([]); 
  const [previewUrls, setPreviewUrls] = useState([]); 

  useEffect(() => {
    console.log("등록된 파일 실 개수는: " + files.length);
  }, [files]);  

  const handleFileChange = (e) => {

    const newSelectedFiles = Array.from(e.target.files); // 새롭게 선택된 파일들을 배열로 변환
    const selectedFiles = [...files, ...newSelectedFiles]; // 기존 파일들과 새로운 파일들을 합친 배열

    if ((files.length + newSelectedFiles.length) > 10) {
      alert(`최대 10개의 파일만 업로드할 수 있습니다. 다시 선택해 주세요`);
      return;
    }
    
    setFiles(selectedFiles);

    Promise.all(newSelectedFiles.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => {
          resolve({url: event.target.result});
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });
    })).then(results => {
      // 모든 파일이 로드되었을 때 실행
      const urls = results.map(result => result.url);
  
      setPreviewUrls(prevUrls => [...prevUrls, ...urls]);
    }).catch(error => {
      console.error("파일 로드 중 오류가 발생했습니다.", error);
    });

  };

  const handleDeleteImage = (event, indexToDelete) => {
    event.preventDefault();
    event.stopPropagation();
    setPreviewUrls(prevUrls => prevUrls.filter((_, index) => index !== indexToDelete));
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToDelete)); // 파일 목록에서도 삭제
  };


  const handleSubmit = async () => {
    try {
      const data = {
        title: title,
        writer : "",
        content: content,
        inquiryType: inquiryType,
        isPublished: isPublished,
        s3fileNames : []
      };

      const responseData = await HttpPostWithFile('/api/v1/inquiry/create', data, files);
      console.log("서버 응답 데이터:", responseData);       

      alert("문의 등록 완료");
      navigate('/inquiry');
    } catch (error) {      
      if(title === null){
        alert("제목은 필수 입력 항목입니다.")
      }else if(content == null){
        alert("내용은 필수 입력 항목입니다.")
      }else if(inquiryType === null){
        alert("문의 유형을 선택해주세요.")
      }
      console.error("글쓰기 요청 중 오류 발생:", error);            
    }
  };


  return (
    <form onSubmit={handleSubmit} style={{maxWidth: '95%', margin: 'auto', display: 'block'}}>
      <FormControl fullWidth margin="normal">
        <InputLabel>문의 유형</InputLabel>
        <Select
          value={inquiryType}
          label="문의 유형"
          onChange={e => setInquiryType(e.target.value)}
        >
          <MenuItem value="홈페이지 오류">홈페이지 오류</MenuItem>
          <MenuItem value="회원가입 및 로그인">회원가입 및 로그인 문의</MenuItem>
          <MenuItem value="전기충전소 문의">전기충전소 문의</MenuItem>
          <MenuItem value="전기충전기 문의">전기충전기 문의</MenuItem>            
          <MenuItem value="기타 문의">기타 문의</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        margin="normal"
        label="제목"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <TextField
        fullWidth
        margin="normal"
        label="내용"
        multiline
        rows={4}
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <input type="file" onChange={handleFileChange} multiple />
      <div>
        총 {previewUrls.length}개의 파일이 선택되었습니다.
      </div>
      <div>
        {previewUrls.map((url, index) => (
          <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
            <img src={url} alt={`이미지 프리뷰 ${index}`} style={{ width: "100px", height: "100px" }} />
            <button type="button" 
              style={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer' }} 
              onClick={(event) => handleDeleteImage(event, index)}>
              X
            </button>
          </div>
        ))}
      </div>
     
      <FormControlLabel
        control={<Checkbox checked={isPublished} onChange={e => setIsPublished(e.target.checked)} />}
        label="공개"
      />
      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
        등록
      </Button>
    </form>
  );
}

export default InquiryForm;