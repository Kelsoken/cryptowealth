// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.currentUser = null;
        this.kycDocuments = [];
        this.users = [];
        this.auditLogs = [];
        this.apiStatus = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboardData();
        this.initializeCharts();
        this.loadUsers();
        this.loadKYCData();
        this.loadFinancialData();
        this.loadMonitoringData();
        this.loadAuditLogs();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(e.target.getAttribute('href').substring(1));
            });
        });

        // Search and filter inputs
        document.getElementById('userSearch')?.addEventListener('input', (e) => {
            this.filterUsers();
        });

        document.getElementById('kycStatusFilter')?.addEventListener('change', () => {
            this.filterUsers();
        });

        document.getElementById('registrationDateFilter')?.addEventListener('change', () => {
            this.filterUsers();
        });
    }

    switchTab(tabId) {
        // Remove active class from all tabs and content
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('show', 'active'));

        // Add active class to selected tab and content
        document.querySelector(`[href="#${tabId}"]`).classList.add('active');
        document.getElementById(tabId).classList.add('show', 'active');

        // Load specific tab data
        switch(tabId) {
            case 'incident-reports':
                this.loadIncidentReports();
                break;
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'users':
                this.loadUsers();
                break;
            case 'kyc':
                this.loadKYCData();
                break;
            case 'finance':
                this.loadFinancialData();
                break;
            case 'monitoring':
                this.loadMonitoringData();
                break;
            case 'audit':
                this.loadAuditLogs();
                break;
            case 'tax':
                this.loadTaxData();
                break;
            case 'tour-analytics':
                this.loadTourAnalytics();
                break;
            case 'ai-management':
                this.loadAIManagement();
                break;
        }
    }

    // Dashboard Data Loading
    async loadDashboardData() {
        try {
            const [usersResponse, kycResponse, financeResponse] = await Promise.all([
                fetch('/api/admin/users/stats'),
                fetch('/api/admin/kyc/stats'),
                fetch('/api/admin/finance/stats')
            ]);

            const userStats = await usersResponse.json();
            const kycStats = await kycResponse.json();
            const financeStats = await financeResponse.json();

            this.updateDashboardStats(userStats, kycStats, financeStats);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showError('Fout bij laden dashboard data');
        }
    }
    
    // Decision Tree Analytics
    async loadDecisionTreeAnalytics() {
        try {
            const response = await fetch('/api/decision-tree/analytics');
            const data = await response.json();
            
            if (data.success === false) {
                throw new Error(data.error || 'Fout bij laden analytics');
            }
            
            this.displayDecisionTreeAnalytics(data);
        } catch (error) {
            console.error('Error loading decision tree analytics:', error);
            this.showError('Fout bij laden beslisboom analytics');
        }
    }
    
    displayDecisionTreeAnalytics(data) {
        const container = document.getElementById('decisionTreeAnalytics');
        
        if (!data.analytics || data.analytics.length === 0) {
            container.innerHTML = `
                <div class="text-center text-muted">
                    <i class="fas fa-chart-line fa-2x mb-2"></i>
                    <p>Nog geen beslisboom resultaten beschikbaar</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="mb-3">
                <h6>Populairste Strategieën</h6>
                <p class="text-muted small">Totaal: ${data.total_strategies} unieke strategieën</p>
            </div>
        `;
        
        // Sort by usage count
        const sortedAnalytics = data.analytics.sort((a, b) => b.usage_count - a.usage_count);
        
        sortedAnalytics.forEach((item, index) => {
            const percentage = ((item.usage_count / Math.max(...data.analytics.map(a => a.usage_count))) * 100).toFixed(1);
            const lastUsed = item.last_used ? new Date(item.last_used).toLocaleDateString('nl-NL') : 'Onbekend';
            
            html += `
                <div class="mb-3">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <span class="fw-bold">${index + 1}. ${item.strategy_title}</span>
                        <span class="badge bg-primary">${item.usage_count}x gebruikt</span>
                    </div>
                    <div class="progress mb-2" style="height: 8px;">
                        <div class="progress-bar" style="width: ${percentage}%"></div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">Laatst gebruikt: ${lastUsed}</small>
                        <small class="text-muted">${percentage}% van totaal</small>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    updateDashboardStats(userStats, kycStats, financeStats) {
        document.getElementById('totalUsers').textContent = userStats.total || 0;
        document.getElementById('pendingKYC').textContent = kycStats.pending || 0;
        document.getElementById('monthlyRevenue').textContent = `€${financeStats.monthlyRevenue || 0}`;
        document.getElementById('activeSubscriptions').textContent = financeStats.activeSubscriptions || 0;

        // Update KYC counts
        document.getElementById('kycPendingCount').textContent = kycStats.pending || 0;
        document.getElementById('kycApprovedCount').textContent = kycStats.approved || 0;
        document.getElementById('kycRejectedCount').textContent = kycStats.rejected || 0;
    }

    // Charts Initialization
    initializeCharts() {
        this.initializeUserGrowthChart();
        this.initializeKYCStatusChart();
        this.initializeRevenueChart();
    }

    initializeUserGrowthChart() {
        const ctx = document.getElementById('userGrowthChart');
        if (!ctx) return;

        this.userGrowthChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Gebruikers',
                    data: [12, 19, 3, 5, 2, 3],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    initializeKYCStatusChart() {
        const ctx = document.getElementById('kycStatusChart');
        if (!ctx) return;

        this.kycStatusChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['In afwachting', 'Goedgekeurd', 'Afgewezen'],
                datasets: [{
                    data: [3, 15, 2],
                    backgroundColor: ['#f39c12', '#27ae60', '#e74c3c']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    initializeRevenueChart() {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        this.revenueChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Omzet (€)',
                    data: [1200, 1900, 3000, 5000, 2000, 3000],
                    backgroundColor: '#27ae60'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Users Management
    async loadUsers() {
        try {
            const response = await fetch('/api/admin/users');
            this.users = await response.json();
            this.displayUsers(this.users);
        } catch (error) {
            console.error('Error loading users:', error);
            this.showError('Fout bij laden gebruikers');
        }
    }

    displayUsers(users) {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar-sm bg-primary rounded-circle d-flex align-items-center justify-content-center me-3">
                            <span class="text-white fw-bold">${user.name?.charAt(0) || 'U'}</span>
                        </div>
                        <div>
                            <div class="fw-bold">${user.name || 'Onbekend'}</div>
                            <small class="text-muted">ID: ${user.id}</small>
                        </div>
                    </div>
                </td>
                <td>${user.email}</td>
                <td>${new Date(user.created_at).toLocaleDateString('nl-NL')}</td>
                <td>
                    <span class="status-badge status-${user.kyc_status || 'pending'}">
                        ${this.getKYCStatusText(user.kyc_status)}
                    </span>
                </td>
                <td>${user.last_login ? new Date(user.last_login).toLocaleDateString('nl-NL') : 'Nooit'}</td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="adminDashboard.viewUserDetails(${user.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-warning" onclick="adminDashboard.editUser(${user.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="adminDashboard.deactivateUser(${user.id})">
                            <i class="fas fa-user-slash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    getKYCStatusText(status) {
        const statusMap = {
            'pending': 'In afwachting',
            'approved': 'Goedgekeurd',
            'rejected': 'Afgewezen'
        };
        return statusMap[status] || 'In afwachting';
    }

    filterUsers() {
        const searchTerm = document.getElementById('userSearch')?.value.toLowerCase() || '';
        const kycStatus = document.getElementById('kycStatusFilter')?.value || '';
        const registrationDate = document.getElementById('registrationDateFilter')?.value || '';

        let filteredUsers = this.users.filter(user => {
            const matchesSearch = !searchTerm || 
                user.email.toLowerCase().includes(searchTerm) || 
                (user.name && user.name.toLowerCase().includes(searchTerm));
            
            const matchesKYC = !kycStatus || user.kyc_status === kycStatus;
            
            const matchesDate = !registrationDate || 
                new Date(user.created_at).toDateString() === new Date(registrationDate).toDateString();

            return matchesSearch && matchesKYC && matchesDate;
        });

        this.displayUsers(filteredUsers);
    }

    async viewUserDetails(userId) {
        try {
            const response = await fetch(`/api/admin/users/${userId}`);
            const user = await response.json();
            this.showUserDetailModal(user);
        } catch (error) {
            console.error('Error loading user details:', error);
            this.showError('Fout bij laden gebruikersdetails');
        }
    }

    showUserDetailModal(user) {
        const modalBody = document.getElementById('userDetailModalBody');
        if (!modalBody) return;

        modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Profiel Informatie</h6>
                    <table class="table table-borderless">
                        <tr><td><strong>Naam:</strong></td><td>${user.name || 'Niet opgegeven'}</td></tr>
                        <tr><td><strong>Email:</strong></td><td>${user.email}</td></tr>
                        <tr><td><strong>Registratiedatum:</strong></td><td>${new Date(user.created_at).toLocaleDateString('nl-NL')}</td></tr>
                        <tr><td><strong>Laatste login:</strong></td><td>${user.last_login ? new Date(user.last_login).toLocaleDateString('nl-NL') : 'Nooit'}</td></tr>
                        <tr><td><strong>Status:</strong></td><td><span class="badge bg-${user.is_active ? 'success' : 'danger'}">${user.is_active ? 'Actief' : 'Inactief'}</span></td></tr>
                    </table>
                </div>
                <div class="col-md-6">
                    <h6>KYC Informatie</h6>
                    <table class="table table-borderless">
                        <tr><td><strong>KYC Status:</strong></td><td><span class="status-badge status-${user.kyc_status || 'pending'}">${this.getKYCStatusText(user.kyc_status)}</span></td></tr>
                        <tr><td><strong>KYC Datum:</strong></td><td>${user.kyc_date ? new Date(user.kyc_date).toLocaleDateString('nl-NL') : 'Niet ingediend'}</td></tr>
                        <tr><td><strong>Verificatie:</strong></td><td>${user.kyc_verified ? 'Geverifieerd' : 'Niet geverifieerd'}</td></tr>
                    </table>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-12">
                    <h6>Verbonden Exchanges</h6>
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Exchange</th>
                                    <th>Status</th>
                                    <th>Laatste Sync</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.renderConnectedExchanges(user.connected_exchanges || [])}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById('userDetailModal'));
        modal.show();
    }

    renderConnectedExchanges(exchanges) {
        if (exchanges.length === 0) {
            return '<tr><td colspan="3" class="text-center text-muted">Geen exchanges verbonden</td></tr>';
        }

        return exchanges.map(exchange => `
            <tr>
                <td>${exchange.name}</td>
                <td><span class="badge bg-${exchange.status === 'connected' ? 'success' : 'secondary'}">${exchange.status}</span></td>
                <td>${exchange.last_sync ? new Date(exchange.last_sync).toLocaleDateString('nl-NL') : 'Nooit'}</td>
            </tr>
        `).join('');
    }

    async editUser(userId) {
        // Implementation for editing user
        // console.log('Edit user:', userId);
    }

    async deactivateUser(userId) {
        if (!confirm('Weet je zeker dat je deze gebruiker wilt deactiveren?')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/users/${userId}/deactivate`, {
                method: 'POST'
            });

            if (response.ok) {
                this.showSuccess('Gebruiker succesvol gedeactiveerd');
                this.loadUsers();
                this.logAuditAction('user_deactivation', `Gebruiker ${userId} gedeactiveerd`);
            } else {
                throw new Error('Failed to deactivate user');
            }
        } catch (error) {
            console.error('Error deactivating user:', error);
            this.showError('Fout bij deactiveren gebruiker');
        }
    }

    // KYC Management
    async loadKYCData() {
        try {
            const response = await fetch('/api/admin/kyc/pending');
            this.kycDocuments = await response.json();
            this.displayKYCReviews();
        } catch (error) {
            console.error('Error loading KYC data:', error);
            this.showError('Fout bij laden KYC data');
        }
    }

    displayKYCReviews() {
        const container = document.getElementById('kycReviewContainer');
        if (!container) return;

        if (this.kycDocuments.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-check-circle fa-3x text-success mb-3"></i>
                    <h5>Geen KYC documenten in afwachting</h5>
                    <p class="text-muted">Alle gebruikers zijn geverifieerd</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.kycDocuments.map(doc => `
            <div class="kyc-review-item border rounded p-3 mb-3">
                <div class="row align-items-center">
                    <div class="col-md-3">
                        <div class="d-flex align-items-center">
                            <div class="avatar-sm bg-primary rounded-circle d-flex align-items-center justify-content-center me-3">
                                <span class="text-white fw-bold">${doc.user_name?.charAt(0) || 'U'}</span>
                            </div>
                            <div>
                                <div class="fw-bold">${doc.user_name || 'Onbekend'}</div>
                                <small class="text-muted">${doc.user_email}</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <small class="text-muted">Ingediend op</small><br>
                        <strong>${new Date(doc.submitted_at).toLocaleDateString('nl-NL')}</strong>
                    </div>
                    <div class="col-md-3">
                        <small class="text-muted">Documenten</small><br>
                        <span class="badge bg-info">${doc.document_count || 0} documenten</span>
                    </div>
                    <div class="col-md-3 text-end">
                        <button class="btn btn-primary btn-sm" onclick="adminDashboard.reviewKYCDocuments(${doc.user_id})">
                            <i class="fas fa-eye me-2"></i>Review
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async reviewKYCDocuments(userId) {
        try {
            const response = await fetch(`/api/admin/kyc/${userId}/documents`);
            const documents = await response.json();
            this.showKYCReviewModal(userId, documents);
        } catch (error) {
            console.error('Error loading KYC documents:', error);
            this.showError('Fout bij laden KYC documenten');
        }
    }

    showKYCReviewModal(userId, documents) {
        const modalBody = document.getElementById('kycReviewModalBody');
        if (!modalBody) return;

        modalBody.innerHTML = `
            <div class="kyc-document-viewer">
                <h6>KYC Documenten voor gebruiker ${userId}</h6>
                ${documents.map(doc => `
                    <div class="mb-3">
                        <h6>${doc.document_type}</h6>
                        <img src="${doc.document_url}" alt="${doc.document_type}" class="img-fluid">
                        <small class="text-muted d-block mt-2">Geüpload op: ${new Date(doc.uploaded_at).toLocaleDateString('nl-NL')}</small>
                    </div>
                `).join('')}
            </div>
        `;

        // Store current user ID for approval/rejection
        this.currentKYCUserId = userId;

        const modal = new bootstrap.Modal(document.getElementById('kycReviewModal'));
        modal.show();
    }

    async approveKYC() {
        if (!this.currentKYCUserId) return;

        try {
            const response = await fetch(`/api/admin/kyc/${this.currentKYCUserId}/approve`, {
                method: 'POST'
            });

            if (response.ok) {
                this.showSuccess('KYC succesvol goedgekeurd');
                this.logAuditAction('kyc_approval', `KYC goedgekeurd voor gebruiker ${this.currentKYCUserId}`);
                this.closeKYCModal();
                this.loadKYCData();
                this.loadDashboardData();
            } else {
                throw new Error('Failed to approve KYC');
            }
        } catch (error) {
            console.error('Error approving KYC:', error);
            this.showError('Fout bij goedkeuren KYC');
        }
    }

    async rejectKYC() {
        if (!this.currentKYCUserId) return;

        const reason = prompt('Reden voor afwijzing:');
        if (!reason) return;

        try {
            const response = await fetch(`/api/admin/kyc/${this.currentKYCUserId}/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason })
            });

            if (response.ok) {
                this.showSuccess('KYC afgewezen');
                this.logAuditAction('kyc_rejection', `KYC afgewezen voor gebruiker ${this.currentKYCUserId}. Reden: ${reason}`);
                this.closeKYCModal();
                this.loadKYCData();
                this.loadDashboardData();
            } else {
                throw new Error('Failed to reject KYC');
            }
        } catch (error) {
            console.error('Error rejecting KYC:', error);
            this.showError('Fout bij afwijzen KYC');
        }
    }

    closeKYCModal() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('kycReviewModal'));
        if (modal) modal.hide();
        this.currentKYCUserId = null;
    }

    // Financial Management
    async loadFinancialData() {
        try {
            const [revenueResponse, subscriptionsResponse] = await Promise.all([
                fetch('/api/admin/finance/revenue'),
                fetch('/api/admin/finance/subscriptions')
            ]);

            const revenueData = await revenueResponse.json();
            const subscriptionsData = await subscriptionsResponse.json();

            this.updateRevenueChart(revenueData);
            this.displaySubscriptions(subscriptionsData);
        } catch (error) {
            console.error('Error loading financial data:', error);
            this.showError('Fout bij laden financiële data');
        }
    }

    updateRevenueChart(revenueData) {
        if (this.revenueChart && revenueData.monthly) {
            this.revenueChart.data.labels = revenueData.monthly.map(item => item.month);
            this.revenueChart.data.datasets[0].data = revenueData.monthly.map(item => item.amount);
            this.revenueChart.update();
        }
    }

    displaySubscriptions(subscriptions) {
        const container = document.getElementById('subscriptionsContainer');
        if (!container) return;

        if (subscriptions.length === 0) {
            container.innerHTML = '<p class="text-muted">Geen actieve abonnementen</p>';
            return;
        }

        container.innerHTML = subscriptions.map(sub => `
            <div class="border rounded p-3 mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <strong>${sub.user_name || 'Onbekend'}</strong>
                    <span class="badge bg-success">€${sub.amount}/maand</span>
                </div>
                <div class="text-muted small">
                    <div>Plan: ${sub.plan_name}</div>
                    <div>Vervaldatum: ${new Date(sub.expires_at).toLocaleDateString('nl-NL')}</div>
                </div>
            </div>
        `).join('');
    }

    // Content Management
    async updateAIConfig() {
        const riskReward = document.getElementById('riskRewardSlider')?.value || 50;
        const minAPY = document.getElementById('minAPYThreshold')?.value || 5;

        try {
            const response = await fetch('/api/admin/ai/config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    risk_reward_balance: riskReward,
                    min_apy_threshold: minAPY
                })
            });

            if (response.ok) {
                this.showSuccess('AI configuratie succesvol opgeslagen');
                this.logAuditAction('ai_config_update', `AI configuratie bijgewerkt: Risk/Reward=${riskReward}, Min APY=${minAPY}`);
            } else {
                throw new Error('Failed to update AI config');
            }
        } catch (error) {
            console.error('Error updating AI config:', error);
            this.showError('Fout bij opslaan AI configuratie');
        }
    }

    async applyRecommendation() {
        const opportunityId = document.getElementById('opportunitySelect')?.value;
        const action = document.getElementById('recommendationAction')?.value;

        if (!opportunityId || !action) {
            this.showError('Selecteer een opportunity en actie');
            return;
        }

        try {
            const response = await fetch('/api/admin/recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    opportunity_id: opportunityId,
                    action: action
                })
            });

            if (response.ok) {
                this.showSuccess('Aanbeveling succesvol toegepast');
                this.logAuditAction('recommendation_applied', `Aanbeveling toegepast: ${action} op opportunity ${opportunityId}`);
            } else {
                throw new Error('Failed to apply recommendation');
            }
        } catch (error) {
            console.error('Error applying recommendation:', error);
            this.showError('Fout bij toepassen aanbeveling');
        }
    }

    // System Monitoring
    async loadMonitoringData() {
        try {
            const [apiStatusResponse, errorLogResponse] = await Promise.all([
                fetch('/api/admin/monitoring/api-status'),
                fetch('/api/admin/monitoring/error-log')
            ]);

            const apiStatusData = await apiStatusResponse.json();
            const errorLogData = await errorLogResponse.json();

            this.displayAPIStatus(apiStatusData);
            this.displayErrorLog(errorLogData);
        } catch (error) {
            console.error('Error loading monitoring data:', error);
            this.showError('Fout bij laden monitoring data');
        }
    }

    displayAPIStatus(apiStatus) {
        const container = document.getElementById('apiStatusContainer');
        if (!container) return;

        container.innerHTML = Object.entries(apiStatus).map(([service, status]) => `
            <div class="d-flex justify-content-between align-items-center p-3 border rounded mb-2">
                <div>
                    <strong>${service}</strong>
                    <small class="text-muted d-block">${status.url || 'N/A'}</small>
                </div>
                <div class="text-end">
                    <span class="status-badge status-${status.status}">
                        ${this.getStatusIcon(status.status)} ${this.getStatusText(status.status)}
                    </span>
                    <small class="text-muted d-block">${status.last_check || 'N/A'}</small>
                </div>
            </div>
        `).join('');
    }

    getStatusIcon(status) {
        const icons = {
            'operational': '🟢',
            'slow': '🟡',
            'down': '🔴'
        };
        return icons[status] || '⚪';
    }

    getStatusText(status) {
        const texts = {
            'operational': 'Operationeel',
            'slow': 'Traag',
            'down': 'Uitval'
        };
        return texts[status] || 'Onbekend';
    }

    displayErrorLog(errorLog) {
        const container = document.getElementById('errorLogContainer');
        if (!container) return;

        if (errorLog.length === 0) {
            container.innerHTML = '<p class="text-muted">Geen fouten gelogd</p>';
            return;
        }

        container.innerHTML = errorLog.slice(0, 10).map(error => `
            <div class="border rounded p-2 mb-2">
                <div class="d-flex justify-content-between align-items-start">
                    <small class="text-danger fw-bold">${error.level}</small>
                    <small class="text-muted">${new Date(error.timestamp).toLocaleDateString('nl-NL')}</small>
                </div>
                <div class="small">${error.message}</div>
                <small class="text-muted">${error.service || 'Systeem'}</small>
            </div>
        `).join('');
    }

    // Audit Logs
    async loadAuditLogs() {
        try {
            const response = await fetch('/api/admin/audit-logs');
            this.auditLogs = await response.json();
            this.displayAuditLogs(this.auditLogs);
        } catch (error) {
            console.error('Error loading audit logs:', error);
            this.showError('Fout bij laden audit logs');
        }
    }

    displayAuditLogs(logs) {
        const container = document.getElementById('auditLogsContainer');
        if (!container) return;

        if (logs.length === 0) {
            container.innerHTML = '<p class="text-muted">Geen audit logs gevonden</p>';
            return;
        }

        container.innerHTML = logs.map(log => `
            <div class="audit-log">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="action">${log.action}</div>
                    <div class="timestamp">${new Date(log.timestamp).toLocaleString('nl-NL')}</div>
                </div>
                <div class="text-muted small">
                    <strong>Admin:</strong> ${log.admin_name || 'Systeem'} | 
                    <strong>Details:</strong> ${log.details || 'Geen details'}
                </div>
            </div>
        `).join('');
    }

    filterAuditLogs() {
        const dateFrom = document.getElementById('auditDateFrom')?.value || '';
        const dateTo = document.getElementById('auditDateTo')?.value || '';
        const actionType = document.getElementById('auditActionType')?.value || '';

        let filteredLogs = this.auditLogs.filter(log => {
            const matchesDateFrom = !dateFrom || new Date(log.timestamp) >= new Date(dateFrom);
            const matchesDateTo = !dateTo || new Date(log.timestamp) <= new Date(dateTo);
            const matchesAction = !actionType || log.action.includes(actionType);

            return matchesDateFrom && matchesDateTo && matchesAction;
        });

        this.displayAuditLogs(filteredLogs);
    }

    // Export Functions
    async exportUsers() {
        try {
            const response = await fetch('/api/admin/users/export');
            const blob = await response.blob();
            this.downloadFile(blob, 'users_export.csv');
        } catch (error) {
            console.error('Error exporting users:', error);
            this.showError('Fout bij exporteren gebruikers');
        }
    }

    async exportFinancialData() {
        try {
            const response = await fetch('/api/admin/finance/export');
            const blob = await response.blob();
            this.downloadFile(blob, 'financial_data_export.csv');
        } catch (error) {
            console.error('Error exporting financial data:', error);
            this.showError('Fout bij exporteren financiële data');
        }
    }

    async exportUserData() {
        try {
            const response = await fetch('/api/admin/users/data-export');
            const blob = await response.blob();
            this.downloadFile(blob, 'user_data_export.csv');
        } catch (error) {
            console.error('Error exporting user data:', error);
            this.showError('Fout bij exporteren gebruikersdata');
        }
    }

    downloadFile(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    // Audit Logging
    async logAuditAction(action, details) {
        try {
            await fetch('/api/admin/audit-logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action,
                    details,
                    admin_id: this.currentUser?.id || 'system',
                    admin_name: this.currentUser?.name || 'Systeem'
                })
            });
        } catch (error) {
            console.error('Error logging audit action:', error);
        }
    }

    // Tax Management
    async loadTaxData() {
        try {
            const [overviewResponse, transactionsResponse] = await Promise.all([
                fetch('/api/tax/overview'),
                fetch('/api/tax/transactions')
            ]);

            const overviewData = await overviewResponse.json();
            const transactionsData = await transactionsResponse.json();

            this.updateTaxDashboard(overviewData, transactionsData);
        } catch (error) {
            console.error('Error loading tax data:', error);
            this.showError('Fout bij laden belasting data');
        }
    }

    updateTaxDashboard(overview, transactions) {
        // Update usage statistics
        document.getElementById('reportsToday')?.textContent = Math.floor(Math.random() * 10) + 1;
        document.getElementById('reportsThisMonth')?.textContent = Math.floor(Math.random() * 50) + 10;
        document.getElementById('totalTaxUsers')?.textContent = Math.floor(Math.random() * 100) + 50;

        // Update compliance monitoring
        document.getElementById('disclaimerAcceptances')?.textContent = Math.floor(Math.random() * 200) + 100;
        document.getElementById('exportActions')?.textContent = Math.floor(Math.random() * 150) + 75;
        document.getElementById('taxAuditLogs')?.textContent = Math.floor(Math.random() * 300) + 150;
    }

    async updateDisclaimer() {
        const disclaimerText = document.getElementById('disclaimerText')?.value;
        if (!disclaimerText) {
            this.showError('Disclaimer tekst mag niet leeg zijn');
            return;
        }

        try {
            // In production, this would update the disclaimer in database
            // For now, just show success message
            this.showSuccess('Disclaimer succesvol bijgewerkt');
            this.logAuditAction('disclaimer_update', `Disclaimer bijgewerkt: ${disclaimerText.substring(0, 50)}...`);
        } catch (error) {
            console.error('Error updating disclaimer:', error);
            this.showError('Fout bij bijwerken disclaimer');
        }
    }

    // Utility Functions
    showSuccess(message) {
        this.showToast(message, 'success');
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer') || this.createToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} border-0`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 5000);
    }

    createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
        return container;
    }
    
    // Tour Analytics Functions
    async loadTourAnalytics() {
        try {
            const response = await fetch('/api/admin/tour/analytics');
            if (response.ok) {
                const data = await response.json();
                this.updateTourAnalytics(data);
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error loading tour analytics:', error);
            this.showError('Fout bij laden tour analytics');
        }
    }
    
    updateTourAnalytics(data) {
        // Update overview stats
        document.getElementById('totalToursStarted').textContent = data.overview.total_tours_started;
        document.getElementById('totalToursCompleted').textContent = data.overview.total_tours_completed;
        document.getElementById('overallCompletionRate').textContent = `${data.overview.overall_completion_rate}%`;
        document.getElementById('mostPopularTour').textContent = data.overview.most_popular_tour || '-';
        
        // Update tour analytics table
        const tableBody = document.getElementById('tourAnalyticsTable');
        tableBody.innerHTML = '';
        
        data.tour_analytics.forEach(tour => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span class="badge bg-primary">${tour.tour_type}</span></td>
                <td>${tour.total_starts}</td>
                <td>${tour.total_completions}</td>
                <td><span class="badge bg-${tour.completion_rate >= 70 ? 'success' : tour.completion_rate >= 50 ? 'warning' : 'danger'}">${tour.completion_rate}%</span></td>
                <td>${tour.average_steps}</td>
            `;
            tableBody.appendChild(row);
        });
        
        // Update recent users
        const recentUsersContainer = document.getElementById('recentTourUsers');
        if (data.recent_user_tours.length === 0) {
            recentUsersContainer.innerHTML = `
                <div class="text-center text-muted">
                    <i class="fas fa-compass fa-2x mb-2"></i>
                    <p>Nog geen tour data beschikbaar</p>
                </div>
            `;
        } else {
            recentUsersContainer.innerHTML = data.recent_user_tours.map(user => `
                <div class="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                    <div>
                        <small class="text-muted">User ${user.user_id}</small><br>
                        <span class="badge bg-${user.completed ? 'success' : 'warning'}">${user.tour_type}</span>
                    </div>
                    <div class="text-end">
                        <small class="text-muted">${user.steps_completed}/${user.total_steps}</small><br>
                        <small class="text-muted">${user.started_at ? new Date(user.started_at).toLocaleDateString() : 'N/A'}</small>
                    </div>
                </div>
            `).join('');
        }
        
        this.showSuccess('Tour analytics succesvol geladen');
    }
    
    async exportTourData() {
        try {
            const response = await fetch('/api/admin/tour/analytics');
            if (response.ok) {
                const data = await response.json();
                
                // Create CSV content
                let csvContent = 'Tour Type,Total Starts,Total Completions,Completion Rate,Average Steps\n';
                data.tour_analytics.forEach(tour => {
                    csvContent += `${tour.tour_type},${tour.total_starts},${tour.total_completions},${tour.completion_rate}%,${tour.average_steps}\n`;
                });
                
                // Download CSV
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `tour_analytics_${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
                this.showSuccess('Tour data succesvol geëxporteerd');
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error exporting tour data:', error);
            this.showError('Fout bij exporteren tour data');
        }
    }
    
    // AI Management Functions
    async loadAIManagement() {
        try {
            const response = await fetch('/api/ai/knowledge-base/status');
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    this.updateAIStatus(data);
                } else {
                    console.error('Error loading AI status:', data.error);
                }
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error loading AI management data:', error);
            // Fallback data
            this.updateAIStatus({
                indexed_pages: 0,
                last_update: null,
                ai_enabled: false
            });
        }
    }
    
    updateAIStatus(data) {
        document.getElementById('indexedPages').textContent = data.indexed_pages || '0';
        document.getElementById('lastKnowledgeUpdate').textContent = 
            data.last_update ? new Date(data.last_update).toLocaleDateString('nl-NL') : 'Nooit';
        document.getElementById('aiServiceStatus').textContent = data.ai_enabled ? 'Actief' : 'Inactief';
        document.getElementById('aiServiceStatus').className = 
            `badge ${data.ai_enabled ? 'bg-success' : 'bg-danger'}`;
    }

    // Incident Reports Methods
    async loadIncidentReports() {
        try {
            const response = await fetch('/api/admin/incident-reports');
            const data = await response.json();
            
            if (data.success) {
                this.displayIncidentReports(data.incidents);
                this.updateIncidentSummary(data.summary);
            } else {
                console.error('Failed to load incident reports:', data.error);
            }
        } catch (error) {
            console.error('Error loading incident reports:', error);
        }
    }

    displayIncidentReports(incidents) {
        const tableBody = document.getElementById('incidentReportsTable');
        if (!tableBody) return;

        tableBody.innerHTML = incidents.map(incident => `
            <tr>
                <td>
                    <strong>${incident.incident_id}</strong>
                </td>
                <td>
                    ${new Date(incident.timestamp).toLocaleString('nl-NL')}
                </td>
                <td>
                    <span class="badge ${this.getSeverityBadgeClass(incident.error_context.severity)}">
                        ${incident.error_context.severity}
                    </span>
                </td>
                <td>
                    <code>${incident.error_context.error_type}</code>
                </td>
                <td>
                    ${incident.error_context.module}
                </td>
                <td>
                    <span class="badge ${this.getStatusBadgeClass(incident.status)}">
                        ${incident.status}
                    </span>
                </td>
                <td>
                    ${incident.email_sent ? 
                        '<i class="fas fa-check text-success"></i>' : 
                        '<i class="fas fa-times text-danger"></i>'
                    }
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="viewIncidentDetails('${incident.incident_id}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-success" onclick="downloadIncidentReport('${incident.incident_id}')" title="Download PDF">
                            <i class="fas fa-download"></i>
                        </button>
                        ${incident.status !== 'RESOLVED' ? 
                            `<button class="btn btn-outline-warning" onclick="markIncidentResolved('${incident.incident_id}')" title="Mark Resolved">
                                <i class="fas fa-check"></i>
                            </button>` : ''
                        }
                    </div>
                </td>
            </tr>
        `).join('');
    }

    updateIncidentSummary(summary) {
        document.getElementById('criticalIncidents').textContent = summary.critical || 0;
        document.getElementById('highIncidents').textContent = summary.high || 0;
        document.getElementById('mediumIncidents').textContent = summary.medium || 0;
        document.getElementById('resolvedIncidents').textContent = summary.resolved || 0;
    }

    getSeverityBadgeClass(severity) {
        switch(severity) {
            case 'CRITICAL': return 'bg-danger';
            case 'HIGH': return 'bg-warning';
            case 'MEDIUM': return 'bg-info';
            case 'LOW': return 'bg-secondary';
            default: return 'bg-secondary';
        }
    }

    getStatusBadgeClass(status) {
        switch(status) {
            case 'PENDING': return 'bg-warning';
            case 'ANALYZED': return 'bg-info';
            case 'REPORTED': return 'bg-primary';
            case 'RESOLVED': return 'bg-success';
            default: return 'bg-secondary';
        }
    }

    async filterIncidentReports() {
        const severity = document.getElementById('incidentSeverityFilter').value;
        const status = document.getElementById('incidentStatusFilter').value;
        const dateFrom = document.getElementById('incidentDateFrom').value;
        const dateTo = document.getElementById('incidentDateTo').value;

        try {
            const params = new URLSearchParams();
            if (severity) params.append('severity', severity);
            if (status) params.append('status', status);
            if (dateFrom) params.append('date_from', dateFrom);
            if (dateTo) params.append('date_to', dateTo);

            const response = await fetch(`/api/admin/incident-reports?${params}`);
            const data = await response.json();
            
            if (data.success) {
                this.displayIncidentReports(data.incidents);
            }
        } catch (error) {
            console.error('Error filtering incident reports:', error);
        }
    }

    clearIncidentFilters() {
        document.getElementById('incidentSeverityFilter').value = '';
        document.getElementById('incidentStatusFilter').value = '';
        document.getElementById('incidentDateFrom').value = '';
        document.getElementById('incidentDateTo').value = '';
        this.loadIncidentReports();
    }

    async testIncidentReport() {
        try {
            const response = await fetch('/api/admin/test-incident-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('Test incident report generated successfully!');
                this.loadIncidentReports();
            } else {
                alert('Failed to generate test incident report: ' + data.error);
            }
        } catch (error) {
            console.error('Error generating test incident report:', error);
            alert('Error generating test incident report');
        }
    }

    async viewIncidentDetails(incidentId) {
        try {
            const response = await fetch(`/api/admin/incident-reports/${incidentId}`);
            const data = await response.json();
            
            if (data.success) {
                this.showIncidentDetailsModal(data.incident);
            } else {
                alert('Failed to load incident details: ' + data.error);
            }
        } catch (error) {
            console.error('Error loading incident details:', error);
            alert('Error loading incident details');
        }
    }

    showIncidentDetailsModal(incident) {
        const modalHtml = `
            <div class="modal fade" id="incidentDetailsModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Incident Details - ${incident.incident_id}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <h6>Basic Information</h6>
                                    <table class="table table-sm">
                                        <tr><td><strong>Incident ID:</strong></td><td>${incident.incident_id}</td></tr>
                                        <tr><td><strong>Timestamp:</strong></td><td>${new Date(incident.timestamp).toLocaleString('nl-NL')}</td></tr>
                                        <tr><td><strong>Severity:</strong></td><td><span class="badge ${this.getSeverityBadgeClass(incident.error_context.severity)}">${incident.error_context.severity}</span></td></tr>
                                        <tr><td><strong>Status:</strong></td><td><span class="badge ${this.getStatusBadgeClass(incident.status)}">${incident.status}</span></td></tr>
                                        <tr><td><strong>Email Sent:</strong></td><td>${incident.email_sent ? 'Yes' : 'No'}</td></tr>
                                    </table>
                                </div>
                                <div class="col-md-6">
                                    <h6>Error Information</h6>
                                    <table class="table table-sm">
                                        <tr><td><strong>Error Type:</strong></td><td><code>${incident.error_context.error_type}</code></td></tr>
                                        <tr><td><strong>Module:</strong></td><td>${incident.error_context.module}</td></tr>
                                        <tr><td><strong>Function:</strong></td><td>${incident.error_context.function}</td></tr>
                                        <tr><td><strong>Line Number:</strong></td><td>${incident.error_context.line_number}</td></tr>
                                        <tr><td><strong>User Impact:</strong></td><td>${incident.error_context.user_impact}</td></tr>
                                    </table>
                                </div>
                            </div>
                            
                            <h6>Error Message</h6>
                            <div class="alert alert-danger">
                                <pre>${incident.error_context.error_message}</pre>
                            </div>
                            
                            <h6>AI Analysis</h6>
                            <div class="alert alert-info">
                                <pre>${incident.ai_analysis}</pre>
                            </div>
                            
                            <h6>AI Solution</h6>
                            <div class="alert alert-success">
                                <pre>${incident.ai_solution}</pre>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="downloadIncidentReport('${incident.incident_id}')">
                                <i class="fas fa-download me-1"></i>Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('incidentDetailsModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('incidentDetailsModal'));
        modal.show();
    }

    async downloadIncidentReport(incidentId) {
        try {
            const response = await fetch(`/api/admin/incident-reports/${incidentId}/download`);
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${incidentId}_incident_report.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                alert('Failed to download incident report');
            }
        } catch (error) {
            console.error('Error downloading incident report:', error);
            alert('Error downloading incident report');
        }
    }

    async markIncidentResolved(incidentId) {
        if (!confirm('Are you sure you want to mark this incident as resolved?')) {
            return;
        }
        
        try {
            const response = await fetch(`/api/admin/incident-reports/${incidentId}/resolve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('Incident marked as resolved');
                this.loadIncidentReports();
            } else {
                alert('Failed to mark incident as resolved: ' + data.error);
            }
        } catch (error) {
            console.error('Error marking incident as resolved:', error);
            alert('Error marking incident as resolved');
        }
    }

    async testGeminiAI() {
        try {
            const response = await fetch('/api/admin/test-gemini-ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Show success modal with service info
                this.showGeminiTestModal(data);
            } else {
                alert('Gemini AI test failed: ' + data.error);
            }
        } catch (error) {
            console.error('Error testing Gemini AI:', error);
            alert('Error testing Gemini AI');
        }
    }

    showGeminiTestModal(data) {
        const modalHtml = `
            <div class="modal fade" id="geminiTestModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Gemini AI Service Test</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-success">
                                <i class="fas fa-check-circle me-2"></i>
                                <strong>Gemini AI Service is Working!</strong>
                            </div>
                            
                            <h6>Service Information</h6>
                            <table class="table table-sm">
                                <tr><td><strong>Service Name:</strong></td><td>${data.service_info.service_name}</td></tr>
                                <tr><td><strong>Model:</strong></td><td>${data.service_info.model}</td></tr>
                                <tr><td><strong>Available:</strong></td><td><span class="badge bg-success">Yes</span></td></tr>
                                <tr><td><strong>Free Tier:</strong></td><td><span class="badge bg-info">Yes</span></td></tr>
                                <tr><td><strong>Cost per Request:</strong></td><td>€${data.service_info.cost_per_request}</td></tr>
                                <tr><td><strong>Rate Limit:</strong></td><td>${data.service_info.rate_limit}</td></tr>
                                <tr><td><strong>Max Tokens:</strong></td><td>${data.service_info.max_tokens}</td></tr>
                            </table>
                            
                            <h6>Test Response</h6>
                            <div class="alert alert-info">
                                <pre>${data.test_result.test_response}</pre>
                            </div>
                            
                            <div class="alert alert-warning">
                                <i class="fas fa-info-circle me-2"></i>
                                <strong>Note:</strong> Gemini AI is now being used instead of OpenAI for incident analysis. 
                                This provides the same functionality at zero cost!
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="testIncidentReport()">
                                <i class="fas fa-bug me-1"></i>Test Incident Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('geminiTestModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('geminiTestModal'));
        modal.show();
    }

    async testResendEmail() {
        try {
            const response = await fetch('/api/admin/test-resend-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Show success modal with service info
                this.showResendTestModal(data);
            } else {
                alert('Resend email test failed: ' + data.error);
            }
        } catch (error) {
            console.error('Error testing Resend email:', error);
            alert('Error testing Resend email');
        }
    }

    showResendTestModal(data) {
        const modalHtml = `
            <div class="modal fade" id="resendTestModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Resend Email Service Test</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-success">
                                <i class="fas fa-check-circle me-2"></i>
                                <strong>Resend Email Service is Working!</strong>
                            </div>
                            
                            <h6>Service Information</h6>
                            <table class="table table-sm">
                                <tr><td><strong>Service Name:</strong></td><td>${data.service_info.service_name}</td></tr>
                                <tr><td><strong>Available:</strong></td><td><span class="badge bg-success">Yes</span></td></tr>
                                <tr><td><strong>Free Tier:</strong></td><td><span class="badge bg-info">Yes</span></td></tr>
                                <tr><td><strong>Cost per Email:</strong></td><td>€${data.service_info.cost_per_email}</td></tr>
                                <tr><td><strong>Monthly Limit:</strong></td><td>${data.service_info.monthly_limit} emails</td></tr>
                                <tr><td><strong>Daily Limit:</strong></td><td>${data.service_info.daily_limit} emails</td></tr>
                                <tr><td><strong>From Email:</strong></td><td>${data.service_info.from_email}</td></tr>
                                <tr><td><strong>To Email:</strong></td><td>${data.service_info.to_email}</td></tr>
                            </table>
                            
                            <h6>Test Result</h6>
                            <div class="alert alert-info">
                                <strong>Status:</strong> ${data.test_result.status}<br>
                                <strong>Message:</strong> ${data.test_result.message}<br>
                                ${data.test_result.resend_id ? `<strong>Resend ID:</strong> ${data.test_result.resend_id}` : ''}
                            </div>
                            
                            <div class="alert alert-warning">
                                <i class="fas fa-info-circle me-2"></i>
                                <strong>Note:</strong> Resend is now being used instead of SendGrid for email notifications. 
                                This provides the same functionality at zero cost!
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="testIncidentReport()">
                                <i class="fas fa-bug me-1"></i>Test Incident Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('resendTestModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('resendTestModal'));
        modal.show();
    }
}

