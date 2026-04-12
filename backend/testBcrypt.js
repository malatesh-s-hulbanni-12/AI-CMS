import bcrypt from "bcrypt";

const hash = "$2b$10$E4l5BrQK6db1c.V0BIfA.O81xQYIH5UyHT7Ixy4smgE8Fd.9W2.0C";

const check = async () => {
  const result = await bcrypt.compare("GMIT@2026", hash);
  console.log(result);
};

check();