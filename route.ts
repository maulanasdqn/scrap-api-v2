import { Router, Request, Response } from "express";
import get from "./get";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    console.log("Accessing");
    res.status(200).send(await get(req.body.url));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;
