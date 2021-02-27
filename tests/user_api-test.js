const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('../utils/test_helper');
const app = require('../app');
const api = supertest(app);
const user = require('../models/user');

const initialUsers = [
  {
    name: 'Abdullahi Sulyman',
    username: 'mrincredible',
    password: 'ojonimi',
  },
  {
    name: 'samuel Dare',
    username: 'samsuit',
    password: 'hellosam',
  },
];

beforeEach(async() => {
    await user.deleteMany({})
    const usersArray = initialUsers.map((user) => new User(user));
    const promiseArray = usersArray.map((user) => user.save());

  await Promise.all(promiseArray);
})

describe('Get all user', () => {
    test('should return all user', async () => {
        await api
        .get('/api/users')
        .expect(200)
        .expect('content-type', /application\/ json/)

        expect(user.body.length),tobe(initialUsers.length)

    })
    test('should return the total number of users', async () => {
      const users = await api.get('/api/users');
  
      expect(users.body.length).toBe(initialUsers.length);
    });
})

describe('Create new user', () => {
  test('should add user', async () => {
    const newUser = {
      name: 'Creed Bratton',
      username: 'nobodyStealsFromCreedBratton',
      password: 'laterSkater',
    };

    const createdUser = await api.post('/api/users').send(newUser);

    expect(createdUser.body.name).toBe(newUser.name);
    expect(createdUser.body.username).toBe(newUser.username);
  });
})

afterAll(async () => {
  await mongoose.connection.close();
});