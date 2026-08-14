// =============================================
// Nyaya Setu — Real-Time Engine & Client Script
// WebSocket Sync, Virtual Courtroom, Notifications, Payment Gateway
// =============================================

// Global Toast Notification System
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
    }, 3500);
};

// Global Notifications Store
window.notificationsList = [
    { title: 'Welcome to Nyaya Setu', desc: 'Real-time judicial portal active.', time: 'Just now', unread: true }
];

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Initialize Real-Time WebSocket Connection
    initWebSocket();

    // 2. Initialize Header Notification Tray
    initNotificationCenter();

    // 3. Utility Bar Functionality
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

    var contrastBtn = document.querySelector('.util-right button:nth-child(2)');
    if (contrastBtn) {
        contrastBtn.addEventListener('click', function() {
            document.body.classList.toggle('high-contrast');
            window.showToast('High contrast mode ' + (document.body.classList.contains('high-contrast') ? 'enabled' : 'disabled'));
        });
    }

    document.querySelectorAll('.util-right a[href="#"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.showToast('Language: ' + e.target.innerText + ' — translation active.');
        });
    });

    // 4. Index Page Search
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

    // 5. Case Status Page Search
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
                selects.forEach(function(s) { if (s.value) query += s.value + ' '; });
                if (input) query += input.value;
                query = query.trim();
            }
            if (!query) {
                window.showToast('Please enter a search value.');
                return;
            }
            window.showToast('Searching live registry for: ' + query);
            fetch('/api/search?q=' + encodeURIComponent(query))
            .then(function(res) { return res.json(); })
            .then(function(data) {
                var old = document.getElementById('search-results');
                if (old) old.remove();

                var resultDiv = document.createElement('div');
                resultDiv.id = 'search-results';
                resultDiv.style = 'margin-top: 24px; padding: 20px; background: #fff; border: 1px solid var(--rule); border-radius: 6px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);';

                if (data.success && data.results.length > 0) {
                    var html = '<h3 style="margin-bottom:16px; color:var(--ink-navy); border-bottom: 2px solid var(--rule); padding-bottom: 8px;">Live Search Results (' + data.results.length + ' found)</h3>';
                    data.results.forEach(function(c) {
                        html += '<div style="border: 1px solid var(--rule); padding: 16px; margin-bottom: 12px; border-radius: 6px; border-left: 4px solid var(--maroon); background:#fafafa;">';
                        html += '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">';
                        html += '<strong style="font-family:var(--font-mono); font-size:15px; color:var(--ink-navy);">' + c.cnr_number + '</strong>';
                        html += '<span class="status-badge">' + c.status + '</span></div>';
                        html += '<div style="font-size:15px; font-weight:600; margin-bottom:6px;">' + c.title + '</div>';
                        html += '<div style="font-size:13px; color:var(--ink-soft); margin-bottom:4px;"><strong>Type:</strong> ' + c.case_type + ' | <strong>Category:</strong> ' + c.category + '</div>';
                        html += '<div style="font-size:13px; color:var(--ink-soft); margin-bottom:4px;"><strong>Petitioner:</strong> ' + c.petitioner + ' | <strong>Respondent:</strong> ' + c.respondent + '</div>';
                        html += '<div style="font-size:13px; color:var(--ink-soft); margin-bottom:4px;"><strong>Court:</strong> ' + c.court + '</div>';
                        html += '<div style="font-size:13px; margin-bottom:8px;"><strong>Next Hearing:</strong> <span style="color:var(--maroon); font-weight:600;">' + c.next_hearing + '</span></div>';
                        html += '<div style="font-size:12px; color:var(--ink-soft); margin-bottom:12px;"><strong>Summary:</strong> ' + c.description + '</div>';
                        html += '<button class="btn btn-outline" style="padding:4px 10px; font-size:12px;" onclick="openDocumentViewer(\'' + c.cnr_number + '\', \'Case Record\')">📜 View Certified Record</button>';
                        html += '</div>';
                    });
                    resultDiv.innerHTML = html;
                    window.showToast('Found ' + data.results.length + ' matching record(s).');
                } else {
                    resultDiv.innerHTML = '<div style="text-align:center; padding:20px; color:var(--ink-soft);"><p style="font-size:18px;">No cases found</p><p>Try searching with a different CNR number or party name.</p></div>';
                    window.showToast(data.message || 'No results found.');
                }
                var activePanel = btn.closest('.tab-panel');
                if (activePanel) activePanel.appendChild(resultDiv);
                else document.querySelector('main').appendChild(resultDiv);
            })
            .catch(function() { window.showToast('Search error. Is the server running?'); });
        });
    });

    // Auto-search URL query parameter
    var urlParams = new URLSearchParams(window.location.search);
    var urlQuery = urlParams.get('q') || urlParams.get('cnr');
    if (urlQuery) {
        var firstInput = document.querySelector('.tab-panel input');
        if (firstInput) {
            firstInput.value = urlQuery;
            var firstSearchBtn = document.querySelector('.tab-panel .btn-primary');
            if (firstSearchBtn) setTimeout(function() { firstSearchBtn.click(); }, 300);
        }
    }

    // 6. Sidebar Navigation
    var sidebarLinks = document.querySelectorAll('.sidebar nav a');
    if (sidebarLinks.length > 0) {
        sidebarLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                sidebarLinks.forEach(function(l) { l.classList.remove('active'); });
                link.classList.add('active');
                showSidebarSection(link.innerText.trim());
            });
        });
    }

    // 7. Page-Specific Dynamic Handlers
    if (window.location.href.indexOf('dashboard-citizen') !== -1) {
        loadCitizenCases();
        document.addEventListener('click', function(e) {
            var target = e.target;
            if (target.tagName === 'A' && target.innerText.trim() === 'Upload') {
                e.preventDefault();
                openDocumentUploadModal();
            }
            if (target.tagName === 'A' && target.innerText.trim() === 'Pay Now') {
                e.preventDefault();
                openPaymentModal(1, 500, 'Court Fee - PT/112/2024');
            }
            if (target.tagName === 'A' && target.innerText.trim() === 'Download') {
                e.preventDefault();
                var rowText = target.closest('li') ? target.closest('li').innerText : 'Document';
                openDocumentViewer(rowText.split(' ')[0], 'Certified Legal Document');
            }
            if (target.tagName === 'A' && target.innerText.trim() === 'View Draft') {
                e.preventDefault();
                openDocumentViewer('Affidavit_Draft_CS405.pdf', 'Affidavit Draft');
            }
            if (target.innerText && target.innerText.indexOf('Join Virtual') !== -1) {
                e.preventDefault();
                openECourtRoom('CS/405/2025');
            }
        });
    }

    if (window.location.href.indexOf('dashboard-lawyer') !== -1) {
        loadLawyerCases();
    }

    if (window.location.href.indexOf('dashboard-judge') !== -1) {
        document.addEventListener('click', function(e) {
            var btn = e.target.closest('button');
            if (!btn) return;
            var text = btn.innerText.trim();
            if (text === 'Start Virtual Hearing') {
                var caseNo = btn.closest('tr') ? btn.closest('tr').querySelector('.mono').innerText : 'CS/405/2025';
                fetch('/api/hearings/start', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ hearing_id: 1, case_number: caseNo, court_room: 'Room 4, District Court Pune' })
                });
                openECourtRoom(caseNo);
            }
            if (text === 'Brief') {
                var caseNo2 = btn.closest('tr') ? btn.closest('tr').querySelectorAll('td')[1].innerText : 'CS/405/2025';
                openDocumentViewer('Bench_Brief_' + caseNo2.replace(/\//g, '_') + '.pdf', 'Bench Brief Summary');
            }
            if (text === 'Draft Order') {
                var caseNo3 = btn.closest('tr') ? btn.closest('tr').querySelectorAll('td')[1].innerText : 'CS/405/2025';
                openOrderDraftingModal(caseNo3);
            }
        });
    }

    // 8. Chanakya AI Assistant Input
    var chatInput = document.querySelector('.ai-chat input');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && chatInput.value.trim() !== '') {
                var msg = chatInput.value;
                chatInput.value = '';

                var userBubble = document.createElement('div');
                userBubble.className = 'bubble';
                userBubble.style = 'background: var(--ink-navy); color: #fff; margin-left: 20px;';
                userBubble.innerHTML = '<strong>You:</strong> ' + msg;
                chatInput.parentNode.insertBefore(userBubble, chatInput);

                setTimeout(function() {
                    var response = generateAIResponse(msg);
                    var botBubble = document.createElement('div');
                    botBubble.className = 'bubble';
                    botBubble.innerHTML = '<strong>Chanakya:</strong> ' + response;
                    chatInput.parentNode.insertBefore(botBubble, chatInput);
                    chatInput.scrollIntoView({ behavior: 'smooth' });
                }, 1000);
            }
        });
    }

    // 9. Tab Switchers
    var caseTabs = document.querySelectorAll('.tab-btn');
    caseTabs.forEach(function(btn) {
        btn.addEventListener('click', function() {
            caseTabs.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            var tabId = btn.getAttribute('data-tab');
            document.querySelectorAll('.tab-panel').forEach(function(p) { p.style.display = 'none'; });
            var activePanel = document.getElementById(tabId);
            if (activePanel) activePanel.style.display = '';
        });
    });

    var noticeTabs = document.querySelectorAll('.tabs button[role="tab"]');
    noticeTabs.forEach(function(btn) {
        btn.addEventListener('click', function() {
            noticeTabs.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            window.showToast('Filtered by ' + btn.innerText.trim());
        });
    });

    // 10. Court Directory Search
    var courtSearchBtn = document.querySelector('.search-directory-btn, .court-search-btn');
    if (!courtSearchBtn) {
        document.querySelectorAll('button.btn-primary').forEach(function(b) {
            if (b.innerText.indexOf('Search Directory') !== -1) courtSearchBtn = b;
        });
    }
    if (courtSearchBtn) {
        courtSearchBtn.addEventListener('click', function() {
            window.showToast('Fetching live court directory...');
            fetch('/api/courts')
            .then(function(res) { return res.json(); })
            .then(function(courts) {
                var tbody = document.querySelector('.ledger tbody');
                if (tbody) {
                    tbody.innerHTML = '';
                    courts.forEach(function(c) {
                        var tr = document.createElement('tr');
                        tr.innerHTML = '<td>' + c.name + '</td><td>' + c.location + '</td><td class="mono">' + c.judges + '</td><td class="mono" style="color:var(--maroon); font-weight:600;">' + c.pending.toLocaleString('en-IN') + '</td>';
                        tbody.appendChild(tr);
                    });
                    window.showToast('Loaded ' + courts.length + ' active court registries.');
                }
            });
        });
    }

}); // END DOMContentLoaded


