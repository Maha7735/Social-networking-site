const baseUrl = "https://tarmeezacademy.com/api/v1";

// ========== POST REQUEST ===========

function createNewPostClicked() {
  let postId = document.getElementById("post-id-input").value;
  let isCreate = postId == null || postId == "";

  const title = document.getElementById("post-title-input").value;
  const body = document.getElementById("post-body-input").value;
  const image = document.getElementById("post-image-input").files[0];

  let formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  formData.append("image", image);

  //   const params = {
  //     title: title,
  //     body: body,
  //   };

  const token = localStorage.getItem("token");
  let url = "";
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (isCreate) {
    url = `https://tarmeezacademy.com/api/v1/posts`;
    toggleLoader(true);
    axios
      .post(url, formData, {
        headers: headers,
      })
      .then((response) => {
        const modal = document.getElementById("create-post-modal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
        showAlert(`New Post Has Been Created`, `success`);
        getPosts();
      })
      .catch(function (error) {
        const message = error.response.data.message;
        showAlert(message, "danger");
        toggleLoader(false);
      });
  } else {
    formData.append("_method", "put");
    url = `https://tarmeezacademy.com/api/v1/posts/${postId}`;
    axios
      .post(url, formData, {
        headers: headers,
      })
      .then((response) => {
        const modal = document.getElementById("create-post-modal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
        showAlert(`New Post Has Been Created`, `success`);
        getPosts();
      })
      .catch(function (error) {
        const message = error.response.data.message;
        showAlert(message, "danger");
      })
      .finally(() => {
        toggleLoader(false);
      });
  }
}

function editPostBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  document.getElementById("post-modal-submit-btn").innerHTML = "Update";
  document.getElementById("post-id-input").value = post.id;
  document.getElementById("post-modal-title").innerHTML = "Edit Post";
  document.getElementById("post-title-input").value = post.title;
  document.getElementById("post-body-input").value = post.body;
  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal"),
    {}
  );
  postModal.toggle();
}
function deletePostBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  document.getElementById("delete-post-id-input").value = post.id;
  let postModal = new bootstrap.Modal(
    document.getElementById("delete-post-modal"),
    {}
  );
  postModal.toggle();
}

function confirmPostDelete() {
  const token = localStorage.getItem("token");
  const postId = document.getElementById("delete-post-id-input").value;
  const baseUrl = "https://tarmeezacademy.com/api/v1";
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const url = `${baseUrl}/posts/${postId}`;
  axios
    .delete(url, {
      headers: headers,
    })
    .then((response) => {
      const modal = document.getElementById("delete-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert(`The post has been deleted successfully`, `success`);
      getPosts();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    });
  getPosts();
}

function profileClicked() {
  const user = getCurrentUser();
  const userId = user.id;
  window.location = `profile.html?userid=${userId}`;
}

function setupUI() {
  const token = localStorage.getItem("token");
  const loginDiv = document.getElementById("logged-in-div");
  const logoutDiv = document.getElementById("logout-div");
  //add btn
  const addBtn = document.getElementById("add-btn");
  if (token == null) {
    //user is guest
    if (addBtn != null) {
      addBtn.style.setProperty("display", "none", "important");
    }
    loginDiv.style.setProperty("display", "flex", "important");
    logoutDiv.style.setProperty("display", "none", "important");
  } else {
    //for loggedin user
    if (addBtn != null) {
      addBtn.style.setProperty("display", "flex", "important");
    }
    loginDiv.style.setProperty("display", "none", "important");
    logoutDiv.style.setProperty("display", "flex", "important");

    const user = getCurrentUser();
    document.getElementById("nav-username").innerHTML = user.username;
    document.getElementById("nav-user-image").src = user.profile_image;
  }
}

function loginBtnClicked() {
  const baseUrl = "https://tarmeezacademy.com/api/v1";
  const username = document.getElementById("username-input").value;
  const password = document.getElementById("password-input").value;

  const params = {
    username: username,
    password: password,
  };
  const url = `${baseUrl}/login`;
  toggleLoader(true);
  axios
    .post(url, params)
    .then((response) => {
      // console.log(response.data.token)
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      //to hide the modal
      const modal = document.getElementById("login-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert(`user logged IN successfully`, `success`);
      setupUI();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}

function registerBtnClicked() {
  const name = document.getElementById("register-name-input").value;
  const username = document.getElementById("register-username-input").value;
  const password = document.getElementById("register-password-input").value;
  const image = document.getElementById("profile-image").files[0];
  console.log(name, username, password);

  const formData = new FormData();
  formData.append("name", name);
  formData.append("username", username);
  formData.append("password", password);
  formData.append("image", image);
  const baseUrl = "https://tarmeezacademy.com/api/v1";
  const url = `${baseUrl}/register`;
  toggleLoader(true);
  axios
    .post(url, formData)
    .then((response) => {
      // console.log(response.data.token)
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      //to hide the modal
      const modal = document.getElementById("register-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert(`New Usre Register Successfully`, `success`);
      setupUI();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, `danger`);
    })
    .finally(() => {
      toggleLoader(false);
    });
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showAlert(`user logged OUT successfully`, `danger`);
  setupUI();
}

function showAlert(messagee, typee) {
  const alertPlaceholder = document.getElementById("success-alert");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };
  appendAlert(messagee, typee);
  setTimeout(() => {
    const alertToHide = bootstrap.Alert.getOrCreateInstance("#success-alert");
    alertToHide.close();
  }, 2000);
}

function getCurrentUser() {
  let user = null;
  const storageUser = localStorage.getItem("user");
  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }
  return user;
}
function postClicked(postId) {
  window.location = `postDetails.html?postId=${postId}`;
}

function toggleLoader(show = true) {
  if (show) {
    document.getElementById("loader").style.visibility = "visible";
  } else {
    document.getElementById("loader").style.visibility = "hidden";
  }
}
// SCROLL TO TOP
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // For smooth scrolling animation
  });
}

let mybutton = document.getElementById("toUpBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
