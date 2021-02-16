const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const initialBlogs = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false,
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true,
  },
]
beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})


test('blog are returned as json', async () => {
  console.log('entered test')
  await api
    .get('/api/blog')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blog')

  expect(response.body).toHaveLength(2)
})


test('all blogs are returned', async () => {
  const response = await api.get('/api/blog')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})


test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blog')

  const contents = response.body.map(r => r.content)
  expect(contents).toContain(
    'Browser can execute only Javascript'
  )
})

test('a valid blog can be added', async () => {
  const newBlog = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/blog')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  
    const contents = blogsAtEnd.map(n => n.content)
  

  const response = await api.get('/api/blog')

  const contents = response.body.map(r => r.content)

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(contents).toContain(
    'async/await simplifies making async calls'
  )
})

test('blog without content is not added', async () => {
  const newBlog = {
    important: true
  }

  await api
    .post('/api/blog')
    .send(newBlog)
    .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  
})

afterAll(() => {
  mongoose.connection.close()
})