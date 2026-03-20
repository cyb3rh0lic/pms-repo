USE hotel_pms;

-- 외래키 체크 잠시 끄기
SET FOREIGN_KEY_CHECKS = 0;

-- 테이블 완전 초기화 (auto_increment도 1로 리셋)
TRUNCATE TABLE reservations;
TRUNCATE TABLE guests;
TRUNCATE TABLE rooms;

-- 외래키 체크 다시 켜기
SET FOREIGN_KEY_CHECKS = 1;

-- 객실 데이터
INSERT INTO rooms (room_number, room_type, floor, capacity, price_per_night, status) VALUES
('101', 'standard', 1, 2, 80000, 'available'),
('102', 'standard', 1, 2, 80000, 'available'),
('103', 'standard', 1, 2, 80000, 'occupied'),
('201', 'deluxe', 2, 2, 120000, 'available'),
('202', 'deluxe', 2, 2, 120000, 'cleaning'),
('203', 'deluxe', 2, 3, 130000, 'available'),
('301', 'suite', 3, 4, 250000, 'available'),
('302', 'suite', 3, 4, 250000, 'maintenance');

-- 고객 데이터
INSERT INTO guests (name, phone, email, id_number) VALUES
('Kim Chulsoo', '010-1234-5678', 'kim@example.com', '800101-1234567'),
('Lee Younghee', '010-9876-5432', 'lee@example.com', '900215-2345678'),
('Park Minjun', '010-5555-6666', 'park@example.com', '850320-1234567');

-- 예약 데이터 (room_id는 항상 1부터 시작)
INSERT INTO reservations (guest_id, room_id, check_in_date, check_out_date, status, total_price) VALUES
(1, 3, '2026-03-20', '2026-03-22', 'checked_in', 160000),
(2, 1, '2026-03-25', '2026-03-27', 'confirmed', 160000),
(3, 4, '2026-03-28', '2026-03-30', 'confirmed', 240000);