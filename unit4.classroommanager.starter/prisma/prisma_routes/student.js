const express = require("express")
const router = express.Router()
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient

router.get("/" , async (req,res)=>{
    try{
    const students = await prisma.student.findMany()
    res.status(200).json(students)
    } catch (error) {
        res.status(500).json({message: "Error fetching students"})
    }
})

router.delete("/" , async(req,res)=>{
    try{
        const {id} = req.body
        const studentId = parseInt(id)

        await prisma.student.deleteMany({
            where: {
                studentId : studentId
            }
        })

        await prisma.student.delete({
            where: {
                id : studentId
            }
        })

        res.status(200).json({message: "Student deleted successfully"})
    } catch (error) {
        res.status(500).json({message: "Error deleting student"})
    }
})

router.put("/:id" , async(req , res)=> {
    try {
        const {id} = req.params
        const studentId = parseInt(id)
        const {name , cohort , instructorId } = req.body 

        if(!name || !cohort || !instructorId){
            res.status(400).json({message: "Please provide all fields"})
        }

        const updatedStudent = await prisma.student.update({
            where: {
                id : studentId
            },
            data: {
                name, 
                cohort,
                instructorId
        }
    });
        res.status(200).json(updatedStudent)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Error updating student"})
    }

    })


    router.post("/" , async(req,res)=>{
        try {
                const {name , cohort , instructorId } = req.body
                const student = await prisma.student.create({
                    data: {
                        name,
                        cohort,
                        instructorId
                    }
    })
    res.status(201).json(student)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Error creating student"})
    }
    })

    router.get("/:id" , async(req,res)=>{
        try {
            const {id} = req.params
            const studentId = parseInt(id)

            const student = await prisma.student.findUnique({
                where: {
                    id: studentId
            }
        })
            res.status(200).json({student})
    } catch (error) {
        console.error(error)
        res.status(404).json({message: "Student not found"})
    }
    })


module.exports = router