import express, {Request, Response} from "express";
import { PrismaClient } from  "@prisma/client";

const app = express();
app.use(express.json());

const prisma = new PrismaClient();


app.listen(3001, ()=>{
    console.log('app starting to listen on port 3001');
})

app.post('/', async (req: Request, res: Response) => {
    const {username, password} = req.body;
    const user = await prisma.user.create({
        data:{
            username: username,
            password: password
        }
    })
    res.json(user)
})

app.post('/createManyUsers', async (req: Request, res: Response) => {
    const {userList} = req.body;
    const user = await prisma.user.createMany({
        data: userList ,
    })
    res.json(user)
})

app.post('/createManyCars', async (req: Request, res: Response) => {
    const {carList} = req.body;
    const cars = await prisma.car.createMany({
        data: carList ,
    })
    res.json(cars)
})

app.get('/', async (req: Request, res: Response) => {
    const users = await prisma.user.findMany({
        include: {Car: true},
    })
    res.json(users)
})

app.get('/byID/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await prisma.user.findUnique({
        where: {id : Number(id)}
    })
    res.json(user)
})

app.put('/', async (req: Request, res: Response) => {
    const {id,username} = req.body;
    const updatedusers = await prisma.user.update({
        where: {id: Number(id)},
        data:{username: username}
    })
    res.json(updatedusers)
})

app.delete('/:id',async (req: Request, res: Response) => {
    const id = req.params.id
    const deleteduser = await prisma.user.delete({
        where: {id: Number(id)}
    })
    res.json(deleteduser)
})

app.get('/byUserName/:username', async (req: Request, res: Response) => {
    const username = req.params.username;
    const userId = await prisma.user.findFirst({
        where: {username:String(username)},
        select:{
            id: true
        }
    })

   if(userId != null){
       const id = userId.id;
       const cars = await prisma.car.findMany({
           where: {User_id: Number(id)}
       })
       res.json(cars)
   }else{
       res.json("No recodes find!!")
   }



})
