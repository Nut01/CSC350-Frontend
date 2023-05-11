import React, { useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Divider,
  Modal,
} from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import { useLocation } from "react-router-dom";
import useAxios from "../../lib/useAxios";
import { bufferToBlobUrl } from "../../lib/toImage";
import { useNavigate } from "react-router-dom";

export default function Receipt() {
  const Navigate = useNavigate();
  
  const location = useLocation();
  const id = location.state.id;
  const prdName = location.state.name;
  const weight = location.state.weight;
  const prdImage = location.state.image;
  const price = location.state.price;

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [name, setName] = React.useState("");
  const [tel, setTel] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [image, setImage] = React.useState(null);

  // total price
  const [total, setTotal] = React.useState(0);

  useEffect(() => {
    setTotal(weight * price);
  }, [weight]);

  const handleGetProduct = async () => {
    const formData = new FormData();
    formData.append("username", name);
    formData.append("product_id", id);
    formData.append("amount", weight);
    formData.append("net_price", total);
    formData.append("name", prdName);
    formData.append("tel", tel);
    formData.append("address", address);
    formData.append("pay_image", image);
    try {
      const res = await useAxios.post(`/history`, formData);
      console.log(res.data);
      alert("สั่งซื้อสินค้าสำเร็จ");
      Navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpload = (newImage, info) => {
    setImage(newImage);
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
            margin: 6,
            padding: 6,
            width: "80%",
            height: "79vh",
            boxShadow: "2px 5px 10px 5px rgba(0, 0, 0, 0.4)",
            borderRadius: "10px",
          }}
        >
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid xs={7}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <img width="50%" src={bufferToBlobUrl(prdImage)} />
                <Box>
                  <h2>{prdName}</h2>
                  <Typography>#{id}</Typography>
                </Box>
              </Box>

              <Box sx={{ marginTop: 5, padding: 4 }}>
                <Grid container>
                  <Grid
                    xs={4}
                    sx={{ display: "flex", justifyContent: "space-evenly" }}
                  >
                    <h4 style={{ color: "grey" }}>น้ำหนักสินค้า</h4>
                  </Grid>
                  <Grid
                    xs={4}
                    sx={{ display: "flex", justifyContent: "space-evenly" }}
                  >
                    <h4 style={{ color: "grey" }}>ราคาต่อกรัม</h4>
                  </Grid>
                  <Grid
                    xs={4}
                    sx={{ display: "flex", justifyContent: "space-evenly" }}
                  >
                    <h4 style={{ color: "grey" }}>ราคารวม</h4>
                  </Grid>
                </Grid>

                <Grid container mt={8}>
                  <Grid
                    xs={4}
                    sx={{ display: "flex", justifyContent: "space-evenly" }}
                  >
                    <Typography>{weight} กรัม</Typography>
                  </Grid>
                  <Grid
                    xs={4}
                    sx={{ display: "flex", justifyContent: "space-evenly" }}
                  >
                    <Typography>{price}</Typography>
                  </Grid>
                  <Grid
                    xs={4}
                    sx={{ display: "flex", justifyContent: "space-evenly" }}
                  >
                    <Typography>{total}</Typography>
                  </Grid>
                </Grid>

                <Grid container mt={10}>
                  <Grid
                    xs={8}
                    sx={{ display: "flex", justifyContent: "space-evenly" }}
                  >
                    <h2>จำนวนที่ต้องชำระ</h2>
                  </Grid>

                  <Grid
                    xs={4}
                    sx={{ display: "flex", justifyContent: "space-evenly" }}
                  >
                    <h2>{total} บาท</h2>
                    <Button variant="outlined" onClick={handleOpen}>
                      ชำระ
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid xs={1}>
              <Divider orientation="vertical" sx={{ marginRight: 5 }} />
            </Grid>
            <Grid xs={4}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "520px",
                }}
              >
                <h2>ข้อมูลสำหรับการจัดส่งสินค้า</h2>
                <TextField
                  label="ชื่อผู้รับ"
                  variant="outlined"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <TextField
                  label="เบอร์โทรศัพท์"
                  variant="outlined"
                  onChange={(e) => {
                    setTel(e.target.value);
                  }}
                />
                <TextField
                  label="ที่อยู่จัดส่ง"
                  multiline
                  rows={4}
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                />
                <Typography>หลักฐานการโอนเงิน</Typography>
                <MuiFileInput
                  placeholder="เลือกหลักฐานการโอนเงิน"
                  value={image}
                  onChange={handleUpload}
                />

                <Button
                  variant="outlined"
                  onClick={(e) => {
                    handleGetProduct();
                  }}
                  disabled={
                    name === "" ||
                    tel === "" ||
                    address === "" ||
                    image === null
                  }
                >
                  ยืนยันการสั่งซื้อ
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
          }}
        >
          <img
            width={400}
            src="https://kontueleks.com/wp-content/uploads/2021/01/004999005973770_20210117_190054.jpeg"
          />
        </Box>
      </Modal>
    </>
  );
}
