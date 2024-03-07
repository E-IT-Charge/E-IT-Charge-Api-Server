import React, { useEffect,useState } from 'react';
import axios from 'axios';
import { HttpGet, HttpPost } from '../../services/HttpService';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@material-ui/core';

const ChargingStationInfo = ({item}) => {
    const[chargingStationData, setChargingStationData] = useState([]);
    useEffect(() => {
      console.log('ChargingStationInfo : '+ item);
      console.log('ChargingStationInfo : '+ item.statId);
      setChargingStationData(item);

      }, []); // 빈 배열을 두번째 인수로 전달하여 컴포넌트가 마운트될 때 한 번만 실행되도록 합니다.
    

  return (
    <div>
    <Typography variant="subtitle1" style={{marginTop: "20px"}}> {item.statNm} 충전소 | {item.addr}</Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>충전소ID</TableCell>
            <TableCell>운영기관</TableCell>
            <TableCell>주차가능</TableCell>
            <TableCell>제한사항</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{item.statId}</TableCell>
            <TableCell>{item.bnm}</TableCell> 
            <TableCell>{item.parkingFree}</TableCell>
            <TableCell>{item.limitDetail}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    </div>
    
  );
};

export default ChargingStationInfo;
