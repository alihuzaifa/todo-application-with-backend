// ==================================   Firebase   ========================================
import { db, auth } from "../../../../../../firebase/firebase-config.js"
import {
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
import {
    collection,
    query,
    where,
    onSnapshot,
    doc,
    deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";

// ==================================   All Variables   ========================================
const currentDate = document.querySelector(".time-schedule");
const days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const date = new Date();
const time = document.querySelector(".time");
const taskNumber = document.querySelector(".task-count");
const list = document.querySelector(".list-data");

// ======================================  You Have To Define It First  =====================================
onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        fetchData()
    } else {
        console.log("User is signed out")
    }
});

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

function fetchData() {
    const collectionRef = collection(db, "complete-task");
    const personalQuery = where("uid", "==", auth.currentUser.uid)
    const q = query(collectionRef, personalQuery);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const number = querySnapshot.size
        taskNumber.innerHTML = number;
        list.innerHTML = "";
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            list.innerHTML += `<div class="col-10 col-sm-10 my-1 task-line py-2">
            <div class="task ms-2">${data.complete}</div>
        </div>
        <div class="col-2 col-sm-2 my-1 task-line py-2 text-center">
            <i class="fas fa-trash-alt icon" onclick="deleteTodo('${doc.id}')"></i>
        </div>`
        });
    });
}

//==================================   For Delete   ========================================
const deleteTodo = async (id) => {
    let dataRef = doc(db, "complete-task", id)
    await deleteDoc(dataRef);
}
window.deleteTodo = deleteTodo;