import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {Button, TextField, Box, Typography, Container, Grid} from '@material-ui/core';
const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [checkId, setCheckId] = useState(null);
  const navigate = useNavigate();

  const handleCheckid = async () => {
    try {
      const response = await axios.get(`https://api.eitcharge.site/api/v1/members/checkid/${username}`);
      if (response.data) {
        alert('사용 가능한 ID 입니다');
        setCheckId(true);
      } else {
        alert('이미 사용중인 ID 입니다');
        setCheckId(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        'https://api.eitcharge.site/api/v1/members/signup',
        {
          username: username,
          password1: password,
          password2: password2
        }
      );

      // 회원가입 성공시 처리
      console.log('Signup successful:' , response);
      alert("회원 가입 성공!");
      navigate('/login');
    } catch (error) {
      // 회원가입 실패 시 처리
      if(username === ''){
        alert("Username은 필수 입력 항목입니다.")
      }else if(password ===  ''){
        alert("Password은 필수 입력 항목입니다.")
      }else if(password2 === ''){
        alert("Passsword Confirm은 필수 입력 항목입니다.")
      }

      if(error.response.data.resultCode === '400-1'){
        alert("두개의 비밀번호가 일치하지 않습니다.");
      }
      else if(error.response.data.resultCode === '400-2'){
        alert("이미 존재하는 회원입니다.");
      }

      console.error('Signup failed:', error.response.data);      
    }
  };

  return (

    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          회원가입
        </Typography>
        <Box component="form" onSubmit={(e) => e.preventDefault()} noValidate sx={{ mt: 3 }}>
        <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={9}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                variant="contained"
                sx={{ height: '100%' }}
                onClick={handleCheckid}
              >
                중복 확인
              </Button>
              </Grid>
          </Grid>
          {checkId === true && <Typography sx={{ color: 'green' }}>✔️ 사용 가능한 ID 입니다.</Typography>}
          {checkId === false && <Typography sx={{ color: 'red' }}>❌ 이미 사용 중인 ID 입니다.</Typography>}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password2"
            label="Password Confirm"
            type="password"
            id="password2"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSignup}
          >
            회원가입
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;