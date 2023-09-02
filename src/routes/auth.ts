import { Router, Request, Response} from 'express'

const authRouter: Router = Router()
authRouter.post('/register', async(req: Request, res: Response) => 
{
    return res.status(200).send({ message: `Thank you for trying to sign up. Let's goooooooo man` })
   
})

authRouter.post('/login', async(req: Request, res: Response) => 
{
   
})

authRouter.post('/change-password/generate-token', async(req: Request, res: Response) => 
{
   
})

authRouter.post('/change-password', async(req: Request, res: Response) => 
{
   
})


authRouter.post('/verify-account', async(req: Request, res: Response) => 
{
   
})

export default authRouter