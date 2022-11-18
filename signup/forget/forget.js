// ======================================  Import Firebase  ===================================== 
import { auth } from "../../firebase/firebase-config.js";
import {
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";

// ======================================  All Variables  ===================================== 
const send = document.querySelector("#send");
const email = document.querySelector(".email");
const errorMessage = document.querySelector("#message-error");
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

// ======================================  Main Function  ===================================== 
const sendMessage = async () => {
    if (emailRegex.test(email.value)) {
        try {
            await sendPasswordResetEmail(auth, email.value);
            email.value = ""
            errorMessage.style.display = "block"
            errorMessage.innerHTML = "The link for new password has been send to your gmail."
            errorMessage.classList.add("error");
            childClearError();
        }
        catch (error) {
            if (error.message === "Firebase: Error (auth/user-not-found).") {
                errorMessage.innerHTML = "You dont have any account to reset password."
            }
        }
    }
    else{
        errorMessage.innerHTML = "Please enter a valid email."
        errorMessage.classList.add("error");
        errorMessage.style.display = "block"
        childClearError()
    }

}
send.addEventListener("click", sendMessage);

// ======================================  Clear All error after 4 seconds  =====================================
function clearAllError() {
    errorMessage.innerHTML = "";
    errorMessage.style.display = "none";
}
function childClearError() {
    setTimeout(clearAllError, 4000);
}