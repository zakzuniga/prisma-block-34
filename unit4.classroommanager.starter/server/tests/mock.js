const request = require('supertest')

jest.mock('@prisma/client' , ()=>{
    const mockPrisma = {
        student: {
            create: jest.fn((data)=> Promise.resolve(data)),
        },
    };
    return {
        PrismaClient: jest.fn(()=>mockPrisma),
    }
})

const myApp = require("../api/students")

describe('POST /' ,()=>{
    it('creates a new student' , async ()=>{
        const response = await request(router)
        .post('/')
        .send({
            name: 'John Doe',
            cohort: "6" ,
            instructorID : 3            
        } , )

        expect(response.status).toBe(201)
        expect(response.body.name).toBe('John Doe')
        expect(response.body.cohort).toBe(6)
        expect(response.body.instructorID).toBe(4)
    })
})

describe('GET /' , ()=>{
    it('returns a list of all students', async ()=>{
        const response = await request(router)
        .get('/')

        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Array)
})
})



describe(`PUT /${studentID}` , ()=>{
    it('updates a student', async ()=>{
        const studentId = 1
        const response = await request(router)
        .put(`/${studentId}`)
        .send({
            name: 'Nathan',
            cohort: "3",
            instructorId : 1
        })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('name' , 'Nathan')
        expect(response.body).toHaveProperty('cohort' , '3'),
        expect(response.body).toHaveProperty('instructorId' , 1)
    })
})

describe('DELETE /' , ()=>{
    it('deletes a student', async ()=>{
        const studentId = 2
        const response = await request(router)
        .delete(`/${studentId}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('message', 'Student deleted successfully')
        })
})


describe(`GET /${studentId}` , () =>{
    it('returns a student by ID', async ()=>{
        const studentId = 1
        const response = await request(router)
        .get(`/${studentId}`)

        expect(response.stauts).toBe(200)
        expect(response.body).toHaveProperty('id' , studentId)
    })
})