const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Client untuk operasi umum (dengan RLS)
const supabase = createClient(
  "https://bysprnmuusxwlrxjoljl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5c3Bybm11dXN4d2xyeGpvbGpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMzcxMjksImV4cCI6MjA5MjcxMzEyOX0.M8Nt-5oTM78p592t7RK-fuIwAWPYVIb2cr8dhrATWYA"
);

// Client untuk admin (bypass RLS)
const supabaseAdmin = createClient(
  "https://bysprnmuusxwlrxjoljl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5c3Bybm11dXN4d2xyeGpvbGpsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzEzNzEyOSwiZXhwIjoyMDkyNzEzMTI5fQ.ju2Cwx8VO9tpKqFuNr3zYoWHj6ESHIyvJtmOLi5MxbI"
);

module.exports = { supabase, supabaseAdmin };