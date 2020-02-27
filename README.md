Interview

Using nodejs expressjs mongoosejs and mongodb atlas  to build a basic manager e-commerce api
  + Product  can add, update, remove, search by product code and show all product
  + Order   can add new order, update order by _id, change status draft, paid, cancelled, draft => paid => cancelled or draft => cancelled.  view all order. 
  + When order draft move to order paid. system will minimus the product storage by the order item.
  + When order paid move to order cancel. system will plush the product storage by order item.

Instruction
1. Clone sourcecode.
2. in command: 'yarn install'.
3. In command: 'yarn start' to run.
