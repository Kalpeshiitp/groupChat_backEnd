// Array to store selected users
const selectedUsers = [];
// Array to store search results
const searchResult = [];
// Socket.IO client connection
const socket = io();

// Utility function to get a DOM element by its ID
function getElement(id) {
  return document.getElementById(id);
}

// Utility function to set the display style of a DOM element
function displayElement(id, displayStyle) {
  const element = getElement(id);
  if (element) {
    element.style.display = displayStyle;
  }
}

// Function to display the group creation modal and hide the main container
function createGroup() {
  displayElement("createGroupModel", "block");
  displayElement("container", "none");
}

// Asynchronous function to handle user search
async function handleSearch(event) {
  const search = event.target.value;
  if (!search) return;

  try {
    // Make a GET request to the server to search for users
    const response = await axios.get(`http://localhost:3000/user?search=${search}`, {
      headers: { Authorization: localStorage.getItem("token") },
    });

    // Clear and update the search result array
    searchResult.length = 0;
    response.data.forEach(user => {
      searchResult.push({ id: user.id, name: user.name });
    });

    // Populate the user list on the UI
    populateUserList();
  } catch (error) {
    console.error(error);
  }
}

// Socket.IO event listener for receiving messages
socket.on("receiveMessage", (message) => {
  console.log('socket message>>>', message)
  const messageContainer = getElement("message");
  const receivedMessageElement = document.createElement("div");
  receivedMessageElement.innerText = `${message.message}`;
  messageContainer.appendChild(receivedMessageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
});

// Function to populate the user list on the UI
function populateUserList() {
  const userListContainer = getElement("user-list");
  userListContainer.innerHTML = "";
  searchResult.forEach((user) => {
    const userItem = document.createElement("li");
    userItem.textContent = user.name;
    userItem.addEventListener("click", () => addUserToGroup(user));
    userListContainer.appendChild(userItem);
  });
}

// Function to add a user to the selected users array
function addUserToGroup(user) {
  const isUserSelected = selectedUsers.some(
    (selectedUser) => selectedUser.id === user.id
  );
  if (!isUserSelected) {
    selectedUsers.push(user);
    // Update the UI with selected users
    populateSelectedUsers();
  }
}

// Function to populate the UI with selected users
function populateSelectedUsers() {
  const selectedUsersContainer = getElement("selected-users");
  selectedUsersContainer.innerHTML = "";
  selectedUsers.forEach((user) => {
    const userItem = document.createElement("li");
    userItem.id = `userItem-${user.id}`;
    userItem.textContent = user.name;
    selectedUsersContainer.appendChild(userItem);
  });
}

// Asynchronous function to handle the submission of the group creation form
async function handleSubmit() {
  const groupName = getElement("group-name").value;
  if (!groupName || selectedUsers.length === 0) {
    alert("Please fill all the fields.");
    return;
  }
  try {
    // Make a POST request to create a new group
    const response = await axios.post(
      "http://localhost:3000/api/chat/group",
      {
        groupName,
        users: selectedUsers.map((user) => ({ id: user.id, name: user.name })),
      },
      { headers: { Authorization: localStorage.getItem("token") } }
    );

    console.log('response skdhj>>>', response )
    
    // Emit a Socket.IO event for creating a new group
    socket.emit("newGroup", {
      groupId: response.data.newGroup.groupId,
      groupName: response.data.newGroup.groupName,
      userId: response.data.newGroup.userId,
    });

    // Fetch and display group chat information
    getGroupChat();

    // Hide the group creation modal and show the main container
    displayElement("createGroupModel", "none");
    displayElement("container", "flex");

    // Clear input fields and selected users array
    getElement("group-name").value = "";
    getElement("add-user").value = "";
    selectedUsers.length = 0;

    // Reload the window
    window.location.reload();
  } catch (error) {
    console.error("Error creating group:", error);
    alert("Failed to create group. Please try again.");
  }
}

// Asynchronous function to open a chat box for a group
async function openChatBox(groupId, groupName, userId) {
  // Emit a Socket.IO event to open a chat box
  socket.emit("openChatBox", groupId);

  // Update the group name in the UI
  const groupNameDiv = getElement("chatName");
  groupNameDiv.innerHTML = "";
  groupNameDiv.innerHTML = `${groupName}`;

  // Show/hide UI elements for chat messages
  displayElement("select-chat-msg", "none");
  displayElement("sendMsg", "block");

  // Clear the message container on the UI
  const messageDiv = getElement("message");
  messageDiv.innerHTML = "";

  try {
    // Fetch chat data for the group
    const chatData = await axios.get(
      `http://localhost:3000/api/messages/${groupId}`,
      { headers: { Authorization: localStorage.getItem("token") } }
    );

    // Get the logged-in user ID
    const loggedInUserId = chatData.data.loggedInUser;
    console.log('loggedInUserId',loggedInUserId)
    console.log('userId>>', userId)

    // If the logged-in user is the group creator, add an "Edit" button
    if (loggedInUserId === userId) {
      const editGroupButton = document.createElement('button');
      editGroupButton.innerHTML = `<span onclick="editGroup()">Edit</span>`;
      groupNameDiv.appendChild(editGroupButton);
    }

    // Check if there are messages in the chat
    const hasMessages =
      chatData.data.messages && chatData.data.messages.length > 0;

    if (hasMessages) {
      // Iterate through messages and display them on the UI
      chatData.data.messages.forEach((msg) => {
        const messageContainer = document.createElement("div");

        // Check if the sender is the logged-in user
        if (msg.userId === loggedInUserId) {
          // Display only the message without the sender's name
          const message = document.createElement("span");
          message.innerText = `${msg.message}`;
          messageContainer.appendChild(message);
        } else {
          // Display sender's name and the message
          const senderName = document.createElement("span");
          senderName.innerText = `${msg.user.name}: `;
          messageContainer.appendChild(senderName);

          const message = document.createElement("span");
          message.innerText = `${msg.message}`;
          messageContainer.appendChild(message);
        }

        // Append the message container to the UI
        messageDiv.append(messageContainer);
        messageDiv.scrollTop = messageDiv.scrollHeight;
      });
    } else {
      // If no messages, display a message indicating that there are no messages
      const noMessageSpan = document.createElement("span");
      noMessageSpan.innerText = "No messages yet.";
      messageDiv.append(noMessageSpan);
    }

    // Set up event listeners for sending messages
    const sendButton = getElement("send-button");
    sendButton.removeEventListener("click", sendMessage);
    sendButton.addEventListener("click", () => sendMessage(groupId));

    // Clear the input field for writing messages
    getElement("write-message").value = "";

    console.log(`Opening chat box for group with ID: ${groupId}-${groupName}`);
  } catch (err) {
    console.error(err);
  }
}

// Asynchronous function to fetch and display the list of group chats
async function getGroupChat() {
  try {
    // Make a GET request to fetch group chat information
    const response = await axios.get("http://localhost:3000/api/chat/group", {
      headers: { Authorization: localStorage.getItem("token") },
    });

    console.log('getGroupChat>>>>', response)

    // Update the UI with the list of group chats
    const chatUl = getElement("chatGroup");
    chatUl.innerHTML = "";
    if (Array.isArray(response.data.groupNames)) {
      response.data.groupNames.forEach((name) => {
        const chatItem = document.createElement("li");
        chatItem.id = name.groupId;
        chatItem.textContent = name.groupName;
        chatItem.addEventListener("click", () =>
          openChatBox(name.groupId, name.groupName, name.userId)
        );
        chatUl.appendChild(chatItem);
      });
    }
  } catch (err) {
    console.error(err);
  }
}

// Set the event handler for when the window is loaded to fetch and display group chats
window.onload = getGroupChat;

// Asynchronous function to send a message
async function sendMessage(groupId) {
  try {
    // Get the new message from the input field
    const newMessage = getElement("write-message").value;
    const message = { message: newMessage, groupId: groupId };

    // Emit a Socket.IO event to send the message
    socket.emit("sendMessage", message);

    // Make a POST request to save the message on the server
    const response = await axios.post(
      "http://localhost:3000/api/message",
      message,
      { headers: { Authorization: localStorage.getItem("token") } }
    );

    // Clear the input field for writing messages
    getElement("write-message").value = "";
    console.log("response for message", response);
  } catch (err) {
    console.error(err);
  }
}

// Function to edit a group (not fully implemented in this snippet)
async function editGroup(groupName) {
  // Set the display style of elements to show the group creation modal and hide the main container
  document.getElementById('createGroupModel').style.display = 'block';
  document.getElementById('container').style.display = 'none';
  // Populate the group name in the form
  document.getElementById('group-name').value = `${groupName}`;
}
