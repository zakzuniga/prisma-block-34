const express = require("express")
const router = express.Router()
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient

router.get("/" , async (req,res)=>{
    try{
    const instructor = await prisma.instructor.findMany()
    res.status(200).json(instructor)
    } catch (error) {
        res.status(500).json({message: "Error fetching instructors"})
    }
})

router.delete("/" , async(req,res)=>{
    try{
        const {id} = req.body
        const instructorId = parseInt(id)

        await prisma.instructor.deleteMany({
            where: {
                instructorId : instructorId
            }
        })

        await prisma.instructor.delete({
            where: {
                id : instructorId
            }
        })

        res.status(200).json({message: "Instructor deleted successfully"})
    } catch (error) {
        res.status(500).json({message: "Error deleting instructor"})
    }
})

router.put("/:id" , async(req , res)=> {
    try {
        const {id} = req.params
        const instructorId = parseInt(id)
        const {username , password } = req.body 

        if(!username || !password){
            res.status(400).json({message: "Please provide all fields"})
        }

        const updatedInstructor = await prisma.instructor.update({
            where: {
                id : instructorIdId
            },
            data: {
                username,
                password
        }
    });
        res.status(200).json(updatedInstructor)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Error updating instructor"})
    }

    })


    router.post("/" , async(req,res)=>{
        try {
                const {username , password} = req.body
                const instructor = await prisma.instructor.create({
                    data: {
                    username,
                    password
                    }
    })
    res.status(201).json(instructor)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Error creating instructor"})
    }
    })

    router.get("/:id" , async(req,res)=>{
        try {
            const {id} = req.params
            const instructorId = parseInt(id)

            const instructor = await prisma.instructor.findUnique({
                where: {
                    id: instructorId
            }
        })
            res.status(200).json({instructor})
    } catch (error) {
        console.error(error)
        res.status(404).json({message: "instructor not found"})
    }
    })


    router.get("/all" , async(req,res)=>{
        try {
            const instructorWithStudents = await prisma.instructor.findMany({
          include: {
            students: true
          }
        });
        res.status(200).json(instructorWithStudents)
            } catch (error){
                console.error(error)
                res.status(500).json({message: "Error fetching instructors"})
            }
    })
    

module.exports = router