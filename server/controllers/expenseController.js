import { faker } from '@faker-js/faker';
import expensesModel from '../models/expensesModel.js';

const isTesting = process.env.ENV === 'testing'
const isDevelopment = process.env.ENV === 'development'

/** @type {import('express').RequestHandler} req */
export async function createExpense(req, res) {
   const formData = req.body
   const amount = Number.parseFloat(formData.amount)
   const createdAt = new Date(formData.createdAt)
   await expensesModel.create({ data: { ...formData, amount, createdAt } })
   res.sendStatus(201)
}

/** @type {import('express').RequestHandler} req */
export async function getAllExpense(req, res) {
   if (isTesting) {
      function makeExpense(qty) {
         return range(qty).map(() => createExpense())
      }
      function createExpense() {
         return {
            id: faker.string.nanoid({ max: 10, min: 10 }),
            description: faker.word.words(),
            category: faker.commerce.department(),
            amount: faker.commerce.price(),
            createdAt: faker.date.anytime()
         }
      }
      function range(len) {
         const numbers = []
         for (let i = 0; i < len; i++) {
            numbers.push(i)
         }
         return numbers
      }
      return res.json(makeExpense(1000))

   } else if (isDevelopment) {
      const expenses = await expensesModel.findMany({
         where: { deletedAt: null }
      })
      res.json(expenses)

   } else {
      const expenses = await expensesModel.findMany({
         where: { deletedAt: null }
      })
      res.json(expenses)
   }
}

/** @type {import('express').RequestHandler} req */
export async function updateExpense(req, res) {
   const id = req.params.id
   const formData = req.body
   const amount = Number.parseFloat(formData.amount)
   const createdAt = new Date(formData.createdAt)
   await expensesModel.update({
      data: { ...formData, amount, createdAt, },
      where: { id }
   })
   res.sendStatus(200)
}

/** @type {import('express').RequestHandler} req */
export async function deleteExpense(req, res) {
   const id = req.params.id
   await expensesModel.update({
      data: { deletedAt: new Date() },
      where: { id }
   })
   res.sendStatus(200)
}