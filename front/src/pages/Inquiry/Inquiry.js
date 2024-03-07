import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
} from "@material-ui/core";
import * as React from "react";
import { Link } from "react-router-dom";
import ReportHeader from "../Report/ReportHeader";
import { HttpGet, HttpPost } from "../../services/HttpService";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import LockIcon from '@mui/icons-material/Lock'; // Lock 아이콘 임포트

const Inquiry = () => {
  const [data, setData] = React.useState({
    totalPages: 0,
    totalElements: 0,
    size: 0,
    content: [],
    number: 0,
  });

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { getUserId, getUserName, isLogin } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchData(page, rowsPerPage);
  }, [page, rowsPerPage]);

  React.useEffect(() => {
    console.log("Data received:", data);
  }, [data]);

  // 신고 리스트 API GET
  const fetchData = async (currentPage, pageSize) => {
    try {
      const response = await HttpGet(
        `/api/v1/inquiry/list`,
        {
          page: currentPage,
          pageSize: pageSize,
        }
      );


      console.log("전송확인");
      console.log("fetch data 확인", response);
      setData(response);
    } catch (error) {
      console.error("Error fetching data:", error);

    }
  };

  const getStatusColor = (isCompleted) => {
    return isCompleted ? "#008000" : "#FFA500";
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }

    const formattedDate = new Date(dateString);
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
    const day = String(formattedDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setPage(0);
    setRowsPerPage(newRowsPerPage);
  };

  return (
    <Box mt={4} mb={4}>
      <ReportHeader
        headerTitle={"1대1 문의하기"}
        headerDescription={"1대1 문의 게시판입니다."}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>글 번호</TableCell>
              <TableCell>상태 </TableCell>
              <TableCell>문의 유형</TableCell>
              <TableCell>글 제목</TableCell>
              <TableCell>작성자</TableCell>
              <TableCell>등록 일시</TableCell>
              <TableCell>조회수</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.content.map((row) => (
              <TableRow
                key={row.id}
                style={{
                  textDecoration: "none",
                }}
                onClick={(e) => {
                  // 조건 검사 로직
                  console.log("공개여부:", row.isPublished);

                  if (row.isPublished == false && getUserName() !== "admin" && getUserName() !== row.writer) {
                    alert("작성자와 관리자만 볼 수 있습니다");
                    console.log("현재 사용자:", getUserName());
                    console.log("글 작성자:", row.writer);
                  } else {
                    // 조건이 충족될 때만 이동
                    navigate(`/inquiry/${row.id}`);
                  }
                }}
              >
                <TableCell>{row.id}</TableCell>
                <TableCell
                  style={{
                    color: row.inquiryState === "답변완료" ? "blue" : row.inquiryState === "답변대기" ? "red" : "black",
                  }}
                >{row.inquiryState}</TableCell>
                <TableCell>{row.inquiryType}</TableCell>
                <TableCell>
                  {row.title}
                  {!row.isPublished && <LockIcon fontSize="small" style={{ verticalAlign: "middle", marginRight: 5 }} />}
                </TableCell>
                <TableCell>{row.writer}</TableCell>
                <TableCell>{formatDate(row.createdDate)}</TableCell>
                <TableCell>{row.viewCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>

        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={data.totalElements}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        {isLogin()?(
          <Button
          variant="contained"
          color="primary"
          size="medium"
          sx={{ marginLeft: "auto" }}
          href="/inquiry/form"
        >
          새 글쓰기
        </Button>

        ):null}
      </Box>
    </Box>
  );
};

export default Inquiry;