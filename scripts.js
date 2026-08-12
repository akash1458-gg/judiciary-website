// =============================================
// Nyaya Setu — Master Scripts (Complete Rebuild)
// Every button, link, sidebar, form, chat — ALL working
// =============================================

// Toast system (must be available before DOMContentLoaded)
window.showToast = function(message) {
    var container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(function() { toast.classList.add('show'); }, 10);
    setTimeout(function() {
        toast.classList.remove('show');
        setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
};

document.addEventListener('DOMContentLoaded', function() {

    // ========== UTILITY BAR ==========
    // Font Size
    var currentFontSize = 100;
    var fontBtn = document.querySelector('.util-right button:nth-child(1)');
    if (fontBtn) {
        fontBtn.addEventListener('click', function() {
            currentFontSize += 10;
            if (currentFontSize > 120) currentFontSize = 90;
            document.body.style.fontSize = currentFontSize === 100 ? '' : currentFontSize + '%';
            window.showToast('Font size: ' + currentFontSize + '%');
        });
    }

    // High Contrast
    var contrastBtn = document.querySelector('.util-right button:nth-child(2)');
    if (contrastBtn) {
        contrastBtn.addEventListener('click', function() {
            document.body.classList.toggle('high-contrast');
            window.showToast('High contrast mode ' + (document.body.classList.contains('high-contrast') ? 'enabled' : 'disabled'));
        });
    }

    // Language links
    document.querySelectorAll('.util-right a[href="#"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.showToast('Language: ' + e.target.innerText + ' — translation not available in prototype.');
        });
    });

    // ========== CNR SEARCH (index.html) ==========
    var indexSearchBtn = document.querySelector('.search-row .btn-primary');
    if (indexSearchBtn) {
        indexSearchBtn.addEventListener('click', function() {
            var input = document.querySelector('.search-row input');
            if (input && input.value.trim()) {
                window.location.href = 'case-status.html?q=' + encodeURIComponent(input.value);
            } else {
                window.showToast('Please enter a CNR number.');
            }
        });
    }

    // ========== CASE STATUS SEARCH (case-status.html) ==========
    var searchBtns = document.querySelectorAll('.tab-panel .btn-primary');
    searchBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            var input = btn.closest('.tab-panel').querySelector('input');
            var selects = btn.closest('.tab-panel').querySelectorAll('select');
            var query = '';
            if (input && input.value.trim()) {
                query = input.value.trim();
            } else if (selects.length > 0) {
                // For case number tab or party name tab, gather select values
                selects.forEach(function(s) { if (s.value) query += s.value + ' '; });
                if (input) query += input.value;
                query = query.trim();
            }
            if (!query) {
                window.showToast('Please enter a search value.');
                return;
            }
            window.showToast('Searching registry for: ' + query);
            fetch('/api/search?q=' + encodeURIComponent(query))
            .then(function(res) { return res.json(); })
            .then(function(data) {
                // Remove any previous results
                var old = document.getElementById('search-results');
                if (old) old.remove();

                var resultDiv = document.createElement('div');
                resultDiv.id = 'search-results';
                resultDiv.style = 'margin-top: 24px; padding: 20px; background: #fff; border: 1px solid var(--rule); border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);';

                if (data.success && data.results.length > 0) {
                    var html = '<h3 style="margin-bottom:16px; color:var(--ink-navy); border-bottom: 2px solid var(--rule); padding-bottom: 8px;">Search Results (' + data.results.length + ' found)</h3>';
                    data.results.forEach(function(c) {
                        html += '<div style="border: 1px solid var(--rule); padding: 16px; margin-bottom: 12px; border-radius: 4px; border-left: 4px solid var(--maroon);">';
                        html += '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">';
                        html += '<strong style="font-family:var(--font-mono); font-size:15px;">' + c.cnr_number + '</strong>';
                        html += '<span class="status-badge">' + c.status + '</span></div>';
                        html += '<div style="font-size:15px; font-weight:600; margin-bottom:6px;">' + c.title + '</div>';
                        html += '<div style="font-size:13px; color:var(--ink-soft); margin-bottom:4px;"><strong>Type:</strong> ' + c.case_type + ' | <strong>Category:</strong> ' + c.category + '</div>';
                        html += '<div style="font-size:13px; color:var(--ink-soft); margin-bottom:4px;"><strong>Petitioner:</strong> ' + c.petitioner + ' | <strong>Respondent:</strong> ' + c.respondent + '</div>';
                        html += '<div style="font-size:13px; color:var(--ink-soft); margin-bottom:4px;"><strong>Court:</strong> ' + c.court + '</div>';
                        html += '<div style="font-size:13px; margin-bottom:4px;"><strong>Next Hearing:</strong> <span style="color:var(--maroon); font-weight:600;">' + c.next_hearing + '</span></div>';
                        html += '<div style="font-size:12px; color:var(--ink-soft);"><strong>Description:</strong> ' + c.description + '</div>';
                        html += '</div>';
                    });
                    resultDiv.innerHTML = html;
                    window.showToast('Found ' + data.results.length + ' case(s).');
                } else {
                    resultDiv.innerHTML = '<div style="text-align:center; padding:20px; color:var(--ink-soft);"><p style="font-size:18px;">No cases found</p><p>Try searching with a different CNR number, party name, or case type.</p><p style="font-size:13px; margin-top:12px;"><strong>Demo CNR numbers:</strong> CS/405/2025, PT/112/2024, CR/992/2026, FC/221/2026, WP/3301/2026</p></div>';
                    window.showToast(data.message || 'No results found.');
                }
                // Insert after the active tab panel
                var activePanel = btn.closest('.tab-panel');
                if (activePanel) activePanel.appendChild(resultDiv);
                else document.querySelector('main').appendChild(resultDiv);
            })
            .catch(function() { window.showToast('Search error. Is the server running?'); });
        });
    });

    // Auto-fill search from URL params (from index.html redirect)
    var urlParams = new URLSearchParams(window.location.search);
    var urlQuery = urlParams.get('q') || urlParams.get('cnr');
    if (urlQuery) {
        var firstInput = document.querySelector('.tab-panel input');
        if (firstInput) {
            firstInput.value = urlQuery;
            // Auto-trigger search
            var firstSearchBtn = document.querySelector('.tab-panel .btn-primary');
            if (firstSearchBtn) setTimeout(function() { firstSearchBtn.click(); }, 500);
        }
    }

    // ========== SIDEBAR NAVIGATION (All Dashboards) ==========
    var sidebarLinks = document.querySelectorAll('.sidebar nav a');
    if (sidebarLinks.length > 0) {
        sidebarLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                sidebarLinks.forEach(function(l) { l.classList.remove('active'); });
                link.classList.add('active');
                var section = link.innerText.trim();

                // Show section-specific content
                showSidebarSection(section);
            });
        });
    }

    // ========== CITIZEN DASHBOARD ==========
    if (window.location.href.indexOf('dashboard-citizen') !== -1) {
        // Load cases from API
        loadCitizenCases();

        // Upload buttons
        document.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && e.target.innerText.trim() === 'Upload') {
                e.preventDefault();
                window.showToast('Uploading document...');
                var link = e.target;
                setTimeout(function() {
                    link.innerText = '✓ Uploaded';
                    link.style.color = 'green';
                    link.style.fontWeight = '600';
                    window.showToast('Document uploaded successfully!');
                }, 1200);
            }
            if (e.target.tagName === 'A' && e.target.innerText.trim() === 'Pay Now') {
                e.preventDefault();
                window.showToast('Processing payment of ₹500...');
                var link2 = e.target;
                setTimeout(function() {
                    link2.innerText = '✓ Paid';
                    link2.style.color = 'green';
                    link2.style.fontWeight = '600';
                    window.showToast('Payment successful! Receipt generated.');
                    // Actually record payment in DB
                    fetch('/api/payments', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ case_id: 2, user_id: localStorage.getItem('token') || '9876543210', amount: 500, description: 'Court Fee - PT/112/2024' })
                    });
                }, 1500);
            }
            if (e.target.tagName === 'A' && e.target.innerText.trim() === 'Download') {
                e.preventDefault();
                window.showToast('Downloading document securely...');
                setTimeout(function() { window.showToast('Download complete.'); }, 1000);
            }
            if (e.target.tagName === 'A' && e.target.innerText.trim() === 'View Draft') {
                e.preventDefault();
                window.showToast('Opening affidavit draft preview...');
                showModal('Affidavit Draft — CS/405/2025', '<p style="font-family:var(--font-body); line-height:1.8;">I, Amit Joshi, son of Late Sh. Ramesh Joshi, residing at 45 MG Road, Pune, do hereby solemnly affirm and declare as follows:</p><ol style="line-height:2; font-size:14px;"><li>That I am the rightful owner of commercial property at Survey No. 45, Pune as per registered sale deed dated 12/03/2020.</li><li>That the respondent has unlawfully encroached upon the said property.</li><li>That I have attached all supporting documents including the original sale deed, tax receipts, and possession certificate.</li></ol><p style="margin-top:16px; font-style:italic; color:var(--ink-soft);">This affidavit was auto-generated by Chanakya AI based on case records.</p>');
            }
            // Join Virtual button
            if (e.target.innerText && e.target.innerText.indexOf('Join Virtual') !== -1) {
                e.preventDefault();
                e.target.innerText = '● In Session...';
                e.target.style.background = 'var(--maroon)';
                e.target.style.color = '#fff';
                e.target.style.border = 'none';
                window.showToast('Connecting to virtual courtroom for CS/405/2025...');
                setTimeout(function() { window.showToast('You are now in the virtual hearing room.'); }, 2000);
            }
        });
    }

    // ========== LAWYER DASHBOARD ==========
    if (window.location.href.indexOf('dashboard-lawyer') !== -1) {
        loadLawyerCases();
    }

    // ========== JUDGE DASHBOARD ==========
    if (window.location.href.indexOf('dashboard-judge') !== -1) {
        // Brief and Draft Order buttons
        document.addEventListener('click', function(e) {
            var btn = e.target.closest('button');
            if (!btn) return;
            var text = btn.innerText.trim();
            if (text === 'Brief') {
                window.showToast('Loading bench brief...');
                var caseNo = btn.closest('tr').querySelector('.mono').innerText;
                setTimeout(function() {
                    showModal('Bench Brief — ' + caseNo, '<div style="line-height:1.8; font-size:14px;"><p><strong>Case:</strong> ' + caseNo + '</p><p><strong>Type:</strong> ' + btn.closest('tr').querySelectorAll('td')[2].innerText + '</p><p><strong>Summary:</strong> This brief contains the consolidated case history, lower court findings, and relevant precedents. The petitioner has filed 3 affidavits and the respondent has submitted a counter-affidavit.</p><p><strong>Key Issues:</strong></p><ul><li>Jurisdiction validity</li><li>Admissibility of electronic evidence</li><li>Limitation period compliance</li></ul><p><strong>Relevant Precedents:</strong></p><ul><li>AIR 2022 SC 1234 — Similar property dispute</li><li>2021 SCC Vol.5 p.789 — Burden of proof</li></ul></div>');
                }, 800);
            }
            if (text === 'Draft Order') {
                window.showToast('Opening order drafting tool...');
                var caseNo2 = btn.closest('tr').querySelector('.mono').innerText;
                setTimeout(function() {
                    showModal('Draft Order — ' + caseNo2, '<div style="line-height:1.8; font-size:14px;"><p style="text-align:center; font-weight:600; margin-bottom:16px;">IN THE COURT OF HON. JUSTICE SHARMA</p><p><strong>Case No:</strong> ' + caseNo2 + '</p><p><strong>Date:</strong> ' + new Date().toLocaleDateString('en-IN') + '</p><hr style="margin:12px 0;"><p><strong>ORDER</strong></p><textarea style="width:100%; height:150px; padding:12px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body); font-size:14px; resize:vertical;" placeholder="Type your order here...">Having heard the arguments from both sides and upon examination of the evidence on record, this court is of the opinion that...</textarea><div style="margin-top:16px; display:flex; gap:12px;"><button class="btn btn-primary" onclick="window.showToast(\'Order signed and published.\'); this.closest(\'.modal-overlay\').remove();">Sign & Publish</button><button class="btn btn-outline" onclick="window.showToast(\'Draft saved.\'); this.closest(\'.modal-overlay\').remove();">Save Draft</button></div></div>');
                }, 800);
            }
            if (text === 'Start Virtual Hearing') {
                window.showToast('Starting E-Hearing session...');
                btn.innerText = '● Live';
                btn.style.background = '#c62828';
                setTimeout(function() { window.showToast('Virtual hearing room is active. Waiting for parties to join.'); }, 1500);
            }
        });
    }

    // ========== CHANAKYA AI CHAT ==========
    var chatInput = document.querySelector('.ai-chat input');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && chatInput.value.trim() !== '') {
                var msg = chatInput.value;
                chatInput.value = '';

                // Add user bubble
                var userBubble = document.createElement('div');
                userBubble.className = 'bubble';
                userBubble.style = 'background: var(--ink-navy); color: #fff; margin-left: 20px;';
                userBubble.innerHTML = '<strong>You:</strong> ' + msg;
                chatInput.parentNode.insertBefore(userBubble, chatInput);

                // Generate smart response
                setTimeout(function() {
                    var response = generateAIResponse(msg);
                    var botBubble = document.createElement('div');
                    botBubble.className = 'bubble';
                    botBubble.innerHTML = '<strong>Chanakya:</strong> ' + response;
                    chatInput.parentNode.insertBefore(botBubble, chatInput);
                    chatInput.scrollIntoView({ behavior: 'smooth' });
                }, 1200);
            }
        });
    }

    // ========== FILE NEW CASE (Lawyer) ==========
    window.fileNewCase = function() {
        showFilingForm();
    };

    // ========== UPDATE CASE STATUS (Judge) ==========
    window.updateCaseStatus = function(id, newStatus) {
        fetch('/api/cases/' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (data.success) {
                window.showToast('Order passed successfully!');
                setTimeout(function() { window.location.reload(); }, 1000);
            }
        });
    };

    // ========== NOTICE TABS ==========
    var noticeTabs = document.querySelectorAll('.tabs button[role="tab"]');
    noticeTabs.forEach(function(btn) {
        btn.addEventListener('click', function() {
            noticeTabs.forEach(function(b) {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            window.showToast('Filtered by ' + btn.innerText.trim());

            // Actually filter notices
            var filterType = btn.innerText.trim();
            var notices = document.querySelectorAll('.notice-row, .notice-item, tr[data-type]');
            notices.forEach(function(n) {
                if (filterType === 'All Notices') {
                    n.style.display = '';
                } else {
                    var type = n.getAttribute('data-type') || '';
                    n.style.display = (type === filterType || !type) ? '' : 'none';
                }
            });
        });
    });

    // ========== CASE STATUS TABS ==========
    var caseTabs = document.querySelectorAll('.tab-btn');
    caseTabs.forEach(function(btn) {
        btn.addEventListener('click', function() {
            caseTabs.forEach(function(b) {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            var tabId = btn.getAttribute('data-tab');
            document.querySelectorAll('.tab-panel').forEach(function(p) {
                p.style.display = 'none';
            });
            var activePanel = document.getElementById(tabId);
            if (activePanel) activePanel.style.display = '';
        });
    });

    // ========== COURT DIRECTORY SEARCH ==========
    var courtSearchBtn = document.querySelector('.search-directory-btn, .court-search-btn');
    if (!courtSearchBtn) {
        // Find by context
        document.querySelectorAll('button.btn-primary').forEach(function(b) {
            if (b.innerText.indexOf('Search Directory') !== -1) courtSearchBtn = b;
        });
    }
    if (courtSearchBtn) {
        courtSearchBtn.addEventListener('click', function() {
            window.showToast('Searching directory... Results updated.');
            fetch('/api/courts')
            .then(function(res) { return res.json(); })
            .then(function(courts) {
                var tbody = document.querySelector('.ledger tbody');
                if (tbody) {
                    tbody.innerHTML = '';
                    courts.forEach(function(c) {
                        var tr = document.createElement('tr');
                        tr.innerHTML = '<td>' + c.name + '</td><td>' + c.location + '</td><td class="mono">' + c.judges + '</td><td class="mono" style="color:var(--maroon);">' + c.pending.toLocaleString('en-IN') + '</td>';
                        tbody.appendChild(tr);
                    });
                    window.showToast('Found ' + courts.length + ' courts.');
                }
            });
        });
    }

    // ========== ADMIN: LIVE CHART ==========
    var chartCanvas = document.getElementById('liveLoadChart');
    if (chartCanvas && typeof Chart !== 'undefined') {
        var ctx = chartCanvas.getContext('2d');
        var chartData = {
            labels: [],
            datasets: [{
                label: 'E-Filings/min',
                data: [],
                borderColor: '#8B1A1A',
                backgroundColor: 'rgba(139,26,26,0.1)',
                fill: true,
                tension: 0.4
            }, {
                label: 'API Requests/s',
                data: [],
                borderColor: '#1B2A4A',
                backgroundColor: 'rgba(27,42,74,0.1)',
                fill: true,
                tension: 0.4
            }]
        };
        var liveChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                animation: { duration: 400 },
                scales: { y: { beginAtZero: true }, x: { display: true } },
                plugins: { legend: { position: 'top' } }
            }
        });

        setInterval(function() {
            var now = new Date();
            var label = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2) + ':' + ('0' + now.getSeconds()).slice(-2);
            chartData.labels.push(label);
            chartData.datasets[0].data.push(Math.floor(40 + Math.random() * 60));
            chartData.datasets[1].data.push(Math.floor(200 + Math.random() * 300));
            if (chartData.labels.length > 20) {
                chartData.labels.shift();
                chartData.datasets[0].data.shift();
                chartData.datasets[1].data.shift();
            }
            liveChart.update();
        }, 2000);
    }

}); // END DOMContentLoaded


