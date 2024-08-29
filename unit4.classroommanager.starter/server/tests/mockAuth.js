const request = require("supertest")

jest.mock('@prisma/client' , ()=>{
    const mockPrisma = {
instructor : {
    create: jest.fn((data) => Promise.resolve(data)),
},
    };
    return {
        PrismaClient: jest.fn(()=>mockPrisma)
    }
})

const router = require('./index');

  describe('POST /register', () => {
    it('creates a new instructor account', async () => {
      const response = await router.post('/register').send({
        username: 'newInstructor',
        password: 'newPassword',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
    });
  });

  describe('POST /login', () => {
    it('logs in to an existing instructor account', async () => {
      const response = await router.post('/login').send({
        username: 'existingInstructor',
        password: 'existingPassword',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('returns 401 for invalid login credentials', async () => {
      const response = await router.post('/login').send({
        username: 'invalidUsername',
        password: 'invalidPassword',
      });

      expect(response.status).toBe(401);
      expect(response.body).toBe('Invalid login credentials.');
    });
  });