// =============================================
// REAL-TIME WEBSOCKET ENGINE
// =============================================

function initWebSocket() {
    var wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    var wsUrl = wsProtocol + '//' + window.location.host + '/ws';
    var socket = new WebSocket(wsUrl);

    socket.onopen = function() {
        console.log('⚡ Connected to Nyaya Setu Real-Time Network');
    };

    socket.onmessage = function(event) {
        try {
            var msg = JSON.parse(event.data);
            handleRealTimeEvent(msg);
        } catch (e) {
            console.error('WebSocket parse error:', e);
        }
    };

    socket.onclose = function() {
        // Reconnect after 3 seconds if disconnected
        setTimeout(initWebSocket, 3000);
    };
}

function handleRealTimeEvent(eventData) {
    var type = eventData.type;
    var data = eventData.data;

    if (type === 'CASE_FILED') {
        window.showToast('⚖️ New Case Filed Live: ' + data.cnr_number + ' — ' + data.title);
        addNotification('New Case Filed: ' + data.cnr_number, data.title + ' filed at ' + data.court, 'Just now');
        refreshActiveDashboard();
    } else if (type === 'ORDER_PASSED') {
        window.showToast('📜 Order Passed Live: ' + (data.cnr_number || 'Case') + ' — ' + data.status);
        addNotification('Judicial Order Passed', 'Case status updated to ' + data.status, 'Just now');
        refreshActiveDashboard();
    } else if (type === 'PAYMENT_SUCCESS') {
        window.showToast('💳 Payment Received: ₹' + data.amount + ' for ' + data.description);
        addNotification('Payment Confirmed', '₹' + data.amount + ' payment received for ' + data.description, 'Just now');
        refreshActiveDashboard();
    } else if (type === 'DOCUMENT_UPLOADED') {
        window.showToast('📄 Document Uploaded: ' + data.filename);
        addNotification('Document Vault Updated', data.filename + ' added to case vault.', 'Just now');
        refreshActiveDashboard();
    } else if (type === 'HEARING_STARTED') {
        window.showToast('🔴 E-Hearing Session Started for ' + data.case_number + ' in ' + data.court_room);
        addNotification('Virtual Hearing Live', 'Courtroom ' + data.court_room + ' is active for ' + data.case_number, 'Just now');
    } else if (type === 'AUDIT_LOG') {
        // Real-time update for Admin audit log table
        var tbody = document.querySelector('.ledger tbody');
        if (tbody && window.location.href.indexOf('dashboard-admin') !== -1) {
            var tr = document.createElement('tr');
            tr.style.animation = 'fadeIn 0.5s';
            tr.innerHTML = '<td class="mono">' + data.timestamp + '</td><td class="mono">' + data.event_id + '</td><td>' + data.role + '</td><td>' + data.description + '</td>';
            tbody.insertBefore(tr, tbody.firstChild);
        }
    }
}

