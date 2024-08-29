const router = require("express").Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
const bcrypt = require("bcrypt")

// Register a new instructor account
router.post("/register", async (req, res, next) => {
  try {
    const insturctor = await prisma.instructor.create({
      data :{
        username : req.body.username, 
        password : req.body.password
      } ,
    })

    // Create a token with the instructor id
    const token = jwt.sign({ id: instructor.id }, process.env.JWT);

    res.status(201).send({ token });
  } catch (error) {
    next(error);
  }
});

// Login to an existing instructor account
router.post("/login", async (req, res, next) => {
  try {
    const instructor = await prisma.instructor.findFirst({
      where: {
        username : req.body.username, 
        password : req.body.password
      }
      });

    if (!instructor) {
      return res.status(401).send("Invalid login credentials.");
    }
    const secretKey = process.env.SECRET_KEY || 'secret_key';
    // Create a token with the instructor id
    const token = jwt.sign({ id: instructor.id }, secretKey, {
      expiresIn: '1h'
    });

    res.send({ token });
  } catch (error) {
    next(error);
  }
});

// Get the currently logged in instructor
router.get("/me", async (req, res, next) => {
  try {
   const instructor = await prisma.instructor.findUnique({
    where: {
      id: req.user.id
    }
    });

    res.status(200).json(instructor)
  
  } catch (error) {
    next(error);
  }
  })

module.exports = router;