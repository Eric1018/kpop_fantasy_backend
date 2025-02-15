const express = require("express");
const router = express.Router();
const { supabase } = require("../utils/supabaseClient");

// 獲取特定用戶的卡片
router.get("/:user_name", async (req, res) => {
  const { user_name } = req.params;

  const { data, error } = await supabase
    .from("kpop_fantasy_user_card")
    .select("*")
    .eq("user_name", user_name);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// 刪除卡片
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("kpop_fantasy_user_card")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json({ message: "Card deleted successfully" });
});

module.exports = router;
