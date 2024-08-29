const app = require("./app");
require("dotenv").config();


const PORT = process.env.PORT || 3000;


app.use("/api" , require("./auth/index"))

app.use("/students" , require ("./api/students"))


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});