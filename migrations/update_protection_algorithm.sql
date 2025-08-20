-- FAKEFACE를 PhotoGuard로 변경하는 마이그레이션

-- 1. 기존 FAKEFACE 데이터를 PhotoGuard로 업데이트 (이미지 생성용)
UPDATE image 
SET protection_algorithm = 'PhotoGuard' 
WHERE protection_algorithm = 'FAKEFACE';

-- 2. 검증 레코드의 PhotoGuard/FAKEFACE는 RobustWide로 변경 (검증에서는 PhotoGuard 사용 안함)
UPDATE validation_record 
SET validation_algorithm = 'RobustWide' 
WHERE validation_algorithm IN ('PhotoGuard', 'FAKEFACE');

-- 3. ENUM 타입 수정 (MySQL 8.0+)
-- image 테이블의 protection_algorithm 컬럼 ENUM 수정 (PhotoGuard 포함)
ALTER TABLE image 
MODIFY COLUMN protection_algorithm ENUM('RobustWide', 'EditGuard', 'PhotoGuard');

-- validation_record 테이블의 validation_algorithm 컬럼 ENUM 수정 (PhotoGuard 제외)
ALTER TABLE validation_record 
MODIFY COLUMN validation_algorithm ENUM('RobustWide', 'EditGuard');

-- 3. 변경 결과 확인
SELECT protection_algorithm, COUNT(*) as count 
FROM image 
GROUP BY protection_algorithm;

SELECT validation_algorithm, COUNT(*) as count 
FROM validation_record 
GROUP BY validation_algorithm;