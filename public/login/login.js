async function login(event) {
    try {  event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const loginObj = {
        email: email,
        password: password,
      };
      console.log(loginObj)
        const response = await axios.post(
          "http://localhost:3000/user/login",
          loginObj
        );
        console.log('response from server>>>>',response)
        if(response.status===200){
            alert(response.data.message)
            localStorage.setItem('token',response.data.token)
            window.location.href='../group/group.html'
            }
      } catch (err) {
        if (err.response) {
          console.log("Response Status:", err.response.status);
        }
      }
    }

    // async function fetchAndDisplayUserList() {
    //   try {
    //     const response = await axios.get("http://localhost:3000/users", {
    //       headers: { Authorization: localStorage.getItem('token') },
    //     });
    
    //     const userList = document.getElementById("userList");
    //     userList.style.display='block'
    //     userList.innerHTML = "";
    
    //     // Display each user in the list with checkboxes
    //     response.data.users.forEach(user => {
    //       const userCheckbox = document.createElement("input");
    //       userCheckbox.type = "checkbox";
    //       userCheckbox.value = user.id;
    //       userCheckbox.name = "selectedUsers";
    
    //       const userName = document.createElement("span");
    //       userName.textContent = user.name;
    
    //       const userItem = document.createElement("div");
    //       userItem.appendChild(userCheckbox);
    //       userItem.appendChild(userName);
    
    //       userList.appendChild(userItem);
    //     });
    
    //   } catch (error) {
    //     console.error('Error fetching user list:', error);
    //   }
    // }
