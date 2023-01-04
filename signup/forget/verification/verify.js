// ======================================  Firebase  =====================================
import { auth } from "../../../firebase/firebase-config.js";
import {
  sendEmailVerification,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";

// ======================================  All Variables  =====================================
const resendBtn = document.querySelector("#resend");
const verified = document.querySelector("#verify");
const verifyError = document.querySelector(".error");
let getUser;

// // ======================================  Resend Email to user Gmail  =====================================
function resend() {
  event.preventDefault();
  resendBtn.innerHTML = `<div class="spinner-border"></div>`;
  sendEmailVerification(auth.currentUser);
  resendBtn.innerHTML = `Resend`;
  swal({
    title: "Good!",
    text: "We have send you confirmation email. Check it",
    icon: "success",
    button: "OK",
  });
}
resendBtn.addEventListener("click", resend);

// // ======================================  You have to define it first  =====================================
function checkVerification() {
  verified.innerHTML = `<div class="spinner-border"></div>`;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      getUser = user;
      changedPage();
    } else {
      console.log("User is signed out");
    }
  });
  verified.innerHTML = `Verified`;
}
verified.addEventListener("click", checkVerification);

// // ======================================  Check Verification  =====================================
function changedPage() {
  event.preventDefault();
  if (getUser.emailVerified === true) {
    swal({
      title: "Good!",
      text: "You have successfully subscribe to your account now login again!",
      icon: "success",
      button: "OK",
    });
  } else {
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
};
function removeError() {
  setTimeout(clear, 5000);
}
