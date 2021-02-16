const blogRouter = require("express").Router();
const Blog = require("./../models/blog");

blogRouter.get("/", async (request, response) => {
 const blogs = await  Blog.find({})
    response.json(blogs)
    .catch((error) => next(error));
});

blogRouter.post("/", (request, response, next) => {
  const blog = new Blog(request.body);
 
  const blog = new Blog ({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

try {
  const saveBlog = await blog.save()
  response.json(saveBlog)
}catch(exception) {
next(exception)
}

});

module.exports = blogRouter;