// =============================================
// HELPER FUNCTIONS
// =============================================

function loadCitizenCases() {
    var token = localStorage.getItem('token') || '9876543210';
    fetch('/api/cases?role=citizen&user=' + token)
    .then(function(res) { return res.json(); })
    .then(function(cases) {
        var tbody = document.querySelector('.ledger tbody');
        if (tbody && cases.length > 0) {
            tbody.innerHTML = '';
            cases.forEach(function(c) {
                var tr = document.createElement('tr');
                var statusHtml;
                if (c.next_hearing.indexOf('Tomorrow') !== -1 || c.next_hearing.indexOf('Today') !== -1) {
                    statusHtml = '<button class="btn btn-outline" style="padding:4px 10px; font-size:12px; font-weight:600;">Join Virtual</button>';
                } else {
                    statusHtml = '<span class="status-badge ' + (c.status.indexOf('Await') !== -1 ? 'pending' : '') + '">' + c.status + '</span>';
                }
                tr.innerHTML = '<td class="mono">' + c.cnr_number + '</td><td>' + c.title + '</td><td class="mono" style="color:var(--maroon); font-weight:600;">' + c.next_hearing + '</td><td>' + statusHtml + '</td>';
                tbody.appendChild(tr);
            });
        }
        // Update sidebar count
        var casesLink = document.querySelector('.sidebar nav a:nth-child(2)');
        if (casesLink) casesLink.innerText = 'My Cases (' + cases.length + ')';
    })
    .catch(function() { /* Server not running, keep static content */ });
}

