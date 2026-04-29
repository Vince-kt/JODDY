// JODDY Enhanced JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // ==========================================
    // MANDATORY ONBOARDING GATE
    // Redirects users with no role to role selection page
    // Backend equivalent: requireRole middleware (see middleware/authMiddleware.js)
    // ==========================================
    (function enforceRoleGate() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const roleSelected = localStorage.getItem('joddy-role-selected');
        const userRole = localStorage.getItem('joddy-user-role');

        // Skip gate on role-selection page itself and allow demo override
        const isRolePage = currentPage === 'role-selection.html';
        const skipGate = new URLSearchParams(window.location.search).get('skip') === 'true';

        if (!isRolePage && !skipGate && (!roleSelected || roleSelected !== 'true' || !userRole)) {
            // Simulate middleware redirect: res.redirect('/role-selection')
            window.location.href = 'role-selection.html?redirect=' + encodeURIComponent(currentPage);
            return; // Stop further execution
        }
    })();

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('joddy-theme', newTheme);
            this.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }

    // Initialize theme
    const savedTheme = localStorage.getItem('joddy-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (themeToggle) {
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeBtn = document.querySelector('.close-mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('active');
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        }
    }

    // Fade-in Animation on Scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));

    // Login/Logout buttons
    const loginBtn = document.querySelector('.login-btn');
    const logoutBtn = document.querySelector('.logout-btn');
    const userMenu = document.querySelector('.user-menu');

    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            showToast('Login feature coming soon!', 'info');
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            showToast('Logged out successfully', 'success');
        });
    }

    // Search form
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = this.querySelector('input').value;
            if (query) {
                showToast(`Searching for: ${query}`, 'info');
            }
        });
    }

    // Filter buttons (for jobs page)
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// Toast Notification Function
function showToast(message, type = 'info') {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };

    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ==========================================
// ROLE TOGGLE FUNCTIONALITY
// ==========================================

function toggleUserRole() {
    const currentRole = localStorage.getItem('joddy-user-role') || 'employer';
    const newRole = currentRole === 'employer' ? 'provider' : 'employer';
    
    localStorage.setItem('joddy-user-role', newRole);
    updateDashboardView(newRole);
    
    const message = newRole === 'employer' 
        ? 'Switched to Employer Mode — Post jobs and hire providers!'
        : 'Switched to Provider Mode — Find work and earn money!';
    showToast(message, 'success');
}

function updateDashboardView(role) {
    // Update banner
    const roleBadge = document.getElementById('currentRoleBadge');
    const roleText = document.getElementById('currentRoleText');
    const switchToText = document.getElementById('switchToText');
    const banner = document.getElementById('roleBanner');
    
    if (roleBadge && roleText && switchToText && banner) {
        if (role === 'employer') {
            roleBadge.textContent = '👔';
            roleText.innerHTML = 'Current Mode: <strong>Employer</strong>';
            switchToText.textContent = 'Provider';
            banner.classList.remove('provider-mode');
        } else {
            roleBadge.textContent = '🔧';
            roleText.innerHTML = 'Current Mode: <strong>Provider</strong>';
            switchToText.textContent = 'Employer';
            banner.classList.add('provider-mode');
        }
    }
    
    // Toggle dashboards (dashboard.html)
    const employerDash = document.getElementById('employerDashboard');
    const providerDash = document.getElementById('providerDashboard');
    
    if (employerDash) employerDash.classList.toggle('hidden', role !== 'employer');
    if (providerDash) providerDash.classList.toggle('hidden', role !== 'provider');
    
    // Toggle profile-specific sections (profile-enhanced.html)
    const employerProfile = document.getElementById('employerProfile');
    const providerProfile = document.getElementById('providerProfile');
    
    if (employerProfile) employerProfile.classList.toggle('hidden', role !== 'employer');
    if (providerProfile) providerProfile.classList.toggle('hidden', role !== 'provider');
    
    // Toggle employer-specific fields (profile-enhanced.html)
    document.querySelectorAll('.employer-field').forEach(el => {
        el.classList.toggle('hidden', role !== 'employer');
    });
    
    // Toggle provider-specific fields (profile-enhanced.html)
    document.querySelectorAll('.provider-field').forEach(el => {
        el.classList.toggle('hidden', role !== 'provider');
    });
    
    // Toggle employer job history section
    const employerJobHistory = document.getElementById('employerJobHistory');
    if (employerJobHistory) employerJobHistory.classList.toggle('hidden', role !== 'employer');
    
    // Toggle provider skills section
    const providerSkillsSection = document.getElementById('providerSkillsSection');
    if (providerSkillsSection) providerSkillsSection.classList.toggle('hidden', role !== 'provider');
    
    // Toggle provider activity section
    const providerActivity = document.getElementById('providerActivity');
    if (providerActivity) providerActivity.classList.toggle('hidden', role !== 'provider');
    
    // Toggle navigation
    const employerNav = document.querySelectorAll('.nav-employer');
    const providerNav = document.querySelectorAll('.nav-provider');
    
    employerNav.forEach(el => {
        if (el) el.style.display = role === 'employer' ? '' : 'none';
    });
    providerNav.forEach(el => {
        if (el) el.style.display = role === 'provider' ? '' : 'none';
    });
    
    // Update document theme color for visual identity
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
        metaTheme = document.createElement('meta');
        metaTheme.name = 'theme-color';
        document.head.appendChild(metaTheme);
    }
    metaTheme.content = role === 'employer' ? '#06531d' : '#1a5fa0';
}

// Initialize role on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedRole = localStorage.getItem('joddy-user-role') || 'employer';
    updateDashboardView(savedRole);
});
