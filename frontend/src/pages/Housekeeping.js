import React, { useEffect, useState } from 'react';
import api from '../api';

function Housekeeping() {
  const [rooms, setRooms] = useState([]);

  const fetchRooms = () => api.get('/housekeeping/all').then(res => setRooms(res.data));

  useEffect(() => { fetchRooms(); }, []);

  const handleClean = async (id) => {
    try {
      await api.patch(`/housekeeping/${id}/clean`);
      fetchRooms();
    } catch (e) {
      alert(e.response?.data?.detail || '오류가 발생했습니다');
    }
  };

  const handleMaintenance = async (id) => {
    if (!window.confirm('점검 중으로 변경하시겠습니까?')) return;
    await api.patch(`/housekeeping/${id}/maintenance`);
    fetchRooms();
  };

  const statusLabel = {
    available: '이용 가능',
    occupied: '사용 중',
    cleaning: '청소 중',
    maintenance: '점검 중',
  };

  const cleaningRooms = rooms.filter(r => r.status === 'cleaning');
  const maintenanceRooms = rooms.filter(r => r.status === 'maintenance');

  return (
    <div>
      <div className="page-title">하우스키핑</div>

      <div className="stats-grid" style={{gridTemplateColumns:'repeat(2,1fr)'}}>
        <div className="stat-card">
          <div className="stat-label">청소 필요</div>
          <div className="stat-value" style={{color:'#1565c0'}}>{cleaningRooms.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">점검 중</div>
          <div className="stat-value" style={{color:'#880e4f'}}>{maintenanceRooms.length}</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{marginBottom:'16px', fontSize:'16px'}}>전체 객실 상태</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>객실번호</th>
                <th>타입</th>
                <th>층</th>
                <th>상태</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room.id}>
                  <td>{room.room_number}호</td>
                  <td>{room.room_type}</td>
                  <td>{room.floor}층</td>
                  <td>
                    <span className={`badge badge-${room.status}`}>
                      {statusLabel[room.status]}
                    </span>
                  </td>
                  <td style={{display:'flex', gap:'6px'}}>
                    {room.status === 'cleaning' && (
                      <button className="btn btn-success btn-sm"
                        onClick={() => handleClean(room.id)}>청소 완료</button>
                    )}
                    {(room.status === 'available' || room.status === 'cleaning') && (
                      <button className="btn btn-warning btn-sm"
                        onClick={() => handleMaintenance(room.id)}>점검 등록</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Housekeeping;