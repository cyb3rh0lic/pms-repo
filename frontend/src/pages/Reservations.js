import React, { useEffect, useState } from 'react';
import api from '../api';

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    guest_id: '', room_id: '', check_in_date: '', check_out_date: ''
  });

  const fetchAll = () => {
    api.get('/reservations').then(res => setReservations(res.data));
    api.get('/guests').then(res => setGuests(res.data));
    api.get('/rooms').then(res => setRooms(res.data));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async () => {
    try {
      await api.post('/reservations', {
        ...form,
        guest_id: parseInt(form.guest_id),
        room_id: parseInt(form.room_id),
      });
      alert('예약이 완료되었습니다!');
      setShowForm(false);
      setForm({ guest_id: '', room_id: '', check_in_date: '', check_out_date: '' });
      fetchAll();
    } catch (e) {
      alert('예약 실패: ' + (e.response?.data?.detail || e.message));
    }
  };

  const handleCheckIn = async (id) => {
    if (!window.confirm('체크인 처리하시겠습니까?')) return;
    await api.patch(`/reservations/${id}/checkin`);
    fetchAll();
  };

  const handleCheckOut = async (id) => {
    if (!window.confirm('체크아웃 처리하시겠습니까?')) return;
    await api.patch(`/reservations/${id}/checkout`);
    fetchAll();
  };

  const statusLabel = {
    confirmed: '예약확정',
    checked_in: '체크인',
    checked_out: '체크아웃',
    cancelled: '취소',
  };

  const guestName = (id) => guests.find(g => g.id === id)?.name || id;
  const roomNumber = (id) => rooms.find(r => r.id === id)?.room_number || id;

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
        <div className="page-title" style={{margin:0}}>예약 관리</div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          + 신규 예약
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 style={{marginBottom:'16px', fontSize:'16px'}}>신규 예약 등록</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>고객</label>
              <select value={form.guest_id} onChange={e => setForm({...form, guest_id: e.target.value})}>
                <option value="">고객 선택</option>
                {guests.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>객실</label>
              <select value={form.room_id} onChange={e => setForm({...form, room_id: e.target.value})}>
                <option value="">객실 선택</option>
                {rooms.filter(r => r.status === 'available').map(r => (
                  <option key={r.id} value={r.id}>
                    {r.room_number}호 ({r.room_type}) - {r.price_per_night.toLocaleString()}원
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>체크인 날짜</label>
              <input type="date" value={form.check_in_date}
                onChange={e => setForm({...form, check_in_date: e.target.value})} />
            </div>
            <div className="form-group">
              <label>체크아웃 날짜</label>
              <input type="date" value={form.check_out_date}
                onChange={e => setForm({...form, check_out_date: e.target.value})} />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleSubmit}>예약 등록</button>
            <button className="btn" style={{background:'#eee'}} onClick={() => setShowForm(false)}>취소</button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>예약번호</th>
                <th>고객명</th>
                <th>객실</th>
                <th>체크인</th>
                <th>체크아웃</th>
                <th>금액</th>
                <th>상태</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(res => (
                <tr key={res.id}>
                  <td>#{res.id}</td>
                  <td>{guestName(res.guest_id)}</td>
                  <td>{roomNumber(res.room_id)}호</td>
                  <td>{res.check_in_date}</td>
                  <td>{res.check_out_date}</td>
                  <td>{res.total_price?.toLocaleString()}원</td>
                  <td>
                    <span className={`badge badge-${res.status}`}>
                      {statusLabel[res.status]}
                    </span>
                  </td>
                  <td style={{display:'flex', gap:'6px'}}>
                    {res.status === 'confirmed' && (
                      <button className="btn btn-success btn-sm"
                        onClick={() => handleCheckIn(res.id)}>체크인</button>
                    )}
                    {res.status === 'checked_in' && (
                      <button className="btn btn-warning btn-sm"
                        onClick={() => handleCheckOut(res.id)}>체크아웃</button>
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

export default Reservations;