function addNotification(title, desc, time) {
    window.notificationsList.unshift({ title: title, desc: desc, time: time, unread: true });
    updateNotifBadge();
}

function updateNotifBadge() {
    var unreadCount = window.notificationsList.filter(function(n) { return n.unread; }).length;
    var bellBtn = document.querySelector('.dash-header button, header button');
    if (bellBtn) {
        var existingBadge = bellBtn.querySelector('.notif-badge');
        if (unreadCount > 0) {
            if (!existingBadge) {
                bellBtn.style.position = 'relative';
                var badge = document.createElement('span');
                badge.className = 'notif-badge';
                badge.innerText = unreadCount;
                bellBtn.appendChild(badge);
            } else {
                existingBadge.innerText = unreadCount;
            }
        } else if (existingBadge) {
            existingBadge.remove();
        }
    }
}

function initNotificationCenter() {
    var bellBtn = document.querySelector('.dash-header button, header button');
    if (!bellBtn) return;

    var dropdown = document.createElement('div');
    dropdown.className = 'notif-dropdown';
    dropdown.innerHTML = '<div class="notif-header"><span>Notifications Center</span><button onclick="markAllRead()" style="background:none; border:none; color:#fff; font-size:12px; cursor:pointer; text-decoration:underline;">Mark all read</button></div><div class="notif-list" id="notif-list-container"></div>';
    
    bellBtn.parentNode.insertBefore(dropdown, bellBtn.nextSibling);

    bellBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        var isOpen = dropdown.style.display === 'block';
        dropdown.style.display = isOpen ? 'none' : 'block';
        renderNotifList();
    });

    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target) && e.target !== bellBtn) {
            dropdown.style.display = 'none';
        }
    });
}

function renderNotifList() {
    var container = document.getElementById('notif-list-container');
    if (!container) return;
    var html = '';
    if (window.notificationsList.length === 0) {
        html = '<div style="padding:20px; text-align:center; color:var(--ink-soft); font-size:13px;">No new notifications.</div>';
    } else {
        window.notificationsList.forEach(function(n) {
            html += '<div class="notif-item ' + (n.unread ? 'unread' : '') + '"><strong>' + n.title + '</strong><p style="margin:2px 0 0; color:var(--ink-soft); font-size:12px;">' + n.desc + '</p><div class="time">' + n.time + '</div></div>';
        });
    }
    container.innerHTML = html;
}

window.markAllRead = function() {
    window.notificationsList.forEach(function(n) { n.unread = false; });
    updateNotifBadge();
    renderNotifList();
};

function refreshActiveDashboard() {
    var page = window.location.href;
    if (page.indexOf('dashboard-citizen') !== -1) loadCitizenCases();
    if (page.indexOf('dashboard-lawyer') !== -1) loadLawyerCases();
}


// =============================================
// INTERACTIVE MODALS & REAL-TIME MODULES
// =============================================

// 1. Interactive Virtual Courtroom Modal
window.openECourtRoom = function(caseNo) {
    var modalHtml = '<div class="ecourt-container">';
    
    // Video Grid
    modalHtml += '<div class="video-grid">';
    
    // Judge Feed
    modalHtml += '<div class="video-feed judge">';
    modalHtml += '<div class="video-avatar">👨‍⚖️</div>';
    modalHtml += '<div class="user-label"><span>🔴 LIVE</span> Hon. Justice Sharma (Presiding Judge)</div>';
    modalHtml += '</div>';

    // Advocate / Petitioner Feed
    modalHtml += '<div class="video-feed">';
    modalHtml += '<div class="video-avatar">⚖️</div>';
    modalHtml += '<div class="user-label">Adv. R. Desai (Petitioner Counsel)</div>';
    modalHtml += '</div>';

    // Citizen / Respondent Feed
    modalHtml += '<div class="video-feed">';
    modalHtml += '<div class="video-avatar">👤</div>';
    modalHtml += '<div class="user-label">Amit Joshi (Petitioner)</div>';
    modalHtml += '</div>';

    // Control Bar
    modalHtml += '<div class="court-controls">';
    modalHtml += '<button class="ctrl-btn" title="Toggle Mic" onclick="this.classList.toggle(\'active-red\'); window.showToast(\'Microphone toggled.\')">🎙️</button>';
    modalHtml += '<button class="ctrl-btn" title="Toggle Video" onclick="this.classList.toggle(\'active-red\'); window.showToast(\'Camera toggled.\')">📹</button>';
    modalHtml += '<button class="ctrl-btn" title="Share Screen" onclick="window.showToast(\'Screen sharing initiated.\')">🖥️</button>';
    modalHtml += '<button class="ctrl-btn" title="Pass Judicial Order" onclick="openOrderDraftingModal(\'' + caseNo + '\')">📜</button>';
    modalHtml += '<button class="ctrl-btn active-red" title="Leave Hearing" onclick="this.closest(\'.modal-overlay\').remove(); window.showToast(\'Left virtual room.\')">📞</button>';
    modalHtml += '</div>';

    modalHtml += '</div>'; // End Video Grid

    // Sidebar Chat & Transcript
    modalHtml += '<div class="ecourt-chat">';
    modalHtml += '<div class="ecourt-chat-header">Courtroom Live Feed — ' + caseNo + '</div>';
    modalHtml += '<div class="ecourt-chat-body" id="court-chat-body">';
    modalHtml += '<div class="ecourt-chat-msg"><strong>Clerk:</strong> Courtroom 4 session started. Parties present.</div>';
    modalHtml += '<div class="ecourt-chat-msg"><strong>Judge:</strong> We are taking up item #1 - ' + caseNo + '. Counsel please proceed.</div>';
    modalHtml += '<div class="ecourt-chat-msg"><strong>Adv. Desai:</strong> My Lord, we have filed the supplemental affidavit today.</div>';
    modalHtml += '</div>';
    
    modalHtml += '<div class="ecourt-chat-input">';
    modalHtml += '<input type="text" id="court-msg-input" placeholder="Type message to court..." style="flex:1; padding:6px 8px; border:1px solid var(--rule); border-radius:4px; font-size:12px;">';
    modalHtml += '<button class="btn btn-primary" style="padding:6px 10px; font-size:12px;" onclick="sendCourtMsg()">Send</button>';
    modalHtml += '</div>';

    modalHtml += '</div>'; // End Chat
    modalHtml += '</div>'; // End Container

    showModal('E-Courtroom Virtual Hearing — ' + caseNo, modalHtml, '860px');
};

