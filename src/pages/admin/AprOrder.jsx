import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Modal, TextField, Button, ButtonGroup } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect } from "react";
import useAxios from "../../lib/useAxios";
import { bufferToBlobUrl } from "../../lib/toImage";
import { useNavigate } from "react-router-dom";

export default function ApproveOrder() {
  const Navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [openGift, setOpenGift] = React.useState(false);
  const [prdTrack, setPrdTrack] = React.useState("");
  const [giftTrack, setGiftTrack] = React.useState("");
  
  // open modal with product id
  const handleOpen = (id) => {
    setOpen(true);
    fetchTheProduct(id);
  };

  const handleOpenGift = (id) => {
    setOpenGift(true);
    fetchTheGift(id);
  };

  const [theProduct, setTheProduct] = React.useState([]);
  const [theGift, setTheGift] = React.useState([]);

  const fetchTheProduct = async (id) => {
    try {
      const res = await useAxios.get(`/history/${id}`);
      setTheProduct(res.data);
      // console.log("fetch image", res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchTheGift = async (id) => {
    try {
      const res = await useAxios.get(`/giftHistory/${id}`);
      setTheGift(res.data);
      // console.log("fetch image", res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleClose = () => setOpen(false);
  const handleClose2 = () => setOpenGift(false);

  const [prdType, setPrdType] = React.useState(true);
  const normalType = () => {
    setPrdType(true);
  };
  const exchangeType = () => {
    setPrdType(false);
  };

  // update only tracking number
  const handlePrdUpdate = async (id) => {
    try {
      const res = await useAxios.put(`/history/${id}`, {
        tracking_number: prdTrack,
      });
      alert("อัพเดทเลขพัสดุเรียบร้อย");
      window.location.reload();;
      console.log("update", res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleGiftUpdate = async (id) => {
    try {
      const res = await useAxios.put(`/giftHistory/${id}`, {
        tracking_number: giftTrack,
      });
      alert("อัพเดทเลขพัสดุเรียบร้อย");
      window.location.reload();;
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const [giftHitory, setGiftHistory] = React.useState([]);
  const [history, setHistory] = React.useState([]);

  useEffect(() => {
    fetchGiftHis();
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await useAxios.get(`/history`);
      setHistory(res.data.reverse());
      // console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchGiftHis = async () => {
    try {
      const res = await useAxios.get(`/giftHistory`);
      setGiftHistory(res.data.reverse());
      // console.log("History", res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const columnsHistory = [
    { field: "id", headerName: "รหัสคำสั่งซื้อ", width: 200 },
    { field: "username", headerName: "ชื่อผู้สั่งซื้อ", width: 210 },
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
    { field: "tracking_number", headerName: "เลขพัสดุ", width: 200 },
  ];

  const columnsGift = [
    { field: "id", headerName: "รหัสคำสั่งซื้อ", width: 200 },
    { field: "username", headerName: "ชื่อผู้สั่งซื้อ", width: 250 },
    { field: "tel", headerName: "เบอร์โทรศัพท์", width: 250 },
    { field: "address", headerName: "ที่อยู่", width: 250 },
    { field: "tracking_number", headerName: "เลขพัสดุ", width: 250 },
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "80%",
            margin: "6px 25px 0 0",
          }}
        >
          <h1 style={{ marginRight: 155 }}></h1>
          <h1>อนุมัติการสั่งซื้อสินค้า</h1>
          <ButtonGroup variant="outlined">
            <Button onClick={normalType}>ทั่วไป</Button>
            <Button onClick={exchangeType}>แลกแต้ม</Button>
          </ButtonGroup>
        </Box>
        <Box
          sx={{
            height: "70vh",
            width: "80%",
            marginTop: 5,
          }}
        >
          {prdType ? (
            <DataGrid
              onRowClick={(e) => {
                handleOpen(e.row.id);
              }}
              rows={history}
              columns={columnsHistory}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5]}
              components={{
                NoRowsOverlay: () => {
                  return (
                    <center
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      ไม่มีข้อมูล
                    </center>
                  );
                },
              }}
            />
          ) : (
            <DataGrid
              onRowClick={(e) => {
                handleOpenGift(e.row.id);
              }}
              rows={giftHitory}
              columns={columnsGift}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5]}
              components={{
                NoRowsOverlay: () => {
                  return (
                    <center
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      ไม่มีข้อมูล
                    </center>
                  );
                },
              }}
            />
          )}
        </Box>

        {/* Modal with product id */}
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
              width: 450,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h2 style={{ marginBottom: "30px" }}>
              ตรวจสอบการโอน - กรอกเลขพัสดุ
            </h2>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                width={300}
                src={
                  theProduct.pay_image != null
                    ? bufferToBlobUrl(theProduct.pay_image)
                    : ""
                }
              />
            </Box>

            <TextField
              id="tracking_number"
              label="กรอกเลขพัสดุ"
              variant="outlined"
              sx={{ marginTop: 2 }}
              onChange={(e) => setPrdTrack(e.target.value)}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
              }}
            >
              <Button
                onClick={handleClose2}
                sx={{ marginTop: 2, color: "red" }}
              >
                ยกเลิก
              </Button>
              <Button
                sx={{ marginTop: 2 }}
                onClick={() => {
                  handlePrdUpdate(theProduct.id);
                  handleClose();
                }}
              >
                ยืนยัน
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Modal Gift */}
        <Modal open={openGift} onClose={handleClose2}>
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
              width: 450,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h2 style={{ marginBottom: "30px" }}>กรอกเลขพัสดุ</h2>

            <TextField
              id="tracking_number"
              label="กรอกเลขพัสดุ"
              variant="outlined"
              sx={{ marginTop: 2 }}
              onChange={(e) => setGiftTrack(e.target.value)}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
              }}
            >
              <Button onClick={handleClose} sx={{ marginTop: 2, color: "red" }}>
                ยกเลิก
              </Button>
              <Button
                sx={{ marginTop: 2 }}
                onClick={() => {
                  handleGiftUpdate(theGift.id);
                  handleClose();
                }}
              >
                ยืนยัน
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </>
  );
}
