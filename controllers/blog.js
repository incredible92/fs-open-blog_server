const blogRouter = require("express").Router();
const Blog = require("./../models/blog");

blogRouter.get("/", async (request, response) => {
 const blogs = await  Blog.find({})
    response.json(blogs)
    .catch((error) => next(error));
});

blogRouter.post("/", async(request, response, next) => {
  let blog = request.body;
 
   blog = new Blog (blog)

try {
  const saveBlog = await blog.save()
  response.json(saveBlog)
}catch(exception) {
next(exception)
}

});

module.exports = blogRouter;