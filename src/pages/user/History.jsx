import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect } from "react";
import useAxios from "../../lib/useAxios";
import { useNavigate } from "react-router-dom";
import { bufferToBlobUrl } from "../../lib/toImage";

export default function History() {
  const [open, setOpen] = React.useState(false);

  const user = localStorage.getItem("user");
  // get username from user
  const username = JSON.parse(user).username;

  const [theHistory, setTheHistory] = React.useState([]);
  const [theGift, setTheGift] = React.useState([]);

  useEffect(() => {
    fetchHistory();
    fetchTheGift();
    console.log(username);
  }, []);

  // fetch history from username
  const fetchHistory = async () => {
    try {
      const res = await useAxios.get(`/history/query?username=${username}`);
      setTheHistory(res.data.reverse());
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchTheGift = async () => {
    try {
      const res = await useAxios.get(`/giftHistory/query?username=${username}`);
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
    { field: "tracking_number", headerName: "เลขพัสดุ", width: 200 },
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
      </Box>
    </>
  );
}
