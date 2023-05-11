import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
  ButtonGroup,
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
import AddProduct from "./AddProduct";
import { useEffect } from "react";
import useAxios from "../../lib/useAxios";
import { useNavigate } from "react-router-dom";
import { bufferToBlobUrl } from "../../lib/toImage";

export default function AdHome() {
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
      const res = await useAxios.get(`/product`);
      setProduct(res.data);
      // console.log("Product", res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchGift = async () => {
    try {
      const res = await useAxios.get(`/gift`);
      setGift(res.data);
      // console.log("Gift", res.data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "30px 25px 0 0",
        }}
      >
        <ButtonGroup variant="outlined">
          <Button onClick={normalType}>ทั่วไป</Button>
          <Button onClick={exchangeType}>แลกแต้ม</Button>
        </ButtonGroup>
        <AddProduct />
      </Box>

      <Box sx={{ margin: 6 }}>
        <Grid container spacing={4}>
          {prdType
            ? product.map((item) => {
                return <ProductCard item={item} prdType={prdType} />;
              })
            : gift.map((item) => {
                return <ProductCard item={item} prdType={prdType} />;
              })}
        </Grid>
      </Box>
    </>
  );
}

function ProductCard({ item, prdType }) {
  const Navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const handleOpen = (id) => setOpen(true);
  const handleClose = () => setOpen(false);

  const [giftOpen, setGiftOpen] = React.useState(false);
  const handleGiftOpen = (id) => setGiftOpen(true);
  const handleGiftClose = () => setGiftOpen(false);

  const [type, setType] = React.useState(false);
  const handleChange = (event) => {
    setType(event.target.value);
  };

  const handlePrdDelete = async (id) => {
    console.log(id);
    try {
      const res = await useAxios.delete(`/product/${id}`);
      console.log(res);
      alert("ลบสินค้าเรียบร้อย");
      navigate(0);
    } catch (e) {
      console.log(e);
    }
  };

  const handleGiftDelete = async (id) => {
    console.log(id);
    try {
      const res = await useAxios.delete(`/gift/${id}`);
      console.log(res);
      alert("ลบของขวัญเรียบร้อย");
      navigate(0);
    } catch (e) {
      console.log(e);
    }
  };

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [image, setImage] = React.useState(null);
  const [price, setPrice] = React.useState("");
  const [point, setPoint] = React.useState("");

  const handlePrdEdit = async (id) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);
    try {
      const res = await useAxios.put(`/product/${id}`, formData);
      console.log(res);
      alert("แก้ไขสินค้าเรียบร้อย");
      navigate(0);
    } catch (e) {
      console.log(e);
    }
  };

  const handleGiftEdit = async (id) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("point", point);
    formData.append("image", image);
    try {
      const res = await useAxios.put(`/gift/${id}`, formData);
      console.log(res);
      alert("แก้ไขของขวัญเรียบร้อย");
      navigate(0);
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpload = (newImage, info) => {
    setImage(newImage);
  };

  return (
    <>
      <Grid item xs={3} key={item.id}>
        <Card sx={{ maxWidth: 345 }}>
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
                  {prdType
                    ? item.price
                    : !prdType
                    ? item.point
                    : alert("เกิดข้อผิดพลาด")}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
            </CardContent>
            <Box
              m={2}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "end",
              }}
            >
              <Button
                onClick={() => {
                  prdType
                    ? handleOpen(item.id)
                    : !prdType
                    ? handleGiftOpen(item.id)
                    : alert("เกิดข้อผิดพลาด");
                }}
              >
                แก้ไข
              </Button>
              <Button
                sx={{ color: "red" }}
                onClick={() => {
                  prdType
                    ? handlePrdDelete(item.id)
                    : !prdType
                    ? handleGiftDelete(item.id)
                    : alert("เกิดข้อผิดพลาด");
                }}
              >
                ลบสินค้า
              </Button>
            </Box>
          </CardActionArea>
        </Card>
      </Grid>

      {/* Modal Product */}
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
          <Typography variant="h5">แก้ไขข้อมูลของสินค้า</Typography>
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
              defaultValue={item.name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <TextField
              id="description"
              label="คำอธิบายสินค้า"
              multiline
              rows={4}
              fullWidth
              defaultValue={item.description}
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
                  <InputAdornment position="end">บาทต่อกรัม</InputAdornment>
                }
                aria-describedby="outlined-weight-helper-text"
                inputProps={{
                  "aria-label": "weight",
                }}
                defaultValue={item.price}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              />
              <FormHelperText id="outlined-weight-helper-text">
                ราคา / กรัม
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
              onClick={(e) => {
                handlePrdEdit(item.id);
              }}
            >
              ตกลง
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal Gift */}
      <Modal open={giftOpen} onClose={handleGiftClose}>
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
          <Typography variant="h5">แก้ไขข้อมูลของสินค้าแลกแต้ม</Typography>
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
              defaultValue={item.name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <TextField
              id="description"
              label="คำอธิบายสินค้า"
              multiline
              rows={4}
              fullWidth
              defaultValue={item.description}
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
                defaultValue={item.point}
                id="price"
                endAdornment={
                  <InputAdornment position="end">แต้ม</InputAdornment>
                }
                aria-describedby="outlined-weight-helper-text"
                inputProps={{
                  "aria-label": "weight",
                }}
                onChange={(e) => {
                  setPoint(e.target.value);
                }}
              />
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
              onClick={(e) => {
                handleGiftEdit(item.id);
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