function loadLawyerCases() {
    var token = localStorage.getItem('token') || 'BAR/123/2010';
    fetch('/api/cases?role=advocate&user=' + token)
    .then(function(res) { return res.json(); })
    .then(function(cases) {
        var tbody = document.querySelector('.ledger tbody');
        if (tbody && cases.length > 0) {
            tbody.innerHTML = '';
            cases.forEach(function(c) {
                var tr = document.createElement('tr');
                tr.innerHTML = '<td>' + c.title + '</td><td>' + c.case_type + '</td><td class="mono" style="color:var(--maroon);">' + c.next_hearing + '</td><td><span class="status-badge">' + c.status + '</span></td>';
                tbody.appendChild(tr);
            });
        }
    })
    .catch(function() { /* Keep static */ });
}

function showFilingForm() {
    // Fetch categories from API
    fetch('/api/categories')
    .then(function(res) { return res.json(); })
    .then(function(categories) {
        var catOptions = '';
        categories.forEach(function(cat) {
            catOptions += '<option value="' + cat.prefix + '">' + cat.name + '</option>';
        });

        var formHtml = '<div style="max-height:70vh; overflow-y:auto; padding-right:8px;">';
        formHtml += '<div style="margin-bottom:16px;"><label style="display:block; font-weight:600; margin-bottom:6px;">Case Type *</label>';
        formHtml += '<select id="filing-type" style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body);">' + catOptions + '</select></div>';

        formHtml += '<div style="margin-bottom:16px;"><label style="display:block; font-weight:600; margin-bottom:6px;">Category *</label>';
        formHtml += '<select id="filing-category" style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body);"><option>Select case type first</option></select></div>';

        formHtml += '<div style="margin-bottom:16px;"><label style="display:block; font-weight:600; margin-bottom:6px;">Case Title *</label>';
        formHtml += '<input id="filing-title" type="text" placeholder="e.g. Ram Kumar v. State of Delhi" style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body); box-sizing:border-box;"></div>';

        formHtml += '<div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">';
        formHtml += '<div><label style="display:block; font-weight:600; margin-bottom:6px;">Petitioner Name *</label>';
        formHtml += '<input id="filing-petitioner" type="text" placeholder="Full name" style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body); box-sizing:border-box;"></div>';
        formHtml += '<div><label style="display:block; font-weight:600; margin-bottom:6px;">Respondent Name *</label>';
        formHtml += '<input id="filing-respondent" type="text" placeholder="Full name" style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body); box-sizing:border-box;"></div></div>';

        formHtml += '<div style="margin-bottom:16px;"><label style="display:block; font-weight:600; margin-bottom:6px;">Court *</label>';
        formHtml += '<select id="filing-court" style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body);">';
        formHtml += '<option>District Court, Pune</option><option>High Court, Mumbai</option><option>High Court, Delhi</option><option>Sessions Court, Delhi</option><option>Family Court, Delhi</option><option>High Court, Madras</option><option>High Court, Karnataka</option><option>Supreme Court of India</option><option>Consumer Forum, Jaipur</option><option>ITAT, Delhi</option><option>Arbitration Centre, Bangalore</option>';
        formHtml += '</select></div>';

        formHtml += '<div style="margin-bottom:16px;"><label style="display:block; font-weight:600; margin-bottom:6px;">Description / Facts of the Case *</label>';
        formHtml += '<textarea id="filing-desc" rows="4" placeholder="Brief description of the case facts..." style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body); box-sizing:border-box; resize:vertical;"></textarea></div>';

        formHtml += '<div style="display:flex; gap:12px; margin-top:20px;">';
        formHtml += '<button class="btn btn-primary" onclick="submitNewCase()">File Case</button>';
        formHtml += '<button class="btn btn-outline" onclick="this.closest(\'.modal-overlay\').remove()">Cancel</button>';
        formHtml += '</div></div>';

        showModal('File a New Case', formHtml);

        // Wire category dropdown to change based on type
        setTimeout(function() {
            var typeSelect = document.getElementById('filing-type');
            var catSelect = document.getElementById('filing-category');
            if (typeSelect && catSelect) {
                function updateCategories() {
                    var selected = typeSelect.value;
                    var cat = categories.find(function(c) { return c.prefix === selected; });
                    if (cat) {
                        catSelect.innerHTML = '';
                        cat.types.forEach(function(t) {
                            catSelect.innerHTML += '<option value="' + t + '">' + t + '</option>';
                        });
                    }
                }
                typeSelect.addEventListener('change', updateCategories);
                updateCategories(); // Initial load
            }
        }, 100);
    });
}