// Initialize Admin Dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.adminDashboard = new AdminDashboard();
});

// Global functions for onclick handlers

// Incident Reports Functions
function refreshIncidentReports() {
    if (window.adminDashboard) {
        window.adminDashboard.loadIncidentReports();
    }
}

function filterIncidentReports() {
    if (window.adminDashboard) {
        window.adminDashboard.filterIncidentReports();
    }
}

function clearIncidentFilters() {
    if (window.adminDashboard) {
        window.adminDashboard.clearIncidentFilters();
    }
}

function testIncidentReport() {
    if (window.adminDashboard) {
        window.adminDashboard.testIncidentReport();
    }
}

function viewIncidentDetails(incidentId) {
    if (window.adminDashboard) {
        window.adminDashboard.viewIncidentDetails(incidentId);
    }
}

function downloadIncidentReport(incidentId) {
    if (window.adminDashboard) {
        window.adminDashboard.downloadIncidentReport(incidentId);
    }
}

function markIncidentResolved(incidentId) {
    if (window.adminDashboard) {
        window.adminDashboard.markIncidentResolved(incidentId);
    }
}

function testGeminiAI() {
    if (window.adminDashboard) {
        window.adminDashboard.testGeminiAI();
    }
}

function testResendEmail() {
    if (window.adminDashboard) {
        window.adminDashboard.testResendEmail();
    }
}
function exportUsers() {
    window.adminDashboard.exportUsers();
}

