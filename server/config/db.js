import { createConnection } from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.log("Kết nối thất bại, lỗi: ", err.stack);
    return;
  }
  console.log("Kết nối thành công.");
});

export const query = db.query.bind(db);
