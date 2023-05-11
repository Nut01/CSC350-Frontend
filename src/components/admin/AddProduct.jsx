import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  FormControl,
  InputLabel,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  FormHelperText,
  OutlinedInput,
} from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import axios from "axios";
import useAxios from "../../lib/useAxios";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const Navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [type, setType] = React.useState("");
  const handleChange = (event) => {
    setType(event.target.value);
  };

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [image, setImage] = React.useState();
  const [price, setPrice] = React.useState("");

  useEffect(() => {
    console.log("Detail", name, description, type, image, price);
  }, [name, description, type, image, price]);

  const handleAddProduct = async () => {
    const formData = new FormData();
    console.log(type);
    try {
      if (type === 1) {
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("image", image);
        console.log(formData);
        const res = await useAxios.post("/product", formData);
        console.log(res.data);
        alert("เพิ่มสินค้าสำเร็จ");
        navigate(0);
      } else if (type === 2) {
        formData.append("name", name);
        formData.append("description", description);
        formData.append("point", price);
        formData.append("image", image);
        const res = await useAxios.post("/gift", formData);
        console.log(res.data);
        alert("เพิ่มสินค้าสำเร็จ");
        navigate(0);
      } else alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const status = e.response.status;
        if (status === 401) {
          alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        } else if (status === 500) {
          alert("เกิดข้อผิดพลาดบางอย่าง!");
        }
      } else {
        alert("เกิดข้อผิดพลาดบางอย่าง");
      }
    }
  };

  const handleUpload = (newImage, info) => {
    setImage(newImage);
  };

  return (
    <>
      <Button
        sx={{ marginLeft: "20px" }}
        variant="contained"
        onClick={() => {
          handleOpen();
        }}
      >
        เพิ่มสินค้า
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            borderRadius: "10px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h5">ข้อมูลของสินค้า</Typography>
          <Box
            sx={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <TextField
              id="name"
              label="ชื่อสินค้า"
              variant="outlined"
              fullWidth
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <FormControl fullWidth>
              <InputLabel>ประเภทสินค้า</InputLabel>
              <Select
                id="type"
                value={type}
                label="ประเภทสินค้า"
                onChange={handleChange}
              >
                <MenuItem value={1}>สินค้าทั่วไป</MenuItem>
                <MenuItem value={2}>สินค้าแลกแต้ม</MenuItem>
              </Select>
            </FormControl>
            <TextField
              id="description"
              label="คำอธิบายสินค้า"
              multiline
              rows={4}
              fullWidth
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <MuiFileInput
              placeholder="เลือกรูปภาพสินค้า"
              value={image}
              onChange={handleUpload}
            />
            <FormControl variant="outlined" fullWidth>
              <OutlinedInput
                id="price"
                endAdornment={
                  <InputAdornment position="end">
                    { type === 1 ? "บาท" : "แต้ม" }
                  </InputAdornment>
                }
                aria-describedby="outlined-weight-helper-text"
                inputProps={{
                  "aria-label": "weight",
                }}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              />
              <FormHelperText id="outlined-weight-helper-text">
                { type === 1 ? "ราคาสินค้า" : "แต้มที่ใช้แลกสินค้า" }
              </FormHelperText>
            </FormControl>
          </Box>

          <Box
            sx={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={() => {
                handleAddProduct();
              }}
            >
              ตกลง
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
