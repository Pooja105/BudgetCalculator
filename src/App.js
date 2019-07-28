import React , {useState, useEffect} from 'react';
import './App.css';
import ExpenseForm from './Components/ExpenseForm';
import ExpenseList from './Components/ExpenseList';
import Alert from './Components/Alert';
import uuid from 'uuid/v4';
import { userInfo } from 'os';

// const initialExpenses  = [
//   {
//     id:uuid(),
//     charge:"Room Rent",
//     amount: 500
//   },
//   {
//     id:uuid(),
//     charge: "Car",
//     amount: 550
//   },
//   {
//     id:uuid(),
//     charge: "Phone",
//     amount: 110
//   }
// ]

const initialExpenses = localStorage.getItem('expenses')
? JSON.parse(localStorage.getItem("expenses"))
: [];

console.log('init expenses',initialExpenses);

function App() {
  /***************** STATE VALUES *********************/
  const [expenses, setExpenses] = useState(initialExpenses);

  //single expense
  const [charge, setCharge] = useState('');

  //single amount
   const [amount, setAmount] = useState('');

   //alert
   const [alert, setAlert] = useState({show: false});

   //edit
   const [edit, setEdit] = useState(false);

   //edit item
   const [id, setId] = useState(0);


   //handle charge
   const handleCharge = (e) => {
     setCharge(e.target.value);
   }

   //handle amount
   const handleAmount = (e) => {
     setAmount(e.target.value)
   }

   //handle Alert
   const handleAlert = ({type, text}) => {
    setAlert({
      show:true,
      type,
      text
    })
    setTimeout(() => {
     setAlert({
      show:false
     }) 
    },3000)
   }

   //clear Items
   const clearItems = () => {
    setExpenses([]);
    handleAlert({
      type:'danger',
      text: 'All Items Cleared'
    })
   }

   //handleDelete
   const handleDelete = (id) => {
     let tempExpenses = expenses.filter(item => item.id !== id)
     setExpenses(tempExpenses);
     handleAlert({
       type:'danger',
       text: 'Item Deleted'
     })
   }

   //handleEdit
   const handleEdit = (id) => {
     let expense = expenses.find(item => item.id === id);
     let {charge, amount} = expense;
     setCharge(charge);
     setAmount(amount);
     setEdit(true);
     setId(id);
   }

   //handle Submit
   const handleSubmit  = (e) =>{
     e.preventDefault();
     if(charge !== "" && amount >0 ){
       if(edit) {
        let tempExpenses = expenses.map(item => {
          return item.id === id ? {...item, charge, amount} : item
        })
        setExpenses(tempExpenses);
        setEdit(false);
        handleAlert({
          type: 'success',
          text: 'Item Edited'
        })
       }else {
        const singleExpense = {
          id: uuid(),
          charge: charge,
          amount: amount
        }
        setExpenses([...expenses,singleExpense]);
        handleAlert({
          type: 'success',
          text: 'Item Added'
        });
      }
        setCharge('');
        setAmount('');
     }else{
        handleAlert({
          type: 'danger',
          text: `charge can't be empty and amount value should be greater than 0`
        })
     }
   }

   /**********Use Effect*************/
   useEffect (() => {
     localStorage.setItem('expenses', JSON.stringify(expenses));
   }, [expenses]) 
  return (
     /***************** fUNCTIONALITY*********************/
    <React.Fragment>
      {
        alert.show && <Alert type={alert.type} text={alert.text}/>
      }
    <Alert />
    <h1>Budget Calculator</h1>
    <main className="App">
    <ExpenseForm charge={charge} amount={amount} handleAmount={handleAmount} handleCharge={handleCharge} handleSubmit={handleSubmit} edit={edit} />
    <ExpenseList expenses={expenses} handleEdit={handleEdit} handleDelete={handleDelete} clearItems={clearItems}/>
    </main>
    <h1> total spending : 
      <span className="total">
        ${expenses.reduce((acc,curr)=> {
          return (
            acc += parseInt(curr.amount)
          )
        }, 0)}
      </span>
      </h1>
    </React.Fragment>
  );
}

export default App;
