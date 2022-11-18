// ======================================  Firebase  ===================================== 
import { auth } from "../../../firebase/firebase-config.js";
import {
    sendEmailVerification,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";

// ======================================  All Variables  ===================================== 
const resendBtn = document.querySelector("#resend");
const verified = document.querySelector("#verify");
const verifyError = document.querySelector(".error");
let getUser;

// // ======================================  Resend Email to user Gmail  ===================================== 
function resend(){
    sendEmailVerification(auth.currentUser)
}
resendBtn.addEventListener("click",resend)

// // ======================================  You have to define it first  ===================================== 
function checkVerification(){
    onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          getUser = user
          changedPage()
        }
         else {
          console.log("User is signed out")
        }
      });
}
verified.addEventListener("click",checkVerification);

// // ======================================  Check Verification  ===================================== 
function changedPage(){
    if(getUser.emailVerified === true){
        swal({
            title: "Good!",
            text: "You have successfully subscribe to your account now login again!",
            icon: "success",
            button: "OK",
          });
        
    }
    else{
        verifyError.innerHTML = "Please check your email and confirmed";
        verifyError.classList.add("error");
        verifyError.style.display = "block";
        verifyError.innerHTML = "Please check your email and confirmed.";
        removeError();
    }
}

const clear = () => {
    verifyError.innerHTML = ``;
    verifyError.style.display = "none";

}
function removeError(){
    setTimeout(clear,4000)
}