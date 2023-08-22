//imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

//variables declaration
const endorsementText = document.getElementById("endorsement-text");
const senderText = document.getElementById("endorsement-sender");
const recipientText = document.getElementById("endorsement-recipient");
const publishBtn = document.getElementById("btn");
const endorsementsContainer = document.getElementById("endorsements-container");
var endorsements = [];
var currentItemId = [];
var currentItemValue = [];

//connectiong our app to our firebase database
const appSettings = {
  databaseURL: "https://wearethechampions-9e329-default-rtdb.firebaseio.com/",
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementsInDB = ref(database, "endorsements");

const clearInputField = () => {
  endorsementText.value = "";
  senderText.value = "";
  recipientText.value = "";
};
const clearEndorsementContainer = () => {
  endorsementsContainer.innerHTML = "";
};

publishBtn.addEventListener("click", () => {
  let endorsement = {
    to: recipientText.value,
    from: senderText.value,
    message: endorsementText.value,
    likes: 0,
    isLiked: false,
  };
  push(endorsementsInDB, endorsement);
  clearInputField();
});

//fetching items from the database
onValue(endorsementsInDB, function (snapshot) {
  if (snapshot.exists()) {
    let endorsementsArray = Object.entries(snapshot.val()); //turning the object(the values) returned into an array
    let reversedEndorsements = endorsementsArray.reverse();
    endorsements = reversedEndorsements;
    // console.log(endorsements);
    clearEndorsementContainer();
    for (let endorsement of reversedEndorsements) {
      renderEndorsements(endorsement);
    }
  } else {
    endorsementsContainer.innerHTML = `
                <p style="color: wheat;">No Endorsement yet....</p>
            `;
  }
});

document.addEventListener("click", (e) => {
  if (e.target.dataset.like) {
    handleLikes(e.target.dataset.like);
  }
});

const handleLikes = (id) => {
  endorsements.filter(function (msg) {
    let exactLocationofItemInDB = ref(database, `endorsements/${id}`);
    let currentItemId = msg[0];
    let currentItemValue = msg[1];

    if (currentItemId === id) {
      let updates;
      // console.log("they're the same", id, currentItemId);
      if (currentItemValue.isLiked) {
        updates = {
          ...currentItemValue,
          likes: currentItemValue.likes - 1,
          isLiked: !currentItemValue.isLiked,
        };
      } else {
        updates = {
          ...currentItemValue,
          likes: currentItemValue.likes + 1,
          isLiked: !currentItemValue.isLiked,
        };
      }
      update(exactLocationofItemInDB, updates);
    }
  });
};

const renderEndorsements = (endorsements) => {
  currentItemId = endorsements[0];
  currentItemValue = endorsements[1];
  // let newEl = document.createElement();
  if (endorsements.length !== 0) {
    // console.log(currentItemId);
    endorsementsContainer.innerHTML += `
              <div class="endorsementDiv" >
                    <h5>To ${currentItemValue.to}</h5>
                    <p class="interFont">${currentItemValue.message}</p>
                    <div class="sender">
                        <h5>From ${currentItemValue.from}</h5>
                        <h5 class="likes" data-like="${currentItemId}" >
                            ${currentItemValue.isLiked ? "❤️" : "♡"}${
      currentItemValue.likes
    }
                        </h5>
                    </div>
             </div>
        `;
  }
};