window.sendCourtMsg = function() {
    var input = document.getElementById('court-msg-input');
    var body = document.getElementById('court-chat-body');
    if (input && input.value.trim() && body) {
        var msg = document.createElement('div');
        msg.className = 'ecourt-chat-msg';
        msg.innerHTML = '<strong>You:</strong> ' + input.value;
        body.appendChild(msg);
        input.value = '';
        body.scrollTop = body.scrollHeight;
    }
};

// 2. Interactive Payment Gateway Modal
window.openPaymentModal = function(caseId, amount, description) {
    var token = localStorage.getItem('token') || '9876543210';
    var modalHtml = '<div>';
    modalHtml += '<p style="font-size:14px; margin-bottom:16px;"><strong>Item:</strong> ' + description + ' | <strong>Amount:</strong> ₹' + amount + '</p>';
    
    modalHtml += '<div style="display:flex; border-bottom:2px solid var(--rule); margin-bottom:16px;">';
    modalHtml += '<button class="tab-btn active" style="padding:8px 16px; border:none; background:none; font-weight:600; cursor:pointer;" onclick="switchPayTab(\'upi\', this)">UPI / QR Code</button>';
    modalHtml += '<button class="tab-btn" style="padding:8px 16px; border:none; background:none; font-weight:600; cursor:pointer; color:var(--ink-soft);" onclick="switchPayTab(\'card\', this)">Credit / Debit Card</button>';
    modalHtml += '</div>';

    // UPI Tab
    modalHtml += '<div id="pay-tab-upi" class="qr-code-box">';
    modalHtml += '<div style="font-size:48px; margin-bottom:8px;">📱 Scan with any UPI App</div>';
    modalHtml += '<div style="background:#000; color:#fff; width:160px; height:160px; margin:0 auto 12px; display:flex; align-items:center; justify-content:center; font-family:var(--font-mono); font-size:12px; border-radius:8px;">[ UPI QR CODE ]<br>nyayasetu@gov</div>';
    modalHtml += '<p style="font-size:13px; color:var(--ink-soft); margin-bottom:16px;">UPI ID: <strong>nyayasetu@gov.in</strong></p>';
    modalHtml += '<button class="btn btn-primary" style="width:100%; padding:12px;" onclick="processPayment(' + caseId + ', \'' + token + '\', ' + amount + ', \'' + description + '\')">✓ I Have Completed Payment</button>';
    modalHtml += '</div>';

    // Card Tab
    modalHtml += '<div id="pay-tab-card" style="display:none;">';
    modalHtml += '<div style="margin-bottom:12px;"><label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px;">Card Number</label><input type="text" placeholder="4532 •••• •••• 8892" style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-mono); box-sizing:border-box;"></div>';
    modalHtml += '<div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">';
    modalHtml += '<div><label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px;">Expiry Date</label><input type="text" placeholder="MM/YY" style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; box-sizing:border-box;"></div>';
    modalHtml += '<div><label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px;">CVV</label><input type="password" placeholder="•••" maxlength="3" style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; box-sizing:border-box;"></div></div>';
    modalHtml += '<button class="btn btn-primary" style="width:100%; padding:12px;" onclick="processPayment(' + caseId + ', \'' + token + '\', ' + amount + ', \'' + description + '\')">Pay ₹' + amount + ' Securely</button>';
    modalHtml += '</div>';

    modalHtml += '</div>';
    showModal('Judicial Payment Gateway — Government of India', modalHtml);
};

window.switchPayTab = function(tabName, btn) {
    btn.parentNode.querySelectorAll('button').forEach(function(b) { b.style.color = 'var(--ink-soft)'; b.classList.remove('active'); });
    btn.style.color = 'var(--maroon)';
    btn.classList.add('active');
    document.getElementById('pay-tab-upi').style.display = tabName === 'upi' ? '' : 'none';
    document.getElementById('pay-tab-card').style.display = tabName === 'card' ? '' : 'none';
};

window.processPayment = function(caseId, userId, amount, description) {
    window.showToast('Verifying payment with bank...');
    fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: caseId, user_id: userId, amount: amount, description: description })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
        if (data.success) {
            var modal = document.querySelector('.modal-overlay');
            if (modal) modal.remove();
            window.showToast('Payment successful! E-Receipt generated.');
            openDocumentViewer('Receipt_PAY_' + data.id + '.pdf', 'Official Fee Receipt');
        }
    });
};

// 3. Document & Order Printable Viewer Modal
window.openDocumentViewer = function(docTitle, docType) {
    var modalHtml = '<div id="printable-doc" style="background:#fff; border:1px solid var(--rule); padding:32px; font-family:var(--font-body); border-radius:4px; box-shadow:inset 0 0 10px rgba(0,0,0,0.02);">';
    
    // Header
    modalHtml += '<div style="text-align:center; border-bottom:2px solid var(--ink-navy); padding-bottom:16px; margin-bottom:20px;">';
    modalHtml += '<div style="font-family:var(--font-display); font-size:20px; font-weight:700; color:var(--ink-navy);">DEPARTMENT OF JUSTICE — GOVERNMENT OF INDIA</div>';
    modalHtml += '<div style="font-family:var(--font-mono); font-size:12px; color:var(--maroon); letter-spacing:1px; margin-top:4px;">NYAYA SETU DIGITAL CERTIFIED RECORD</div>';
    modalHtml += '</div>';

    // Content
    modalHtml += '<div style="line-height:1.8; font-size:14px;">';
    modalHtml += '<p><strong>Document ID:</strong> DOC-' + Math.floor(100000 + Math.random() * 900000) + '</p>';
    modalHtml += '<p><strong>Document Name:</strong> ' + docTitle + '</p>';
    modalHtml += '<p><strong>Document Type:</strong> ' + docType + '</p>';
    modalHtml += '<p><strong>Issued On:</strong> ' + new Date().toLocaleDateString('en-IN') + ' ' + new Date().toLocaleTimeString('en-IN') + '</p>';
    modalHtml += '<hr style="margin:16px 0; border:0; border-top:1px solid var(--rule);">';
    modalHtml += '<p style="font-weight:600;">CERTIFICATE OF AUTHENTICITY:</p>';
    modalHtml += '<p style="font-size:13px; color:var(--ink-soft);">This document is digitally signed and verified under Section 65B of the Indian Evidence Act, 1872. Any alterations invalidate this electronic certified record.</p>';
    modalHtml += '<div style="margin-top:24px; display:flex; justify-content:space-between; align-items:center; background:var(--parchment); padding:16px; border-radius:4px; border:1px solid var(--brass);">';
    modalHtml += '<div><strong style="color:var(--ink-navy);">Digital Seal & Signature</strong><br><span style="font-size:11px; color:var(--ink-soft);">Verified by e-Sign Portal India</span></div>';
    modalHtml += '<div style="font-family:var(--font-mono); font-weight:bold; color:green; border:2px solid green; padding:4px 12px; border-radius:4px;">✓ VERIFIED</div>';
    modalHtml += '</div>';
    modalHtml += '</div>';

    // Actions
    modalHtml += '<div style="margin-top:24px; display:flex; gap:12px;">';
    modalHtml += '<button class="btn btn-primary" onclick="window.print()">🖨️ Print / Save as PDF</button>';
    modalHtml += '<button class="btn btn-outline" onclick="window.showToast(\'Downloaded ' + docTitle + ' securely.\')">⬇️ Download File</button>';
    modalHtml += '</div>';

    modalHtml += '</div>';

    showModal(docType + ' — Certified Copy', modalHtml);
};

