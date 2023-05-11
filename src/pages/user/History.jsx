import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Modal,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect } from "react";
import useAxios from "../../lib/useAxios";
import { useNavigate } from "react-router-dom";
import { bufferToBlobUrl } from "../../lib/toImage";

export default function History() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [theHistory, setTheHistory] = React.useState([]);
  const [theGift, setTheGift] = React.useState([]);

  useEffect(() => {
    fetchHistory();
    fetchTheGift();
    console.log(history);
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await useAxios.get(`/history`);
      setTheHistory(res.data);
      console.log(res.data.reverse());
    } catch (e) {
      console.log(e);
    }
  };

  const fetchTheGift = async (id) => {
    try {
      const res = await useAxios.get(`/giftHistory`);
      setTheGift(res.data.reverse());
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const columns = [
    { field: "id", headerName: "รหัสคำสั่งซื้อ", width: 200 },
    { field: "name", headerName: "ชื่อสินค้า", width: 210 },
    { field: "tel", headerName: "เบอร์โทรศัพท์", width: 200 },
    { field: "address", headerName: "ที่อยู่", width: 215 },
    {
      field: "pay_image",
      headerName: "หลักฐานการชำระเงิน",
      width: 200,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {params.value != null ? (
              <CheckIcon />
            ) : (
              <ClearIcon style={{ color: "red" }} />
            )}
          </Box>
        );
      },
    },
    { field: "trackNum", headerName: "เลขพัสดุ", width: 200 },
  ];

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 5,
        }}
      >
        <h1>ประวัติการสั่งซื้อ</h1>
        <Box
          sx={{
            height: "70vh",
            width: "80%",
            marginTop: 5,
          }}
        >
          <DataGrid
            onRowClick={(e) => {
              handleOpen();
            }}
            rows={[theHistory, theGift].flat(1 || [])}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
          />
        </Box>

        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              padding: 4,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "#fff",
              borderRadius: "10px",
              boxShadow: 24,
              width: "80%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
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
                  <img
                    width="50%"
                    src="https://cdn.pixabay.com/photo/2017/07/28/14/23/macarons-2548810_960_720.jpg"
                  />
                  <Box>
                    <h2>ชื่อสินค้า</h2>
                    <Typography>เลขรหัสสินค้า</Typography>
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
                      <Typography>300 กรัม</Typography>
                    </Grid>
                    <Grid
                      xs={4}
                      sx={{ display: "flex", justifyContent: "space-evenly" }}
                    >
                      <Typography>500</Typography>
                    </Grid>
                    <Grid
                      xs={4}
                      sx={{ display: "flex", justifyContent: "space-evenly" }}
                    >
                      <Typography>1500</Typography>
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
                      <h2>1500 บาท</h2>
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
                    marginTop: 5,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "350px",
                  }}
                >
                  <h2>ข้อมูลสำหรับการจัดส่งสินค้า</h2>
                  <TextField id="" label="ชื่อผู้รับ" variant="outlined" />
                  <TextField id="" label="เบอร์โทรศัพท์" variant="outlined" />
                  <TextField id="" label="ที่อยู่จัดส่ง" multiline rows={4} />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      </Box>
    </>
  );
}