window.submitNewCase = function() {
    var title = document.getElementById('filing-title').value;
    var petitioner = document.getElementById('filing-petitioner').value;
    var respondent = document.getElementById('filing-respondent').value;
    var desc = document.getElementById('filing-desc').value;
    var caseType = document.getElementById('filing-type');
    var category = document.getElementById('filing-category');
    var court = document.getElementById('filing-court');

    if (!title || !petitioner || !respondent || !desc) {
        window.showToast('Please fill in all required fields.');
        return;
    }

    var token = localStorage.getItem('token') || 'BAR/123/2010';

    window.showToast('Filing case... Please wait.');

    fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: title,
            petitioner: petitioner,
            respondent: respondent,
            description: desc,
            case_type: caseType.options[caseType.selectedIndex].text,
            case_type_prefix: caseType.value,
            category: category.value,
            court: court.value,
            user: token
        })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        if (data.success) {
            // Close modal
            var modal = document.querySelector('.modal-overlay');
            if (modal) modal.remove();
            window.showToast('Case filed successfully! CNR: ' + data.cnr_number);
            setTimeout(function() { window.location.reload(); }, 1500);
        } else {
            window.showToast('Error: ' + data.message);
        }
    });
};

function showModal(title, contentHtml) {
    // Remove any existing modal
    var existing = document.querySelector('.modal-overlay');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:10000; display:flex; align-items:center; justify-content:center; animation: fadeIn 0.2s;';
    overlay.innerHTML = '<div style="background:#fff; border-radius:8px; padding:28px; max-width:600px; width:90%; max-height:85vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,0.3);">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:2px solid var(--rule); padding-bottom:12px;">' +
        '<h3 style="margin:0; color:var(--ink-navy);">' + title + '</h3>' +
        '<button onclick="this.closest(\'.modal-overlay\').remove()" style="border:none; background:none; font-size:24px; cursor:pointer; color:var(--ink-soft);">✕</button></div>' +
        '<div>' + contentHtml + '</div></div>';

    // Close on overlay click
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) overlay.remove();
    });

    document.body.appendChild(overlay);
}