// 4. Order Drafting Modal for Judge
window.openOrderDraftingModal = function(caseNo) {
    var modalHtml = '<div style="line-height:1.8; font-size:14px;">';
    modalHtml += '<p style="text-align:center; font-weight:600; margin-bottom:16px; color:var(--ink-navy);">IN THE COURT OF HON. JUSTICE SHARMA</p>';
    modalHtml += '<p><strong>Case No:</strong> ' + caseNo + '</p>';
    modalHtml += '<p><strong>Date:</strong> ' + new Date().toLocaleDateString('en-IN') + '</p>';
    modalHtml += '<hr style="margin:12px 0;">';
    modalHtml += '<p><strong>JUDICIAL ORDER:</strong></p>';
    modalHtml += '<textarea id="order-text-content" style="width:100%; height:160px; padding:12px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body); font-size:14px; resize:vertical; box-sizing:border-box;" placeholder="Type judicial order summary here...">Having heard the learned counsels for both parties and perused the pleadings on record, this Court is pleased to pass the following order...</textarea>';
    
    modalHtml += '<div style="margin-top:16px; display:flex; gap:12px;">';
    modalHtml += '<button class="btn btn-primary" onclick="submitJudicialOrder(\'' + caseNo + '\')">✒️ Sign & Publish Order Live</button>';
    modalHtml += '<button class="btn btn-outline" onclick="this.closest(\'.modal-overlay\').remove()">Cancel</button>';
    modalHtml += '</div></div>';

    showModal('Judicial Order Publishing — ' + caseNo, modalHtml);
};

window.submitJudicialOrder = function(caseNo) {
    var txt = document.getElementById('order-text-content').value;
    if (!txt.trim()) { window.showToast('Please enter order text.'); return; }

    window.showToast('Publishing order live to national registry...');
    // Find case ID by CNR or update case #1 / #2
    fetch('/api/cases/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Order Passed: ' + txt.substring(0, 30) + '...' })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
        if (data.success) {
            var modal = document.querySelector('.modal-overlay');
            if (modal) modal.remove();
            window.showToast('Order published live to registry & broadcasted!');
        }
    });
};

function openDocumentUploadModal() {
    var modalHtml = '<div>';
    modalHtml += '<div style="border:2px dashed var(--maroon); padding:32px; text-align:center; border-radius:6px; background:var(--parchment-2); margin-bottom:16px; cursor:pointer;" onclick="document.getElementById(\'modal-file-input\').click()">';
    modalHtml += '<div style="font-size:32px; margin-bottom:8px;">📁</div>';
    modalHtml += '<strong>Click to Select Document (.pdf, .docx, .jpg)</strong>';
    modalHtml += '<p style="font-size:12px; color:var(--ink-soft); margin-top:4px;">Digital signature verification enabled</p>';
    modalHtml += '<input type="file" id="modal-file-input" style="display:none;" onchange="document.getElementById(\'selected-file-name\').innerText = this.files[0].name">';
    modalHtml += '<div id="selected-file-name" style="margin-top:8px; font-weight:600; color:var(--maroon);"></div>';
    modalHtml += '</div>';

    modalHtml += '<div style="margin-bottom:16px;"><label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px;">Document Classification</label>';
    modalHtml += '<select id="upload-doc-type" style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body);"><option>Affidavit</option><option>Vakalatnama</option><option>Evidence / Annexure</option><option>Written Submission</option></select></div>';

    modalHtml += '<button class="btn btn-primary" style="width:100%; padding:12px;" onclick="submitDocumentUpload()">Upload to Document Vault</button>';
    modalHtml += '</div>';

    showModal('Upload Certified Legal Document', modalHtml);
}

window.submitDocumentUpload = function() {
    var input = document.getElementById('modal-file-input');
    var filename = input && input.files[0] ? input.files[0].name : 'Affidavit_Signed_2026.pdf';
    var docType = document.getElementById('upload-doc-type').value;
    var token = localStorage.getItem('token') || '9876543210';

    window.showToast('Encrypting & uploading document...');
    fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: 1, filename: filename, doc_type: docType, uploaded_by: token })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
        if (data.success) {
            var modal = document.querySelector('.modal-overlay');
            if (modal) modal.remove();
            window.showToast('Document uploaded successfully to Vault!');
        }
    });
};

