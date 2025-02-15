import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // 取得所有 KPOP 偶像資料
    const { data, error } = await supabase
      .from("kpop_fantasy")
      .select("*")
      .order("price", { ascending: false })
      .order("group", { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "DELETE") {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Missing name" });

    const { error } = await supabase.from("kpop_fantasy").delete().eq("name", name);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: "Deleted successfully" });
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