function generateAIResponse(msg) {
    var lower = msg.toLowerCase();
    if (lower.indexOf('hearing') !== -1 || lower.indexOf('next') !== -1 || lower.indexOf('date') !== -1) {
        return 'Your next hearing is scheduled for <strong>tomorrow at 10:30 AM</strong> in District Court, Pune (Room 4) for case CS/405/2025. It will be a virtual hearing. Make sure your Affidavit is ready to present.';
    }
    if (lower.indexOf('document') !== -1 || lower.indexOf('affidavit') !== -1 || lower.indexOf('upload') !== -1) {
        return 'You have 1 pending document upload: <strong>Affidavit for CS/405/2025</strong>. You can upload it from the Pending Actions section. The deadline is before your hearing tomorrow.';
    }
    if (lower.indexOf('pay') !== -1 || lower.indexOf('fee') !== -1 || lower.indexOf('cost') !== -1) {
        return 'You have a pending court fee of <strong>₹500</strong> for case PT/112/2024 (Property Dispute). You can pay it instantly using UPI, net banking, or debit card from the Payments Hub.';
    }
    if (lower.indexOf('status') !== -1 || lower.indexOf('case') !== -1) {
        return 'You have <strong>2 active cases</strong>:<br>1. <strong>CS/405/2025</strong> — Hearing tomorrow<br>2. <strong>PT/112/2024</strong> — Awaiting Order (next hearing 15 Sep 2026)';
    }
    if (lower.indexOf('lawyer') !== -1 || lower.indexOf('advocate') !== -1) {
        return 'Your case CS/405/2025 is being handled by <strong>Adv. R. Desai</strong> (BAR/123/2010). For PT/112/2024, you may want to consult with a property law specialist.';
    }
    if (lower.indexOf('help') !== -1) {
        return 'I can help you with: <br>• Case status and hearing dates<br>• Document requirements<br>• Court fee calculations<br>• Finding a lawyer<br>• Legal procedure explanations<br><br>Just ask me anything!';
    }
    return 'I understand your question about "' + msg + '". Based on your case records, I recommend discussing this with your advocate Adv. R. Desai before the hearing tomorrow. Is there anything specific I can help with?';
}

