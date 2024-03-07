import { AppBar, Button, Toolbar, Typography, IconButton, Menu, MenuItem, Hidden } from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import EvStationIcon from '@mui/icons-material/EvStation';

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const { isLogin, setLogout, getUserName, getUserNickname } = useAuth();

  const handleLogout = () => {
    setLogout();
    //로그 아웃 후 로그인 페이지 or 홈으로 이동 ?
    navigate("/");
  };

  const goToHome = () => {
    navigate("/");
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" style={{ background: "white", borderBottom: "1px solid grey", boxShadow: "none", display: "flex", justifyContent: "center" }}>
      <Toolbar style={{ display: "flex", justifyContent: "space-between", padding: "24px", maxWidth: "1200px", margin: "auto" }}>
        <div onClick={goToHome} style={{ cursor: "pointer" }}>
          <Typography variant="h5" style={{ fontWeight: "bold", display: "flex", alignItems: "center", color: "#3F51B5", marginRight: "20px" }}>
            <EvStationIcon style={{ marginRight: "3px", fontSize: "2rem", color: "#3F51B5" }} />전기차 충전소 서비스</Typography>
        </div>
        <div>
          <Hidden mdUp style={{ display: "flex", justifyContent: "flex-end"}}>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              aria-controls="nav-menu"
              aria-haspopup="true"
              onClick={handleMenuClick}
              style={{ color: "black" }} // 햄버거 아이콘의 색상을 검은색으로 지정
              marginLeft
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="nav-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {[
                <MenuItem key="report" onClick={handleMenuClose} component={Link} to="/report/list">신고하기</MenuItem>,
                <MenuItem key="serviceInfo" onClick={handleMenuClose} component={Link} to="/chargingServiceInfo">서비스 안내</MenuItem>,
                <MenuItem key="map" onClick={handleMenuClose} component={Link} to="/map">충전소 지도</MenuItem>,
                <MenuItem key="inquiry" onClick={handleMenuClose} component={Link} to="/inquiry">1대1 문의</MenuItem>,
                isLogin() ? (
                  <>
                    <MenuItem key="welcome" onClick={handleMenuClose}>
                      <Typography variant="body1">
                        {!getUserName().startsWith("KAKAO") ? getUserName() : getUserNickname()}
                        님 환영합니다.
                      </Typography>
                    </MenuItem>,
                    <MenuItem key="logout" onClick={handleMenuClose}>
                      <Button color="inherit" onClick={handleLogout}>
                        로그아웃
                      </Button>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem key="signup" onClick={handleMenuClose} component={Link} to="/signup">회원가입</MenuItem>,
                    <MenuItem key="login" onClick={handleMenuClose} component={Link} to="/login">로그인</MenuItem>
                  </>
                )
              ]}
            </Menu>
          </Hidden>
        </div>

        <Hidden mdDown>
          <Button color="inherit" component={Link} to="/report/list" style={{ fontSize: "24px", color: "gray", fontWeight: "bold", marginLeft:"12px", marginRight:"12px" }}>
            신고하기
          </Button>
          <Button color="inherit" component={Link} to="/chargingServiceInfo" style={{ fontSize: "24px", color: "gray", fontWeight: "bold", marginLeft:"12px", marginRight:"12px" }}>
            서비스 안내
          </Button>
          <Button color="inherit" component={Link} to="/map" style={{ fontSize: "24px", color: "gray", fontWeight: "bold", marginLeft:"12px", marginRight:"12px" }}>
            충전소 지도
          </Button>
          <Button color="inherit" component={Link} to="/inquiry" style={{ fontSize: "24px", color: "gray", fontWeight: "bold", marginLeft:"12px", marginRight:"12px" }}>
            1대1 문의
          </Button>
          {isLogin() ? (
            <>
              
              <Button color="inherit" onClick={handleLogout} style={{ fontSize: "24px", color: "gray", fontWeight: "bold", marginLeft:"12px", marginRight:"10px" }}>
                로그아웃
              </Button>
              <Typography variant="body1" style={{  fontSize: "24px", color: "black",  marginLeft:"5px", fontWeight: "bold", textAlign:"right"}}>
                {!getUserName().startsWith("KAKAO")
                  ? getUserName()
                  : getUserNickname()}
                님 
              </Typography>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/signup" style={{ fontSize: "24px", color: "gray", fontWeight: "bold", marginLeft:"12px", marginRight:"12px" }}>
                회원가입
              </Button>
              <Button color="inherit" component={Link} to="/login" style={{ fontSize: "24px", color: "gray", fontWeight: "bold", marginLeft:"12px" }}>
                로그인
              </Button>
            </>
          )}
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
