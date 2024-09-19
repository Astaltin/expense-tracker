import {
   ColumnDef,
   flexRender,
   getCoreRowModel,
   getPaginationRowModel,
   useReactTable
} from '@tanstack/react-table'
import { ChevronLeftIcon, ChevronRightIcon, EllipsisIcon, PlusIcon } from 'lucide-react'
import type { FormEventHandler } from 'react'
import { useEffect, useState } from 'react'
import {
   AlertDialog,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger
} from './components/ui/alert-dialog'
import { Badge } from './components/ui/badge'
import { Button, buttonVariants } from './components/ui/button'
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger
} from './components/ui/dialog'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger
} from './components/ui/dropdown-menu'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow
} from './components/ui/table'
import { Textarea } from './components/ui/textarea'
import { cn } from './lib/utils'
import calendarizeDate from './utils/calendarizeDate'

type ValueOf<T> = T[keyof T]

type Expense = {
   id: string
   description: string
   category: string
   amount: number
   createdAt: string
}

const API_URL = 'http://localhost:3000/api/expenses'
const FETCH_OPTS: RequestInit = {
   credentials: 'same-origin',
   headers: { 'Content-Type': 'application/json' },
   redirect: 'error'
}

const isProduction = import.meta.env.PROD

function App() {
   const [expenses, setExpenses] = useState<Expense[]>([])

   useEffect(() => {
      const fetchExpenses = async () => {
         const response = await fetch(API_URL)
         const data = await response.json()
         setExpenses(data)
      }
      fetchExpenses()
   }, [])

   const handleCreateExpense: FormEventHandler<HTMLFormElement> = async (e) => {
      e.preventDefault()

      const formData = Object.fromEntries(new FormData(e.currentTarget)) as unknown as Expense
      await fetch(API_URL, {
         body: JSON.stringify(formData),
         method: 'POST',
         ...FETCH_OPTS
      })
      setExpenses((prev) => [...prev, formData])
   }

   const columns: ColumnDef<Expense, ValueOf<Expense>>[] = [
      {
         accessorKey: 'id',
         header: 'ID'
      },
      {
         accessorKey: 'description'
      },
      {
         accessorKey: 'category',
         cell({ getValue }) {
            return <Badge variant="secondary">{getValue()}</Badge>
         }
      },
      {
         accessorKey: 'amount',
         cell({ getValue }) {
            const value = getValue()
            const amount = typeof value === 'string' ? Number.parseFloat(value) : value
            const opts = { currency: 'PHP', style: 'currency' } as Intl.NumberFormatOptions
            const formatter = Intl.NumberFormat('en-PH', opts)
            return formatter.format(amount)
         }
      },
      {
         accessorKey: 'createdAt',
         header: 'Date',
         cell({ getValue }) {
            return calendarizeDate(getValue())
         }
      },
      {
         id: 'action',
         header() {
            return (
               <Dialog>
                  <DialogTrigger asChild>
                     <Button type="button" className="gap-1" size="sm">
                        <PlusIcon className="size-[0.875rem]" />
                        <span>New</span>
                     </Button>
                  </DialogTrigger>
                  <DialogContent>
                     <DialogHeader>
                        <DialogTitle>New</DialogTitle>
                        <DialogDescription>What stuff did you buy today tho?</DialogDescription>
                     </DialogHeader>
                     <form
                        id="createExpense"
                        className="grid gap-4 [&>div]:flex [&>div]:flex-col [&>div]:gap-1"
                        onSubmit={handleCreateExpense}
                     >
                        <div className="col-span-2">
                           <Label htmlFor="description">Description</Label>
                           <Textarea id="description" name="description" required={isProduction} />
                        </div>
                        <div className="col-span-2">
                           <Label htmlFor="category">Category</Label>
                           <select
                              id="category"
                              className={buttonVariants({ variant: 'outline' })}
                              name="category"
                              required={isProduction}
                           >
                              <option value="Clothing">Clothing</option>
                              <option value="Education">Education</option>
                              <option value="Food">Food</option>
                              <option value="Transportation">Transportation</option>
                              <option value="Others">Others</option>
                           </select>
                        </div>
                        <div className="col-start-1">
                           <Label htmlFor="amount">Amount</Label>
                           <Input id="amount" type="number" name="amount" required={isProduction} />
                        </div>
                        <div className="col-start-2">
                           <Label htmlFor="createdAt">Date</Label>
                           <Input
                              id="createdAt"
                              type="date"
                              name="createdAt"
                              required={isProduction}
                           />
                        </div>
                     </form>
                     <DialogFooter>
                        <DialogClose type="submit" asChild>
                           <Button form="createExpense">Create</Button>
                        </DialogClose>
                     </DialogFooter>
                  </DialogContent>
               </Dialog>
            )
         },
         cell({ row }) {
            const handleUpdateExpense: FormEventHandler<HTMLFormElement> = async (e) => {
               e.preventDefault()

               const uriPath = new URL(e.currentTarget.action).pathname
               const formData = Object.fromEntries(
                  new FormData(e.currentTarget)
               ) as unknown as Expense
               await fetch(API_URL + uriPath, {
                  body: JSON.stringify(formData),
                  method: 'PATCH',
                  ...FETCH_OPTS
               })
               const id = uriPath.replace('/', '')
               const matchedExpense = expenses.find((expense) => expense.id === id)
               if (matchedExpense) {
                  matchedExpense.description =
                     matchedExpense.description === formData.description
                        ? matchedExpense.description
                        : formData.description
                  matchedExpense.category =
                     matchedExpense.category === formData.category
                        ? matchedExpense.category
                        : formData.category
                  matchedExpense.amount =
                     matchedExpense.amount === formData.amount
                        ? matchedExpense.amount
                        : formData.amount
                  matchedExpense.createdAt =
                     matchedExpense.createdAt === formData.createdAt
                        ? matchedExpense.createdAt
                        : formData.createdAt
                  setExpenses((prev) => [...prev, matchedExpense])
               }
            }

            const handleDeleteExpense: FormEventHandler<HTMLFormElement> = async (e) => {
               e.preventDefault()

               const uriPath = new URL(e.currentTarget.action).pathname
               await fetch(API_URL + uriPath, {
                  method: 'DELETE',
                  ...FETCH_OPTS
               })
               const id = uriPath.replace('/', '')
               const newExpenses = expenses.filter((expense) => expense.id !== id)
               setExpenses(newExpenses)
            }

            return (
               <Dialog>
                  <AlertDialog>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button type="button" size="icon" variant="ghost">
                              <EllipsisIcon className="size-4" />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                           <DropdownMenuLabel>Actions</DropdownMenuLabel>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem>
                              <DialogTrigger>Edit</DialogTrigger>
                           </DropdownMenuItem>
                           <DropdownMenuItem>
                              <AlertDialogTrigger>Delete</AlertDialogTrigger>
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                     <DialogContent>
                        <DialogHeader>
                           <DialogTitle>Edit</DialogTitle>
                           <DialogDescription>Editing {row.getValue('id')}...</DialogDescription>
                        </DialogHeader>
                        <form
                           id={`editExpense_${row.getValue('id')}`}
                           className="grid gap-4 [&>div]:flex [&>div]:flex-col [&>div]:gap-1"
                           action={`/${row.getValue('id')}`}
                           onSubmit={handleUpdateExpense}
                        >
                           <div className="col-span-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                 id={`description_${row.getValue('id')}`}
                                 name="description"
                                 defaultValue={row.getValue('description')}
                                 required={isProduction}
                              />
                           </div>
                           <div className="col-span-2">
                              <Label htmlFor="category">Category</Label>
                              <select
                                 id={`category_${row.getValue('id')}`}
                                 className={buttonVariants({ variant: 'outline' })}
                                 name="category"
                                 required={isProduction}
                              >
                                 <option
                                    value="Clothing"
                                    selected={row.getValue('category') === 'Clothing'}
                                 >
                                    Clothing
                                 </option>
                                 <option
                                    value="Education"
                                    selected={row.getValue('category') === 'Education'}
                                 >
                                    Education
                                 </option>
                                 <option
                                    value="Food"
                                    selected={row.getValue('category') === 'Food'}
                                 >
                                    Food
                                 </option>

                                 <option
                                    value="Transportation"
                                    selected={row.getValue('category') === 'Transportation'}
                                 >
                                    Transportation
                                 </option>
                                 <option
                                    value="Others"
                                    selected={row.getValue('category') === 'Others'}
                                 >
                                    Others
                                 </option>
                              </select>
                           </div>
                           <div className="col-start-1">
                              <Label htmlFor="amount">Amount</Label>
                              <Input
                                 id={`amount_${row.getValue('id')}`}
                                 type="number"
                                 name="amount"
                                 defaultValue={row.getValue('amount')}
                              />
                           </div>
                           <div className="col-start-2">
                              <Label htmlFor="createdAt">Date</Label>
                              <Input
                                 id={`createdAt_${row.getValue('id')}`}
                                 type="date"
                                 name="createdAt"
                                 defaultValue={calendarizeDate(row.getValue('createdAt'))}
                              />
                           </div>
                        </form>
                        <DialogFooter>
                           <DialogClose type="submit" asChild>
                              <Button form={'editExpense_' + row.getValue('id')}>Update</Button>
                           </DialogClose>
                        </DialogFooter>
                     </DialogContent>
                     <AlertDialogContent>
                        <AlertDialogHeader>
                           <AlertDialogTitle>Delete {row.getValue('id')}?</AlertDialogTitle>
                           <AlertDialogDescription>
                              This action cannot be undone.
                           </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                           <AlertDialogCancel>Cancel</AlertDialogCancel>
                           <AlertDialogCancel
                              className={cn(buttonVariants({ variant: 'default' }))}
                              type="submit"
                              form={'deleteExpense_' + row.getValue('id')}
                           >
                              Delete
                           </AlertDialogCancel>
                           <form
                              id={'deleteExpense_' + row.getValue('id')}
                              action={`${row.getValue('id')}`}
                              onSubmit={handleDeleteExpense}
                           ></form>
                        </AlertDialogFooter>
                     </AlertDialogContent>
                  </AlertDialog>
               </Dialog>
            )
         }
      }
   ]

   const table = useReactTable({
      columns,
      data: expenses,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      initialState: {
         pagination: { pageSize: 4 }
      }
   })

   return (
      <main className="mx-auto grid max-w-5xl gap-3 p-3">
         <h1 className="text-accent-foreground text-2xl font-bold">Expense Tracker</h1>
         <section className="col-start-1 rounded-md border p-3">
            {(() => {
               const totalClothingCategory = expenses.reduce((p, c) => {
                  p += c.category === 'Clothing' ? 1 : 0
                  return p
               }, 0)
               const totalEducationCategory = expenses.reduce((p, c) => {
                  p += c.category === 'Education' ? 1 : 0
                  return p
               }, 0)
               const totalFoodCategory = expenses.reduce((p, c) => {
                  p += c.category === 'Food' ? 1 : 0
                  return p
               }, 0)
               const totalTransportationCategory = expenses.reduce((p, c) => {
                  p += c.category === 'Transportation' ? 1 : 0
                  return p
               }, 0)
               const totalOthersCategory = expenses.reduce((p, c) => {
                  p += c.category === 'Others' ? 1 : 0
                  return p
               }, 0)

               return (
                  <div className="grid gap-1.5">
                     <p className="text-xs font-semibold">
                        Total expenses for <Badge className="rounded-full">Clothing</Badge> -{' '}
                        {totalClothingCategory}
                     </p>
                     <p className="text-xs font-semibold">
                        Total expenses for <Badge className="rounded-full">Education</Badge> -{' '}
                        {totalEducationCategory}
                     </p>
                     <p className="text-xs font-semibold">
                        Total expenses for <Badge className="rounded-full">Food</Badge> -{' '}
                        {totalFoodCategory}
                     </p>
                     <p className="text-xs font-semibold">
                        Total expenses for <Badge className="rounded-full">Transportation</Badge> -{' '}
                        {totalTransportationCategory}
                     </p>
                     <p className="text-xs font-semibold">
                        Total expenses for <Badge className="rounded-full">Others</Badge> -{' '}
                        {totalOthersCategory}
                     </p>
                  </div>
               )
            })()}
         </section>
         <section className="col-start-2 rounded-md border p-3">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
               {(() => {
                  const totalAmount = expenses.reduce((p, c) => (p += +c.amount), 0)
                  const formatter = new Intl.NumberFormat('en-PH', {
                     currency: 'PHP',
                     style: 'currency'
                  })
                  const formatted = formatter.format(totalAmount) + '/mo.'
                  return formatted
               })()}
            </h1>
            <Label>Total Expenses</Label>
         </section>
         <section className="col-span-2 grid gap-3">
            <Table>
               <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                     <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                           <TableHead key={header.id}>
                              <span className="capitalize">
                                 {flexRender(header.column.columnDef.header, header.getContext())}
                              </span>
                           </TableHead>
                        ))}
                     </TableRow>
                  ))}
               </TableHeader>
               <TableBody>
                  {table.getRowModel().rows.map((row) => (
                     <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                           <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                           </TableCell>
                        ))}
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
            <section className="flex items-center justify-end gap-1.5">
               <div className="flex justify-end gap-1.5">
                  <Button
                     type="button"
                     size="icon"
                     variant="outline"
                     disabled={!table.getCanPreviousPage()}
                     onClick={() => table.previousPage()}
                  >
                     <ChevronLeftIcon className="size-[0.875rem]" />
                  </Button>
                  <Button
                     type="button"
                     size="icon"
                     variant="outline"
                     disabled={!table.getCanNextPage()}
                     onClick={() => table.nextPage()}
                  >
                     <ChevronRightIcon className="size-[0.875rem]" />
                  </Button>
               </div>
            </section>
         </section>
      </main>
   )
}

export default App
