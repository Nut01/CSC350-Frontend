import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
  Grid,
  ButtonGroup,
  Button,
  Modal,
  FormControl,
  FormHelperText,
  InputAdornment,
  Input,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useAxios from "../../lib/useAxios";
import { bufferToBlobUrl } from "../../lib/toImage";

export default function UserHome() {
  const [prdType, setPrdType] = React.useState(true);
  const normalType = () => {
    setPrdType(true);
  };
  const exchangeType = () => {
    setPrdType(false);
  };

  const [product, setProduct] = React.useState([]);
  const [gift, setGift] = React.useState([]);

  useEffect(() => {
    fetchProduct();
    fetchGift();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await useAxios.get(`/gift`);
      setProduct(res.data);
      // console.log("Product", res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchGift = async () => {
    try {
      const res = await useAxios.get(`/product`);
      setGift(res.data);
      // console.log("Gift", res.data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Box width={"100%"} height={"600px"}>
        <img
          width={"100%"}
          height={"100%"}
          src="https://images.ctfassets.net/zkw0qlnf0vqv/psycom_page_fid33047_asset_33040/1ea60296edb30f6055b7d809e16177e9/marijuana_cannabis_leaf_background"
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "20px 25px 0 0",
        }}
      >
        <ButtonGroup variant="outlined">
          <Button onClick={normalType}>ทั่วไป</Button>
          <Button onClick={exchangeType}>แลกแต้ม</Button>
        </ButtonGroup>
      </Box>

      <Box sx={{ margin: 6 }}>
        <Grid container spacing={4}>
          {prdType
            ? gift.map((item) => {
                return <ProductCard item={item} prdType={prdType} />;
              })
            : product.map((item) => {
                return <ProductCard item={item} prdType={prdType} />;
              })}
        </Grid>
      </Box>
    </>
  );
}

function ProductCard({ item, prdType }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const Navigate = useNavigate();

  const handleClick = () => {
    if (user) {
      if (user.role === 1) {
        handleOpen();
      }
    } else {
      alert("กรุณาเข้าสู่ระบบ");
      Navigate("/logreg");
    }
  };

  const [username, setUsername] = React.useState("");
  const [tel, setTel] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [weight, setWeight] = React.useState("0");

  // useEffect(() => {
  //   console.log(username, tel, address, weight);
  // }, [username, tel, address, weight]);

  const handleGetGift = async () => {
    try {
      const res = await useAxios.post(`/giftHistory`, {
        username: username,
        gift_id: item.id,
        amount: item.point,
        net_point: item.point,
        name: item.name,
        tel: tel,
        address: address,
      });
      console.log(res.data);
      alert("แลกของขวัญสำเร็จ");
      Navigate(0);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Grid item xs={3} key={item.id}>
        <Card sx={{ maxWidth: 345 }} onClick={handleClick}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image={bufferToBlobUrl(item.image)}
            />
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Typography gutterBottom variant="h5">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.price ? item.price : item.point}
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>

      {/* Product and Gift Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {prdType ? (
          // If Product
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
            <Typography variant="h5">เลือกน้ำหนักของสินค้า</Typography>
            <Box
              sx={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <FormControl
                variant="standard"
                sx={{ m: 1, mt: 3, width: "25ch" }}
              >
                <Input
                  id="standard-adornment-weight"
                  defaultValue={"0"}
                  endAdornment={
                    <InputAdornment position="end">กรัม</InputAdornment>
                  }
                  aria-describedby="standard-weight-helper-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                  onChange={(e) => {
                    setWeight(e.target.value);
                  }}
                />
                <FormHelperText id="standard-weight-helper-text">
                  น้ำหนัก
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
              <Link
                to="/Receipt"
                state={{
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  weight: weight,
                }}
              >
                <Button>ตกลง</Button>
              </Link>
            </Box>
          </Box>
        ) : (
          // If Gift
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              height: 500,
              borderRadius: "10px",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <h2>ข้อมูลสำหรับการจัดส่งสินค้า</h2>
            <TextField
              id=""
              label="ชื่อผู้รับ"
              variant="outlined"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <TextField
              id=""
              label="เบอร์โทรศัพท์"
              variant="outlined"
              onChange={(e) => {
                setTel(e.target.value);
              }}
            />
            <TextField
              id=""
              label="ที่อยู่จัดส่ง"
              multiline
              rows={4}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />

            <Button
              variant="outlined"
              onClick={(e) => {
                handleGetGift();
              }}
            >
              ยืนยันการสั่งซื้อ
            </Button>
          </Box>
        )}
      </Modal>
    </>
  );
}
