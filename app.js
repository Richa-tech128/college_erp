// ─── Theme ───────────────────────────────────────────────────────────────────
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');

function setTheme(dark) {
  if (dark) {
    html.classList.add('dark');
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
    localStorage.setItem('theme', 'dark');
  } else {
    html.classList.remove('dark');
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
    localStorage.setItem('theme', 'light');
  }
  // Re-render current page so charts pick up new colors
  if (document.getElementById('page-' + currentPage)?.innerHTML) {
    setTimeout(() => renderPage(currentPage), 50);
  }
}
setTheme(localStorage.getItem('theme') === 'dark');
themeToggle.addEventListener('click', () => setTheme(!html.classList.contains('dark')));

// ─── Sidebar toggle ───────────────────────────────────────────────────────────
const sidebar = document.getElementById('sidebar');
const mainWrapper = document.getElementById('main-wrapper');
document.getElementById('sidebar-toggle').addEventListener('click', () => {
  if (window.innerWidth <= 768) {
    sidebar.classList.toggle('mobile-open');
    document.getElementById('sidebar-overlay').classList.toggle('hidden');
  } else {
    sidebar.classList.toggle('collapsed');
    mainWrapper.classList.toggle('sidebar-collapsed');
  }
});

// ─── Notifications ────────────────────────────────────────────────────────────
function toggleNotifications() {
  document.getElementById('notif-dropdown').classList.toggle('hidden');
}
document.addEventListener('click', e => {
  const nd = document.getElementById('notif-dropdown');
  if (!nd.contains(e.target) && !e.target.closest('[onclick="toggleNotifications()"]')) {
    nd.classList.add('hidden');
  }
});

// ─── Modal ────────────────────────────────────────────────────────────────────
function openModal(title, bodyHTML) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  document.getElementById('modal-overlay').classList.remove('hidden');
}
function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});

// ─── Navigation ───────────────────────────────────────────────────────────────
let currentPage = 'dashboard';
let charts = {};

function navigate(page) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + page).classList.remove('hidden');
  document.querySelector(`[data-page="${page}"]`).classList.add('active');
  // Update breadcrumb
  const labels = { dashboard: 'Dashboard', hr: 'HR Management', inventory: 'Inventory', finance: 'Finance', sales: 'Sales & CRM', reports: 'Reports', settings: 'Settings' };
  const bc = document.getElementById('breadcrumb-page');
  if (bc) bc.textContent = labels[page] || page;
  currentPage = page;
  renderPage(page);
  if (window.innerWidth <= 768) {
    sidebar.classList.remove('mobile-open');
    document.getElementById('sidebar-overlay').classList.add('hidden');
  }
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    navigate(item.dataset.page);
  });
});

// ─── Chart helpers ────────────────────────────────────────────────────────────
function destroyChart(id) {
  if (charts[id]) { charts[id].destroy(); delete charts[id]; }
}

