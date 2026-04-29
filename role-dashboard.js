/**
 * JODDY Role Dashboard Logic
 * Handles Employer vs Provider mode switching
 */

// ==========================================
// DATA SCHEMA DEFINITION
// ==========================================

/**
 * User Role Schema
 * In a real backend, this would be stored in the database
 */
const userSchema = {
    role: 'employer',
    canSwitch: true,
    profile: {
        name: 'John Doe',
        email: 'john@example.com',
        location: 'Nairobi, Kenya',
        phone: '+254 712 345 678',
        avatar: 'images/cdc-jjrXvzbqC5E-unsplash.jpg',
        employer: {
            verificationStatus: 'verified',
            companyName: '',
            preferredPaymentMethod: 'mpesa',
        },
        provider: {
            hourlyRate: 500,
            skills: ['Cleaning', 'Gardening', 'Handyman'],
            equipment: ['Professional Mop', 'Microfiber Cloths', 'Lawn Mower'],
            transportAvailable: true,
            bio: 'Experienced professional with 5+ years in odd jobs.',
            totalEarnings: 45000,
            jobsCompleted: 28,
            averageRating: 4.8,
        }
    }
};

// ==========================================
// ROLE TOGGLE FUNCTIONALITY
// ==========================================

/**
 * Toggle between Employer and Provider modes
 */
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

/**
 * Update dashboard based on current role
 */
function updateDashboardView(role) {
    const employerDash = document.getElementById('employerDashboard');
    const providerDash = document.getElementById('providerDashboard');
    const roleBadge = document.getElementById('currentRoleBadge');
    const roleText = document.getElementById('currentRoleText');
    const switchToText = document.getElementById('switchToText');
    
    if (role === 'employer') {
        if (employerDash) employerDash.classList.remove('hidden');
        if (providerDash) providerDash.classList.add('hidden');
        if (roleBadge) roleBadge.textContent = '👔';
        if (roleText) roleText.innerHTML = 'Current Mode: <strong>Employer</strong>';
        if (switchToText) switchToText.textContent = 'Provider';
        document.documentElement.style.setProperty('--current-role', 'employer');
    } else {
        if (employerDash) employerDash.classList.add('hidden');
        if (providerDash) providerDash.classList.remove('hidden');
        if (roleBadge) roleBadge.textContent = '🔧';
        if (roleText) roleText.innerHTML = 'Current Mode: <strong>Provider</strong>';
        if (switchToText) switchToText.textContent = 'Employer';
        document.documentElement.style.setProperty('--current-role', 'provider');
    }
    
    updateNavigationRole(role);
}

/**
 * Update navigation based on role
 */
function updateNavigationRole(role) {
    console.log(`Navigation updated for ${role} mode`);
}

// ==========================================
// CONDITIONAL RENDERING LOGIC
// ==========================================

/**
 * Get profile fields based on user role
 */
function getProfileFieldsByRole(role) {
    const commonFields = ['name', 'email', 'location', 'phone', 'avatar'];
    const employerFields = [...commonFields, 'verificationStatus', 'companyName', 'preferredPaymentMethod'];
    const providerFields = [...commonFields, 'hourlyRate', 'skills', 'equipment', 'transportAvailable', 'bio', 'totalEarnings', 'jobsCompleted', 'averageRating'];
    return role === 'employer' ? employerFields : providerFields;
}

/**
 * Render profile form based on role
 * Shows only relevant fields for the current role
 */
function renderProfileForm(role) {
    const fields = getProfileFieldsByRole(role);
    console.log(`Rendering ${role} profile fields:`, fields);
    
    const rateSetting = document.querySelector('.hourly-rate-setting');
    const skillsGrid = document.querySelector('.skills-grid');
    
    if (role === 'provider') {
        if (rateSetting) rateSetting.style.display = 'flex';
        if (skillsGrid) skillsGrid.style.display = 'flex';
    } else {
        if (rateSetting) rateSetting.style.display = 'none';
        if (skillsGrid) skillsGrid.style.display = 'none';
    }
}

// ==========================================
// VISUAL CUES & COLOR CODING
// ==========================================

const roleColors = {
    employer: {
        primary: '#06531d',
        accent: '#7cff81',
        background: 'rgba(6, 83, 29, 0.1)',
        icon: '👔'
    },
    provider: {
        primary: '#1a5fa0',
        accent: '#64b5f6',
        background: 'rgba(26, 95, 160, 0.1)',
        icon: '🔧'
    }
};

/**
 * Apply role-specific styling
 */
function applyRoleStyling(role) {
    const colors = roleColors[role];
    const root = document.documentElement;
    
    root.style.setProperty('--role-primary', colors.primary);
    root.style.setProperty('--role-accent', colors.accent);
    root.style.setProperty('--role-background', colors.background);
    
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
        metaTheme = document.createElement('meta');
        metaTheme.name = 'theme-color';
        document.head.appendChild(metaTheme);
    }
    metaTheme.content = colors.primary;
}

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const savedRole = localStorage.getItem('joddy-user-role') || 'employer';
    updateDashboardView(savedRole);
    applyRoleStyling(savedRole);
    console.log(`JODDY Role Dashboard initialized in ${savedRole} mode`);
});

// Export functions for global access
window.toggleUserRole = toggleUserRole;
window.updateDashboardView = updateDashboardView;
window.getProfileFieldsByRole = getProfileFieldsByRole;
window.renderProfileForm = renderProfileForm;
window.applyRoleStyling = applyRoleStyling;
