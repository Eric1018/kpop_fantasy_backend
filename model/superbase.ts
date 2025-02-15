import { createClient } from '@supabase/supabase-js';

// 設定 Supabase API 連線
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!
  );

// 測試資料庫連線
// async function testConnection() {
//   const { data, error } = await supabase.from('kpop_fantasy_user').select('*');
  
//   if (error) {
//     console.error('Supabase 連線失敗:', error);
//   } else {
//     console.log('Supabase 連線成功，取得資料:', data);
//   }
// }

// testConnection();
