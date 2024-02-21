const express = require("express");
const app = express();

const epubRoutes = require("./routes/epubRoutes");
const webRoutes = require("./routes/webRoutes");
const errorRoutes = require("./routes/errorRoutes");

const PORT = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(webRoutes);
app.use(epubRoutes);
app.use(errorRoutes);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
