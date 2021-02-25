const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('../utils/test_helper');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');

const initialUsersList = [
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
