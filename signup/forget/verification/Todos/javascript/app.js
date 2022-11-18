// ==================================   Firebase   ========================================
import { db, auth } from "../../../../../firebase/firebase-config.js"
import {
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
import {
    collection,
    addDoc,
    Timestamp,
    query,
    where,
    onSnapshot,
    doc,
    deleteDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";

// ==================================   All Variables   ========================================
const currentDate = document.querySelector(".time-schedule");
const time = document.querySelector(".time");
const days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const date = new Date();
const todo = document.getElementById("todo");
const list = document.querySelector(".list-data");
const addBtn = document.getElementById("add-btn");
const taskNumber = document.querySelector(".task-count");
let saveId;
let saveValue;

// ======================================  You Have To Define It First  =====================================
onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        fetchData()
    } else {
        console.log("User is signed out")
    }
});

// ==================================   Date Schedule   ========================================
const timeSchedule = () => {
    currentDate.innerHTML = `${days[date.getDay()]} ${months[date.getMonth()]} ${date.getFullYear()}`
}
setInterval(timeSchedule, 1000)

// ==================================   Timer Function   ========================================
const currentTime = () => {
    const currentDate = new Date();
    // ==================================   Check AM and PM   ========================================
    const checkPmAndAm = () => {
        if (hour > 12) {
            return `PM`
        } else {
            return `AM`
        };
    };

    // ==================================   For to get only in 12 hours   ========================================
    let hour = currentDate.getHours();
    if (hour > 12) {
        hour -= 12
    };

    //==================================   For minutes   ========================================
    const minutes = currentDate.getMinutes();

    //==================================   For Seconds   ========================================
    const seconds = currentDate.getSeconds();
    time.innerHTML = `${hour}:${minutes}:${seconds} ${checkPmAndAm()}`;
}
setInterval(currentTime, 1000);

const addData = async () => {
    if (todo.value !== "") {
        if (todo.value.length > 1) {
            const collectionRef = collection(db, "user-task");
            const tasks = {
                uid: auth.currentUser.uid,
                time: Timestamp.fromDate(new Date()),
                task: todo.value,
            }
            await addDoc(collectionRef, tasks);
            todo.value = "";
        } else {
            swal({
                title: "Sorry",
                text: "Fill Some data.",
                icon: "warning",
                button: "OK",
              });
        }
    }else {
        swal({
            title: "Sorry",
            text: "Fill Some data.",
            icon: "warning",
            button: "OK",
          });
    }
}

function fetchData() {
    const collectionRef = collection(db, "user-task");
    const personalQuery = where("uid", "==", auth.currentUser.uid)
    const q = query(collectionRef, personalQuery);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const number = querySnapshot.size
        taskNumber.innerHTML = number;
        list.innerHTML = "";
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            list.innerHTML += `<div class="col-2 col-sm-1 my-1 pt-2 task-line"><i class="fas fa-check tick" onclick="completeTask('${doc.id}','${data.task}')"></i></div>
        <div class="col-6 col-sm-8 my-1 task-line py-2">
            <div class="task">${data.task}</div>
        </div>
        <div class="col-4 col-sm-3 my-1 task-line py-2 text-center">
            <i class="fas fa-trash-alt icon" onclick="deleteTodo('${doc.id}')"></i>
            <i class="fas fa-edit icon" onclick="editTodo('${doc.id}','${data.task}')"></i>
        </div>`
        });
    });
}
//==================================   For Delete   ========================================
const deleteTodo = async (id) => {
    let dataRef = doc(db, "user-task", id)
    await deleteDoc(dataRef);
}

//==================================   For Edit   ========================================
const editTodo = (id, inputVal) => {
    saveId = id;
    saveValue = inputVal;
    todo.value = inputVal;
    addBtn.classList.remove("fa-plus");
    addBtn.classList.add("fa-download");
    addBtn.setAttribute("onclick", "saveTodo()")
}
//==================================   For Save   ========================================
const saveTodo = async () => {
    const dataRef = doc(db, "user-task", saveId);
    await updateDoc(dataRef, {
        task: todo.value,
        time: Timestamp.fromDate(new Date()),
    });
    todo.value = "";
    addBtn.classList.remove("fa-download");
    addBtn.classList.add("fa-plus");
    addBtn.setAttribute("onclick", "addData()")
}
//==================================   For Complete   ========================================
const completeTask = async (id, val) => {

    //==================================   Save for next page   ========================================
    const collectionRef = collection(db, "complete-task");
    const tasks = {
        uid: auth.currentUser.uid,
        complete: val,
    }
    await addDoc(collectionRef, tasks);

    //==================================   For Delete   ========================================
    let dataRef = doc(db, "user-task", id)
    await deleteDoc(dataRef);
}

function clearVal() {
    setTimeout(() => {
        todo.value = "";
    }, 3000);
}


//==================================   Define function exactly like because of import   ========================================
window.addData = addData;
window.deleteTodo = deleteTodo;
window.editTodo = editTodo;
window.saveTodo = saveTodo;
window.completeTask = completeTask;
window.addEventListener("keydown",(e)=>{
    if(e.key === "Enter"){
        addData();
    }
});