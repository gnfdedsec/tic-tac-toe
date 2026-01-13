-- สร้างตาราง game_stats สำหรับเก็บสถิติการเล่นเกม

CREATE TABLE IF NOT EXISTS game_stats (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  total_score INTEGER DEFAULT 0,
  total_games INTEGER DEFAULT 0,
  max_streak INTEGER DEFAULT 0,
  current_rank TEXT DEFAULT 'Bronze',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- สร้าง index เพื่อเพิ่มประสิทธิภาพการค้นหา
CREATE INDEX IF NOT EXISTS idx_game_stats_total_score ON game_stats(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_game_stats_username ON game_stats(username);

-- ตั้งค่า Row Level Security (RLS)
ALTER TABLE game_stats ENABLE ROW LEVEL SECURITY;

-- Policy: ผู้ใช้สามารถอ่านข้อมูลของตัวเองได้
CREATE POLICY "Users can view their own stats"
  ON game_stats
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: ผู้ใช้สามารถอัพเดทข้อมูลของตัวเองได้
CREATE POLICY "Users can update their own stats"
  ON game_stats
  FOR UPDATE
  USING (auth.uid() = id);

-- Policy: ผู้ใช้สามารถสร้างข้อมูลของตัวเองได้
CREATE POLICY "Users can insert their own stats"
  ON game_stats
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: ทุกคนสามารถอ่าน leaderboard ได้ (สำหรับหน้า leaderboard)
CREATE POLICY "Anyone can view leaderboard"
  ON game_stats
  FOR SELECT
  USING (true);

-- สร้าง function สำหรับอัพเดท updated_at อัตโนมัติ
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- สร้าง trigger สำหรับอัพเดท updated_at
CREATE TRIGGER update_game_stats_updated_at
  BEFORE UPDATE ON game_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- หมายเหตุ: 
-- - ตารางนี้จะเชื่อมโยงกับ auth.users โดยใช้ id
-- - RLS จะป้องกันไม่ให้ผู้ใช้แก้ไขข้อมูลของคนอื่น
-- - Leaderboard สามารถดูได้ทุกคน แต่แก้ไขได้เฉพาะเจ้าของข้อมูล