function showModal(title, contentHtml, maxWidth) {
    var existing = document.querySelector('.modal-overlay');
    if (existing) existing.remove();

    var width = maxWidth || '600px';
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.65); backdrop-filter:blur(3px); z-index:10000; display:flex; align-items:center; justify-content:center; animation: fadeIn 0.2s;';
    overlay.innerHTML = '<div style="background:#fff; border-radius:8px; padding:24px; max-width:' + width + '; width:92%; max-height:88vh; overflow-y:auto; box-shadow:0 25px 50px rgba(0,0,0,0.35);">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; border-bottom:2px solid var(--rule); padding-bottom:10px;">' +
        '<h3 style="margin:0; color:var(--ink-navy); font-size:1.2rem;">' + title + '</h3>' +
        '<button onclick="this.closest(\'.modal-overlay\').remove()" style="border:none; background:none; font-size:22px; cursor:pointer; color:var(--ink-soft);">✕</button></div>' +
        '<div>' + contentHtml + '</div></div>';

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) overlay.remove();
    });

    document.body.appendChild(overlay);
}

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
                    statusHtml = '<button class="btn btn-outline" style="padding:4px 10px; font-size:12px; font-weight:600;" onclick="openECourtRoom(\'' + c.cnr_number + '\')">🎥 Join Virtual</button>';
                } else {
                    statusHtml = '<span class="status-badge ' + (c.status.indexOf('Await') !== -1 ? 'pending' : '') + '">' + c.status + '</span>';
                }
                tr.innerHTML = '<td class="mono">' + c.cnr_number + '</td><td>' + c.title + '</td><td class="mono" style="color:var(--maroon); font-weight:600;">' + c.next_hearing + '</td><td>' + statusHtml + '</td>';
                tbody.appendChild(tr);
            });
        }
        var casesLink = document.querySelector('.sidebar nav a:nth-child(2)');
        if (casesLink) casesLink.innerText = 'My Cases (' + cases.length + ')';
    })
    .catch(function() {});
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
    .catch(function() {});
}

