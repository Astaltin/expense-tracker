import express from "express"
import {
   createExpense,
   deleteExpense,
   getAllExpense,
   updateExpense
} from "./controllers/expenseController.js"

const apiRouter = express.Router({
   caseSensitive: true,
   strict: true
})

apiRouter.route('/expenses')
   .post(createExpense)
   .get(getAllExpense)
apiRouter.route('/expenses/:id')
   .patch(updateExpense)
   .delete(deleteExpense)

export default apiRouter