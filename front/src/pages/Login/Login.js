import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import KakaoLoginButton from "./KakaoLoginButton";
import { HttpGet, HttpPost } from "../../services/HttpService";
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
} from "@material-ui/core";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setLogined } = useAuth();
  const handleLogin = async () => {
    try {
      HttpPost("/api/v1/members/login", {
        username: username,
        password: password,
      }).then((response) => {
        // 로그인 성공 시 처리
        console.log("Login successful:", response);

        console.log("Login successful:", response.data.item);
        setLogined(response.data.item);
        console.log("username sessionStorage " + response.data.item.username);
        sessionStorage.setItem("username", response.data.item.username);
        // TODO: 성공 시 리다이렉트 또는 다른 작업 수행
        navigate("/");
      });
    } catch (error) {
      // 로그인 실패 시 처리
      if (username === "") {
        alert("Username은 필수 입력 항목입니다.");
      } else if (password === "") {
        alert("Password은 필수 입력 항목입니다.");
      }

      if (error.response.data.resultCode === "400-1") {
        alert("해당 유저가 존재하지 않습니다.");
      } else if (error.response.data.resultCode === "400-2") {
        alert("비밀번호가 일치하지 않습니다.");
        setPassword("");
      }

      console.error("Login failed:", error.response.data);

      // TODO: 실패 시 에러 메시지 출력 또는 다른 작업 수행
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "60vh",
      }}
    >
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <Typography component="h1" variant="h5">
          로그인
        </Typography>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
          }}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleLogin}
          >
            로그인
          </Button>
          <KakaoLoginButton />
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
