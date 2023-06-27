//imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

//variables declaration
const endorsementText = document.getElementById("endorsement-text");
const senderText = document.getElementById("endorsement-sender");
const recipientText = document.getElementById("endorsement-recipient");
const publishBtn = document.getElementById("btn");
const likePost = document.getElementById("like-post");
const endorsementsContainer = document.getElementById("endorsements-container");

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
console.log(likePost);

//fetching items from the database
onValue(endorsementsInDB, function (snapshot) {
  if (snapshot.exists()) {
    let endorsementsArray = Object.values(snapshot.val()); //turning the object returned into an array
    let endorsementsIDs = Object.keys(snapshot.val());
    console.log(endorsementsIDs);
    clearEndorsementContainer();
    // for (let endorsement of endorsementsArray) {
    //   console.log(endorsement);
    // }
    renderEndorsements(endorsementsArray);
  } else {
    endorsementsContainer.innerHTML = `
                <p style="color: wheat;">No Endorsement yet....</p>
            `;
  }
});

const renderEndorsements = (endorsements) => {
  const likes = () => {
    console.log("likessss");
  };

  if (endorsements.length !== 0) {
    // console.log("it is not  empty");
    endorsementsContainer.innerHTML = `
            ${endorsements
              .reverse()
              .map((msg) => {
                return `
                         <div class="endorsementDiv" >
                            <h5>To ${msg.to}</h5>
                            <p class="interFont">${msg.message}</p>
                            <div class="sender">
                                <h5>From ${msg.from}</h5>
                                <h5 class="likes" onclick = "${likes}">
                                    ${msg.isLiked ? "❤️" : "🖤"}${msg.likes}
                                </h5>
                            </div>
                        </div>
                    `;
              })
              .join("")}
        `;
  }
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