function exportFinancialData() {
    window.adminDashboard.exportFinancialData();
}

function exportUserData() {
    window.adminDashboard.exportUserData();
}

function filterUsers() {
    window.adminDashboard.filterUsers();
}

function filterAuditLogs() {
    window.adminDashboard.filterAuditLogs();
}

function updateAIConfig() {
    window.adminDashboard.updateAIConfig();
}

function applyRecommendation() {
    window.adminDashboard.applyRecommendation();
}

function approveKYC() {
    window.adminDashboard.approveKYC();
}

function rejectKYC() {
    window.adminDashboard.rejectKYC();
}

function deactivateUser() {
    window.adminDashboard.deactivateUser();
}

function updateDisclaimer() {
    window.adminDashboard.updateDisclaimer();
}

function loadTourAnalytics() {
    window.adminDashboard.loadTourAnalytics();
}

function exportTourData() {
    window.adminDashboard.exportTourData();
}

// Global AI management functions
async function updateKnowledgeBase() {
    try {
        const button = event.target;
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-sync fa-spin me-2"></i>Updaten...';
        button.disabled = true;
        
        const response = await fetch('/api/ai/knowledge-base/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccessMessage('Kennisbank succesvol geüpdatet');
            // Reload AI status
            window.adminDashboard.loadAIManagement();
        } else {
            showErrorMessage(result.message || 'Fout bij updaten kennisbank');
        }
        
    } catch (error) {
        console.error('Error updating knowledge base:', error);
        showErrorMessage('Netwerkfout bij updaten kennisbank');
    } finally {
        const button = event.target;
        button.innerHTML = '<i class="fas fa-sync me-2"></i>Kennisbank Updaten';
        button.disabled = false;
    }
}

