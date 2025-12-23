// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navUl = document.querySelector('nav ul');

menuToggle.addEventListener('click', () => {
    navUl.classList.toggle('active');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        navUl.classList.remove('active');
    });
});

// Scroll to top button
const scrollToTopBtn = document.getElementById('scroll-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Header background change on scroll
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navUl.classList.remove('active');
    }
});

// Focus management for accessibility
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('focus', () => {
        navUl.classList.add('active');
    });
});

// Aria-labels for accessibility
menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');

// Fitness Tracker Functionality
let workouts = JSON.parse(localStorage.getItem('workouts')) || [];

// Update dashboard stats
function updateDashboard() {
    const totalWorkouts = workouts.length;
    const totalTime = workouts.reduce((sum, w) => sum + w.duration, 0);
    const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
    const goalsAchieved = Math.floor(totalWorkouts / 10); // Simple goal: 10 workouts = 1 goal

    document.getElementById('total-workouts').textContent = totalWorkouts;
    document.getElementById('total-time').textContent = `${totalTime} min`;
    document.getElementById('total-calories').textContent = totalCalories;
    document.getElementById('goals-achieved').textContent = goalsAchieved;

    // Update recent activities
    const recentList = document.getElementById('recent-list');
    recentList.innerHTML = '';
    const recent = workouts.slice(-5).reverse();
    if (recent.length === 0) {
        recentList.innerHTML = '<li>No recent workouts</li>';
    } else {
        recent.forEach(workout => {
            const li = document.createElement('li');
            li.textContent = `${workout.type} - ${workout.duration} min - ${workout.calories} cal`;
            recentList.appendChild(li);
        });
    }
}

// Workout form submission
document.getElementById('workout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('workout-type').value;
    const duration = parseInt(document.getElementById('duration').value);
    const calories = parseInt(document.getElementById('calories').value);
    const notes = document.getElementById('notes').value;

    const workout = {
        id: Date.now(),
        type,
        duration,
        calories,
        notes,
        date: new Date().toISOString()
    };

    workouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(workouts));

    // Reset form
    e.target.reset();

    // Update dashboard and progress
    updateDashboard();
    updateProgress();

    // Show success message
    alert('Workout logged successfully!');
});

// Update progress section
function updateProgress() {
    // Update workout history
    const historyList = document.getElementById('workout-history');
    historyList.innerHTML = '';
    if (workouts.length === 0) {
        historyList.innerHTML = '<li>No workouts logged yet</li>';
    } else {
        workouts.slice(-10).reverse().forEach(workout => {
            const li = document.createElement('li');
            const date = new Date(workout.date).toLocaleDateString();
            li.textContent = `${date} - ${workout.type} - ${workout.duration} min - ${workout.calories} cal`;
            historyList.appendChild(li);
        });
    }

    // Update charts
    updateCharts();
}

// Update charts with Chart.js
function updateCharts() {
    // Weekly workouts chart
    const weeklyData = getWeeklyData();
    const weeklyCtx = document.getElementById('weekly-chart').getContext('2d');
    new Chart(weeklyCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Workouts',
                data: weeklyData.workouts,
                backgroundColor: '#4CAF50',
                borderColor: '#4CAF50',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Monthly calories chart
    const monthlyData = getMonthlyData();
    const caloriesCtx = document.getElementById('calories-chart').getContext('2d');
    new Chart(caloriesCtx, {
        type: 'line',
        data: {
            labels: monthlyData.labels,
            datasets: [{
                label: 'Calories Burned',
                data: monthlyData.calories,
                backgroundColor: 'rgba(33, 150, 243, 0.2)',
                borderColor: '#2196F3',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Helper function to get weekly workout data
function getWeeklyData() {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const workoutsThisWeek = workouts.filter(w => new Date(w.date) >= weekStart);

    const dailyWorkouts = [0, 0, 0, 0, 0, 0, 0];
    workoutsThisWeek.forEach(workout => {
        const day = new Date(workout.date).getDay();
        dailyWorkouts[day]++;
    });

    return { workouts: dailyWorkouts };
}

// Helper function to get monthly calorie data
function getMonthlyData() {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const workoutsThisMonth = workouts.filter(w => new Date(w.date) >= monthStart);

    const dailyCalories = {};
    workoutsThisMonth.forEach(workout => {
        const day = new Date(workout.date).getDate();
        dailyCalories[day] = (dailyCalories[day] || 0) + workout.calories;
    });

    const labels = [];
    const calories = [];
    for (let i = 1; i <= 31; i++) {
        labels.push(i.toString());
        calories.push(dailyCalories[i] || 0);
    }

    return { labels, calories };
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateDashboard();
    updateProgress();
});
