// ==================== HOME PAGE: Image Slider ====================
const slider = document.getElementById('slider');
const slides = document.querySelectorAll('.slide');
if (slider && slides.length > 0) {
  let currentIndex = 0;

  function showNextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  setInterval(showNextSlide, 4000);
}

// ==================== HOME PAGE: Last Viewed Videos (Scroll + Swipe) ====================
const track = document.getElementById("videoTrack");
const leftBtn = document.querySelector(".slide-btn.left");
const rightBtn = document.querySelector(".slide-btn.right");

if (track && leftBtn && rightBtn) {
  leftBtn.addEventListener("click", () => {
    track.scrollBy({ left: -400, behavior: "smooth" });
  });

  rightBtn.addEventListener("click", () => {
    track.scrollBy({ left: 400, behavior: "smooth" });
  });

  // Swipe support
  let isDown = false;
  let startX, scrollLeft;

  track.addEventListener("touchstart", (e) => {
    isDown = true;
    startX = e.touches[0].pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener("touchmove", (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - track.offsetLeft;
    const walk = x - startX;
    track.scrollLeft = scrollLeft - walk;
  });

  track.addEventListener("touchend", () => isDown = false);
}

// ==================== INDEX PAGE: Login/Register Modal ====================
const loginModal = document.getElementById('loginModal');
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');

if (loginModal && loginTab && registerTab) {
  window.showModal = function () {
    loginModal.style.display = 'flex';
  };

  window.hideModal = function () {
    loginModal.style.display = 'none';
  };

  window.showTab = function (tab) {
    loginTab.style.display = (tab === 'login') ? 'block' : 'none';
    registerTab.style.display = (tab === 'register') ? 'block' : 'none';
  };
window.registerUser = function () {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirmPassword = document.getElementById('reg-confirm-password').value;

  if (!name || !email || !password || !confirmPassword) {
    alert("Please fill all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  // Get existing users array or create new one
  let users = JSON.parse(localStorage.getItem("allUsers")) || [];

  // Check if email already exists
  const userExists = users.some(user => user.email === email);
  if (userExists) {
    alert("This email is already registered.");
    return;
  }

  // Create new user object
  const newUser = {
    name: name,
    email: email,
    password: password,
    phone: "",
    bio: "New user at INFONAN Learn"
  };

  // Add new user and save
  users.push(newUser);
  localStorage.setItem("allUsers", JSON.stringify(users));

  alert("Registration successful! Please log in.");
  showTab('login');
};

window.loginUser = function () {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  const users = JSON.parse(localStorage.getItem("allUsers")) || [];

  const matchedUser = users.find(user => user.email === email && user.password === password);

  if (matchedUser) {
    // Save logged-in user's profile separately
    localStorage.setItem("userProfile", JSON.stringify(matchedUser));
    alert("Login successful!");
    window.location.href = "home.html";
  } else {
    alert("Invalid email or password. Please register first.");
  }
};

// Close modal when clicking outside
  window.onclick = function (event) {
    if (event.target === loginModal) {
      loginModal.style.display = "none";
    }
  };
}

// ==================== COURSES PAGE: Search Filter ====================
const searchBox = document.getElementById('searchBox');
const searchBtn = document.getElementById('searchBtn');
const courseCards = document.querySelectorAll('.course-card');

function filterCourses() {
  const searchTerm = searchBox.value.toLowerCase();
  courseCards.forEach(card => {
    const title = card.querySelector('h2').textContent.toLowerCase();
    const desc = card.querySelector('p').textContent.toLowerCase();
    const matches = title.includes(searchTerm) || desc.includes(searchTerm);
    card.style.display = matches ? 'flex' : 'none';
  });
}

if (searchBox && searchBtn && courseCards.length > 0) {
  searchBtn.addEventListener('click', filterCourses);
  searchBox.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      filterCourses();
    }
  });
}

// ==================== COURSES PAGE: Load More Courses ====================
const loadMoreBtn = document.getElementById('loadMoreBtn');
let visibleCount = 6;

function updateVisibleCourses() {
  courseCards.forEach((card, index) => {
    card.style.display = index < visibleCount ? 'flex' : 'none';
  });

  if (visibleCount >= courseCards.length) {
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
  }
}

if (loadMoreBtn && courseCards.length > 0) {
  loadMoreBtn.addEventListener('click', () => {
    visibleCount += 6;
    updateVisibleCourses();
  });

  updateVisibleCourses(); // Initial run
}

// store course data //
function enrollCourse(course) {
  // Get current user
  const user = JSON.parse(localStorage.getItem("userProfile"));
  if (!user) {
    alert("Please login first.");
    window.location.href = "index.html";
    return;
  }

  // Use a user-specific key for enrolled courses
  const enrolledKey = `enrolledCourses_${user.email}`;
  let enrolledCourses = JSON.parse(localStorage.getItem(enrolledKey)) || [];

  // Check if course already enrolled (avoid duplicates)
  const alreadyEnrolled = enrolledCourses.some(c => c.title === course.title);
  if (!alreadyEnrolled) {
    enrolledCourses.push(course);
    localStorage.setItem(enrolledKey, JSON.stringify(enrolledCourses));
  }

  // Set selectedCourse for immediate use
  localStorage.setItem('selectedCourse', JSON.stringify(course));
  window.location.href = "enroll.html";
}


// Attach event listeners to all enroll buttons
document.querySelectorAll('.enroll-btn').forEach(button => {
  button.addEventListener('click', () => {
    // Parse videos array from data-videos attribute (if present)
    let videos = [];
    const videosData = button.getAttribute('data-videos');
    if (videosData) {
      try {
        videos = JSON.parse(videosData);
      } catch (e) {
        console.warn('Invalid videos JSON:', e);
      }
    }

    const course = {
      title: button.dataset.title,
      instructor: button.dataset.instructor,
      description: button.dataset.description,
      price: button.dataset.price,
      image: button.dataset.image,
      videos: videos
    };

    enrollCourse(course);
  });
});
