// ====================================== Import Firebase  ===================================== 
import {
    db,
    storage,
    auth
} from "../firebase/firebase-config.js"
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
import {
    uploadBytes,
    getDownloadURL,
    ref
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js"

// ======================================  All variables  ===================================== 
const name = document.querySelector("#inputName");
const email = document.querySelector("#inputEmail");
const password = document.querySelector("#inputPassword");
const confirmPassword = document.querySelector(".confirm-password");
const image = document.querySelector("#formFileLg");
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
const signup = document.querySelector("#sign-up");
let correct = 0;

// ======================================  All error variables  ===================================== 
const mainError = document.querySelector("#main-error");
const nameError = document.querySelector("#name-error");
const emailError = document.querySelector("#email-error");
const passwordError = document.querySelector("#password-error");
const confirmPasswordError = document.querySelector("#confirm-password-error");
const fileError = document.querySelector("#file-error");

// ======================================  You Have To Define It First  =====================================
onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        // console.log(uid)
    } else {
        // console.log("Signout");
    }
});

// ======================================  Main Function  =====================================
const signupData = async () => {

    // ======================================  Name Checker  ===================================== 
    if (name.value !== "") {
        if (name.value.length > 2) {
            correct++
        } else {
            nameError.innerHTML = "Please enter a valid Name";
            nameError.classList.add("error");
            nameError.style.display = "block"
            childClearError();
            return false
        }

    } else {
        mainError.innerHTML = "ALL INPUT FIELDS ARE REQUIRED";
        mainError.classList.add("error");
        mainError.style.display = "block";
        childClearError();
        return false
    }

    // ======================================  Email Checker  ===================================== 
    if (email.value !== "") {
        if (emailRegex.test(email.value)) {
            correct++
        } else {
            emailError.innerHTML = "Please enter a valid email"
            emailError.classList.add("error");
            emailError.style.display = "block"
            childClearError();
            return false
        }

    } else {
        mainError.innerHTML = "ALL INPUT FIELDS ARE REQUIRED"
        mainError.classList.add("error");
        mainError.style.display = "block"
        childClearError();
        return false
    }

    // ======================================  Password Checker  ===================================== 
    if (password.value !== "") {
        if (password.value.length > 7) {
            correct++
        } else {
            passwordError.innerHTML = "Password contain minimum 8 characters";
            passwordError.classList.add("error");
            passwordError.style.display = "block";
            childClearError();
            return false
        }

    } else {
        mainError.innerHTML = "ALL INPUT FIELDS ARE REQUIRED"
        mainError.classList.add("error");
        mainError.style.display = "block";
        childClearError();
        return false;
    }

    // ======================================  Confirm Password Checker  ===================================== 
    if (confirmPassword.value !== ``) {
        if (confirmPassword.value === password.value) {
            correct++
        } else {
            confirmPasswordError.innerHTML = "Please Enter a matched password"
            confirmPasswordError.classList.add("error");
            confirmPasswordError.style.display = "block";
            childClearError();
            return false
        }
    }
    else {
        mainError.innerHTML = "ALL INPUT FIELDS ARE REQUIRED";
        mainError.classList.add("error");
        mainError.style.display = "block"
        childClearError();
        return false
    }

    // ======================================  File Checker  ===================================== 
    if (image.files !== ``) {
        correct++
    }
    else {
        mainError.innerHTML = "ALL INPUT FIELDS ARE REQUIRED";
        mainError.classList.add("error");
        mainError.style.display = "block";
        childClearError();
        return false
    }

    if (correct >= 5) {
        let upload_picture = image.files[0]
        try {
            // ======================================  Firebase Authentication  ===================================== 
            await createUserWithEmailAndPassword(auth, email.value, password.value);

            // ======================================  Firebase Storage  ===================================== 
            const imageRef = await ref(storage, `user-images/${upload_picture.name}`);
            await uploadBytes(imageRef, upload_picture);
            const url = await getDownloadURL(imageRef);

            // ======================================  Firebase Firestore  ===================================== 
            const dataRef = collection(db, "users");
            await addDoc(dataRef, {
                userName: name.value,
                userEmail: email.value,
                uid: auth.currentUser.uid,
                image: url
            });

            // ======================================  Send Email For Verify  ===================================== 
            await sendEmailVerification(auth.currentUser);
            signup.innerHTML = "Sign Up"

            // ======================================  Change Location  =====================================
            location = "forget/verification/verification.html";
            clearAllInput();
        }
        catch (error) {
            if(error.message == "Firebase: Error (auth/email-already-in-use)."){
                mainError.innerHTML = "Email Already In Use. Please Enter Another email."
                mainError.classList.add("error");
                mainError.style.display = "block";
                childClearError();
                return false;
            }
        }
    }
}
signup.addEventListener("click", signupData);

// ======================================  Clear All input after data is confirm  =====================================
function clearAllInput() {
    name.value = "";
    email.value = "";
    password.value = "";
    confirmPassword.value = "";
    image.files = "";
}

// ======================================  Clear All error after 4 seconds  =====================================
function clearAllError() {
    nameError.innerHTML = "";
    emailError.innerHTML = "";
    passwordError.innerHTML = "";
    confirmPasswordError.innerHTML = "";
    mainError.innerHTML = "";
    nameError.style.display = "none";
    emailError.style.display = "none";
    passwordError.style.display = "none";
    confirmPasswordError.style.display = "none";
    mainError.style.display = "none";
}
function childClearError() {
    setTimeout(clearAllError, 4000);
}