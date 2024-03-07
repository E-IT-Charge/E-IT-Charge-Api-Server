import { Box, Button, TextField, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HttpDelete, HttpGet, HttpPut } from "../../services/HttpService";
import ErrorPage from "../Error/ErrorPage";
import ReportHeader from "./ReportHeader";

const ReportDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");

  // 신고내역 단건조회 API GET
  async function fetchReportDetail() {
    try {
      const response = await HttpGet(`/api/v1/reports/${id}`);

      setData(response.data);
    } catch (error) {
      console.error("Error fetching report detail:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReportDetail();
  }, [id]);

  useEffect(() => {
    console.log("Data received:", data);
  }, [data]);

  if (loading) {
    return null;
  }

  // 신고 삭제 API DELETE
  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        const response = await HttpDelete(`/api/v1/reports/${id}`);

        if (response.statusCode === 200) {
          alert("신고내역이 성공적으로 삭제되었습니다.");
          console.log("신고내역이 성공적으로 삭제되었습니다.");
          navigate("/report/list");
        } else {
          console.error(`신고 삭제 실패 : ${response.msg}`);
        }
      } catch (error) {
        console.error("신고 삭제 중 오류:", error);
      }
    }
  };

  // 신고 답변 및 완료처리 API PUT
  const handleReplyReport = async () => {
    const isValid = validateReplyInputs();
    if (isValid) {
      const confirmReply = window.confirm(
        `완료처리 이후 신고내역 / 처리결과 수정, 삭제가 불가능합니다.\n신고에 대한 답변 등록 및 완료 처리하시겠습니까?`
      );
      if (confirmReply) {
        try {
          const requestData = {
            reply: reply,
          };

          const response = await HttpPut(
            `/api/v1/reports/${id}/complete`,
            requestData
          );

          if (response.statusCode === 200) {
            console.log("신고내역 처리 완료, 처리답변 등록이 완료되었습니다.");
            alert("신고내역 처리 완료, 처리 답변 등록이 완료되었습니다.");
            await fetchReportDetail();
            navigate(window.location.pathname);
          } else {
            console.error(`신고 처리 실패 : ${response.msg}`);
          }
        } catch (error) {
          console.error("신고 처리 중 오류 :", error);
        }
      }
    }
  };

  // 수정버튼 클릭 시 폼으로 리다이렉트
  const navigateModify = () => {
    navigate(`/report/form`, {
      state: {
        reportType: data.reportType,
        statId: data.statId,
        statNm: data.statNm,
        title: data.title,
        content: data.content,
        id: data.id,
        mode: "MODIFY",
      },
    });
  };

  const handleReplyChange = (event) => {
    const inputValue = event.target.value;
    setReply(inputValue);
  };

  // 입력값 검증
  const validateReplyInputs = () => {
    let isValid = true;
    const newError = {
      reply: "",
    };

    if (reply.trim() === "") {
      newError.reply = "처리 답변을 입력하세요.";
      isValid = false;
    }

    if (reply.length > 200) {
      newError.reply = "처리 답변을 200자 이내로 입력하세요.";
      isValid = false;
    }

    setError(newError);

    if (!isValid) {
      alert("입력값을 확인하세요.");
    }

    return isValid;
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

  return (
    <>
      {!data && (
        <ErrorPage
          errorCode="404 NOT FOUND"
          errorTitle="요청하신 페이지를 찾을 수 없습니다."
          errorDescription="입력하신 주소가 정확한지 확인해주세요."
        />
      )}

      {data && (
        <Box mt={4} mb={4}>
          <ReportHeader
            headerTitle={"신고내역 확인"}
            headerDescription={"충전소 관련 내용을 신고할 수 있습니다."}
            actorCanCreate={data.actorCanCreate}
            actorCanManagerSearch={data.actorCanManagerSearch}
            isEditPage={false}
          />

          <Box alignItems="center" my={2} px={2}>
            <Typography variant="subtitle2">{`[유형] 충전소: [${data.reportType}] ${data.statNm}`}</Typography>
            <Typography variant="subtitle2">{`위치: ${data.addr}`}</Typography>
            <Typography variant="subtitle2">{`신고자: ${data.memberName}`}</Typography>
            <Typography
              variant="subtitle2"
              style={{ marginBottom: "5px" }}
            >{`작성일: ${formatDate(data.createDate)}`}</Typography>
            <Typography
              variant="subtitle1"
              style={{ fontWeight: "bold" }}
            >{`제목: ${data.title}`}</Typography>
          </Box>
          <hr />

          <Box alignItems="center" my={2} px={2} height={200}>
            <Typography
              variant="subtitle2"
              style={{
                paddingLeft: "3px",
                paddingRight: "10px",
                paddingTop: "10px",
              }}
            >
              {data.content}
            </Typography>
          </Box>
          <hr />

          <Box my={2} px={2}>
            <Typography variant="subtitle2">
              {`신고결과: `}
              <span
                style={{
                  color: data.completed ? "#008000" : "#FFA500",
                  fontWeight: "bold",
                }}
              >
                {data.completed ? "처리완료" : "처리중"}
              </span>
            </Typography>

            {/* 유지보수자 신고 처리 결과 입력 */}
            {!data.completed && data.actorCanComplete && (
              <>
                <TextField
                  label="답변"
                  placeholder="처리 후 답변을 입력해주세요.(200자 이내)"
                  helperText={`${reply.length} / 200`}
                  inputProps={{ maxLength: 200 }}
                  rowsMin={6}
                  multiline
                  rows={6}
                  value={reply}
                  onChange={handleReplyChange}
                  style={{ width: "100%", marginTop: "10px" }}
                />
                {error.reply && (
                  <Typography variant="caption" color="error">
                    {error.reply}
                  </Typography>
                )}
              </>
            )}

            {/* 신고 처리 결과 */}
            {data.completed && (
              <Box>
                {data.replierName && (
                  <Typography variant="subtitle2">{`처리자: ${data.replierName}`}</Typography>
                )}
                {data.replyCreatedDate && (
                  <Typography variant="subtitle2">{`처리일: ${formatDate(
                    data.replyCreatedDate
                  )}`}</Typography>
                )}
                {data.reply && (
                  <Typography variant="subtitle2">{`${data.reply}`}</Typography>
                )}
              </Box>
            )}
          </Box>

          {/* 등록, 수정 버튼 */}
          {(data.actorCanEdit || data.actorCanComplete) && (
            <Box
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                marginRight: "20px",
                marginTop: "-30px",
              }}
            >
              {data.actorCanComplete && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleReplyReport}
                  style={{ marginRight: "2px" }}
                >
                  완료 처리하기
                </Button>
              )}
              {data.actorCanEdit && (
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={navigateModify}
                  style={{ marginRight: "2px" }}
                >
                  수정하기
                </Button>
              )}
              {data.actorCanEdit && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleDelete}
                >
                  삭제하기
                </Button>
              )}
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default ReportDetail;
