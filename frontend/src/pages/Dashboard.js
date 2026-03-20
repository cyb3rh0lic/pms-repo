import React, { useEffect, useState } from 'react';
import api from '../api';

function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    api.get('/rooms').then(res => setRooms(res.data));
    api.get('/reservations').then(res => setReservations(res.data));
  }, []);

  const stats = {
    total: rooms.length,
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    cleaning: rooms.filter(r => r.status === 'cleaning').length,
  };

  const statusLabel = {
    available: '이용 가능',
    occupied: '사용 중',
    cleaning: '청소 중',
    maintenance: '점검 중',
  };

  return (
    <div>
      <div className="page-title">대시보드</div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">전체 객실</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">이용 가능</div>
          <div className="stat-value" style={{color:'#2e7d32'}}>{stats.available}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">사용 중</div>
          <div className="stat-value" style={{color:'#e65100'}}>{stats.occupied}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">청소 중</div>
          <div className="stat-value" style={{color:'#1565c0'}}>{stats.cleaning}</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{marginBottom: '16px', fontSize: '16px'}}>객실 현황</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>객실번호</th>
                <th>타입</th>
                <th>층</th>
                <th>수용인원</th>
                <th>1박 요금</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room.id}>
                  <td>{room.room_number}호</td>
                  <td>{room.room_type}</td>
                  <td>{room.floor}층</td>
                  <td>{room.capacity}명</td>
                  <td>{room.price_per_night.toLocaleString()}원</td>
                  <td>
                    <span className={`badge badge-${room.status}`}>
                      {statusLabel[room.status] || room.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2 style={{marginBottom: '16px', fontSize: '16px'}}>최근 예약</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>예약번호</th>
                <th>객실</th>
                <th>체크인</th>
                <th>체크아웃</th>
                <th>상태</th>
                <th>금액</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(res => (
                <tr key={res.id}>
                  <td>#{res.id}</td>
                  <td>{res.room_id}호</td>
                  <td>{res.check_in_date}</td>
                  <td>{res.check_out_date}</td>
                  <td>
                    <span className={`badge badge-${res.status}`}>
                      {res.status}
                    </span>
                  </td>
                  <td>{res.total_price?.toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;