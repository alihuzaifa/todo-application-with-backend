// ======================================  Firebase  ===================================== 
import { app } from "./firebase/firebase-config.js"
import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";

// ======================================  All variables  ===================================== 
const auth = getAuth(app);
const email = document.querySelector("#inputEmail");
const password = document.querySelector("#inputPassword");
const login = document.querySelector("#login");
const emailError = document.querySelector(".email-error");
const passwordError = document.querySelector(".password-error");
const mainError = document.querySelector(".main-error");

// ======================================  Main Function  =====================================
const loginData = async () => {
    if (email.value !== "" || password.value !== "") {
        try {
            let user = await signInWithEmailAndPassword(auth, email.value, password.value)
            login.innerHTML = "Sign In"
            location = `signup/forget/verification/Todos/todo.html`
        }
        catch (error) {
            if (error.message === `Firebase: Error (auth/user-not-found).`) {
                mainError.innerHTML = "You don't have any account."
                mainError.classList.add("error");
                mainError.style.display = "block";
                childClearError()
            } else if (error.message === `Firebase: Error (auth/wrong-password).`) {
                mainError.innerHTML = `Wrong Password.`
                mainError.classList.add("error");
                mainError.style.display = "block";
                childClearError()
            }
        }
    } else {
        mainError.innerHTML = "Please Fill All Input Fields."
        mainError.classList.add("error");
        mainError.style.display = "block";
        childClearError()
    }
}
login.addEventListener("click", loginData);

// ======================================  Clear All error after 4 seconds  =====================================
function clearAllError() {
    emailError.innerHTML = "";
    passwordError.innerHTML = "";
    mainError.innerHTML = "";
    emailError.style.display = "none";
    passwordError.style.display = "none";
    mainError.style.display = "none";
}
function childClearError() {
    setTimeout(clearAllError, 4000);
}