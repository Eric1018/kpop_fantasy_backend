const express = require("express");
const router = express.Router();
const { supabase } = require("../utils/supabaseClient");

// 註冊 API
router.post("/", async (req, res) => {
  const { account, password, user_name } = req.body;

  if (!account || !password || !user_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // 🔹 檢查 user_name 是否已經存在
    const { data: existingUser } = await supabase
      .from("kpop_fantasy_user")
      .select("user_name")
      .eq("user_name", user_name)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // ✅ 插入新用戶
    const { data, error } = await supabase.from("kpop_fantasy_user").insert([
      { account, password, user_name },
    ]);

    if (error) {
      throw error;
    }

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Sign-up error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
