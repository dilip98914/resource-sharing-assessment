import express from "express";
import cors from "cors";
import resourceRoutes from "./routes/resourceRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.send("OK HEALTH!");
});

app.use("/api/user", resourceRoutes);
app.use("/api/", resourceRoutes);

export default app;
