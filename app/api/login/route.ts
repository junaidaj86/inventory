import prismadb from "@/lib/prismadb";
import * as bcrypt from 'bcrypt';

interface requestBody{
    username: string,
    password: string
}
export  async function POST(request: Request){
    const body: requestBody = await request.json();
    console.log("bosy = "+JSON.stringify(body, undefined,2))
    if(body?.username != null && body?.password != null){
        const user = await prismadb.user.findFirst({
            where:{
                email: body.username
            }
        });
        console.log(JSON.stringify(user, undefined,2))
        console.log("bcrypt pass =" + await bcrypt.hash(body.password,10))
        if(user != null && await bcrypt.compare(body.password, user.password, )){
            const{password, ...userWithOutPassword} = user;
            return new Response(JSON.stringify(userWithOutPassword ));
        }else{
            console.log("Auth Fail: Incorrect password");
            return new Response(null);
        }
    }else{
        console.log("Bad request: require both username and password");
        return new Response(null);
    }

}