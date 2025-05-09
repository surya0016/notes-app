import 'dotenv/config';
import { UserTable } from '@/db/schema';
import { db } from '@/db';

interface CreateUserProps {
  name: string,
  email: string,
  password: string,
}

export const createUser = async({name, email, password}:CreateUserProps) => {
  try {
    //Check if user already exists
    const userAlreadyExists = await db.query.UserTable.findFirst({
      where: ((user, {eq}) => eq(user.email, email))
    })

    if(userAlreadyExists){
      console.log("USER ALREADY EXISTS")
      return {
        message: "User already exists"
      }
    }
    
    //To avoid duplicate emails
    const normalizedEmail = email.toLowerCase().trim()

    //Creating user
    const user = await db.insert(UserTable).values({
      name,
      email:normalizedEmail,
      password
    }).returning()

    console.log("USER CREATED SUCCESSFULLY! ")

    return {
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email
      },
      message: "User created successfully!"
    }
  } catch (error) {
    console.log("ERROR [CREATE_USER]: ", error)
    return {
      message: "Server Error [CREATE_USER_FUNC]"
    }
  }    
}