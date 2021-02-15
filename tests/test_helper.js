const blog = require('../models/blog')

const initialBlogs = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true
  }
]

const nonExistingId = async () => {
  const blog = new Note({ content: 'willremovethissoon', date: new Date() })
  await blog.save()
  await blog.remove()

  return note._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return notes.map(note => note.toJSON())
}

module.exports = {
  initialNotes, nonExistingId, blogsInDb
}