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
})