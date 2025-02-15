const express = require("express");
const router = express.Router();
const { supabase } = require("../utils/supabaseClient");

// 獲取特定用戶的 myidol 圖片陣列
router.get("/:user_name", async (req, res) => {
  const { user_name } = req.params;

  const { data, error } = await supabase
    .from("kpop_fantasy_user_card")
    .select("photo") // 只查詢 photo 欄位
    .eq("user_name", user_name);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: "No idols found for this user" });
  }

  // 回傳 photo 陣列
  res.json(data.map((item) => item.photo).filter(Boolean)); // 過濾掉空值
});

module.exports = router;
