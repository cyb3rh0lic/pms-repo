import React, { useEffect, useState } from 'react';
import api from '../api';

function Guests() {
  const [guests, setGuests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', id_number: '' });

  const fetchGuests = () => api.get('/guests').then(res => setGuests(res.data));

  useEffect(() => { fetchGuests(); }, []);

  const handleSubmit = async () => {
    if (!form.name) { alert('이름은 필수입니다'); return; }
    try {
      await api.post('/guests', form);
      alert('고객이 등록되었습니다!');
      setShowForm(false);
      setForm({ name: '', phone: '', email: '', id_number: '' });
      fetchGuests();
    } catch (e) {
      alert('등록 실패: ' + (e.response?.data?.detail || e.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    await api.delete(`/guests/${id}`);
    fetchGuests();
  };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
        <div className="page-title" style={{margin:0}}>고객 관리</div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          + 고객 등록
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 style={{marginBottom:'16px', fontSize:'16px'}}>신규 고객 등록</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>이름 *</label>
              <input placeholder="홍길동" value={form.name}
                onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>연락처</label>
              <input placeholder="010-0000-0000" value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div className="form-group">
              <label>이메일</label>
              <input placeholder="email@example.com" value={form.email}
                onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label>신분증 번호</label>
              <input placeholder="주민번호 또는 여권번호" value={form.id_number}
                onChange={e => setForm({...form, id_number: e.target.value})} />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleSubmit}>등록</button>
            <button className="btn" style={{background:'#eee'}} onClick={() => setShowForm(false)}>취소</button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>번호</th>
                <th>이름</th>
                <th>연락처</th>
                <th>이메일</th>
                <th>신분증 번호</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {guests.map(g => (
                <tr key={g.id}>
                  <td>#{g.id}</td>
                  <td>{g.name}</td>
                  <td>{g.phone}</td>
                  <td>{g.email}</td>
                  <td>{g.id_number}</td>
                  <td>
                    <button className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(g.id)}>삭제</button>
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

export default Guests;