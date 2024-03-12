import React, { useState, useEffect } from 'react';
import { HttpPost } from '../../services/HttpService';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material';

function InquiryForm() {
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [inquiryType, setInquiryType] = useState(null); // 문의 유형 상태 추가
  const navigate = useNavigate();
  const formData = new FormData();
  const [file, setFile] = useState(null); // 파일 상태 추가
  const [filename, setFileName] = useState(null); // 파일 상태 추가
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  
  // useEffect(() => {
  //   setFileName(filename);  
  //   console.log("등록된 파일 이름은: " + filename);
  // }, [filename]); // `filename` 상태가 변할 때마다 이 코드 블록이 실행됩니다.

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // 첫 번째 파일 선택
    setFileName(e.target.files[0].name);  
    // console.log("등록된 파일이름은: " + filename);   
  };

  const handleSubmit = async () => {
    
    
    try {
      
      
      
      
      // const request2 = await HttpPost('/api/v1/inquiry/fileupload', formData);
      console.log(`파일 = ${file}`)
      console.log(`파일이름1 = ${filename}`)

      if(file){
        formData.append('file', file); // 파일 필드 추가
        
        console.log("파일이름2: " + file.name); 
        fetch(`${BACKEND_URL}/api/v1/inquiry/fileupload`, {
        method: 'POST',
        body: formData
      }).then(
        resp => resp.json()
      ).then(
        data => console.log(data)
      ).catch( err => console.log)
      }

      const request1 = await HttpPost(
        '/api/v1/inquiry/create',
        {
          title: title,
          content: content,
          inquiryType : inquiryType,
          isPublished: isPublished,
          s3fileName : filename
        }
      );

      console.log(`파일이름1 = ${filename}`)
      console.log(`파일2 = ${file}`)
        
      // const [response1, response2] = await Promise.all([request1, request2]);
      // const [response1] = await Promise.all([request1]);

      console.log('문의 등록 완료' ,{ title, content, isPublished, inquiryType, filename});
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
      console.error('글쓰기 실패', error);      
      console.error('글쓰기 실패', error.request1);      
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
      <input type="file" onChange={handleFileChange} /> {/* 파일 입력 필드 추가 */}
      <p></p>
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