function isDark() { return html.classList.contains('dark'); }
function gridColor() { return isDark() ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'; }
function textColor() { return isDark() ? '#9ca3af' : '#6b7280'; }

// ─── Pages ────────────────────────────────────────────────────────────────────
function renderPage(page) {
  const el = document.getElementById('page-' + page);
  switch (page) {
    case 'dashboard': renderDashboard(el); break;
    case 'hr': renderHR(el); break;
    case 'inventory': renderInventory(el); break;
    case 'finance': renderFinance(el); break;
    case 'sales': renderSales(el); break;
    case 'reports': renderReports(el); break;
    case 'settings': renderSettings(el); break;
  }
}

// ════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════════════════════════════════════════
function renderDashboard(el) {
  el.innerHTML = `
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p class="text-sm text-gray-500 mt-1">Welcome back, Admin. Here's what's happening today.</p>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
      ${statCard('Total Revenue', '$284,500', '↑ 12.5% vs last month', 'from-blue-500 to-blue-600', 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', 'green')}
      ${statCard('Active Employees', '1,248', '↑ 3 new this week', 'from-purple-500 to-purple-600', 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', 'blue')}
      ${statCard('Open Orders', '342', '↓ 8 pending approval', 'from-orange-400 to-orange-500', 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', 'yellow')}
      ${statCard('Inventory Items', '5,820', '12 low stock alerts', 'from-green-500 to-green-600', 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', 'red')}
    </div>

    <!-- Charts row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
      <div class="card lg:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Revenue Overview</h3>
            <p class="text-xs text-gray-400 mt-0.5">Monthly revenue for 2025</p>
          </div>
          <div class="flex gap-2">
            <button class="btn-secondary text-xs py-1 px-3">Monthly</button>
            <button class="btn-primary text-xs py-1 px-3">Yearly</button>
          </div>
        </div>
        <canvas id="revenueChart" height="100"></canvas>
      </div>
      <div class="card">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Sales by Category</h3>
        <p class="text-xs text-gray-400 mb-4">Q1 2025 breakdown</p>
        <canvas id="pieChart" height="180"></canvas>
        <div class="mt-4 space-y-2">
          ${legendItem('Software', '#3b82f6', '42%')}
          ${legendItem('Hardware', '#8b5cf6', '28%')}
          ${legendItem('Services', '#10b981', '18%')}
          ${legendItem('Support', '#f59e0b', '12%')}
        </div>
      </div>
    </div>

    <!-- Bottom row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <!-- Recent transactions -->
      <div class="card lg:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
          <button class="text-xs text-blue-600 hover:underline">View all</button>
        </div>
        <table class="erp-table">
          <thead><tr>
            <th>Transaction</th><th>Date</th><th>Amount</th><th>Status</th>
          </tr></thead>
          <tbody>
            ${txRow('INV-1042', 'Acme Corp', 'Mar 28', '$12,400', 'badge-green', 'Paid')}
            ${txRow('INV-1041', 'TechStart Inc', 'Mar 27', '$8,200', 'badge-yellow', 'Pending')}
            ${txRow('INV-1040', 'Global Media', 'Mar 26', '$5,600', 'badge-green', 'Paid')}
            ${txRow('INV-1039', 'Nexus Ltd', 'Mar 25', '$3,100', 'badge-red', 'Overdue')}
            ${txRow('INV-1038', 'Bright Solutions', 'Mar 24', '$9,800', 'badge-green', 'Paid')}
          </tbody>
        </table>
      </div>

      <!-- Right column: performers + activity -->
      <div class="space-y-5">
        <div class="card">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Top Performers</h3>
          <div class="space-y-4">
            ${performer('Sarah Chen', 'Sales Lead', '$84,200', 92, 'from-blue-400 to-blue-600')}
            ${performer('James Park', 'Account Mgr', '$71,500', 78, 'from-purple-400 to-purple-600')}
            ${performer('Mia Torres', 'Sales Rep', '$63,100', 68, 'from-green-400 to-green-600')}
            ${performer('Alex Kim', 'BizDev', '$55,800', 60, 'from-orange-400 to-orange-500')}
          </div>
        </div>

        <!-- Activity Feed -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
            <span class="badge badge-blue">Live</span>
          </div>
          <div class="space-y-4">
            ${activityItem('New employee onboarded', 'Priya Nair joined the Finance team', '2m ago', 'bg-green-100 dark:bg-green-900 text-green-600', 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z')}
            ${activityItem('Invoice paid', 'Acme Corp paid INV-1042 ($12,400)', '15m ago', 'bg-blue-100 dark:bg-blue-900 text-blue-600', 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z')}
            ${activityItem('Low stock alert', 'SKU-103 USB-C Hub below reorder point', '1h ago', 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600', 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z')}
            ${activityItem('Deal closed', 'TechStart Inc deal won — $45,000', '3h ago', 'bg-purple-100 dark:bg-purple-900 text-purple-600', 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z')}
          </div>
        </div>
      </div>
    </div>
  `;

  // Revenue chart
  destroyChart('revenue');
  const rCtx = document.getElementById('revenueChart').getContext('2d');
  charts['revenue'] = new Chart(rCtx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Revenue',
        data: [42000, 38000, 55000, 47000, 62000, 58000, 71000, 65000, 80000, 74000, 88000, 95000],
        backgroundColor: 'rgba(59,130,246,0.15)',
        borderColor: '#3b82f6',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      }, {
        label: 'Expenses',
        data: [28000, 25000, 32000, 30000, 38000, 35000, 42000, 40000, 48000, 44000, 52000, 58000],
        backgroundColor: 'rgba(139,92,246,0.15)',
        borderColor: '#8b5cf6',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: textColor(), font: { family: 'Inter' } } } },
      scales: {
        x: { grid: { color: gridColor() }, ticks: { color: textColor() } },
        y: { grid: { color: gridColor() }, ticks: { color: textColor(), callback: v => '$' + (v / 1000) + 'k' } }
      }
    }
  });

  // Pie chart
  destroyChart('pie');
  const pCtx = document.getElementById('pieChart').getContext('2d');
  charts['pie'] = new Chart(pCtx, {
    type: 'doughnut',
    data: {
      labels: ['Software', 'Hardware', 'Services', 'Support'],
      datasets: [{ data: [42, 28, 18, 12], backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'], borderWidth: 0, hoverOffset: 6 }]
    },
    options: {
      responsive: true,
      cutout: '70%',
      plugins: { legend: { display: false } }
    }
  });
}

function statCard(title, value, sub, gradient, iconPath, trend) {
  const trendColor = trend === 'green' ? 'text-green-500' : trend === 'red' ? 'text-red-500' : trend === 'yellow' ? 'text-yellow-500' : 'text-blue-500';
  return `
    <div class="stat-card">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">${title}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">${value}</p>
          <p class="text-xs ${trendColor} mt-1 font-medium">${sub}</p>
        </div>
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPath}"/></svg>
        </div>
      </div>
    </div>`;
}

function legendItem(label, color, pct) {
  return `<div class="flex items-center justify-between text-sm">
    <div class="flex items-center gap-2">
      <span class="w-3 h-3 rounded-full flex-shrink-0" style="background:${color}"></span>
      <span class="text-gray-600 dark:text-gray-400">${label}</span>
    </div>
    <span class="font-semibold text-gray-900 dark:text-white">${pct}</span>
  </div>`;
}

function txRow(id, company, date, amount, badge, status) {
  return `<tr>
    <td><div class="font-medium text-gray-900 dark:text-white">${id}</div><div class="text-xs text-gray-400">${company}</div></td>
    <td class="text-gray-500">${date}</td>
    <td class="font-semibold text-gray-900 dark:text-white">${amount}</td>
    <td><span class="badge ${badge}">${status}</span></td>
  </tr>`;
}

function performer(name, role, revenue, pct, gradient) {
  return `<div>
    <div class="flex items-center gap-3 mb-1.5">
      <div class="w-8 h-8 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0">${name[0]}</div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">${name}</p>
          <p class="text-sm font-semibold text-gray-900 dark:text-white ml-2">${revenue}</p>
        </div>
        <p class="text-xs text-gray-400">${role}</p>
      </div>
    </div>
    <div class="progress-bar ml-11"><div class="progress-fill bg-gradient-to-r ${gradient}" style="width:${pct}%"></div></div>
  </div>`;
}

function activityItem(title, desc, time, iconBg, iconPath) {
  return `<div class="flex items-start gap-3">
    <div class="w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0 mt-0.5">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPath}"/></svg>
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-900 dark:text-white">${title}</p>
      <p class="text-xs text-gray-400 mt-0.5 truncate">${desc}</p>
    </div>
    <span class="text-xs text-gray-400 flex-shrink-0">${time}</span>
  </div>`;
}

// ════════════════════════════════════════════════════════════════════════════
// HR MANAGEMENT
// ════════════════════════════════════════════════════════════════════════════
const employees = [
  { id: 'EMP001', name: 'Sarah Chen', role: 'Sales Lead', dept: 'Sales', status: 'Active', salary: '$92,000', attendance: 96 },
  { id: 'EMP002', name: 'James Park', role: 'Account Manager', dept: 'Sales', status: 'Active', salary: '$78,000', attendance: 91 },
  { id: 'EMP003', name: 'Mia Torres', role: 'HR Specialist', dept: 'HR', status: 'Active', salary: '$65,000', attendance: 88 },
  { id: 'EMP004', name: 'Alex Kim', role: 'Dev Engineer', dept: 'Tech', status: 'Active', salary: '$110,000', attendance: 94 },
  { id: 'EMP005', name: 'Priya Nair', role: 'Finance Analyst', dept: 'Finance', status: 'On Leave', salary: '$72,000', attendance: 79 },
  { id: 'EMP006', name: 'Tom Nguyen', role: 'Product Manager', dept: 'Tech', status: 'Active', salary: '$98,000', attendance: 97 },
  { id: 'EMP007', name: 'Lisa Brown', role: 'Marketing Lead', dept: 'Marketing', status: 'Active', salary: '$84,000', attendance: 90 },
  { id: 'EMP008', name: 'David Osei', role: 'Support Eng', dept: 'Support', status: 'Inactive', salary: '$58,000', attendance: 72 },
];

function renderHR(el) {
  el.innerHTML = `
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">HR Management</h1>
        <p class="text-sm text-gray-500 mt-1">Manage employees, attendance and payroll</p>
      </div>
      <button class="btn-primary" onclick="openAddEmployeeModal()">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Add Employee
      </button>
    </div>

    <!-- HR Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      ${miniStat('Total Staff', '1,248', 'badge-blue')}
      ${miniStat('On Leave', '34', 'badge-yellow')}
      ${miniStat('New Hires', '12', 'badge-green')}
      ${miniStat('Avg Attendance', '91%', 'badge-purple')}
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 mb-5 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
      <button class="hr-tab active-tab px-4 py-2 rounded-lg text-sm font-medium transition-all" data-tab="employees" onclick="switchHRTab('employees',this)">Employees</button>
      <button class="hr-tab px-4 py-2 rounded-lg text-sm font-medium text-gray-500 transition-all" data-tab="attendance" onclick="switchHRTab('attendance',this)">Attendance</button>
      <button class="hr-tab px-4 py-2 rounded-lg text-sm font-medium text-gray-500 transition-all" data-tab="payroll" onclick="switchHRTab('payroll',this)">Payroll</button>
    </div>

    <div id="hr-tab-employees" class="hr-tab-content">
      <div class="card">
        <div class="flex items-center gap-3 mb-4">
          <input type="text" placeholder="Search employees..." class="form-input max-w-xs" oninput="filterEmployees(this.value)" />
          <select class="form-input max-w-xs" onchange="filterEmployees(document.querySelector('[oninput]').value, this.value)">
            <option value="">All Departments</option>
            <option>Sales</option><option>Tech</option><option>HR</option><option>Finance</option><option>Marketing</option><option>Support</option>
          </select>
        </div>
        <div class="overflow-x-auto">
          <table class="erp-table" id="emp-table">
            <thead><tr>
              <th onclick="sortTable('emp-table',0)">ID ↕</th>
              <th onclick="sortTable('emp-table',1)">Name ↕</th>
              <th onclick="sortTable('emp-table',2)">Role ↕</th>
              <th onclick="sortTable('emp-table',3)">Department ↕</th>
              <th onclick="sortTable('emp-table',4)">Status ↕</th>
              <th onclick="sortTable('emp-table',5)">Salary ↕</th>
              <th>Attendance</th>
              <th>Actions</th>
            </tr></thead>
            <tbody id="emp-tbody">
              ${employees.map(e => empRow(e)).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div id="hr-tab-attendance" class="hr-tab-content hidden">
      <div class="card">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Attendance Overview — March 2025</h3>
        <canvas id="attendanceChart" height="80"></canvas>
      </div>
    </div>

    <div id="hr-tab-payroll" class="hr-tab-content hidden">
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-900 dark:text-white">Payroll — March 2025</h3>
          <button class="btn-primary text-xs" onclick="openModal('Process Payroll','<p class=\\'text-sm text-gray-600 dark:text-gray-400 mb-4\\'>Confirm processing payroll for all 1,248 employees for March 2025?</p><div class=\\'flex gap-3\\'><button class=\\'btn-primary\\' onclick=\\'closeModal()\\'>Confirm</button><button class=\\'btn-secondary\\' onclick=\\'closeModal()\\'>Cancel</button></div>')">Run Payroll</button>
        </div>
        <table class="erp-table">
          <thead><tr><th>Employee</th><th>Department</th><th>Base Salary</th><th>Bonus</th><th>Deductions</th><th>Net Pay</th><th>Status</th></tr></thead>
          <tbody>
            ${payrollRow('Sarah Chen', 'Sales', '$92,000', '$4,600', '$1,200', '$95,400', 'badge-green', 'Processed')}
            ${payrollRow('James Park', 'Sales', '$78,000', '$3,900', '$980', '$80,920', 'badge-green', 'Processed')}
            ${payrollRow('Mia Torres', 'HR', '$65,000', '$0', '$820', '$64,180', 'badge-yellow', 'Pending')}
            ${payrollRow('Alex Kim', 'Tech', '$110,000', '$5,500', '$1,400', '$114,100', 'badge-green', 'Processed')}
            ${payrollRow('Priya Nair', 'Finance', '$72,000', '$0', '$900', '$71,100', 'badge-yellow', 'Pending')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Render attendance chart when tab is shown
  setTimeout(() => {
    if (document.getElementById('attendanceChart')) renderAttendanceChart();
    // Apply active tab style to first HR tab on render
    const firstTab = document.querySelector('.hr-tab[data-tab="employees"]');
    if (firstTab) {
      firstTab.classList.add('bg-white', 'dark:bg-gray-900', 'text-blue-600', 'shadow-sm');
      firstTab.classList.remove('text-gray-500');
    }
  }, 50);
}

function empRow(e) {
  const statusBadge = e.status === 'Active' ? 'badge-green' : e.status === 'On Leave' ? 'badge-yellow' : 'badge-gray';
  const attColor = e.attendance >= 90 ? '#10b981' : e.attendance >= 80 ? '#f59e0b' : '#ef4444';
  return `<tr>
    <td class="text-gray-400 text-xs">${e.id}</td>
    <td><div class="flex items-center gap-2">
      <div class="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">${e.name[0]}</div>
      <span class="font-medium text-gray-900 dark:text-white">${e.name}</span>
    </div></td>
    <td class="text-gray-500 dark:text-gray-400">${e.role}</td>
    <td><span class="badge badge-blue">${e.dept}</span></td>
    <td><span class="badge ${statusBadge}">${e.status}</span></td>
    <td class="font-medium text-gray-900 dark:text-white">${e.salary}</td>
    <td>
      <div class="flex items-center gap-2">
        <div class="progress-bar w-16"><div class="progress-fill" style="width:${e.attendance}%;background:${attColor}"></div></div>
        <span class="text-xs text-gray-500">${e.attendance}%</span>
      </div>
    </td>
    <td>
      <div class="flex gap-1">
        <button class="btn-success" onclick="openModal('Edit Employee','${editEmpForm(e)}')">Edit</button>
        <button class="btn-danger" onclick="openModal('Remove Employee','<p class=\\'text-sm text-gray-600 dark:text-gray-400 mb-4\\'>Remove <strong>${e.name}</strong> from the system?</p><div class=\\'flex gap-3\\'><button class=\\'btn-danger\\' onclick=\\'closeModal()\\'>Remove</button><button class=\\'btn-secondary\\' onclick=\\'closeModal()\\'>Cancel</button></div>')">Remove</button>
      </div>
    </td>
  </tr>`;
}

function editEmpForm(e) {
  return `<div class='space-y-3'><div><label class='form-label'>Full Name</label><input class='form-input' value='${e.name}'/></div><div><label class='form-label'>Role</label><input class='form-input' value='${e.role}'/></div><div><label class='form-label'>Department</label><input class='form-input' value='${e.dept}'/></div><div><label class='form-label'>Salary</label><input class='form-input' value='${e.salary}'/></div><div class='flex gap-3 mt-4'><button class='btn-primary' onclick='closeModal()'>Save Changes</button><button class='btn-secondary' onclick='closeModal()'>Cancel</button></div></div>`;
}

function payrollRow(name, dept, base, bonus, ded, net, badge, status) {
  return `<tr>
    <td class="font-medium text-gray-900 dark:text-white">${name}</td>
    <td class="text-gray-500">${dept}</td>
    <td>${base}</td><td class="text-green-600">${bonus}</td><td class="text-red-500">${ded}</td>
    <td class="font-bold text-gray-900 dark:text-white">${net}</td>
    <td><span class="badge ${badge}">${status}</span></td>
  </tr>`;
}

function miniStat(label, value, badge) {
  return `<div class="card flex items-center justify-between">
    <div><p class="text-xs text-gray-400 uppercase tracking-wider">${label}</p><p class="text-xl font-bold text-gray-900 dark:text-white mt-1">${value}</p></div>
    <span class="badge ${badge} text-lg font-bold px-3 py-1">${value}</span>
  </div>`;
}

function switchHRTab(tab, btn) {
  document.querySelectorAll('.hr-tab-content').forEach(t => t.classList.add('hidden'));
  document.querySelectorAll('.hr-tab').forEach(t => { t.classList.remove('active-tab', 'bg-white', 'dark:bg-gray-900', 'text-blue-600', 'shadow-sm'); t.classList.add('text-gray-500'); });
  document.getElementById('hr-tab-' + tab).classList.remove('hidden');
  btn.classList.add('active-tab', 'bg-white', 'dark:bg-gray-900', 'text-blue-600', 'shadow-sm');
  btn.classList.remove('text-gray-500');
  if (tab === 'attendance') setTimeout(renderAttendanceChart, 50);
}

function renderAttendanceChart() {
  destroyChart('attendance');
  const ctx = document.getElementById('attendanceChart');
  if (!ctx) return;
  charts['attendance'] = new Chart(ctx.getContext('2d'), {
    type: 'line',
    data: {
      labels: Array.from({ length: 28 }, (_, i) => i + 1),
      datasets: [{
        label: 'Present', data: [1180, 1195, 1200, 1188, 1210, 1205, 1198, 1215, 1220, 1208, 1195, 1212, 1225, 1218, 1200, 1195, 1210, 1220, 1215, 1205, 1198, 1212, 1225, 1218, 1200, 1195, 1210, 1220],
        borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.08)', fill: true, tension: 0.4, borderWidth: 2, pointRadius: 0
      }, {
        label: 'Absent', data: [68, 53, 48, 60, 38, 43, 50, 33, 28, 40, 53, 36, 23, 30, 48, 53, 38, 28, 33, 43, 50, 36, 23, 30, 48, 53, 38, 28],
        borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)', fill: true, tension: 0.4, borderWidth: 2, pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: textColor() } } },
      scales: {
        x: { grid: { color: gridColor() }, ticks: { color: textColor() } },
        y: { grid: { color: gridColor() }, ticks: { color: textColor() } }
      }
    }
  });
}

function filterEmployees(search, dept) {
  const rows = document.querySelectorAll('#emp-tbody tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    const matchSearch = !search || text.includes(search.toLowerCase());
    const matchDept = !dept || text.includes(dept.toLowerCase());
    row.style.display = matchSearch && matchDept ? '' : 'none';
  });
}

function openAddEmployeeModal() {
  openModal('Add New Employee', `
    <div class="space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <div><label class="form-label">First Name</label><input class="form-input" placeholder="John"/></div>
        <div><label class="form-label">Last Name</label><input class="form-input" placeholder="Doe"/></div>
      </div>
      <div><label class="form-label">Role</label><input class="form-input" placeholder="e.g. Software Engineer"/></div>
      <div><label class="form-label">Department</label>
        <select class="form-input"><option>Sales</option><option>Tech</option><option>HR</option><option>Finance</option><option>Marketing</option></select>
      </div>
      <div><label class="form-label">Salary</label><input class="form-input" placeholder="$0"/></div>
      <div class="flex gap-3 mt-2">
        <button class="btn-primary" onclick="closeModal()">Add Employee</button>
        <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>`);
}

// ════════════════════════════════════════════════════════════════════════════
// INVENTORY
// ════════════════════════════════════════════════════════════════════════════
const products = [
  { sku: 'SKU-101', name: 'Laptop Pro 15"', category: 'Electronics', stock: 142, reorder: 50, price: '$1,299', status: 'In Stock' },
  { sku: 'SKU-102', name: 'Wireless Mouse', category: 'Accessories', stock: 380, reorder: 100, price: '$29', status: 'In Stock' },
  { sku: 'SKU-103', name: 'USB-C Hub 7-Port', category: 'Accessories', stock: 28, reorder: 50, price: '$49', status: 'Low Stock' },
  { sku: 'SKU-104', name: '4K Monitor 27"', category: 'Electronics', stock: 65, reorder: 30, price: '$549', status: 'In Stock' },
  { sku: 'SKU-105', name: 'Mechanical Keyboard', category: 'Accessories', stock: 12, reorder: 40, price: '$129', status: 'Low Stock' },
  { sku: 'SKU-106', name: 'Webcam HD 1080p', category: 'Electronics', stock: 0, reorder: 20, price: '$89', status: 'Out of Stock' },
  { sku: 'SKU-107', name: 'Desk Lamp LED', category: 'Furniture', stock: 210, reorder: 60, price: '$45', status: 'In Stock' },
  { sku: 'SKU-108', name: 'Ergonomic Chair', category: 'Furniture', stock: 18, reorder: 10, price: '$399', status: 'Low Stock' },
];

function renderInventory(el) {
  el.innerHTML = `
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
        <p class="text-sm text-gray-500 mt-1">Track stock levels, products and orders</p>
      </div>
      <button class="btn-primary" onclick="openAddProductModal()">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Add Product
      </button>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      ${miniStat('Total Products', '5,820', 'badge-blue')}
      ${miniStat('Low Stock', '12', 'badge-yellow')}
      ${miniStat('Out of Stock', '3', 'badge-red')}
      ${miniStat('Categories', '8', 'badge-purple')}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
      <div class="card lg:col-span-2">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Stock Movement — Last 7 Days</h3>
        <canvas id="stockChart" height="100"></canvas>
      </div>
      <div class="card">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Stock by Category</h3>
        <canvas id="stockPieChart" height="160"></canvas>
      </div>
    </div>

    <div class="card">
      <div class="flex items-center gap-3 mb-4">
        <input type="text" placeholder="Search products..." class="form-input max-w-xs" oninput="filterTable('inv-tbody', this.value)" />
        <select class="form-input max-w-xs">
          <option>All Categories</option><option>Electronics</option><option>Accessories</option><option>Furniture</option>
        </select>
      </div>
      <div class="overflow-x-auto">
        <table class="erp-table">
          <thead><tr><th>SKU</th><th>Product</th><th>Category</th><th>Stock</th><th>Reorder Point</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="inv-tbody">
            ${products.map(p => invRow(p)).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  setTimeout(() => {
    destroyChart('stock');
    const sCtx = document.getElementById('stockChart');
    if (sCtx) charts['stock'] = new Chart(sCtx.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          { label: 'Received', data: [120, 85, 200, 150, 180, 90, 110], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', fill: true, tension: 0.4, borderWidth: 2 },
          { label: 'Shipped', data: [95, 110, 160, 130, 200, 70, 85], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.4, borderWidth: 2 }
        ]
      },
      options: { responsive: true, plugins: { legend: { labels: { color: textColor() } } }, scales: { x: { grid: { color: gridColor() }, ticks: { color: textColor() } }, y: { grid: { color: gridColor() }, ticks: { color: textColor() } } } }
    });

    destroyChart('stockPie');
    const spCtx = document.getElementById('stockPieChart');
    if (spCtx) charts['stockPie'] = new Chart(spCtx.getContext('2d'), {
      type: 'doughnut',
      data: { labels: ['Electronics', 'Accessories', 'Furniture', 'Other'], datasets: [{ data: [35, 28, 22, 15], backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'], borderWidth: 0, hoverOffset: 6 }] },
      options: { responsive: true, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { color: textColor(), font: { size: 11 } } } } }
    });
  }, 50);
}

function invRow(p) {
  const badge = p.status === 'In Stock' ? 'badge-green' : p.status === 'Low Stock' ? 'badge-yellow' : 'badge-red';
  const stockColor = p.stock === 0 ? 'text-red-500' : p.stock <= p.reorder ? 'text-yellow-500' : 'text-gray-900 dark:text-white';
  return `<tr>
    <td class="text-xs text-gray-400 font-mono">${p.sku}</td>
    <td class="font-medium text-gray-900 dark:text-white">${p.name}</td>
    <td><span class="badge badge-blue">${p.category}</span></td>
    <td class="font-semibold ${stockColor}">${p.stock}</td>
    <td class="text-gray-500">${p.reorder}</td>
    <td class="font-medium text-gray-900 dark:text-white">${p.price}</td>
    <td><span class="badge ${badge}">${p.status}</span></td>
    <td><div class="flex gap-1">
      <button class="btn-success">Edit</button>
      <button class="btn-secondary text-xs py-1 px-2" onclick="openModal('Restock ${p.name}','<div class=\\'space-y-3\\'><label class=\\'form-label\\'>Quantity to Add</label><input class=\\'form-input\\' type=\\'number\\' value=\\'100\\'/><div class=\\'flex gap-3 mt-3\\'><button class=\\'btn-primary\\' onclick=\\'closeModal()\\'>Confirm</button><button class=\\'btn-secondary\\' onclick=\\'closeModal()\\'>Cancel</button></div></div>')">Restock</button>
    </div></td>
  </tr>`;
}

function openAddProductModal() {
  openModal('Add New Product', `
    <div class="space-y-3">
      <div><label class="form-label">Product Name</label><input class="form-input" placeholder="e.g. Laptop Pro 15"/></div>
      <div class="grid grid-cols-2 gap-3">
        <div><label class="form-label">SKU</label><input class="form-input" placeholder="SKU-XXX"/></div>
        <div><label class="form-label">Category</label><select class="form-input"><option>Electronics</option><option>Accessories</option><option>Furniture</option></select></div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div><label class="form-label">Initial Stock</label><input class="form-input" type="number" placeholder="0"/></div>
        <div><label class="form-label">Price</label><input class="form-input" placeholder="$0.00"/></div>
      </div>
      <div class="flex gap-3 mt-2">
        <button class="btn-primary" onclick="closeModal()">Add Product</button>
        <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>`);
}

// ════════════════════════════════════════════════════════════════════════════
// FINANCE
// ════════════════════════════════════════════════════════════════════════════
function renderFinance(el) {
  el.innerHTML = `
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Finance</h1>
        <p class="text-sm text-gray-500 mt-1">Expenses, invoices and financial reports</p>
      </div>
      <div class="flex gap-2">
        <button class="btn-secondary" onclick="openModal('Export Report','<p class=\\'text-sm text-gray-500 mb-4\\'>Choose export format:</p><div class=\\'flex gap-3\\'><button class=\\'btn-primary\\' onclick=\\'closeModal()\\'>PDF</button><button class=\\'btn-secondary\\' onclick=\\'closeModal()\\'>Excel</button><button class=\\'btn-secondary\\' onclick=\\'closeModal()\\'>CSV</button></div>')">Export</button>
        <button class="btn-primary" onclick="openNewInvoiceModal()">New Invoice</button>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      ${finStat('Total Revenue', '$284,500', '↑ 12.5%', 'text-green-500')}
      ${finStat('Total Expenses', '$142,300', '↑ 4.2%', 'text-red-500')}
      ${finStat('Net Profit', '$142,200', '↑ 21.3%', 'text-green-500')}
      ${finStat('Outstanding', '$38,400', '12 invoices', 'text-yellow-500')}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
      <div class="card">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Cash Flow — 2025</h3>
        <canvas id="cashflowChart" height="120"></canvas>
      </div>
      <div class="card">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Expense Breakdown</h3>
        <canvas id="expenseChart" height="120"></canvas>
      </div>
    </div>

    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-gray-900 dark:text-white">Recent Invoices</h3>
        <input type="text" placeholder="Search invoices..." class="form-input max-w-xs" oninput="filterTable('inv-fin-tbody', this.value)" />
      </div>
      <div class="overflow-x-auto">
        <table class="erp-table">
          <thead><tr><th>Invoice #</th><th>Client</th><th>Issue Date</th><th>Due Date</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="inv-fin-tbody">
            ${finInvRow('INV-1042', 'Acme Corp', 'Mar 1', 'Mar 31', '$12,400', 'badge-green', 'Paid')}
            ${finInvRow('INV-1041', 'TechStart Inc', 'Feb 28', 'Mar 28', '$8,200', 'badge-yellow', 'Pending')}
            ${finInvRow('INV-1040', 'Global Media', 'Feb 20', 'Mar 20', '$5,600', 'badge-green', 'Paid')}
            ${finInvRow('INV-1039', 'Nexus Ltd', 'Feb 15', 'Mar 15', '$3,100', 'badge-red', 'Overdue')}
            ${finInvRow('INV-1038', 'Bright Solutions', 'Feb 10', 'Mar 10', '$9,800', 'badge-green', 'Paid')}
            ${finInvRow('INV-1037', 'DataFlow Inc', 'Feb 5', 'Mar 5', '$6,500', 'badge-red', 'Overdue')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  setTimeout(() => {
    destroyChart('cashflow');
    const cfCtx = document.getElementById('cashflowChart');
    if (cfCtx) charts['cashflow'] = new Chart(cfCtx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          { label: 'Income', data: [42000, 38000, 55000, 47000, 62000, 58000], backgroundColor: 'rgba(16,185,129,0.7)', borderRadius: 6 },
          { label: 'Expenses', data: [28000, 25000, 32000, 30000, 38000, 35000], backgroundColor: 'rgba(239,68,68,0.7)', borderRadius: 6 }
        ]
      },
      options: { responsive: true, plugins: { legend: { labels: { color: textColor() } } }, scales: { x: { grid: { color: gridColor() }, ticks: { color: textColor() } }, y: { grid: { color: gridColor() }, ticks: { color: textColor(), callback: v => '$' + (v / 1000) + 'k' } } } }
    });

    destroyChart('expense');
    const exCtx = document.getElementById('expenseChart');
    if (exCtx) charts['expense'] = new Chart(exCtx.getContext('2d'), {
      type: 'bar',
      indexAxis: 'y',
      data: {
        labels: ['Salaries', 'Operations', 'Marketing', 'R&D', 'Infrastructure', 'Other'],
        datasets: [{ data: [68000, 22000, 18000, 14000, 12000, 8300], backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6b7280'], borderRadius: 6 }]
      },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { grid: { color: gridColor() }, ticks: { color: textColor(), callback: v => '$' + (v / 1000) + 'k' } }, y: { grid: { color: gridColor() }, ticks: { color: textColor() } } } }
    });
  }, 50);
}

function finStat(label, value, change, changeColor) {
  return `<div class="stat-card">
    <p class="text-xs text-gray-400 uppercase tracking-wider">${label}</p>
    <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">${value}</p>
    <p class="text-xs ${changeColor} mt-1 font-medium">${change}</p>
  </div>`;
}

function finInvRow(id, client, issue, due, amount, badge, status) {
  return `<tr>
    <td class="font-mono text-sm text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">${id}</td>
    <td class="font-medium text-gray-900 dark:text-white">${client}</td>
    <td class="text-gray-500">${issue}</td>
    <td class="text-gray-500">${due}</td>
    <td class="font-semibold text-gray-900 dark:text-white">${amount}</td>
    <td><span class="badge ${badge}">${status}</span></td>
    <td><div class="flex gap-1">
      <button class="btn-success">View</button>
      <button class="btn-secondary text-xs py-1 px-2">Send</button>
    </div></td>
  </tr>`;
}

function openNewInvoiceModal() {
  openModal('Create New Invoice', `
    <div class="space-y-3">
      <div><label class="form-label">Client Name</label><input class="form-input" placeholder="e.g. Acme Corp"/></div>
      <div class="grid grid-cols-2 gap-3">
        <div><label class="form-label">Issue Date</label><input class="form-input" type="date"/></div>
        <div><label class="form-label">Due Date</label><input class="form-input" type="date"/></div>
      </div>
      <div><label class="form-label">Amount ($)</label><input class="form-input" type="number" placeholder="0.00"/></div>
      <div><label class="form-label">Notes</label><textarea class="form-input" rows="2" placeholder="Optional notes..."></textarea></div>
      <div class="flex gap-3 mt-2">
        <button class="btn-primary" onclick="closeModal()">Create Invoice</button>
        <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>`);
}

// ════════════════════════════════════════════════════════════════════════════
// SALES & CRM
// ════════════════════════════════════════════════════════════════════════════
const leads = [
  { name: 'TechStart Inc', contact: 'John Smith', value: '$45,000', stage: 'Proposal', prob: 70, assigned: 'Sarah C.' },
  { name: 'Global Media', contact: 'Anna Lee', value: '$28,000', stage: 'Negotiation', prob: 85, assigned: 'James P.' },
  { name: 'Nexus Ltd', contact: 'Mark Davis', value: '$62,000', stage: 'Discovery', prob: 40, assigned: 'Sarah C.' },
  { name: 'Bright Solutions', contact: 'Emma Wilson', value: '$18,500', stage: 'Closed Won', prob: 100, assigned: 'Mia T.' },
  { name: 'DataFlow Inc', contact: 'Chris Brown', value: '$33,000', stage: 'Proposal', prob: 60, assigned: 'James P.' },
  { name: 'CloudBase Co', contact: 'Sara Johnson', value: '$91,000', stage: 'Discovery', prob: 30, assigned: 'Alex K.' },
];

function renderSales(el) {
  el.innerHTML = `
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Sales & CRM</h1>
        <p class="text-sm text-gray-500 mt-1">Manage customers, leads and deals</p>
      </div>
      <button class="btn-primary" onclick="openAddLeadModal()">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Add Lead
      </button>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      ${finStat('Pipeline Value', '$277,500', '6 active deals', 'text-blue-500')}
      ${finStat('Won This Month', '$46,500', '3 deals closed', 'text-green-500')}
      ${finStat('Conversion Rate', '34%', '↑ 5% vs last month', 'text-green-500')}
      ${finStat('Avg Deal Size', '$46,250', '↑ 8.2%', 'text-blue-500')}
    </div>

    <!-- Pipeline kanban -->
    <div class="mb-6">
      <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Deal Pipeline</h3>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        ${pipelineCol('Discovery', '#3b82f6', leads.filter(l => l.stage === 'Discovery'))}
        ${pipelineCol('Proposal', '#8b5cf6', leads.filter(l => l.stage === 'Proposal'))}
        ${pipelineCol('Negotiation', '#f59e0b', leads.filter(l => l.stage === 'Negotiation'))}
        ${pipelineCol('Closed Won', '#10b981', leads.filter(l => l.stage === 'Closed Won'))}
      </div>
    </div>

    <!-- Leads table -->
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-gray-900 dark:text-white">All Leads</h3>
        <input type="text" placeholder="Search leads..." class="form-input max-w-xs" oninput="filterTable('leads-tbody', this.value)" />
      </div>
      <div class="overflow-x-auto">
        <table class="erp-table">
          <thead><tr><th>Company</th><th>Contact</th><th>Deal Value</th><th>Stage</th><th>Probability</th><th>Assigned To</th><th>Actions</th></tr></thead>
          <tbody id="leads-tbody">
            ${leads.map(l => leadRow(l)).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function pipelineCol(stage, color, items) {
  const total = items.reduce((s, l) => s + parseInt(l.value.replace(/[$,]/g, '')), 0);
  return `<div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
    <div class="flex items-center justify-between mb-3">
      <span class="text-xs font-semibold uppercase tracking-wider" style="color:${color}">${stage}</span>
      <span class="badge badge-gray text-xs">${items.length}</span>
    </div>
    <p class="text-xs text-gray-400 mb-3">$${(total / 1000).toFixed(0)}k total</p>
    <div class="space-y-2">
      ${items.map(l => `<div class="bg-white dark:bg-gray-900 rounded-lg p-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
        <p class="text-sm font-medium text-gray-900 dark:text-white">${l.name}</p>
        <p class="text-xs text-gray-400 mt-0.5">${l.contact}</p>
        <p class="text-sm font-semibold mt-1" style="color:${color}">${l.value}</p>
      </div>`).join('')}
    </div>
  </div>`;
}

function leadRow(l) {
  const stageBadge = l.stage === 'Closed Won' ? 'badge-green' : l.stage === 'Negotiation' ? 'badge-yellow' : l.stage === 'Proposal' ? 'badge-purple' : 'badge-blue';
  const probColor = l.prob >= 80 ? '#10b981' : l.prob >= 50 ? '#f59e0b' : '#ef4444';
  return `<tr>
    <td class="font-medium text-gray-900 dark:text-white">${l.name}</td>
    <td class="text-gray-500">${l.contact}</td>
    <td class="font-semibold text-gray-900 dark:text-white">${l.value}</td>
    <td><span class="badge ${stageBadge}">${l.stage}</span></td>
    <td>
      <div class="flex items-center gap-2">
        <div class="progress-bar w-16"><div class="progress-fill" style="width:${l.prob}%;background:${probColor}"></div></div>
        <span class="text-xs text-gray-500">${l.prob}%</span>
      </div>
    </td>
    <td class="text-gray-500">${l.assigned}</td>
    <td><div class="flex gap-1">
      <button class="btn-success">View</button>
      <button class="btn-secondary text-xs py-1 px-2">Edit</button>
    </div></td>
  </tr>`;
}

function openAddLeadModal() {
  openModal('Add New Lead', `
    <div class="space-y-3">
      <div><label class="form-label">Company Name</label><input class="form-input" placeholder="e.g. Acme Corp"/></div>
      <div><label class="form-label">Contact Person</label><input class="form-input" placeholder="Full name"/></div>
      <div class="grid grid-cols-2 gap-3">
        <div><label class="form-label">Deal Value</label><input class="form-input" placeholder="$0"/></div>
        <div><label class="form-label">Stage</label><select class="form-input"><option>Discovery</option><option>Proposal</option><option>Negotiation</option><option>Closed Won</option></select></div>
      </div>
      <div><label class="form-label">Assigned To</label><select class="form-input"><option>Sarah C.</option><option>James P.</option><option>Mia T.</option><option>Alex K.</option></select></div>
      <div class="flex gap-3 mt-2">
        <button class="btn-primary" onclick="closeModal()">Add Lead</button>
        <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>`);
}

// ════════════════════════════════════════════════════════════════════════════
// REPORTS & ANALYTICS
// ════════════════════════════════════════════════════════════════════════════
function renderReports(el) {
  el.innerHTML = `
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
        <p class="text-sm text-gray-500 mt-1">Data insights across all modules</p>
      </div>
      <div class="flex gap-2">
        <select class="form-input max-w-xs"><option>Q1 2025</option><option>Q2 2025</option><option>Q3 2025</option><option>Q4 2025</option></select>
        <button class="btn-primary">Generate Report</button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
      <div class="card">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Revenue vs Target — 2025</h3>
        <canvas id="revTargetChart" height="120"></canvas>
      </div>
      <div class="card">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Department Performance</h3>
        <canvas id="deptChart" height="120"></canvas>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
      <div class="card">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Sales Funnel</h3>
        <canvas id="funnelChart" height="160"></canvas>
      </div>
      <div class="card lg:col-span-2">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Monthly KPIs</h3>
        <div class="overflow-x-auto">
          <table class="erp-table">
            <thead><tr><th>KPI</th><th>Jan</th><th>Feb</th><th>Mar</th><th>Target</th><th>Status</th></tr></thead>
            <tbody>
              ${kpiRow('Revenue Growth', '8.2%', '10.1%', '12.5%', '10%', 'badge-green', 'On Track')}
              ${kpiRow('Customer Acquisition', '42', '38', '51', '45', 'badge-green', 'On Track')}
              ${kpiRow('Churn Rate', '2.1%', '1.8%', '2.4%', '<2%', 'badge-yellow', 'At Risk')}
              ${kpiRow('Avg Response Time', '4.2h', '3.8h', '3.1h', '<4h', 'badge-green', 'On Track')}
              ${kpiRow('Employee Satisfaction', '78%', '80%', '82%', '85%', 'badge-yellow', 'At Risk')}
              ${kpiRow('Inventory Turnover', '4.2x', '4.5x', '4.8x', '5x', 'badge-yellow', 'At Risk')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    destroyChart('revTarget');
    const rtCtx = document.getElementById('revTargetChart');
    if (rtCtx) charts['revTarget'] = new Chart(rtCtx.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          { label: 'Actual', data: [42000, 38000, 55000, 47000, 62000, 58000, 71000, 65000, 80000, 74000, 88000, 95000], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.4, borderWidth: 2 },
          { label: 'Target', data: [45000, 45000, 50000, 50000, 60000, 60000, 70000, 70000, 80000, 80000, 90000, 90000], borderColor: '#10b981', borderDash: [5, 5], fill: false, tension: 0, borderWidth: 2, pointRadius: 0 }
        ]
      },
      options: { responsive: true, plugins: { legend: { labels: { color: textColor() } } }, scales: { x: { grid: { color: gridColor() }, ticks: { color: textColor() } }, y: { grid: { color: gridColor() }, ticks: { color: textColor(), callback: v => '$' + (v / 1000) + 'k' } } } }
    });

    destroyChart('dept');
    const dCtx = document.getElementById('deptChart');
    if (dCtx) charts['dept'] = new Chart(dCtx.getContext('2d'), {
      type: 'radar',
      data: {
        labels: ['Sales', 'Finance', 'HR', 'Tech', 'Marketing', 'Support'],
        datasets: [
          { label: 'Q1 2025', data: [88, 72, 65, 91, 78, 70], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.15)', borderWidth: 2 },
          { label: 'Q4 2024', data: [75, 68, 70, 85, 72, 65], borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.1)', borderWidth: 2 }
        ]
      },
      options: { responsive: true, plugins: { legend: { labels: { color: textColor() } } }, scales: { r: { grid: { color: gridColor() }, ticks: { color: textColor(), backdropColor: 'transparent' }, pointLabels: { color: textColor() } } } }
    });

    destroyChart('funnel');
    const fCtx = document.getElementById('funnelChart');
    if (fCtx) charts['funnel'] = new Chart(fCtx.getContext('2d'), {
      type: 'bar',
      indexAxis: 'y',
      data: {
        labels: ['Leads', 'Qualified', 'Proposal', 'Negotiation', 'Closed'],
        datasets: [{ data: [320, 180, 95, 48, 28], backgroundColor: ['#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6'], borderRadius: 6 }]
      },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { grid: { color: gridColor() }, ticks: { color: textColor() } }, y: { grid: { color: gridColor() }, ticks: { color: textColor() } } } }
    });
  }, 50);
}

function kpiRow(kpi, jan, feb, mar, target, badge, status) {
  return `<tr>
    <td class="font-medium text-gray-900 dark:text-white">${kpi}</td>
    <td class="text-gray-500">${jan}</td><td class="text-gray-500">${feb}</td><td class="font-semibold text-gray-900 dark:text-white">${mar}</td>
    <td class="text-gray-400">${target}</td>
    <td><span class="badge ${badge}">${status}</span></td>
  </tr>`;
}

// ════════════════════════════════════════════════════════════════════════════
// SETTINGS
// ════════════════════════════════════════════════════════════════════════════
function renderSettings(el) {
  el.innerHTML = `
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      <p class="text-sm text-gray-500 mt-1">Manage your account and application preferences</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div class="space-y-2">
        ${settingsNav('Profile', 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', 'profile')}
        ${settingsNav('Security', 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', 'security')}
        ${settingsNav('Notifications', 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', 'notifs')}
        ${settingsNav('Appearance', 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01', 'appearance')}
        ${settingsNav('Integrations', 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1', 'integrations')}
      </div>

      <div class="lg:col-span-2 space-y-5">
        <div class="card">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h3>
          <div class="flex items-center gap-4 mb-5">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">A</div>
            <div>
              <button class="btn-secondary text-sm">Change Photo</button>
              <p class="text-xs text-gray-400 mt-1">JPG, PNG up to 2MB</p>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label class="form-label">First Name</label><input class="form-input" value="Admin"/></div>
            <div><label class="form-label">Last Name</label><input class="form-input" value="User"/></div>
            <div><label class="form-label">Email</label><input class="form-input" value="admin@erppro.com"/></div>
            <div><label class="form-label">Phone</label><input class="form-input" value="+1 (555) 000-0000"/></div>
            <div class="sm:col-span-2"><label class="form-label">Company</label><input class="form-input" value="ERP Pro Inc."/></div>
          </div>
          <div class="mt-4 flex gap-3">
            <button class="btn-primary">Save Changes</button>
            <button class="btn-secondary">Cancel</button>
          </div>
        </div>

        <div class="card">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div><p class="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</p><p class="text-xs text-gray-400">Switch between light and dark theme</p></div>
              <button onclick="setTheme(!html.classList.contains('dark'))" class="relative w-11 h-6 rounded-full transition-colors duration-200 ${html.classList.contains('dark') ? 'bg-blue-600' : 'bg-gray-200'}" id="theme-toggle-settings">
                <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${html.classList.contains('dark') ? 'translate-x-5' : ''}"></span>
              </button>
            </div>
            <div class="flex items-center justify-between">
              <div><p class="text-sm font-medium text-gray-900 dark:text-white">Compact Mode</p><p class="text-xs text-gray-400">Reduce spacing for more content</p></div>
              <button class="relative w-11 h-6 bg-gray-200 rounded-full transition-colors duration-200">
                <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"></span>
              </button>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Notifications</h3>
          <div class="space-y-3">
            ${notifToggle('Email Notifications', 'Receive updates via email', true)}
            ${notifToggle('Push Notifications', 'Browser push notifications', true)}
            ${notifToggle('Payroll Alerts', 'Notify when payroll is processed', true)}
            ${notifToggle('Low Stock Alerts', 'Notify when stock is below threshold', false)}
            ${notifToggle('Invoice Reminders', 'Remind about overdue invoices', true)}
          </div>
        </div>
      </div>
    </div>
  `;
}

function settingsNav(label, iconPath, id) {
  return `<button class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left">
    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPath}"/></svg>
    ${label}
  </button>`;
}

function notifToggle(label, desc, on) {
  return `<div class="flex items-center justify-between">
    <div><p class="text-sm font-medium text-gray-900 dark:text-white">${label}</p><p class="text-xs text-gray-400">${desc}</p></div>
    <button onclick="this.classList.toggle('bg-blue-600');this.classList.toggle('bg-gray-200');this.querySelector('span').classList.toggle('translate-x-5')"
      class="relative w-11 h-6 ${on ? 'bg-blue-600' : 'bg-gray-200'} rounded-full transition-colors duration-200">
      <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${on ? 'translate-x-5' : ''}"></span>
    </button>
  </div>`;
}

// ════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ════════════════════════════════════════════════════════════════════════════
function filterTable(tbodyId, search) {
  const rows = document.querySelectorAll('#' + tbodyId + ' tr');
  rows.forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(search.toLowerCase()) ? '' : 'none';
  });
}

let sortDirections = {};
function sortTable(tableId, colIndex) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const tbody = table.tagName === 'TBODY' ? table : table.querySelector('tbody');
  if (!tbody) return;
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const key = tableId + '_' + colIndex;
  sortDirections[key] = !sortDirections[key];
  rows.sort((a, b) => {
    const aText = a.cells[colIndex]?.textContent.trim() || '';
    const bText = b.cells[colIndex]?.textContent.trim() || '';
    const aNum = parseFloat(aText.replace(/[^0-9.-]/g, ''));
    const bNum = parseFloat(bText.replace(/[^0-9.-]/g, ''));
    if (!isNaN(aNum) && !isNaN(bNum)) return sortDirections[key] ? aNum - bNum : bNum - aNum;
    return sortDirections[key] ? aText.localeCompare(bText) : bText.localeCompare(aText);
  });
  rows.forEach(r => tbody.appendChild(r));
}

// ─── Init ─────────────────────────────────────────────────────────────────────
renderPage('dashboard');
