
const socket = io();
async function postUserData(event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phoneNumber = document.getElementById("phone-number").value;
  const password = document.getElementById("password").value;
  const userSignupDetailObj = {
    name: name,
    email: email,
    phoneNumber: phoneNumber,
    password: password,
  };
  console.log(userSignupDetailObj)
  try {
    const response = await axios.post('http://localhost:3000/user/signup', userSignupDetailObj);
    if (response.status === 201) {
      alert("Signup successful. You can now log in.");
      window.location.href = "../login/login.html";
    } else {
      console.log("Error during signup, unable to redirect to login.");
    }
  } catch (err) {
    console.log("error", err);
    alert("email is already exist")
  }
  document.getElementById("name").value=''
  document.getElementById("email").value='';
  document.getElementById("phone-number").value='';
  document.getElementById("password").value='';
}