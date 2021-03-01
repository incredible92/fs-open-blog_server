const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs');
const app =  require("../app")
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('../utils/test_helper')

const api = supertest(app)



const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
];
let token;

beforeEach(async () => {
  await Blog.deleteMany({});
  await new Blog(blogs[0]).save();
  await new Blog(blogs[1]).save();
  await new Blog(blogs[2]).save();

  await User.deleteMany({});
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash('testPassword', saltRounds);
  const user = new User({ username: 'testUser', passwordHash });

  await user.save();

  await api
    .post('/api/login')
    .send({ username: 'testUser', password: 'testPassword' })
    .then((response) => {
      token = response.body.token;
    });
})

describe('GET /blogs', function () {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      expect(200)
      expect('Content-Type', /application\/json/);
  });

  test('returns the correct number of blogs', async () => {
    const blogs = await api.get('/api/blogs');
    expect(blogs.body.length).toBe(3);
  });

  test('blogs have an unique identifier id property', async () => {
    const blogs = await api.get('/api/blogs');
    expect(blogs.body[0].id).toBeDefined();
  });

});

describe ('POST /blogs', function() {
  test(' url successfully creates a new blog post', async() => {
    const testBlog = {
      title: 'test blog post',
      author: 'Abdullahi Sulyman',
      url: 'http:/incredible.org.ng',
      likes: 0
    }
    const response = await api.post('/api/blogs')
    .send(testBlog)
    .set('Authorization', `Bearer ${token}`)
    .set('accept', 'application/json')
    expect(201)

    expect(response.body.title).toBe(testBlog.title)

  })

})

describe('Like property of blogs', function () {
  test('should default to 0 if likes are missing', async () => {
    const newBlogPost = {
      title: 'New blog Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    };

    const blogsList = await api
      .post('/api/blogs')
      .send(newBlogPost)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      expect(201);

    expect(blogsList.body).toHaveProperty('likes', 0);
  });

  test('should return given like', async () => {
    const newBlogPost = {
      title: 'New blog Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 16,
    };

    const blogsList = await api
      .post('/api/blogs')
      .send(newBlogPost)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      expect(201);

    expect(blogsList.body).toHaveProperty('likes', 16);
  });
});

describe('Required properties missing', function () {
  test('should return status code 400 Bad Request when title property is missing', async () => {
    const newBlogPost = {
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    };

    await api
      .post('/api/blogs')
      .send(newBlogPost)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      expect(400);
  });

  test('should return status code 400 Bad Request when url property is missing', async () => {
    const newBlogPost = {
      title: 'New blog Canonical string reduction',
      author: 'Edsger W. Dijkstra',
    };

    await api
      .post('/api/blogs')
      .send(newBlogPost)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      expect(400);
  });
});

describe('DELETE /blogs', function () {
  test('should delete a blog', async () => {
    const newBlogPost = {
      title: 'New blog Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 18,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogPost);

    const blogsAtStart = await helper.blogsInDb();
    const idToDelete = blogsAtStart[blogsAtStart.length - 1].id;
    await api
      .delete(`/api/blogs/${idToDelete}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtStart).toHaveLength(blogsAtEnd.length + 1);
  });

  describe('update a blog',() => {
    test('without blog likes added',async() => {
      const blogsAtStart = await helper.blogsInDB()
      const blogToUpdate = blogsAtStart[0]
      const noBlogLikes = { title: 'arigato masarimasem', author: 'ichimaru gin' }
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(noBlogLikes)
        .expect(404)
      const likesUpdate = { likes: 30 }
  
      const blogsAtEnd = await helper.blogsInDB()
      const titles = blogsAtEnd.map(blog => blog.title)
      expect(titles).not.toContain(noBlogLikes.title)
  
      const response= await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(likesUpdate)
        .expect(200)
        .expect('Content-Type',/application\/json/)
      const latestBlogs = await helper.blogsInDB()
      expect(response.body.likes).toBe(latestBlogs[0].likes)
    })
  })
})





afterAll(() => {
  mongoose.connection.close()
})