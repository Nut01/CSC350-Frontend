import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Modal, Button } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect } from "react";
import useAxios from "../../lib/useAxios";
import {bufferToBlobUrl } from "../../lib/toImage";
import { useNavigate } from "react-router-dom";

export default function ApproveMember() {
  const Navigate = useNavigate();
  
  const [open, setOpen] = React.useState(false);
  const handleOpen = (username) => {
    setOpen(true);
    fetchUser(username);
  };
  const handleClose = () => setOpen(false);

  const [pending, setPending] = React.useState([]);
  const [user, setUser] = React.useState([]);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await useAxios.get(`/user/pending`);
      setPending(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchUser = async (username) => {
    try {
      const res = await useAxios.get(`/user/${username}`);
      setUser(res.data);
      console.log(user);
    } catch (e) {
      console.log(e);
    }
  };

  const columns = [
    { field: "username", headerName: "ชื่อผู้ใช้งาน", width: 620 },
    {
      field: "role",
      headerName: "รูปบัตรประชาชน",
      width: 600,
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
  ];

  const handleComfirm = async (username) => {
    try {
      const res = await useAxios.put(`/user/${username}`, {
        role: 1,
      });
      alert("อนุมัติการสมัครสมาชิกเรียบร้อย");
      navigate(0);
    } catch (e) {
      console.log(e);
    }
  };

  const handleReject = async (username) => {
    try {
      const res = await useAxios.delete(`/user/${username}`);
      alert("ปฏิเสธการสมัครสมาชิกเรียบร้อย");
      navigate(0);
    } catch (e) {
      console.log(e);
    }
  };

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
        <h1>อนุมัติการสมัครสมาชิก</h1>
        <Box
          sx={{
            height: "70vh",
            width: "80%",
            marginTop: 5,
          }}
        >
          <DataGrid
            onRowClick={(row) => handleOpen(row.row.username)}
            rows={pending}
            getRowId={(row) => row.username}
            columns={columns}
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
                return <center style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}>ไม่มีข้อมูล</center>;
              }
            }}
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
              width: "40%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h2 style={{ marginBottom: "30px" }}>บัตรประชาชน</h2>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                width={400}
                src={
                  user.cid_image != null ? bufferToBlobUrl(user.cid_image) : ""
                }
              />
            </Box>
            <Box
              sx={{
                marginTop: 4,
                display: "flex",
                justifyContent: "end",
              }}
            >
              <Button
                sx={{ color: "red" }}
                onClick={() => handleReject(user.username)}
              >
                ปฏิเสธการสมัคร
              </Button>
              <Button onClick={() => handleComfirm(user.username)}>
                ยืนยันการสมัคร
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </>
  );
}
