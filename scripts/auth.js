function togglePassword(id) {
  const field = document.getElementById(id);
  field.type = field.type === "password" ? "text" : "password";
}

// Email validation
function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

// Password strength check
function checkStrength(pass) {
  const strength = document.getElementById("passwordStrength");

  if (pass.length < 6) {
    strength.textContent = "Weak password ❌";
    strength.style.color = "red";
  } else if (pass.match(/[A-Z]/) && pass.match(/[0-9]/)) {
    strength.textContent = "Strong password ✔";
    strength.style.color = "green";
  } else {
    strength.textContent = "Moderate password ⚠️";
    strength.style.color = "orange";
  }
}

// Signup form validation
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const pass = document.getElementById("signupPassword").value.trim();
    const confirm = document.getElementById("confirmPassword").value.trim();

    let valid = true;

    if (!isValidEmail(email)) {
      document.getElementById("signupEmailError").textContent = "Invalid email format";
      valid = false;
    } else {
      document.getElementById("signupEmailError").textContent = "";
    }

    if (pass.length < 8) {
      document.getElementById("signupPasswordError").textContent = "Password must be at least 8 characters";
      valid = false;
    } else {
      document.getElementById("signupPasswordError").textContent = "";
    }

    if (pass !== confirm) {
      document.getElementById("confirmPasswordError").textContent = "Passwords do not match";
      valid = false;
    } else {
      document.getElementById("confirmPasswordError").textContent = "";
    }

    if (valid) {
      alert("Account created successfully!");
      window.location.href = "login.html";
    }
  });

  document.getElementById("signupPassword").addEventListener("input", (e) => {
    checkStrength(e.target.value);
  });
}

// Login validation
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPassword").value.trim();

    if (!isValidEmail(email)) {
      document.getElementById("loginEmailError").textContent = "Invalid email format";
      return;
    }

    if (pass.length < 6) {
      document.getElementById("loginPasswordError").textContent = "Invalid password";
      return;
    }

    alert("Logged in successfully!");

  });
}



// Forgot password form handler
document.getElementById("forgotForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("forgotEmail").value;

    if (!email.includes("@")) {
        alert("Please enter a valid email address.");
        return;
    }

    alert("Password reset link has been sent to your email!");
});
