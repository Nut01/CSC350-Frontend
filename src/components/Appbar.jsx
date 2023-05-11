import React, { useEffect, useContext } from "react";
import {
  MenuItem,
  Menu,
  Avatar,
  Button,
  Container,
  Typography,
  Toolbar,
  Box,
  AppBar,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import useAxios from "../lib/useAxios";

export default function ResponsiveAppBar() {
  const Navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username;
  const [data, setData] = React.useState([]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const OpenMenu = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await useAxios.get(`/user/${username}`);
      setData(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("user");
    alert("ออกจากระบบสำเร็จ");
    Navigate(`/`)
    Navigate(0);
  };

  return (
    <>
      <AppBar
        position="static"
        color="transparent"
        sx={{
          boxShadow: "none",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar>
            <Link to="/">
              <img
                width={35}
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Cannabis_leaf.svg/800px-Cannabis_leaf.svg.png"
              />
            </Link>

            <Typography
              variant="h6"
              noWrap
              sx={{
                ml: 2,
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "noto-sans",
                fontWeight: 600,
                letterSpacing: ".1rem",
              }}
            >
              Thai Ridgebuds
            </Typography>

            <Box
              sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
            ></Box>

            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {user ? (
                user.role === 2 ? (
                  <Button onClick={handleClick}>
                    <Avatar src="https://cdn.pixabay.com/photo/2022/11/22/22/06/bird-7610726_960_720.jpg" />
                  </Button>
                ) : user.role === 1 ? (
                  [
                    <Typography sx={{ margin: 2, textDecoration: "none" }}>
                      คะแนนสะสม : { data.point }
                    </Typography>,
                    <Button onClick={handleClick}>
                      <Avatar src="https://cdn.pixabay.com/photo/2022/09/30/12/56/cat-7489398_960_720.jpg" />
                    </Button>,
                  ]
                ) : user.role === 0 ? (
                  [
                    alert("กรุณารอการอนุมัติจากผู้ดูแลระบบ"),
                    <Link to="/logreg">
                      <Button variant="text">เข้าสู่ระบบ / สมัครสมาชิก</Button>
                    </Link>,
                    localStorage.removeItem("user"),
                  ]
                ) : (
                  <Link to="/logreg">
                    <Button variant="text">เข้าสู่ระบบ / สมัครสมาชิก</Button>
                  </Link>
                )
              ) : (
                <Link to="/logreg">
                  <Button variant="text">เข้าสู่ระบบ / สมัครสมาชิก</Button>
                </Link>
              )}
            </Box>
          </Toolbar>
        </Container>

        <Menu
          id="appBar"
          anchorEl={anchorEl}
          open={OpenMenu}
          onClose={handleClose}
          aria-labelledby="basic-demo-button"
        >
          {user?.role === 2
            ? [
                <MenuItem>
                  <Link
                    to="/aprmember"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    อนุมัติการสมัคร
                  </Link>
                </MenuItem>,
                <MenuItem>
                  <Link
                    to="/aprorder"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    อนุมัติคำสั่งซื้อ
                  </Link>
                </MenuItem>,
                <MenuItem onClick={handleLogout}>ออกจากระบบ</MenuItem>,
              ]
            : [
                <MenuItem>
                  <Link
                    to="/history"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    ประวัติการสั่งซื้อ
                  </Link>
                </MenuItem>,
                <MenuItem onClick={handleLogout}>ออกจากระบบ</MenuItem>,
              ]}
        </Menu>
      </AppBar>
    </>
  );
}
