import * as cf from "@google-cloud/functions-framework";

cf.http("test", (req: cf.Request, res: cf.Response) => {
  res.send("test");
});
