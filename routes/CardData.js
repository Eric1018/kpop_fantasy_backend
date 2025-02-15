const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const express = require("express");

dotenv.config(); // 讀取 .env 變數

const router = express.Router();

// 初始化 Supabase
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("SUPABASE_URL:", SUPABASE_URL);
console.log("SUPABASE_KEY:", SUPABASE_KEY ? "Loaded" : "Missing");

// 取得所有 KPOP 偶像資料
router.get("/", async (req, res) => {
  console.log("Received GET request to /api/cardData");

  try {
    const { data, error } = await supabase
      .from("kpop_fantasy")
      .select("*")
      .order("price", { ascending: false })
      .order("group", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    console.log("Fetched data:", data.length, "records");
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in GET /api/cardData:", error);
    res.status(500).json({ error: error.message });
  }
});

// 刪除指定的 KPOP 偶像
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  console.log(`Received DELETE request for ID: ${id}`);

  if (!id) {
    console.warn("Missing ID in DELETE request");
    return res.status(400).json({ error: "Missing ID" });
  }

  try {
    const { error } = await supabase
      .from("kpop_fantasy")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase DELETE error:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log(`Successfully deleted record with ID: ${id}`);
    res.status(200).json({ message: "Deleted successfully" });

  } catch (error) {
    console.error("Error in DELETE /api/cardData/:id:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router; // ✅ 使用 CommonJS 匯出
