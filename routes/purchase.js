const express = require("express");
const router = express.Router();
const { supabase } = require("../utils/supabaseClient");

router.post("/", async (req, res) => {
  const { user_name, name, photo, group, debutyear, position, mbti, price } = req.body;

  if (!user_name || !name || !photo || !group || !debutyear || !position || !mbti || !price) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // 🔹 查詢用戶當前餘額（10000 - SUM(所有購買金額)）
    const { data: userPurchases, error: purchaseError } = await supabase
      .from("kpop_fantasy_user_card")
      .select("price")
      .eq("user_name", user_name);

    if (purchaseError) throw purchaseError;

    // 計算當前餘額
    const totalSpent = userPurchases?.reduce((sum, record) => sum + record.price, 0) || 0;
    const userBalance = 10000 - totalSpent;

    // 🔹 檢查餘額是否足夠
    if (userBalance < price) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // 🔹 計算新餘額
    const newBalance = userBalance - price;

    // ✅ 插入購買記錄，存入扣款後的 balance
    const { error: insertCardError } = await supabase
      .from("kpop_fantasy_user_card")
      .insert([{ user_name, name, photo, group, debutyear, position, mbti, price, balance: newBalance }]);

    if (insertCardError) throw insertCardError;

    res.status(201).json({ message: "Purchase successful", balance: newBalance });
  } catch (error) {
    console.error("Purchase error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/balance/:user_name", async (req, res) => {
    const { user_name } = req.params;
  
    try {
      const { data, error } = await supabase
        .from("kpop_fantasy_user_card")
        .select("balance")
        .eq("user_name", user_name)
        .order("created_at", { ascending: false }) // 按照時間降序
        .limit(1)
        .single();
  
      if (error) {
        console.error("Error fetching balance:", error.message);
        return res.status(500).json({ error: "Failed to fetch balance" });
      }
  
      res.status(200).json({ balance: data?.balance ?? 10000 }); // 如果沒有記錄，則回傳 10000
    } catch (error) {
      console.error("Balance fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }); 
  // 更新 balance 到最新的 created_at
router.post("/updateBalance", async (req, res) => {
    const { user_name, newBalance } = req.body;
  
    const { data, error } = await supabase
      .from("kpop_fantasy_user_card")
      .update({ balance: newBalance })
      .eq("user_name", user_name)
      .order("created_at", { ascending: false }) // 找最新的
      .limit(1); // 只更新最新的那行
  
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ message: "Balance updated successfully", balance: newBalance });
  });
   

module.exports = router;
