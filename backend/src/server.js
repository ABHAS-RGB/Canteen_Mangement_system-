require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000;
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
const staffRoutes = require('./routes/staff');
app.use('/api/staff', staffRoutes);
const walletRoutes = require("./routes/walletRoutes");
app.use("/api/wallet", walletRoutes);