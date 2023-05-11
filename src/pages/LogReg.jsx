import * as React from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import {isAxiosError} from 'https://cdn.jsdelivr.net/npm/axios@1.4.0/+esm'
import useAxios from "../lib/useAxios";
import { useNavigate } from "react-router-dom";

export default function LogReg() {
  const navigate = useNavigate();

  // Login
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Register
  const [usernameReg, setUsernameReg] = React.useState("");
  const [passwordReg, setPasswordReg] = React.useState("");
  const [conpasswordReg, setConpasswordReg] = React.useState("");
  const [file, setFile] = React.useState();

  const handleLogin = async () => {
    try {
      // console.log(username, password);
      const res = await useAxios.post("/user/login", {
        username: username,
        password: password,
      });
      alert("เข้าสู่ระบบสำเร็จ");
      localStorage.setItem("user", JSON.stringify(res.data));
      // console.log(res.data);
      navigate("/");
    } catch (e) {
      if (isAxiosError(e)) {
        const status = e.response.status;
        if (status === 401) {
          alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        } else if (status === 400) {
          alert("ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง");
        } else {
          alert("เกิดข้อผิดพลาดบางอย่าง");
        }
      }
    }
  };

  const handleRegister = async () => {
    const formData = new FormData();
    formData.append("username", usernameReg);
    formData.append("password", passwordReg);
    formData.append("image", file);
    try {
      const res = await useAxios.post("/user", formData);
      // console.log("ResData", res.data);
      alert("สมัครสมาชิกสำเร็จ");
      window.location.reload();;
    } catch (e) {
      if (isAxiosError(e)) {
        const status = e.response.status;
        if (status === 400) {
          alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        } else if (status === 401) {
          alert("ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง");
        } else {
          alert("เกิดข้อผิดพลาดบางอย่าง");
        }
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            margin: 10,
            padding: 6,
            width: "65%",
            height: "70vh",
            boxShadow: "2px 5px 10px 5px rgba(0, 0, 0, 0.4)",
            borderRadius: "10px",
          }}
        >
          <Grid container>
            {/* Login */}
            <Grid xs={5}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <h2>เข้าสู่ระบบ</h2>
              </Box>
              <Box
                sx={{
                  marginTop: 4,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                  height: "350px",
                }}
              >
                <TextField
                  required
                  id="username"
                  label="ชื่อผู้ใช้งาน"
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
                <TextField
                  required
                  id="password"
                  label="รหัสผ่าน"
                  type="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <Button variant="contained" onClick={handleLogin}>
                  เข้าสู่ระบบ
                </Button>
              </Box>
            </Grid>

            {/* Divider */}
            <Grid xs={1}>
              <Divider orientation="vertical" sx={{ height: "470px" }} />
            </Grid>
            <Grid xs={1}></Grid>

            {/* Register */}
            <Grid xs={5}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <h2>สมัครสมาชิก</h2>
              </Box>
              <Box
                sx={{
                  marginTop: 4,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                  height: "400px",
                }}
              >
                <TextField
                  required
                  id="username"
                  label="ชื่อผู้ใช้งาน"
                  onChange={(e) => {
                    setUsernameReg(e.target.value);
                  }}
                />
                <TextField
                  id="password"
                  label="รหัสผ่าน"
                  type="password"
                  onChange={(e) => {
                    setPasswordReg(e.target.value);
                  }}
                />
                <TextField
                  id="conpassword"
                  label="ยืนยันรหัสผ่าน"
                  type="password"
                  onChange={(e) => {
                    setConpasswordReg(e.target.value);
                  }}
                />
                <Typography>อัปโหลดรูปบัตรประชาชน :</Typography>
                <TextField
                  id="cid"
                  type="file"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                  }}
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    if (passwordReg === conpasswordReg) {
                      handleRegister();
                    } else {
                      alert("รหัสผ่านไม่ตรงกัน");
                    }
                  }}
                  disabled={
                    usernameReg === "" ||
                    passwordReg === "" ||
                    conpasswordReg === "" ||
                    file === undefined
                  }
                >
                  สมัคร
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
