import express, { Express } from "express";
import router from "./route";
import { config } from "dotenv";

config();

const app: Express = express();
const port = process.env.PORT;
app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Running fine ${port}`);
});
