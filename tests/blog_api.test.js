const mongoose = require('mongoose')
const supertest = require('supertest')
const app =  require("../app")
const Blog = require('../models/blog')

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



afterAll(() => {
  mongoose.connection.close()
})