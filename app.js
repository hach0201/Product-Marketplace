const express = require("express");
const port = process.env.PORT || 3000;
const route =  require("./routes/route")

require("./config/db")

const app = express();
app.use(express.json());
app.use(route)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});