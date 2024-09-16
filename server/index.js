import cors from 'cors';
import express from "express";

const app = express()

app.use(cors({
	allowedHeaders: ['Content-Type'],
	credentials: true,
	methods: ['GET', 'POST', 'PATCH', 'DELETE'],
	origin: 'http://localhost:5174'
}))
app.use(express.json())

const indexRouter = express.Router({ caseSensitive: true, strict: true })
indexRouter.get('/', (req, res) => {
	res.json({ message: 'Hello, world!' })
})

app.use('/api', indexRouter)

export default app