function showSidebarSection(section) {
    var mainContent = document.querySelector('main');
    if (!mainContent) return;

    if (!mainContent.getAttribute('data-original')) {
        mainContent.setAttribute('data-original', mainContent.innerHTML);
    }

    var page = window.location.href;
    var html = '';

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
                var h = '<table class="ledger" style="border:none;"><thead><tr><th>Date</th><th>Time</th><th>Case</th><th>Court Room</th><th>Type</th><th>Action</th></tr></thead><tbody>';
                hearings.forEach(function(hr) {
                    h += '<tr><td class="mono">' + hr.hearing_date + '</td><td class="mono" style="color:var(--maroon); font-weight:600;">' + hr.hearing_time + '</td><td>' + hr.cnr_number + ' — ' + hr.title + '</td><td style="font-size:12px;">' + hr.court_room + '</td><td>' + hr.hearing_type + '</td><td><button class="btn btn-outline" style="padding:4px 10px; font-size:12px;" onclick="openECourtRoom(\'' + hr.cnr_number + '\')">🎥 Join Courtroom</button></td></tr>';
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
                var h = '<div style="margin-bottom:16px;"><button class="btn btn-primary" onclick="openDocumentUploadModal()">+ Upload Document</button></div>';
                h += '<table class="ledger" style="border:none;"><thead><tr><th>File Name</th><th>Type</th><th>Uploaded By</th><th>Date</th><th>Action</th></tr></thead><tbody>';
                docs.forEach(function(d) {
                    h += '<tr><td>' + d.filename + '</td><td>' + d.doc_type + '</td><td>' + d.uploaded_by + '</td><td class="mono">' + d.upload_date + '</td><td><a href="#" class="btn btn-outline" style="padding:4px 10px; font-size:12px;" onclick="event.preventDefault(); openDocumentViewer(\'' + d.filename + '\', \'' + d.doc_type + '\')">📜 View / Download</a></td></tr>';
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
                    var actionHtml = p.status === 'Pending' ? '<button class="btn btn-primary" style="padding:4px 10px; font-size:12px;" onclick="openPaymentModal(' + p.id + ', ' + p.amount + ', \'' + p.description + '\')">💳 Pay Now</button>' : '<button class="btn btn-outline" style="padding:4px 10px; font-size:12px;" onclick="openDocumentViewer(\'Receipt_' + p.id + '.pdf\', \'Fee Receipt\')">📄 Receipt</button>';
                    h += '<tr><td>' + p.description + '</td><td class="mono" style="font-weight:600;">₹' + p.amount + '</td><td><span class="status-badge ' + (p.status === 'Pending' ? 'pending' : '') + '">' + p.status + '</span></td><td class="mono">' + (p.payment_date || '—') + '</td><td>' + actionHtml + '</td></tr>';
                });
                h += '</tbody></table>';
                div.innerHTML = h;
            });
            return;
        }
        if (section === 'Settings') {
            html = '<h1 style="font-size:1.8rem; margin-bottom:24px;">Account Settings</h1>';
            html += '<div class="card"><h3>Profile Information</h3><div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:16px;">';
            html += '<div><label style="display:block; font-weight:600; margin-bottom:6px;">Full Name</label><input type="text" value="' + (localStorage.getItem('display_name') || 'Amit Joshi') + '" style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body); box-sizing:border-box;"></div>';
            html += '<div><label style="display:block; font-weight:600; margin-bottom:6px;">Mobile</label><input type="text" value="' + (localStorage.getItem('token') || '9876543210') + '" style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body); box-sizing:border-box;"></div>';
            html += '</div><button class="btn btn-primary" style="margin-top:16px;" onclick="window.showToast(\'Profile settings saved successfully!\')">Save Changes</button></div>';
            mainContent.innerHTML = html;
            return;
        }
    }

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
                var h = '<table class="ledger" style="border:none;"><thead><tr><th>Date</th><th>Time</th><th>Case</th><th>Parties</th><th>Court Room</th><th>Action</th></tr></thead><tbody>';
                hearings.forEach(function(hr) { h += '<tr><td class="mono">' + hr.hearing_date + '</td><td class="mono" style="color:var(--maroon); font-weight:600;">' + hr.hearing_time + '</td><td class="mono">' + hr.cnr_number + '</td><td style="font-size:12px;">' + hr.petitioner + ' v. ' + hr.respondent + '</td><td style="font-size:12px;">' + hr.court_room + '</td><td><button class="btn btn-outline" style="padding:4px 10px; font-size:12px;" onclick="openECourtRoom(\'' + hr.cnr_number + '\')">🎥 Join Courtroom</button></td></tr>'; });
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
                cases.forEach(function(c) { h += '<tr><td style="font-weight:600;">' + c.petitioner + '</td><td class="mono">' + c.cnr_number + '</td><td>' + c.case_type + '</td><td><span class="status-badge">' + c.status + '</span></td><td><a href="#" onclick="event.preventDefault(); window.showToast(\'Client file details loaded.\')">View File</a></td></tr>'; });
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
                var h = '<div style="margin-bottom:16px;"><button class="btn btn-primary" onclick="openDocumentUploadModal()">+ Upload Document</button></div>';
                h += '<table class="ledger" style="border:none;"><thead><tr><th>File</th><th>Type</th><th>Uploaded By</th><th>Date</th><th>Actions</th></tr></thead><tbody>';
                docs.forEach(function(d) { h += '<tr><td>' + d.filename + '</td><td>' + d.doc_type + '</td><td>' + d.uploaded_by + '</td><td class="mono">' + d.upload_date + '</td><td><a href="#" onclick="event.preventDefault(); openDocumentViewer(\'' + d.filename + '\', \'' + d.doc_type + '\')">View Document</a></td></tr>'; });
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
            html += '<tr><td>Mehta & Sons Ltd.</td><td>CR/992/2026</td><td class="mono" style="font-weight:600;">₹50,000</td><td><span class="status-badge">Paid</span></td><td><button class="btn btn-outline" style="padding:4px 10px; font-size:12px;" onclick="openDocumentViewer(\'Invoice_101.pdf\', \'Client Invoice\')">📄 Invoice</button></td></tr>';
            html += '<tr><td>Priya Singh</td><td>FC/221/2026</td><td class="mono" style="font-weight:600;">₹30,000</td><td><span class="status-badge pending">Pending</span></td><td><button class="btn btn-primary" style="padding:4px 10px; font-size:12px;" onclick="window.showToast(\'Payment link sent via SMS & WhatsApp.\')">📲 Remind Client</button></td></tr>';
            html += '</tbody></table></div>';
            mainContent.innerHTML = html;
            return;
        }
    }

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
                cases.slice(0, 6).forEach(function(c) {
                    h += '<div style="border:1px solid var(--rule); padding:16px; margin-bottom:12px; border-radius:6px; border-left:4px solid var(--ink-navy); background:#fff;">';
                    h += '<div style="display:flex; justify-content:space-between;"><strong class="mono" style="font-size:15px; color:var(--ink-navy);">' + c.cnr_number + '</strong><span class="status-badge">' + c.status + '</span></div>';
                    h += '<p style="margin:8px 0 4px; font-weight:600;">' + c.title + '</p>';
                    h += '<p style="font-size:13px; color:var(--ink-soft);">' + c.description + '</p>';
                    h += '<button class="btn btn-outline" style="padding:4px 10px; font-size:12px; margin-top:8px;" onclick="openDocumentViewer(\'Brief_' + c.cnr_number.replace(/\//g, '_') + '.pdf\', \'Bench Brief & Precedents\')">📜 View Certified Brief</button></div>';
                });
                div.innerHTML = h;
            });
            return;
        }
        if (section === 'Draft Judgements') {
            html = '<h1 style="font-size:1.8rem; margin-bottom:24px;">Draft Judgements & Orders</h1><div class="card">';
            html += '<div id="draft-cases"><p>Loading...</p></div></div>';
            mainContent.innerHTML = html;
            fetch('/api/cases?role=judge')
            .then(function(r) { return r.json(); })
            .then(function(cases) {
                var div = document.getElementById('draft-cases');
                var h = '';
                cases.forEach(function(c) {
                    h += '<div style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; border:1px solid var(--rule); margin-bottom:8px; border-radius:6px; background:#fff;">';
                    h += '<div><strong class="mono">' + c.cnr_number + '</strong> — ' + c.title + ' <span class="status-badge" style="margin-left:8px;">' + c.status + '</span></div>';
                    h += '<div style="display:flex; gap:8px;">';
                    h += '<button class="btn btn-outline" style="padding:4px 10px; font-size:12px;" onclick="openOrderDraftingModal(\'' + c.cnr_number + '\')">✒️ Draft Order</button>';
                    h += '</div></div>';
                });
                div.innerHTML = h;
            });
            return;
        }
        if (section === 'E-Hearing Rooms') {
            html = '<h1 style="font-size:1.8rem; margin-bottom:24px;">E-Hearing Virtual Rooms</h1><div class="card">';
            html += '<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:16px;">';
            html += '<div style="border:2px solid green; padding:20px; border-radius:6px; text-align:center; background:#f0fdf4;"><div style="font-size:28px; margin-bottom:8px;">🔴</div><strong>Courtroom 4 (Live)</strong><p style="font-size:12px; margin:4px 0;">CS/405/2025</p><button class="btn btn-primary" style="padding:6px 12px; font-size:12px;" onclick="openECourtRoom(\'CS/405/2025\')">🎥 Enter Bench Room</button></div>';
            html += '<div style="border:2px solid var(--rule); padding:20px; border-radius:6px; text-align:center;"><div style="font-size:28px; margin-bottom:8px;">⚪</div><strong>Courtroom 7</strong><p style="font-size:12px; margin:4px 0;">CR/992/2026</p><button class="btn btn-outline" style="padding:6px 12px; font-size:12px;" onclick="openECourtRoom(\'CR/992/2026\')">🎥 Open Room</button></div>';
            html += '</div></div>';
            mainContent.innerHTML = html;
            return;
        }
        if (section === 'Precedents DB') {
            html = '<h1 style="font-size:1.8rem; margin-bottom:24px;">Precedents Search Engine</h1><div class="card">';
            html += '<div style="display:flex; gap:12px; margin-bottom:20px;"><input type="text" id="precedent-search" placeholder="Search Supreme Court & High Court judgments..." style="flex:1; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body);"><button class="btn btn-primary" onclick="window.showToast(\'Searching 5,00,000+ precedents...\')">Search Precedents</button></div>';
            html += '<div style="border:1px solid var(--rule); padding:16px; margin-bottom:12px; border-radius:6px; background:#fff;"><strong>AIR 2022 SC 1234</strong> — <em>Property Dispute Landmark Ruling</em><p style="font-size:13px; color:var(--ink-soft); margin-top:4px;">Supreme Court held that registered sale deed prevails over unregistered agreement.</p><button class="btn btn-outline" style="padding:4px 10px; font-size:11px; margin-top:6px;" onclick="openDocumentViewer(\'AIR_2022_SC_1234.pdf\', \'Landmark Judgment\')">📜 Read Citation</button></div>';
            html += '</div>';
            mainContent.innerHTML = html;
            return;
        }
    }

    if (page.indexOf('dashboard-admin') !== -1) {
        if (section === 'System Analytics') {
            mainContent.innerHTML = mainContent.getAttribute('data-original');
            return;
        }
        if (section === 'User Management') {
            html = '<h1 style="font-size:1.8rem; margin-bottom:24px;">User Account Management</h1><div class="card">';
            html += '<div style="display:flex; justify-content:space-between; margin-bottom:16px;"><strong>Registered System Users</strong><button class="btn btn-primary" style="padding:6px 12px; font-size:12px;" onclick="window.showToast(\'Use the Portal Registration link to add new accounts.\')">+ Add User</button></div>';
            html += '<table class="ledger" style="border:none;"><thead><tr><th>Name</th><th>Role</th><th>Username / ID</th><th>Status</th></tr></thead><tbody>';
            html += '<tr><td>Amit Joshi</td><td>Citizen</td><td class="mono">9876543210</td><td><span style="color:green; font-weight:600;">✓ Active</span></td></tr>';
            html += '<tr><td>Adv. R. Desai</td><td>Advocate</td><td class="mono">BAR/123/2010</td><td><span style="color:green; font-weight:600;">✓ Active</span></td></tr>';
            html += '<tr><td>Hon. Justice Sharma</td><td>Judge</td><td class="mono">GOV-8822</td><td><span style="color:green; font-weight:600;">✓ Active</span></td></tr>';
            html += '</tbody></table></div>';
            mainContent.innerHTML = html;
            return;
        }
        if (section === 'Server Status') {
            html = '<h1 style="font-size:1.8rem; margin-bottom:24px;">Server & Network Cluster Status</h1><div class="card">';
            html += '<div style="display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:24px;">';
            html += '<div style="background:#e8f5e9; padding:16px; border-radius:6px; text-align:center;"><span style="font-size:24px;">🟢</span><br><strong>API Server</strong><br><span style="font-size:12px; color:green; font-weight:600;">Online (Port 3000)</span></div>';
            html += '<div style="background:#e8f5e9; padding:16px; border-radius:6px; text-align:center;"><span style="font-size:24px;">⚡</span><br><strong>WebSocket Server</strong><br><span style="font-size:12px; color:green; font-weight:600;">Connected (/ws)</span></div>';
            html += '<div style="background:#e8f5e9; padding:16px; border-radius:6px; text-align:center;"><span style="font-size:24px;">💾</span><br><strong>SQLite Storage</strong><br><span style="font-size:12px; color:green; font-weight:600;">nyaya_setu.db</span></div>';
            html += '<div style="background:#e8f5e9; padding:16px; border-radius:6px; text-align:center;"><span style="font-size:24px;">🔒</span><br><strong>e-Sign & Auth</strong><br><span style="font-size:12px; color:green; font-weight:600;">Active</span></div></div>';
            html += '</div>';
            mainContent.innerHTML = html;
            return;
        }
    }

    window.showToast('Navigated to ' + section);
}

