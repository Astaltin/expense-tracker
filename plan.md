> <div style="color:yellow">
>  <b>**WARNING**</b>
>  <p>The deadline is Sept. 19 2024</p>
> </div>

# Expense Tracker

**Expense Tracker** is a small web application to keep track of where you spend your money. It is designed to be simple, intuitive, and easy-to-use.

## Features

- Allows the **creation**, **modification** and **deletion** of an item created.
- Allows the sorting of columns in an ascending and descending order.
- Provides a visual analysis of your total expenses (and other things as well).

## Target Audience

This web app is specifically made for people who want to keep track of their expenses to save money.

## Tech Stack

The teck stack that I'm planning to use is **MySQL**, **Express**, **Node.js** **(MERN)** + **Docker**.

## Data Structures

### Expenses Table

| id         | description | category                                                            | amount | timestamps |
| ---------- | ----------- | ------------------------------------------------------------------- | ------ | ---------- |
| `CHAR(32)` | `CHAR`      | `ENUM('Clothing', 'Food', 'Education', 'Transportation', 'Others')` | `INT`  | `DATETIME` |

## References

[ITE 314 | GCR - P2 Examination](https://classroom.google.com/c/NjgxMjExOTIzNjYw/m/NzA2MTIzNTU1Nzky/details)
