console.log("SuperAdmin.js is loaded!");
const API_BASE = 'http://localhost:3000/api';
let currentPage = 1;
let totalPages = 1;
let allAdmins = [];

// Check authentication and role
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'Auth/LoginPage.html';
}

// Load user info
async function loadUserInfo() {
    try {
    const response = await fetch(`${API_BASE}/admin/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to fetch user');

    const user = await response.json();
    
    // Check if user is super admin
    if (user.role !== 'super_admin') {
        alert('Access denied. Super Admin privileges required.');
        window.location.href = 'LandingPage.html';
        return;
    }

    document.getElementById('userName').textContent = `${user.first_name} ${user.last_name}`;
    document.getElementById('userEmail').textContent = user.email;
    } catch (error) {
    console.error('Error loading user:', error);
    localStorage.removeItem('token');
    window.location.href = 'Auth/LoginPage.html';
    }
}

// Load logs
async function loadLogs(page = 1) {
    try {
    const adminFilter = document.getElementById('filterAdmin').value;
    const pageFilter = document.getElementById('filterPage').value;
    const dateFrom = document.getElementById('filterDateFrom').value;
    const dateTo = document.getElementById('filterDateTo').value;

    let url = `${API_BASE}/superadmin/logs?page=${page}&limit=20`;
    if (adminFilter) url += `&admin_id=${adminFilter}`;
    if (pageFilter) url += `&target_page=${pageFilter}`;
    if (dateFrom) url += `&date_from=${dateFrom}`;
    if (dateTo) url += `&date_to=${dateTo}`;

    const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to fetch logs');

    const data = await response.json();
        displayLogs(data.logs);
        updatePagination(data.pagination);
        currentPage = data.pagination.page;
        totalPages = data.pagination.totalPages;
    } catch (error) {
    console.error('Error loading logs:', error);
    document.getElementById('logsTableBody').innerHTML = 
        '<tr><td colspan="6" style="text-align: center; color: red;">Error loading logs</td></tr>';
    }
}

// Display logs
function displayLogs(logs) {
    const tbody = document.getElementById('logsTableBody');
    
    if (logs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No logs found</td></tr>';
    return;
    }

    tbody.innerHTML = logs.map(log => {
    const date = new Date(log.timestamp).toLocaleString();
    const actionClass = log.action.includes('CREATE') ? 'badge-create' :
    log.action.includes('UPDATE') ? 'badge-update' :
    log.action.includes('DELETE') ? 'badge-delete' : 'badge-view';
    
    return `
        <tr>
        <td>${date}</td>
        <td>${log.first_name} ${log.last_name}<br><small>${log.email}</small></td>
        <td><span class="badge ${actionClass}">${log.action}</span></td>
        <td>${log.target_page}</td>
        <td>${log.ip_address || 'N/A'}</td>
        <td><button class="btn-small btn-primary" onclick='showDetails(${JSON.stringify(log.details)})'>View</button></td>
        </tr>
    `;
    }).join('');
}

// Show details modal
function showDetails(details) {
    alert(JSON.stringify(details, null, 2));
}

// Update pagination
function updatePagination(pagination) {
    const container = document.getElementById('pagination');
    const { page, totalPages } = pagination;

    let html = `
    <button ${page === 1 ? 'disabled' : ''} onclick="loadLogs(${page - 1})">Previous</button>
    <span>Page ${page} of ${totalPages}</span>
    <button ${page === totalPages ? 'disabled' : ''} onclick="loadLogs(${page + 1})">Next</button>
    `;

    container.innerHTML = html;
}

// Load admins list
async function loadAdmins() {
    try {
    const response = await fetch(`${API_BASE}/superadmin/admins`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to fetch admins');

    const data = await response.json();
    allAdmins = data.admins;
    displayAdmins(data.admins);
    populateAdminFilter(data.admins);
    } catch (error) {
    console.error('Error loading admins:', error);
    }
}

// Display admins
function displayAdmins(admins) {
    const tbody = document.getElementById('adminsTableBody');
    
    tbody.innerHTML = admins.map(admin => {
    const roleClass = admin.role === 'super_admin' ? 'role-super-admin' : 'role-admin';
    const createdDate = new Date(admin.created_at).toLocaleDateString();
    
    return `
        <tr>
        <td>${admin.first_name} ${admin.last_name}</td>
        <td>${admin.email}</td>
        <td>${admin.phone || 'N/A'}</td>
        <td><span class="role-badge ${roleClass}">${admin.role}</span></td>
        <td>${createdDate}</td>
        <td class="action-buttons">
            <button class="btn-small btn-primary" onclick="changeRole('${admin.id}', '${admin.role}')">Change Role</button>
            <button class="btn-small btn-danger" onclick="deleteAdmin('${admin.id}')">Delete</button>
        </td>
        </tr>
    `;
    }).join('');
}

// Populate admin filter
function populateAdminFilter(admins) {
    const select = document.getElementById('filterAdmin');
    select.innerHTML = '<option value="">All Admins</option>' +
    admins.map(admin => `<option value="${admin.id}">${admin.first_name} ${admin.last_name}</option>`).join('');
}

// Change admin role
async function changeRole(adminId, currentRole) {
    const newRole = currentRole === 'admin' ? 'super_admin' : 'admin';
    
    if (!confirm(`Change role to ${newRole}?`)) return;

    try {
    const response = await fetch(`${API_BASE}/superadmin/admins/${adminId}/role`, {
        method: 'PUT',
        headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
    });

    if (!response.ok) throw new Error('Failed to update role');

    alert('Role updated successfully');
    loadAdmins();
    } catch (error) {
    console.error('Error updating role:', error);
    alert('Failed to update role');
    }
}

// Delete admin
async function deleteAdmin(adminId) {
    if (!confirm('Are you sure you want to delete this admin?')) return;

    try {
    const response = await fetch(`${API_BASE}/superadmin/admins/${adminId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to delete admin');

    alert('Admin deleted successfully');
    loadAdmins();
    } catch (error) {
    console.error('Error deleting admin:', error);
    alert('Failed to delete admin');
    }
}

// Load statistics
async function loadStats() {
    try {
    const response = await fetch(`${API_BASE}/superadmin/logs/summary`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to fetch stats');

    const data = await response.json();
    
    // Calculate stats
    const totalLogs = data.summary.byPage.reduce((sum, item) => sum + parseInt(item.count), 0);
    const activeAdmins = data.summary.byAdmin.filter(a => a.action_count > 0).length;
    const mostActivePage = data.summary.byPage[0]?.target_page || '-';

    document.getElementById('totalLogs').textContent = totalLogs;
    document.getElementById('activeAdmins').textContent = activeAdmins;
    document.getElementById('mostActivePage').textContent = mostActivePage;
    
    // For today's actions, you'd need to pass date filters
    document.getElementById('todayActions').textContent = totalLogs;
    } catch (error) {
    console.error('Error loading stats:', error);
    }
}

// Apply filters
function applyFilters() {
    loadLogs(1);
}

// Reset filters
function resetFilters() {
    document.getElementById('filterAdmin').value = '';
    document.getElementById('filterPage').value = '';
    document.getElementById('filterDateFrom').value = '';
    document.getElementById('filterDateTo').value = '';
    loadLogs(1);
}

// Export logs to CSV
function exportLogs() {
    alert('Export functionality - implement CSV generation');
}

// Tab switching
document.querySelectorAll('.menu-item[data-tab]').forEach(item => {
    item.addEventListener('click', (e) => {
    e.preventDefault();
    const tabName = item.dataset.tab;
    
    // Update active menu item
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    item.classList.add('active');
    
    // Show corresponding tab
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(`${tabName}Tab`).classList.add('active');
    
    // Update page title
    const titles = {
        'logs': 'Admin Task Logs',
        'admins': 'Manage Administrators',
        'qr': 'QR Code Management',
        'gallery': 'Gallery Management',
        'notifications': 'Notification Management'
    };
    document.getElementById('pageTitle').textContent = titles[tabName];
    
    // Load data for specific tabs
    if (tabName === 'admins') loadAdmins();
    });
});

// Account button
document.getElementById('accountBtn').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'Admin/AdminAccountPage.html';
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('token');
    window.location.href = 'Auth/LoginPage.html';
    }
});

// Initialize
loadUserInfo();
loadLogs();
loadAdmins();
loadStats();