function showFilingForm() {
    fetch('/api/categories')
    .then(function(res) { return res.json(); })
    .then(function(categories) {
        var catOptions = '';
        categories.forEach(function(cat) {
            catOptions += '<option value="' + cat.prefix + '">' + cat.name + '</option>';
        });

        var formHtml = '<div style="max-height:72vh; overflow-y:auto; padding-right:6px;">';
        formHtml += '<div style="margin-bottom:14px;"><label style="display:block; font-weight:600; margin-bottom:4px;">Case Classification *</label>';
        formHtml += '<select id="filing-type" style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body);">' + catOptions + '</select></div>';

        formHtml += '<div style="margin-bottom:14px;"><label style="display:block; font-weight:600; margin-bottom:4px;">Specific Sub-Category *</label>';
        formHtml += '<select id="filing-category" style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body);"><option>Select case type first</option></select></div>';

        formHtml += '<div style="margin-bottom:14px;"><label style="display:block; font-weight:600; margin-bottom:4px;">Case Title / Cause Title *</label>';
        formHtml += '<input id="filing-title" type="text" placeholder="e.g. Ramesh Kumar v. Union of India" style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body); box-sizing:border-box;"></div>';

        formHtml += '<div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px;">';
        formHtml += '<div><label style="display:block; font-weight:600; margin-bottom:4px;">Petitioner / Complainant *</label>';
        formHtml += '<input id="filing-petitioner" type="text" placeholder="Full name of petitioner" style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body); box-sizing:border-box;"></div>';
        formHtml += '<div><label style="display:block; font-weight:600; margin-bottom:4px;">Respondent / Defendant *</label>';
        formHtml += '<input id="filing-respondent" type="text" placeholder="Full name of respondent" style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body); box-sizing:border-box;"></div></div>';

        formHtml += '<div style="margin-bottom:14px;"><label style="display:block; font-weight:600; margin-bottom:4px;">Target Court Forum *</label>';
        formHtml += '<select id="filing-court" style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body);">';
        formHtml += '<option>High Court, Bombay</option><option>District Court, Pune</option><option>High Court, Delhi</option><option>Sessions Court, Delhi</option><option>Family Court, Delhi</option><option>Supreme Court of India</option>';
        formHtml += '</select></div>';

        formHtml += '<div style="margin-bottom:16px;"><label style="display:block; font-weight:600; margin-bottom:4px;">Pleadings & Facts of Petition *</label>';
        formHtml += '<textarea id="filing-desc" rows="4" placeholder="Brief facts of the petition..." style="width:100%; padding:10px; border:1px solid var(--rule); border-radius:4px; font-family:var(--font-body); box-sizing:border-box; resize:vertical;"></textarea></div>';

        formHtml += '<div style="display:flex; gap:12px;">';
        formHtml += '<button class="btn btn-primary" style="flex:1; padding:12px;" onclick="submitNewCase()">⚖️ Submit Petition & File Case</button>';
        formHtml += '</div></div>';

        showModal('E-Filing Portal — Submit New Petition', formHtml);

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
                updateCategories();
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

    window.showToast('Encrypting petition & broadcasting file live...');

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
            var modal = document.querySelector('.modal-overlay');
            if (modal) modal.remove();
            window.showToast('Case filed successfully! CNR Number: ' + data.cnr_number);
        } else {
            window.showToast('Error: ' + data.message);
        }
    });
};

function generateAIResponse(msg) {
    var lower = msg.toLowerCase();
    if (lower.indexOf('hearing') !== -1 || lower.indexOf('date') !== -1) {
        return 'Your next hearing is scheduled for <strong>tomorrow at 10:30 AM</strong> in District Court, Pune (Room 4) for case CS/405/2025. You can click <strong>"🎥 Join Virtual"</strong> on your dashboard to join the live courtroom.';
    }
    if (lower.indexOf('document') !== -1 || lower.indexOf('upload') !== -1) {
        return 'You can upload affidavits and legal documents directly using the <strong>Document Vault</strong> or <strong>Pending Actions</strong> section.';
    }
    if (lower.indexOf('pay') !== -1 || lower.indexOf('fee') !== -1) {
        return 'You have a pending court fee of <strong>₹500</strong> for case PT/112/2024. Use the live <strong>Payments Hub</strong> for UPI QR Code or Card payments.';
    }
    return 'I am Chanakya AI, your digital judicial assistant. I am monitoring your cases in real-time. How can I assist you with pleadings, hearing schedules, or court fee payments today?';
}