function showSidebarSection(section) {
    var mainContent = document.querySelector('main');
    if (!mainContent) return;

    // Keep original content as a data attribute
    if (!mainContent.getAttribute('data-original')) {
        mainContent.setAttribute('data-original', mainContent.innerHTML);
    }

    var page = window.location.href;
    var html = '';

    // ===== CITIZEN SIDEBAR SECTIONS =====
    if (page.indexOf('dashboard-citizen') !== -1) {
        if (section === 'My Dashboard') {
            mainContent.innerHTML = mainContent.getAttribute('data-original');
            loadCitizenCases();
            return;
        }
        if (section.indexOf('My Cases') !== -1) {
            html = '<h1 style="font-size:1.8rem; margin-bottom:24px;">My Cases</h1><div class="card" id="my-cases-section"><p>Loading cases...</p></div>';
            mainContent.innerHTML = html;
            fetch('/api/cases?role=citizen&user=' + (localStorage.getItem('token') || '9876543210'))
            .then(function(r) { return r.json(); })
            .then(function(cases) {
                var div = document.getElementById('my-cases-section');
                var h = '<table class="ledger" style="border:none;"><thead><tr><th>CNR</th><th>Title</th><th>Type</th><th>Status</th><th>Next Hearing</th><th>Court</th></tr></thead><tbody>';
                cases.forEach(function(c) {
                    h += '<tr><td class="mono">' + c.cnr_number + '</td><td>' + c.title + '</td><td>' + c.case_type + '</td><td><span class="status-badge">' + c.status + '</span></td><td class="mono" style="color:var(--maroon);">' + c.next_hearing + '</td><td style="font-size:12px;">' + c.court + '</td></tr>';
                });
                h += '</tbody></table>';
                div.innerHTML = h;
            });
            return;
        }
        if (section === 'Hearing Schedule') {
            html = '<h1 style="font-size:1.8rem; margin-bottom:24px;">Hearing Schedule</h1><div class="card" id="hearings-section"><p>Loading...</p></div>';
            mainContent.innerHTML = html;
            fetch('/api/hearings?user=' + (localStorage.getItem('token') || '9876543210'))
            .then(function(r) { return r.json(); })
            .then(function(hearings) {
                var div = document.getElementById('hearings-section');
                var h = '<table class="ledger" style="border:none;"><thead><tr><th>Date</th><th>Time</th><th>Case</th><th>Court Room</th><th>Type</th><th>Status</th></tr></thead><tbody>';
                hearings.forEach(function(hr) {
                    h += '<tr><td class="mono">' + hr.hearing_date + '</td><td class="mono" style="color:var(--maroon); font-weight:600;">' + hr.hearing_time + '</td><td>' + hr.cnr_number + ' — ' + hr.title + '</td><td style="font-size:12px;">' + hr.court_room + '</td><td>' + hr.hearing_type + '</td><td><span class="status-badge">' + hr.status + '</span></td></tr>';
                });
                h += '</tbody></table>';
                div.innerHTML = h;
            });
            return;
        }
        if (section === 'Document Vault') {
            html = '<h1 style="font-size:1.8rem; margin-bottom:24px;">Document Vault</h1><div class="card" id="docs-section"><p>Loading...</p></div>';
            mainContent.innerHTML = html;
            fetch('/api/documents')
            .then(function(r) { return r.json(); })
            .then(function(docs) {
                var div = document.getElementById('docs-section');
                var h = '<table class="ledger" style="border:none;"><thead><tr><th>File Name</th><th>Type</th><th>Uploaded By</th><th>Date</th><th>Action</th></tr></thead><tbody>';
                docs.forEach(function(d) {
                    h += '<tr><td>' + d.filename + '</td><td>' + d.doc_type + '</td><td>' + d.uploaded_by + '</td><td class="mono">' + d.upload_date + '</td><td><a href="#" class="btn btn-outline" style="padding:4px 10px; font-size:12px;" onclick="event.preventDefault(); window.showToast(\'Downloading ' + d.filename + '...\')">Download</a></td></tr>';
                });
                h += '</tbody></table>';
                div.innerHTML = h;
            });
            return;
        }
        if (section === 'Payments Hub') {
            html = '<h1 style="font-size:1.8rem; margin-bottom:24px;">Payments Hub</h1><div class="card" id="pay-section"><p>Loading...</p></div>';
            mainContent.innerHTML = html;
            fetch('/api/payments?user_id=' + (localStorage.getItem('token') || '9876543210'))
            .then(function(r) { return r.json(); })
            .then(function(payments) {
                var div = document.getElementById('pay-section');
                var h = '<table class="ledger" style="border:none;"><thead><tr><th>Description</th><th>Amount</th><th>Status</th><th>Date</th><th>Action</th></tr></thead><tbody>';
                payments.forEach(function(p) {
                    var actionHtml = p.status === 'Pending' ? '<button class="btn btn-primary" style="padding:4px 10px; font-size:12px;" onclick="payNow(' + p.id + ', this)">Pay Now</button>' : '<span style="color:green; font-weight:600;">✓ Paid</span>';
                    h += '<tr><td>' + p.description + '</td><td class="mono" style="font-weight:600;">₹' + p.amount + '</td><td><span class="status-badge ' + (p.status === 'Pending' ? 'pending' : '') + '">' + p.status + '</span></td><td class="mono">' + (p.payment_date || '—') + '</td><td>' + actionHtml + '</td></tr>';
                });
                h += '</tbody></table>';
                div.innerHTML = h;
            });
            return;
        }
        if (section === 'Settings') {
            html = '<h1 style="font-size:1.8rem; margin-bottom:24px;">Settings</h1>';
            html += '<div class="card"><h3>Profile Information</h3><div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:16px;">';
            html += '<div><label style="display:block; font-weight:600; margin-bottom:6px;">Full Name</label><input type="text" value="Amit Joshi" style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body); box-sizing:border-box;"></div>';
            html += '<div><label style="display:block; font-weight:600; margin-bottom:6px;">Mobile</label><input type="text" value="9876543210" style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body); box-sizing:border-box;"></div>';
            html += '<div><label style="display:block; font-weight:600; margin-bottom:6px;">Email</label><input type="email" value="amit.joshi@email.com" style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body); box-sizing:border-box;"></div>';
            html += '<div><label style="display:block; font-weight:600; margin-bottom:6px;">Aadhaar (Last 4)</label><input type="text" value="****5678" disabled style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body); box-sizing:border-box; background:#f5f5f5;"></div>';
            html += '</div><div style="margin-top:20px;"><h3>Notification Preferences</h3><div style="margin-top:12px;">';
            html += '<label style="display:flex; align-items:center; gap:8px; margin-bottom:12px;"><input type="checkbox" checked> SMS notifications for hearing dates</label>';
            html += '<label style="display:flex; align-items:center; gap:8px; margin-bottom:12px;"><input type="checkbox" checked> Email notifications for case updates</label>';
            html += '<label style="display:flex; align-items:center; gap:8px; margin-bottom:12px;"><input type="checkbox"> WhatsApp notifications</label>';
            html += '</div></div><button class="btn btn-primary" style="margin-top:16px;" onclick="window.showToast(\'Settings saved successfully!\')">Save Changes</button></div>';
            mainContent.innerHTML = html;
            return;
        }
    }

    // ===== LAWYER SIDEBAR SECTIONS =====
    if (page.indexOf('dashboard-lawyer') !== -1) {
        if (section === 'Overview') {
            mainContent.innerHTML = mainContent.getAttribute('data-original');
            loadLawyerCases();
            return;
        }
        if (section.indexOf('Calendar') !== -1) {
            html = '<h1 style="font-size:1.8rem; margin-bottom:24px;">Calendar & Conflicts</h1><div class="card" id="lawyer-hearings"><p>Loading...</p></div>';
            mainContent.innerHTML = html;
            fetch('/api/hearings?user=' + (localStorage.getItem('token') || 'BAR/123/2010'))
            .then(function(r) { return r.json(); })
            .then(function(hearings) {
                var div = document.getElementById('lawyer-hearings');
                var h = '<table class="ledger" style="border:none;"><thead><tr><th>Date</th><th>Time</th><th>Case</th><th>Parties</th><th>Court Room</th><th>Type</th></tr></thead><tbody>';
                hearings.forEach(function(hr) { h += '<tr><td class="mono">' + hr.hearing_date + '</td><td class="mono" style="color:var(--maroon); font-weight:600;">' + hr.hearing_time + '</td><td class="mono">' + hr.cnr_number + '</td><td style="font-size:12px;">' + hr.petitioner + ' v. ' + hr.respondent + '</td><td style="font-size:12px;">' + hr.court_room + '</td><td>' + hr.hearing_type + '</td></tr>'; });
                h += '</tbody></table>';
                div.innerHTML = h;
            });
            return;
        }
        if (section === 'Client Directory') {
            html = '<h1 style="font-size:1.8rem; margin-bottom:24px;">Client Directory</h1><div class="card" id="client-dir"><p>Loading...</p></div>';
            mainContent.innerHTML = html;
            fetch('/api/cases?role=advocate&user=' + (localStorage.getItem('token') || 'BAR/123/2010'))
            .then(function(r) { return r.json(); })
            .then(function(cases) {
                var div = document.getElementById('client-dir');
                var h = '<table class="ledger" style="border:none;"><thead><tr><th>Client (Petitioner)</th><th>Case</th><th>Type</th><th>Status</th><th>Contact</th></tr></thead><tbody>';
                cases.forEach(function(c) { h += '<tr><td style="font-weight:600;">' + c.petitioner + '</td><td class="mono">' + c.cnr_number + '</td><td>' + c.case_type + '</td><td><span class="status-badge">' + c.status + '</span></td><td><a href="#" onclick="event.preventDefault(); window.showToast(\'Contact details for ' + c.petitioner + ' sent to your email.\')">View</a></td></tr>'; });
                h += '</tbody></table>';
                div.innerHTML = h;
            });
            return;
        }
        if (section === 'Bulk E-Filing') {
            showFilingForm();
            return;
        }
        if (section.indexOf('Affidavit') !== -1 || section.indexOf('Vault') !== -1) {
            html = '<h1 style="font-size:1.8rem; margin-bottom:24px;">Affidavits & Vault</h1><div class="card" id="vault-section"><p>Loading...</p></div>';
            mainContent.innerHTML = html;
            fetch('/api/documents')
            .then(function(r) { return r.json(); })
            .then(function(docs) {
                var div = document.getElementById('vault-section');
                var h = '<div style="margin-bottom:16px;"><button class="btn btn-primary" onclick="window.showToast(\'Upload dialog opened.\')">Upload Document</button></div>';
                h += '<table class="ledger" style="border:none;"><thead><tr><th>File</th><th>Type</th><th>Uploaded By</th><th>Date</th><th>Actions</th></tr></thead><tbody>';
                docs.forEach(function(d) { h += '<tr><td>' + d.filename + '</td><td>' + d.doc_type + '</td><td>' + d.uploaded_by + '</td><td class="mono">' + d.upload_date + '</td><td><a href="#" onclick="event.preventDefault(); window.showToast(\'Downloading...\')">Download</a> | <a href="#" onclick="event.preventDefault(); window.showToast(\'Sharing ' + d.filename + ' with client.\')">Share</a></td></tr>'; });
                h += '</tbody></table>';
                div.innerHTML = h;
            });
            return;
        }
        if (section === 'Billing') {
            html = '<h1 style="font-size:1.8rem; margin-bottom:24px;">Billing & Invoices</h1>';
            html += '<div class="card"><div style="display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:24px;">';
            html += '<div style="background:var(--parchment-2); padding:16px; border-radius:4px; text-align:center;"><span style="display:block; font-size:24px; font-family:var(--font-mono); font-weight:600; color:var(--ink-navy);">₹1,25,000</span>Total Billed</div>';
            html += '<div style="background:var(--parchment-2); padding:16px; border-radius:4px; text-align:center;"><span style="display:block; font-size:24px; font-family:var(--font-mono); font-weight:600; color:green;">₹95,000</span>Received</div>';
            html += '<div style="background:#fff8e1; padding:16px; border-radius:4px; text-align:center;"><span style="display:block; font-size:24px; font-family:var(--font-mono); font-weight:600; color:var(--maroon);">₹30,000</span>Outstanding</div></div>';
            html += '<table class="ledger" style="border:none;"><thead><tr><th>Client</th><th>Case</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead><tbody>';
            html += '<tr><td>Mehta & Sons Ltd.</td><td>CR/992/2026</td><td class="mono" style="font-weight:600;">₹50,000</td><td><span class="status-badge">Paid</span></td><td><a href="#" onclick="event.preventDefault(); window.showToast(\'Downloading invoice...\')">Invoice</a></td></tr>';
            html += '<tr><td>Priya Singh</td><td>FC/221/2026</td><td class="mono" style="font-weight:600;">₹30,000</td><td><span class="status-badge pending">Pending</span></td><td><a href="#" onclick="event.preventDefault(); window.showToast(\'Payment reminder sent.\')">Remind</a></td></tr>';
            html += '<tr><td>Green Earth NGO</td><td>WP/3301/2026</td><td class="mono" style="font-weight:600;">₹45,000</td><td><span class="status-badge">Paid</span></td><td><a href="#" onclick="event.preventDefault(); window.showToast(\'Downloading invoice...\')">Invoice</a></td></tr>';
            html += '</tbody></table></div>';
            mainContent.innerHTML = html;
            return;
        }
    }

    // ===== JUDGE SIDEBAR SECTIONS =====
    if (page.indexOf('dashboard-judge') !== -1) {
        if (section === 'Daily Docket') {
            mainContent.innerHTML = mainContent.getAttribute('data-original');
            return;
        }
        if (section === 'Bench Briefs') {
            html = '<h1 style="font-size:1.8rem; margin-bottom:24px;">Bench Briefs</h1><div class="card" id="briefs-section"><p>Loading...</p></div>';
            mainContent.innerHTML = html;
            fetch('/api/cases?role=judge')
            .then(function(r) { return r.json(); })
            .then(function(cases) {
                var div = document.getElementById('briefs-section');
                var h = '';
                cases.slice(0, 5).forEach(function(c) {
                    h += '<div style="border:1px solid var(--rule); padding:16px; margin-bottom:12px; border-radius:4px; border-left:4px solid var(--ink-navy);">';
                    h += '<div style="display:flex; justify-content:space-between;"><strong class="mono">' + c.cnr_number + '</strong><span class="status-badge">' + c.status + '</span></div>';
                    h += '<p style="margin:8px 0 4px; font-weight:600;">' + c.title + '</p>';
                    h += '<p style="font-size:13px; color:var(--ink-soft);">' + c.description.substring(0, 120) + '...</p>';
                    h += '<button class="btn btn-outline" style="padding:4px 10px; font-size:12px; margin-top:8px;" onclick="window.showToast(\'Full brief loaded for ' + c.cnr_number + '\')">View Full Brief</button></div>';
                });
                div.innerHTML = h;
            });
            return;
        }
        if (section === 'Draft Judgements') {
            html = '<h1 style="font-size:1.8rem; margin-bottom:24px;">Draft Judgements</h1><div class="card">';
            html += '<div style="margin-bottom:16px;"><strong>Select a case to draft judgement:</strong></div>';
            html += '<div id="draft-cases"><p>Loading...</p></div></div>';
            mainContent.innerHTML = html;
            fetch('/api/cases?role=judge')
            .then(function(r) { return r.json(); })
            .then(function(cases) {
                var div = document.getElementById('draft-cases');
                var h = '';
                cases.forEach(function(c) {
                    h += '<div style="display:flex; justify-content:space-between; align-items:center; padding:12px; border:1px solid var(--rule); margin-bottom:8px; border-radius:4px;">';
                    h += '<div><strong class="mono">' + c.cnr_number + '</strong> — ' + c.title + ' <span class="status-badge">' + c.status + '</span></div>';
                    h += '<div style="display:flex; gap:8px;">';
                    h += '<button class="btn btn-outline" style="padding:4px 10px; font-size:12px;" onclick="window.showToast(\'Opening draft editor for ' + c.cnr_number + '\')">Draft Order</button>';
                    h += '<button class="btn btn-primary" style="padding:4px 10px; font-size:12px;" onclick="window.updateCaseStatus(' + c.id + ',\'Order Passed\')">Pass Order</button>';
                    h += '</div></div>';
                });
                div.innerHTML = h;
            });
            return;
        }
        if (section === 'E-Hearing Rooms') {
            html = '<h1 style="font-size:1.8rem; margin-bottom:24px;">E-Hearing Rooms</h1><div class="card">';
            html += '<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:16px;">';
            html += '<div style="border:2px solid green; padding:20px; border-radius:4px; text-align:center;"><div style="font-size:24px; margin-bottom:8px;">🟢</div><strong>Room 4</strong><p style="font-size:12px; margin:4px 0;">CS/405/2025</p><button class="btn btn-primary" style="padding:4px 10px; font-size:12px;" onclick="window.showToast(\'Joining Room 4...\')">Join Now</button></div>';
            html += '<div style="border:2px solid var(--rule); padding:20px; border-radius:4px; text-align:center;"><div style="font-size:24px; margin-bottom:8px;">⚪</div><strong>Room 7</strong><p style="font-size:12px; margin:4px 0;">CR/992/2026</p><button class="btn btn-outline" style="padding:4px 10px; font-size:12px;" onclick="window.showToast(\'Scheduling for 2:00 PM\')">Schedule</button></div>';
            html += '<div style="border:2px solid var(--rule); padding:20px; border-radius:4px; text-align:center;"><div style="font-size:24px; margin-bottom:8px;">⚪</div><strong>Room 12</strong><p style="font-size:12px; margin:4px 0;">Available</p><button class="btn btn-outline" style="padding:4px 10px; font-size:12px;" onclick="window.showToast(\'Room reserved.\')">Reserve</button></div></div></div>';
            mainContent.innerHTML = html;
            return;
        }
        if (section === 'Precedents DB') {
            html = '<h1 style="font-size:1.8rem; margin-bottom:24px;">Precedents Database</h1><div class="card">';
            html += '<div style="display:flex; gap:12px; margin-bottom:20px;"><input type="text" id="precedent-search" placeholder="Search precedents by keyword, section, or citation..." style="flex:1; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body);"><button class="btn btn-primary" onclick="window.showToast(\'Searching precedents...\')">Search</button></div>';
            html += '<div style="border:1px solid var(--rule); padding:16px; margin-bottom:12px; border-radius:4px;"><strong>AIR 2022 SC 1234</strong> — <em>Similar Property Dispute</em><p style="font-size:13px; color:var(--ink-soft); margin-top:4px;">Supreme Court held that registered sale deed prevails over unregistered agreement...</p></div>';
            html += '<div style="border:1px solid var(--rule); padding:16px; margin-bottom:12px; border-radius:4px;"><strong>2021 SCC Vol.5 p.789</strong> — <em>Burden of Proof in Civil Suits</em><p style="font-size:13px; color:var(--ink-soft); margin-top:4px;">The burden of proof lies on the party who asserts a fact...</p></div>';
            html += '<div style="border:1px solid var(--rule); padding:16px; margin-bottom:12px; border-radius:4px;"><strong>(2023) 4 SCC 567</strong> — <em>Electronic Evidence Admissibility</em><p style="font-size:13px; color:var(--ink-soft); margin-top:4px;">Section 65B certificate is mandatory for admissibility of electronic records...</p></div>';
            html += '</div>';
            mainContent.innerHTML = html;
            return;
        }
    }

    // ===== ADMIN SIDEBAR SECTIONS =====
    if (page.indexOf('dashboard-admin') !== -1) {
        if (section === 'System Analytics') {
            mainContent.innerHTML = mainContent.getAttribute('data-original');
            return;
        }
        if (section === 'User Management') {
            html = '<h1 style="font-size:1.8rem; margin-bottom:24px;">User Management</h1><div class="card">';
            html += '<div style="display:flex; justify-content:space-between; margin-bottom:16px;"><strong>Registered Users</strong><button class="btn btn-primary" style="padding:6px 12px; font-size:12px;" onclick="window.showToast(\'Add User form opened.\')">+ Add User</button></div>';
            html += '<table class="ledger" style="border:none;"><thead><tr><th>Name</th><th>Role</th><th>Username</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
            html += '<tr><td>Amit Joshi</td><td>Citizen</td><td class="mono">9876543210</td><td><span style="color:green;">Active</span></td><td><button class="btn btn-outline" style="padding:2px 8px; font-size:11px;" onclick="window.showToast(\'User profile opened.\')">Edit</button></td></tr>';
            html += '<tr><td>Adv. R. Desai</td><td>Advocate</td><td class="mono">BAR/123/2010</td><td><span style="color:green;">Active</span></td><td><button class="btn btn-outline" style="padding:2px 8px; font-size:11px;" onclick="window.showToast(\'User profile opened.\')">Edit</button></td></tr>';
            html += '<tr><td>Hon. Justice Sharma</td><td>Judge</td><td class="mono">GOV-8822</td><td><span style="color:green;">Active</span></td><td><button class="btn btn-outline" style="padding:2px 8px; font-size:11px;" onclick="window.showToast(\'User profile opened.\')">Edit</button></td></tr>';
            html += '</tbody></table></div>';
            mainContent.innerHTML = html;
            return;
        }
        if (section === 'Audit Logs') {
            mainContent.innerHTML = mainContent.getAttribute('data-original');
            return;
        }
        if (section === 'Server Status') {
            html = '<h1 style="font-size:1.8rem; margin-bottom:24px;">Server Status</h1><div class="card">';
            html += '<div style="display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:24px;">';
            html += '<div style="background:#e8f5e9; padding:16px; border-radius:4px; text-align:center;"><span style="font-size:24px;">🟢</span><br><strong>API Server</strong><br><span style="font-size:12px;">Healthy</span></div>';
            html += '<div style="background:#e8f5e9; padding:16px; border-radius:4px; text-align:center;"><span style="font-size:24px;">🟢</span><br><strong>Database</strong><br><span style="font-size:12px;">Connected</span></div>';
            html += '<div style="background:#e8f5e9; padding:16px; border-radius:4px; text-align:center;"><span style="font-size:24px;">🟢</span><br><strong>File Storage</strong><br><span style="font-size:12px;">Operational</span></div>';
            html += '<div style="background:#e8f5e9; padding:16px; border-radius:4px; text-align:center;"><span style="font-size:24px;">🟢</span><br><strong>Auth Service</strong><br><span style="font-size:12px;">Running</span></div></div>';
            html += '<div style="font-family:var(--font-mono); background:#1a1a1a; color:#00ff00; padding:16px; border-radius:4px; font-size:12px; line-height:1.8;">';
            html += '[OK] Node.js v22.20.0 — Port 3000<br>[OK] SQLite in-memory DB — 10 cases loaded<br>[OK] Express 4.x — Static + API serving<br>[OK] CORS enabled — All origins<br>[OK] Last restart: ' + new Date().toLocaleString('en-IN') + '<br>[OK] Memory usage: 45MB / 512MB<br>[OK] CPU: 2.3%</div></div>';
            mainContent.innerHTML = html;
            return;
        }
        if (section === 'Portal Settings') {
            html = '<h1 style="font-size:1.8rem; margin-bottom:24px;">Portal Settings</h1><div class="card">';
            html += '<h3 style="margin-bottom:16px;">General Configuration</h3>';
            html += '<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">';
            html += '<div><label style="display:block; font-weight:600; margin-bottom:6px;">Portal Name</label><input type="text" value="Nyaya Setu" style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body); box-sizing:border-box;"></div>';
            html += '<div><label style="display:block; font-weight:600; margin-bottom:6px;">Maintenance Mode</label><select style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body);"><option>Disabled</option><option>Enabled</option></select></div>';
            html += '<div><label style="display:block; font-weight:600; margin-bottom:6px;">Max File Upload (MB)</label><input type="number" value="20" style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body); box-sizing:border-box;"></div>';
            html += '<div><label style="display:block; font-weight:600; margin-bottom:6px;">Session Timeout (min)</label><input type="number" value="30" style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body); box-sizing:border-box;"></div>';
            html += '</div><button class="btn btn-primary" style="margin-top:20px;" onclick="window.showToast(\'Portal settings saved!\')">Save Settings</button></div>';
            mainContent.innerHTML = html;
            return;
        }
    }

    // Default fallback
    window.showToast('Loading ' + section + '...');
}

window.payNow = function(id, btn) {
    window.showToast('Processing payment...');
    fetch('/api/payments/' + id + '/pay', { method: 'PUT' })
    .then(function(r) { return r.json(); })
    .then(function(data) {
        if (data.success) {
            btn.outerHTML = '<span style="color:green; font-weight:600;">✓ Paid</span>';
            var statusCell = btn.closest('tr').querySelector('.status-badge');
            if (statusCell) { statusCell.innerText = 'Paid'; statusCell.classList.remove('pending'); }
            window.showToast('Payment successful! Receipt generated.');
        }
    });
};
