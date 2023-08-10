import prismadb from "@/lib/prismadb";
import * as bcrypt from 'bcrypt';

interface requestBody{
    username: string,
    password: string,
    email: string,
}

export async function POST(request: Request){
    const body = await request.json();
    console.log("register = "+ await  bcrypt.hash(body.password, 10));
    if(body?.username != null && body?.password != null && body?.email != null){
        const user = await  prismadb.user.create({
            data:{
                username: body.username,
                email: body.email,
                password: await bcrypt.hash(body.password, 10),
                role: body.role,
                store: { connect: { id: body.storeId } },
            }
        });
        const {password, ...userWithoutPassword} = user;
        return new Response(JSON.stringify(userWithoutPassword));
    }else{
        return new Response(JSON.stringify(null))
    }
}