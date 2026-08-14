const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

// ========== WEBSOCKET SERVER ==========
const wss = new WebSocket.Server({ server, path: '/ws' });

function broadcastEvent(type, data) {
    const payload = JSON.stringify({ type, data, timestamp: new Date().toISOString() });
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}

wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ type: 'CONNECTED', message: 'Connected to Nyaya Setu Real-Time Network' }));
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ========== PERSISTENT SQLITE DB ==========
const dbPath = path.join(__dirname, 'nyaya_setu.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Users
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        role TEXT, 
        username TEXT UNIQUE, 
        password TEXT, 
        display_name TEXT
    )`);
    
    // Seed default users if empty
    db.get('SELECT COUNT(*) as cnt FROM users', (err, row) => {
        if (row && row.cnt === 0) {
            db.run("INSERT OR IGNORE INTO users (id, role, username, password, display_name) VALUES (1,'citizen','9876543210','123456','Amit Joshi')");
            db.run("INSERT OR IGNORE INTO users (id, role, username, password, display_name) VALUES (2,'advocate','BAR/123/2010','demo','Adv. R. Desai')");
            db.run("INSERT OR IGNORE INTO users (id, role, username, password, display_name) VALUES (3,'judge','GOV-8822','demo','Hon. Justice Sharma')");
            db.run("INSERT OR IGNORE INTO users (id, role, username, password, display_name) VALUES (4,'admin','GOV-8822','demo','System Administrator')");
        }
    });

    // Cases - 10 demo cases
    db.run(`CREATE TABLE IF NOT EXISTS cases (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        cnr_number TEXT UNIQUE, 
        title TEXT, 
        case_type TEXT, 
        category TEXT, 
        description TEXT, 
        status TEXT, 
        next_hearing TEXT, 
        court TEXT, 
        filed_by TEXT, 
        assigned_to TEXT, 
        filing_date TEXT, 
        petitioner TEXT, 
        respondent TEXT
    )`);

    db.get('SELECT COUNT(*) as cnt FROM cases', (err, row) => {
        if (row && row.cnt === 0) {
            db.run("INSERT OR IGNORE INTO cases VALUES (1,'CS/405/2025','Amit Joshi v. State of Maharashtra','Civil Suit','Property Dispute','Dispute regarding ownership of commercial property at Survey No. 45, Pune. Plaintiff claims rightful ownership through registered sale deed dated 12/03/2020.','Hearing Scheduled','Tomorrow, 10:30 AM','District Court, Pune','9876543210','9876543210','2025-03-15','Amit Joshi','State of Maharashtra')");
            db.run("INSERT OR IGNORE INTO cases VALUES (2,'PT/112/2024','Property Dispute - Mehta Estate','Civil Suit','Property Dispute','Partition suit filed for ancestral property located at Plot No. 78, Andheri West, Mumbai. Multiple claimants involved.','Awaiting Order','15 Sep 2026','High Court, Mumbai','BAR/123/2010','9876543210','2024-06-20','Rajesh Mehta','Suresh Mehta & Others')");
            db.run("INSERT OR IGNORE INTO cases VALUES (3,'CR/992/2026','State v. Vikram Malhotra','Criminal','Theft & Burglary','FIR No. 234/2026 registered at Saket PS. Accused charged under IPC Sections 380, 457. Bail application pending.','Under Investigation','20 Aug 2026','Sessions Court, Delhi','BAR/123/2010','BAR/123/2010','2026-01-10','State','Vikram Malhotra')");
            db.run("INSERT OR IGNORE INTO cases VALUES (4,'FC/221/2026','Priya Singh v. Rahul Singh','Family Court','Divorce','Petition for dissolution of marriage under Section 13 of Hindu Marriage Act, 1955. Mutual consent claimed by petitioner.','Filing Complete','18 Aug 2026','Family Court, Delhi','BAR/123/2010','BAR/123/2010','2026-05-01','Priya Singh','Rahul Singh')");
            db.run("INSERT OR IGNORE INTO cases VALUES (5,'WP/3301/2026','Green Earth NGO v. Municipal Corp','Writ Petition','Environmental','PIL challenging illegal construction in CRZ zone at Versova Beach. Environmental impact assessment report pending.','Notice Issued','25 Aug 2026','High Court, Mumbai','BAR/123/2010','9876543210','2026-02-14','Green Earth NGO','Municipal Corporation of Mumbai')");
            db.run("INSERT OR IGNORE INTO cases VALUES (6,'ARB/55/2025','TechCorp India v. DataSoft Ltd','Arbitration','Commercial Dispute','Commercial arbitration under Arbitration & Conciliation Act for breach of software licensing agreement worth Rs. 2.5 Crore.','Arbitration In Progress','10 Sep 2026','Arbitration Centre, Bangalore','BAR/123/2010','BAR/123/2010','2025-11-05','TechCorp India Pvt. Ltd.','DataSoft Solutions Ltd.')");
            db.run("INSERT OR IGNORE INTO cases VALUES (7,'LA/789/2026','Workers Union v. ABC Manufacturing','Labour Appeal','Labour Dispute','Appeal against order of Labour Court regarding wrongful termination of 45 factory workers. Reinstatement with back wages demanded.','Arguments Ongoing','5 Sep 2026','Industrial Tribunal, Chennai','BAR/123/2010','9876543210','2026-04-18','Tamil Nadu Workers Union','ABC Manufacturing Co.')");
            db.run("INSERT OR IGNORE INTO cases VALUES (8,'MC/101/2026','Anita Sharma v. State','Misc. Application','Consumer Protection','Consumer complaint regarding defective automobile sold by authorized dealer. Refund of Rs. 8.5 Lakh with compensation claimed.','Mediation Ordered','30 Aug 2026','Consumer Forum, Jaipur','9876543210','9876543210','2026-03-22','Anita Sharma','AutoDeal India Pvt. Ltd.')");
            db.run("INSERT OR IGNORE INTO cases VALUES (9,'CR/445/2026','State v. Sunil Yadav','Criminal','Fraud & Cheating','Cheating case under IPC 420. Accused allegedly defrauded 150 investors through fake investment scheme worth Rs. 12 Crore.','Charge Sheet Filed','12 Sep 2026','Sessions Court, Lucknow','BAR/123/2010','BAR/123/2010','2026-06-01','State of UP','Sunil Yadav & Others')");
            db.run("INSERT OR IGNORE INTO cases VALUES (10,'TA/220/2026','Sharma & Associates v. Income Tax Dept','Tax Appeal','Tax Dispute','Appeal against reassessment order under Section 147 of Income Tax Act. Disputed demand of Rs. 1.2 Crore for AY 2023-24.','Hearing Scheduled','8 Sep 2026','ITAT, Delhi','BAR/123/2010','9876543210','2026-07-15','Sharma & Associates','Income Tax Department')");
        }
    });

    // Audit Logs
    db.run(`CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        timestamp TEXT, 
        event_id TEXT, 
        role TEXT, 
        description TEXT
    )`);
    
    db.get('SELECT COUNT(*) as cnt FROM audit_logs', (err, row) => {
        if (row && row.cnt === 0) {
            db.run("INSERT INTO audit_logs (timestamp, event_id, role, description) VALUES ('13:42:01','SYS-990','Admin System','Daily DB Backup Completed Successfully.')");
            db.run("INSERT INTO audit_logs (timestamp, event_id, role, description) VALUES ('13:40:15','USR-AUTH','Adv. R. Desai','Bulk e-filing batch of 12 petitions submitted.')");
            db.run("INSERT INTO audit_logs (timestamp, event_id, role, description) VALUES ('13:38:22','SEC-WARN','Unknown IP','Failed login attempt (x5). IP Blocked for 30m.')");
            db.run("INSERT INTO audit_logs (timestamp, event_id, role, description) VALUES ('13:30:00','JUD-ACT','Hon. Justice Sharma','Signed and published order for CS/201/2026.')");
            db.run("INSERT INTO audit_logs (timestamp, event_id, role, description) VALUES ('13:25:10','CASE-FILE','Adv. K. Patel','New writ petition WP/3301/2026 filed successfully.')");
            db.run("INSERT INTO audit_logs (timestamp, event_id, role, description) VALUES ('13:20:00','SYS-HLT','System','Server health check passed. All services operational.')");
        }
    });

    // Documents
    db.run(`CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        case_id INTEGER, 
        filename TEXT, 
        doc_type TEXT, 
        uploaded_by TEXT, 
        upload_date TEXT
    )`);
    
    db.get('SELECT COUNT(*) as cnt FROM documents', (err, row) => {
        if (row && row.cnt === 0) {
            db.run("INSERT INTO documents VALUES (1,1,'Summons_Copy.pdf','Summons','Court','2026-08-10')");
            db.run("INSERT INTO documents VALUES (2,1,'FIR_Report.pdf','FIR','Police','2025-03-16')");
            db.run("INSERT INTO documents VALUES (3,2,'Property_Deed.pdf','Evidence','Petitioner','2024-06-22')");
            db.run("INSERT INTO documents VALUES (4,1,'Affidavit_Draft.pdf','Affidavit','Petitioner','2026-08-11')");
        }
    });

    // Payments
    db.run(`CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        case_id INTEGER, 
        user_id TEXT, 
        amount REAL, 
        description TEXT, 
        status TEXT, 
        payment_date TEXT
    )`);
    
    db.get('SELECT COUNT(*) as cnt FROM payments', (err, row) => {
        if (row && row.cnt === 0) {
            db.run("INSERT INTO payments VALUES (1,2,'9876543210',500,'Court Fee - PT/112/2024','Pending',NULL)");
            db.run("INSERT INTO payments VALUES (2,1,'9876543210',250,'Process Fee - CS/405/2025','Paid','2026-08-01')");
        }
    });

    // Hearings schedule
    db.run(`CREATE TABLE IF NOT EXISTS hearings (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        case_id INTEGER, 
        hearing_date TEXT, 
        hearing_time TEXT, 
        court_room TEXT, 
        hearing_type TEXT, 
        status TEXT
    )`);

    db.get('SELECT COUNT(*) as cnt FROM hearings', (err, row) => {
        if (row && row.cnt === 0) {
            db.run("INSERT INTO hearings VALUES (1,1,'2026-08-13','10:30 AM','Room 4, District Court Pune','Virtual','Scheduled')");
            db.run("INSERT INTO hearings VALUES (2,2,'2026-09-15','11:00 AM','Room 12, High Court Mumbai','Physical','Scheduled')");
            db.run("INSERT INTO hearings VALUES (3,3,'2026-08-20','02:00 PM','Room 7, Sessions Court Delhi','Physical','Scheduled')");
            db.run("INSERT INTO hearings VALUES (4,4,'2026-08-18','10:00 AM','Room 2, Family Court Delhi','Physical','Scheduled')");
            db.run("INSERT INTO hearings VALUES (5,5,'2026-08-25','11:30 AM','Room 1, High Court Mumbai','Virtual','Scheduled')");
        }
    });
});

// Helper for Logging Audit & Broadcasting Log
function logAudit(event_id, role, description) {
    const now = new Date();
    const ts = ('0'+now.getHours()).slice(-2)+':'+('0'+now.getMinutes()).slice(-2)+':'+('0'+now.getSeconds()).slice(-2);
    db.run('INSERT INTO audit_logs (timestamp, event_id, role, description) VALUES (?, ?, ?, ?)', [ts, event_id, role, description], function(err) {
        if (!err) {
            broadcastEvent('AUDIT_LOG', { id: this.lastID, timestamp: ts, event_id, role, description });
        }
    });
}

// ========== AUTH API ==========
app.post('/api/register', (req, res) => {
    const b = req.body;
    if (!b.username || !b.password || !b.role || !b.display_name) {
        return res.json({ success: false, message: 'All fields are required.' });
    }
    db.get('SELECT * FROM users WHERE username = ? AND role = ?', [b.username, b.role], (err, existing) => {
        if (existing) {
            return res.json({ success: false, message: 'An account with this ID already exists for this role.' });
        }
        db.run('INSERT INTO users (role, username, password, display_name) VALUES (?,?,?,?)',
            [b.role, b.username, b.password, b.display_name],
            function(err) {
                if (err) return res.json({ success: false, message: err.message });
                logAudit('USR-REG', b.display_name, 'New ' + b.role + ' account registered: ' + b.username);
                broadcastEvent('USER_REGISTERED', { display_name: b.display_name, role: b.role, username: b.username });
                res.json({ success: true, message: 'Registration successful! You can now log in.' });
            }
        );
    });
});

app.post('/api/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const role = req.body.role;
    db.get('SELECT * FROM users WHERE username = ? AND password = ? AND role = ?', [username, password, role], (err, row) => {
        if (row) {
            logAudit('USR-AUTH', row.display_name, 'Successful login by ' + username);
            res.json({ success: true, token: row.username, role: row.role, display_name: row.display_name });
        } else {
            logAudit('SEC-WARN', 'Unknown', 'Failed login attempt for ' + username);
            res.status(401).json({ success: false, message: 'Invalid credentials. Please check your ID and password.' });
        }
    });
});

// ========== CASES API ==========
app.get('/api/cases', (req, res) => {
    const role = req.query.role;
    const user = req.query.user;
    if (role === 'citizen') {
        db.all('SELECT * FROM cases WHERE assigned_to = ? OR petitioner LIKE ? ORDER BY id DESC', [user, '%'+user+'%'], (err, rows) => res.json(rows || []));
    } else if (role === 'advocate') {
        db.all('SELECT * FROM cases WHERE filed_by = ? ORDER BY id DESC', [user], (err, rows) => res.json(rows || []));
    } else {
        db.all('SELECT * FROM cases ORDER BY id DESC', (err, rows) => res.json(rows || []));
    }
});

app.get('/api/cases/:id', (req, res) => {
    db.get('SELECT * FROM cases WHERE id = ?', [req.params.id], (err, row) => {
        if (row) res.json({ success: true, data: row });
        else res.json({ success: false, message: 'Case not found' });
    });
});

app.get('/api/search', (req, res) => {
    const q = req.query.q || '';
    if (!q.trim()) return res.json({ success: false, message: 'Please enter a search term.' });
    const param = '%' + q.trim() + '%';
    db.all('SELECT * FROM cases WHERE cnr_number LIKE ? OR title LIKE ? OR petitioner LIKE ? OR respondent LIKE ? OR case_type LIKE ?', [param, param, param, param, param], (err, rows) => {
        if (rows && rows.length > 0) {
            logAudit('PUB-SEARCH', 'Guest', 'Searched: ' + q + ' (' + rows.length + ' results)');
            res.json({ success: true, results: rows });
        } else {
            res.json({ success: false, message: 'No cases found matching "' + q + '".' });
        }
    });
});

// File a new case (Broadcasting live update across all clients)
app.post('/api/cases', (req, res) => {
    const b = req.body;
    const cnr = b.case_type_prefix + '/' + Math.floor(1000 + Math.random() * 9000) + '/2026';
    const filingDate = new Date().toISOString().split('T')[0];
    
    db.run('INSERT INTO cases (cnr_number, title, case_type, category, description, status, next_hearing, court, filed_by, assigned_to, filing_date, petitioner, respondent) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [cnr, b.title, b.case_type, b.category, b.description, 'Just Filed', 'Pending Listing', b.court, b.user, b.user, filingDate, b.petitioner, b.respondent],
        function(err) {
            if (err) return res.json({ success: false, message: err.message });
            const caseId = this.lastID;
            const newCaseData = { id: caseId, cnr_number: cnr, title: b.title, case_type: b.case_type, category: b.category, description: b.description, status: 'Just Filed', next_hearing: 'Pending Listing', court: b.court, filed_by: b.user, assigned_to: b.user, filing_date: filingDate, petitioner: b.petitioner, respondent: b.respondent };
            
            logAudit('CASE-FILE', 'Advocate', 'New case filed: ' + cnr + ' - ' + b.title);
            broadcastEvent('CASE_FILED', newCaseData);
            res.json({ success: true, cnr_number: cnr, id: caseId });
        }
    );
});

// Update case status / Pass order (Broadcasting live update)
app.put('/api/cases/:id', (req, res) => {
    const status = req.body.status;
    db.run('UPDATE cases SET status = ? WHERE id = ?', [status, req.params.id], (err) => {
        db.get('SELECT * FROM cases WHERE id = ?', [req.params.id], (err2, updatedCase) => {
            logAudit('JUD-ACT', 'Judge', 'Updated case #' + req.params.id + ' status to ' + status);
            broadcastEvent('ORDER_PASSED', updatedCase || { id: req.params.id, status });
            res.json({ success: true });
        });
    });
});

// ========== DOCUMENTS API ==========
app.get('/api/documents', (req, res) => {
    const case_id = req.query.case_id;
    if (case_id) {
        db.all('SELECT * FROM documents WHERE case_id = ? ORDER BY id DESC', [case_id], (err, rows) => res.json(rows || []));
    } else {
        db.all('SELECT * FROM documents ORDER BY id DESC', (err, rows) => res.json(rows || []));
    }
});

app.post('/api/documents', (req, res) => {
    const b = req.body;
    const uploadDate = new Date().toISOString().split('T')[0];
    db.run('INSERT INTO documents (case_id, filename, doc_type, uploaded_by, upload_date) VALUES (?,?,?,?,?)',
        [b.case_id || 1, b.filename, b.doc_type, b.uploaded_by, uploadDate],
        function(err) {
            const docData = { id: this.lastID, case_id: b.case_id, filename: b.filename, doc_type: b.doc_type, uploaded_by: b.uploaded_by, upload_date: uploadDate };
            logAudit('DOC-UPL', b.uploaded_by, 'Uploaded ' + b.filename);
            broadcastEvent('DOCUMENT_UPLOADED', docData);
            res.json({ success: true, id: this.lastID });
        }
    );
});

// ========== PAYMENTS API ==========
app.get('/api/payments', (req, res) => {
    const user_id = req.query.user_id;
    db.all('SELECT p.*, c.cnr_number FROM payments p LEFT JOIN cases c ON p.case_id = c.id WHERE p.user_id = ? OR ? = "all" ORDER BY p.id DESC', [user_id, user_id], (err, rows) => res.json(rows || []));
});

app.post('/api/payments', (req, res) => {
    const b = req.body;
    const payDate = new Date().toISOString().split('T')[0];
    db.run('INSERT INTO payments (case_id, user_id, amount, description, status, payment_date) VALUES (?,?,?,?,?,?)',
        [b.case_id, b.user_id, b.amount, b.description, 'Paid', payDate],
        function(err) {
            const payData = { id: this.lastID, case_id: b.case_id, user_id: b.user_id, amount: b.amount, description: b.description, status: 'Paid', payment_date: payDate };
            logAudit('PAY-OK', b.user_id, 'Payment of Rs.' + b.amount + ' for ' + b.description);
            broadcastEvent('PAYMENT_SUCCESS', payData);
            res.json({ success: true, id: this.lastID });
        }
    );
});

app.put('/api/payments/:id/pay', (req, res) => {
    const payDate = new Date().toISOString().split('T')[0];
    db.run("UPDATE payments SET status = 'Paid', payment_date = ? WHERE id = ?", [payDate, req.params.id], (err) => {
        db.get('SELECT * FROM payments WHERE id = ?', [req.params.id], (err2, payRow) => {
            logAudit('PAY-OK', 'Citizen', 'Payment completed for payment #' + req.params.id);
            broadcastEvent('PAYMENT_SUCCESS', payRow || { id: req.params.id, status: 'Paid', payment_date: payDate });
            res.json({ success: true });
        });
    });
});

// ========== HEARINGS & E-COURT API ==========
app.get('/api/hearings', (req, res) => {
    const user = req.query.user;
    if (user) {
        db.all('SELECT h.*, c.cnr_number, c.title, c.petitioner, c.respondent, c.case_type FROM hearings h JOIN cases c ON h.case_id = c.id WHERE c.assigned_to = ? OR c.filed_by = ? ORDER BY h.hearing_date', [user, user], (err, rows) => res.json(rows || []));
    } else {
        db.all('SELECT h.*, c.cnr_number, c.title, c.petitioner, c.respondent, c.case_type FROM hearings h JOIN cases c ON h.case_id = c.id ORDER BY h.hearing_date', (err, rows) => res.json(rows || []));
    }
});

app.post('/api/hearings/start', (req, res) => {
    const { hearing_id, case_number, court_room } = req.body;
    logAudit('HEAR-START', 'Judge', 'Started virtual hearing for ' + case_number + ' in ' + court_room);
    broadcastEvent('HEARING_STARTED', { hearing_id, case_number, court_room, time: new Date().toLocaleTimeString('en-IN') });
    res.json({ success: true, message: 'Hearing session initiated' });
});

// ========== ANALYTICS API ==========
app.get('/api/analytics', (req, res) => {
    db.get('SELECT COUNT(*) as total FROM cases', (err, caseCount) => {
        db.get("SELECT COUNT(*) as pending FROM cases WHERE status != 'Order Passed' AND status != 'Dismissed'", (err2, pendingCount) => {
            db.all('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 20', (err3, logs) => {
                db.get("SELECT COUNT(*) as today FROM cases WHERE filing_date = ?", [new Date().toISOString().split('T')[0]], (err4, todayCount) => {
                    res.json({
                        totalCases: caseCount ? caseCount.total : 0,
                        pendingFilings: pendingCount ? pendingCount.pending : 0,
                        filedToday: todayCount ? todayCount.today : 0,
                        logs: logs || []
                    });
                });
            });
        });
    });
});

// ========== CATEGORIES API ==========
app.get('/api/categories', (req, res) => {
    res.json([
        { prefix: 'CS', name: 'Civil Suit', types: ['Property Dispute','Contract Breach','Recovery of Money','Specific Performance','Injunction','Declaratory Suit','Partition Suit'] },
        { prefix: 'CR', name: 'Criminal Case', types: ['Theft & Burglary','Fraud & Cheating','Assault','Cybercrime','Drug Offence','Murder','Domestic Violence'] },
        { prefix: 'WP', name: 'Writ Petition', types: ['Fundamental Rights','Habeas Corpus','Mandamus','Certiorari','Quo Warranto','PIL'] },
        { prefix: 'FC', name: 'Family Court', types: ['Divorce','Child Custody','Maintenance','Domestic Violence','Adoption','Guardianship'] },
        { prefix: 'LA', name: 'Labour Appeal', types: ['Wrongful Termination','Wage Dispute','Industrial Dispute','Workmen Compensation','ESIC/PF Dispute'] },
        { prefix: 'ARB', name: 'Arbitration', types: ['Commercial Dispute','Construction Dispute','Insurance Dispute','Partnership Dispute','International Arbitration'] },
        { prefix: 'TA', name: 'Tax Appeal', types: ['Income Tax','GST','Custom Duty','Property Tax','Service Tax'] },
        { prefix: 'MC', name: 'Misc. Application', types: ['Consumer Protection','Motor Accident Claim','Environmental','RTI Appeal','Election Petition'] },
        { prefix: 'BA', name: 'Bail Application', types: ['Regular Bail','Anticipatory Bail','Interim Bail','Default Bail'] }
    ]);
});

// ========== COURTS LIST API ==========
app.get('/api/courts', (req, res) => {
    res.json([
        { name: 'Supreme Court of India', location: 'New Delhi', judges: 34, pending: 79841 },
        { name: 'High Court of Delhi', location: 'New Delhi', judges: 45, pending: 112340 },
        { name: 'High Court of Bombay', location: 'Mumbai', judges: 71, pending: 234561 },
        { name: 'High Court of Madras', location: 'Chennai', judges: 58, pending: 189200 },
        { name: 'High Court of Karnataka', location: 'Bangalore', judges: 52, pending: 156780 },
        { name: 'High Court of Calcutta', location: 'Kolkata', judges: 42, pending: 201345 },
        { name: 'District Court, Pune', location: 'Pune', judges: 28, pending: 45210 },
        { name: 'Sessions Court, Delhi', location: 'Delhi', judges: 35, pending: 67890 },
        { name: 'Family Court, Delhi', location: 'Delhi', judges: 12, pending: 23456 },
        { name: 'Consumer Forum, Jaipur', location: 'Jaipur', judges: 8, pending: 12340 }
    ]);
});

server.listen(port, () => {
    console.log('====================================================');
    console.log('  🚀 Nyaya Setu Real-Time Server running locally!');
    console.log('  🌐 HTTP: http://localhost:' + port);
    console.log('  ⚡ WebSockets: ws://localhost:' + port + '/ws');
    console.log('  💾 SQLite Database: nyaya_setu.db (Persistent)');
    console.log('====================================================');
});