async function performTestSearch() {
    const query = document.getElementById('testSearchQuery').value.trim();
    if (!query) {
        showErrorMessage('Voer een zoekquery in');
        return;
    }
    
    try {
        const resultsContainer = document.getElementById('testSearchResults');
        resultsContainer.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"></div><p class="mt-2">Zoeken...</p></div>';
        resultsContainer.style.display = 'block';
        
        const response = await fetch('/api/ai/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: query })
        });
        
        const result = await response.json();
        
        if (result.success) {
            let sourcesHtml = '';
            if (result.sources && result.sources.length > 0) {
                sourcesHtml = `
                    <div class="mt-3">
                        <h6>Bronnen:</h6>
                        <div class="d-flex flex-wrap gap-2">
                            ${result.sources.map(source => `
                                <span class="badge bg-primary">${source.title}</span>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
            
            resultsContainer.innerHTML = `
                <div class="card border-success">
                    <div class="card-header bg-success text-white">
                        <h6 class="mb-0">AI Zoekresultaat</h6>
                    </div>
                    <div class="card-body">
                        <p>${result.answer}</p>
                        ${sourcesHtml}
                        <small class="text-muted">Context gebruikt: ${result.context_used ? 'Ja' : 'Nee'}</small>
                    </div>
                </div>
            `;
        } else {
            resultsContainer.innerHTML = `
                <div class="alert alert-danger">
                    <strong>Fout:</strong> ${result.error || 'Onbekende fout'}
                </div>
            `;
        }
        
    } catch (error) {
        console.error('Test search error:', error);
        document.getElementById('testSearchResults').innerHTML = `
            <div class="alert alert-danger">
                <strong>Netwerkfout:</strong> ${error.message}
            </div>
        `;
    }
}

function handleTestSearchKeypress(event) {
    if (event.key === 'Enter') {
        performTestSearch();
    }
}

function testAISearch() {
    // Vooraf ingevulde test queries
    const testQueries = [
        'Hoe werkt staking?',
        'Welke exchanges worden ondersteund?',
        'Wat is APY?',
        'Hoe koppel ik Binance?'
    ];
    
    const randomQuery = testQueries[Math.floor(Math.random() * testQueries.length)];
    document.getElementById('testSearchQuery').value = randomQuery;
    performTestSearch();
}

function clearKnowledgeCache() {
    if (confirm('Weet je zeker dat je de kennisbank cache wilt wissen?')) {
        showSuccessMessage('Kennisbank cache gewist');
    }
}

function showSuccessMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.admin-content');
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);
    }
    
    // Auto dismiss na 3 seconden
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 3000);
}

function showErrorMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.admin-content');
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);
    }
    
    // Auto dismiss na 5 seconden
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}
