const bcrypt = require("bcrypt")
const { PrismaClient} = require(`@prisma/client`)
const prisma = new PrismaClient()
async function hashExistingPasswords() {
    const instructors = await prisma.instructor.findMany();
    for (const instructor of instructors) {
      const hashedPassword = await bcrypt.hash(instructor.password, 8);
      await prisma.instructor.update({
        where: { id: instructor.id },
        data: { password: hashedPassword },
      });
    }
    console.log("Existing passwords have been hashed!");
  }
  hashExistingPasswords();
async function loginInstructor(username , password) {
    try {
        const instructor = await prisma.instructor.findUnique({
            where: { username: username } })
        if(!instructor){
            return { error: "Instructor not found" }
        }
        const isValid = await bcrypt.compare(password , instructor.password)
        if(!isValid) {
            return { error: "Invalid password" }
        }
    } catch (error) {
        console.error(error)
    }
}

