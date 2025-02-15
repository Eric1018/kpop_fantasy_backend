const express = require("express");
const router = express.Router();
const { supabase } = require("../utils/supabaseClient");

// 登入 API
router.post("/", async (req, res) => {
  const { account, password } = req.body;

  if (!account || !password) {
    return res.status(400).json({ error: "Missing account or password" });
  }

  try {
    // ✅ 查詢該帳號
    const { data, error } = await supabase
      .from("kpop_fantasy_user")
      .select("account, password, user_name")
      .eq("account", account)
      .single();

    // ✅ 帳號不存在
    if (error || !data) {
      return res.status(404).json({ error: "Account not found" });
    }

    // ✅ 密碼錯誤
    if (data.password !== password) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // ✅ 成功登入
    res.status(200).json({ message: "Login successful", user_name: data.user_name });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
