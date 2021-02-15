const blogRouter = require("express").Router();
const Blog = require("./../models/blog");

blogRouter.get("/", async (request, response) => {
 const blogs = await  Blog.find({})
    response.json(blogs)
    .catch((error) => next(error));
});

blogRouter.post("/", (request, response) => {
  const blog = new Blog(request.body);

  blog
    .save()
    .then((result) => {
      response.status(201).json(result);
    })
    .catch((error) => next(error));
});

module.exports = blogRouter;