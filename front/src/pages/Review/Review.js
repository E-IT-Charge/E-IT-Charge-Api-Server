import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Button } from '@material-ui/core';
import Rating from '@mui/material/Rating';
import { useAuth } from "../../utils/AuthContext";
import { HttpGet, HttpPost, HttpDelete, HttpPut } from '../../services/HttpService';  // 유틸리티 파일 경로를 업데이트하세요


const Review = ({ chargingStationId }) => {
  //접속자 userName
  const { getUserName } = useAuth();
  //리뷰 가져오기
  const [review, setReview] = useState({ data: { items: [] } });
  const fetchData = async () => {
    try {
      const response = await HttpGet(`api/v1/review/${chargingStationId}`);
      setReview(response || { data: { items: [] } });
    } catch (error) {
      console.error("데이터를 불러오는 중 오류 발생:", error);
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);
  const handleUpdate = async (reviewId) => {
    if (!editedReviewContent || !editedReviewContent.trim()) {
      alert("후기 내용을 입력해주세요.");
      return;
    }

    try {
      await HttpPut(`api/v1/review/${chargingStationId}/${reviewId}`, {
        content: editedReviewContent,
        rating: editedReviewRating,
      });

      console.log("후기 수정 성공");
      fetchData();
      setIsEditing(false);
      setEditReviewId(null);
      setEditedReviewContent('');
    } catch (error) {
      console.error("후기를 수정하는 중 오류 발생:", error);
    }
  };
  const handleDelete = async (reviewId, loginUserName, reviewUserName) => {
    if (!window.confirm('삭제하시겠습니까?')) {
      return;
    }
    if (loginUserName == reviewUserName) {
      await HttpDelete(`api/v1/review/${chargingStationId}/${reviewId}`);
      console.log("삭제")

      fetchData();
    }
  };
  const [editedReviewContent, setEditedReviewContent] = useState('');
  const [editedReviewRating, setEditedReviewRating] = useState('');
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditReviewId(null);
    setEditedReviewContent('');
  };
  const handleEdit = (reviewId, content) => {
    setIsEditing(true);
    setEditReviewId(reviewId);
    setEditedReviewContent(content);
  };
  const [newReviewContent, setNewReviewContent] = useState('');
  const { isLogin } = useAuth();
  const handleSubmit = async () => {


    if (!newReviewContent.trim()) {
      alert("후기 내용을 입력해주세요.");
      return;
    }

    if (!isLogin()) {
      alert("로그인 해주세요.");
      return;
    }


    try {
      await HttpPost(`api/v1/review/${chargingStationId}`, {
        content: newReviewContent,
        rating: newReviewRating,
      });

      fetchData();
      setNewReviewContent('');
    } catch (error) {
      console.error("후기를 작성하는 중 오류 발생:", error);
    }
  };

  const [newReviewRating, setNewReviewRating] = React.useState(0); // 평점 state 추가

  useEffect(() => {
    fetchData();
  }, [chargingStationId]);

  return (
    <div>
      <Typography variant="subtitle1" style={{marginTop: "20px"}}>이용후기</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>

            {Array.isArray(review.data.items) && review.data.items.length > 0 ? (
              review.data.items.slice(0, review.data.items.length).map((reviewItem) => (
                <TableRow>
                  <TableCell style={{ width: '100px', paddingLeft: '25px', textAlign: 'center' }}>
                    <div >{reviewItem.userName}</div>
                    {isEditing && editReviewId === reviewItem.id ? (
                      <Rating name="size-small" value={reviewItem.rating} size="small"
                        onChange={(event, newValue) => {
                          setEditedReviewRating(newValue);
                          reviewItem.rating = newValue;
                        }}
                      />
                    ) : (
                      <Rating name="read-only" value={reviewItem.rating} readOnly size="small" />
                    )}
                  </TableCell>
                  <TableCell style={{ width: '500px', wordWrap: 'break-word' }}>
                    {isEditing && editReviewId === reviewItem.id ? (
                      <TextField
                        label="후기 수정"
                        variant="outlined"
                        multiline
                        minRows={1}
                        value={editedReviewContent}
                        onChange={(e) => setEditedReviewContent(e.target.value)}
                        fullWidth
                        size="small"
                      />
                    ) : (
                      reviewItem.content || "내용이 없습니다."
                    )}
                  </TableCell>
                  <TableCell style={{ width: '50px' }}>
                    <div style={{ fontSize: '11px' }}>
                      {new Date(reviewItem.createDate).toLocaleString()}
                    </div>
                    {getUserName() == reviewItem.userName && (
                      <div>
                        {isEditing && editReviewId === reviewItem.id ? (
                          <div style={{ display: 'flex', justifyContent: 'flex-center', width: '100%', marginBottom: '1px' }}>
                            {/* 수정 완료 버튼 */}
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleUpdate(editReviewId)}
                              style={{ fontSize: '12px' }}
                            >
                              완료
                            </Button>
                            {/* 취소 버튼 */}
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={handleCancelEdit}
                              style={{ fontSize: '12px' }}
                            >
                              취소
                            </Button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', justifyContent: 'flex-center', width: '100%', marginBottom: '1px' }}>
                            {/* 수정 버튼 */}
                            <Button
                              variant="contained"
                              onClick={() => handleEdit(reviewItem.id, reviewItem.content)}
                              style={{ fontSize: '12px' }}
                            >
                              수정
                            </Button>
                            {/* 삭제 버튼 */}
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => handleDelete(reviewItem.id, getUserName(), reviewItem.userName)}
                              style={{ fontSize: '12px' }}
                            >
                              삭제
                            </Button>
                          </div>
                        )}
                        <div>
                        </div>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : null}
            <TableRow >
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      <div style={{ height: '10px' }}>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '1px' }}>

        <TextField
          label={Array.isArray(review.data.items) && review.data.items.length === 0
            ? "첫 후기를 작성해 보세요."
            : "후기 작성"
          }
          variant="outlined"
          multiline
          minRows={1}
          value={newReviewContent}
          onChange={(e) => setNewReviewContent(e.target.value)}
          fullWidth
        />
        <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignContent: 'center', width: '160px' }}>
          <div>
            <Rating name="size-small" defaultValue={3} size="small"
              onChange={(event, newValue) => {
                setNewReviewRating(newValue);
              }}
            />
          </div>

          <Button variant="contained" color="primary" onClick={handleSubmit} size="small">
            작성
          </Button>
        </div>
      </div>
    </div>

  );
};

export default Review;
