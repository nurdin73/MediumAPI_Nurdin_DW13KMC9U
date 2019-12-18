require("express-group-routes");

const express = require("express");

const app = express();

const port = 5000;
const categoriesController = require("./controllers/categories");
const articlesController = require("./controllers/articles");
const authController = require("./controllers/auth");
const userController = require("./controllers/user");

// middleware
const { authorized } = require("./middleware");

app.use(express.json());
app.get("/", (req, res) => {
  res.send("hayyy");
});

app.group("/api/v1", router => {
  // API CATEGORIES

  // get all data categories
  router.get("/categories", categoriesController.index);
  // get detail category
  router.get("/category/:name/articles", categoriesController.category);
  // Add Category
  router.post("/category", categoriesController.addCategory);
  // edit category
  router.patch("/editCategory/:id", categoriesController.updateCategory);
  // delete category
  router.delete("/deleteCategory/:id", categoriesController.deleteCategory);

  // API ARTICLES

  // get all articles
  router.get("/articles", articlesController.index);
  // get detail article
  router.get("/articleDetails/:title", articlesController.detail);
  // get Popular articles
  router.get("/popularArticle", articlesController.popularArticle);
  // get related article
  router.get("/relatedArticles/:result", articlesController.related);
  // post article
  router.post("/article", authorized, articlesController.addArticle);
  // update post
  router.patch("/article/:id", articlesController.updateArticle);

  // API LOGIN

  // login user
  router.post("/login", authController.login);
  // register user
  router.post("/register", authController.register);

  // API USER

  // get all article by person
  router.get("/user/:username/articles", userController.articles);
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(401).json({ message: "You are not authorized." });
  } else {
    next(err);
  }
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
