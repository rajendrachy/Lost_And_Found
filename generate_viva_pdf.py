import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#475569"))
        
        # Top Header line & text (on all pages after page 1)
        if self._pageNumber > 1:
            self.drawString(54, letter[1] - 36, "Lost and Found Platform (Sajha Khoj) — Viva & Defense Preparation Guide")
            self.drawRightString(letter[0] - 54, letter[1] - 36, "MERN Stack Application")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.75)
            self.line(54, letter[1] - 42, letter[0] - 54, letter[1] - 42)
        
        # Bottom Footer line & page numbers
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.75)
        self.line(54, 45, letter[0] - 54, 45)
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(54, 32, "Lost and Found Platform (Sajha Khoj) Project Defense Notes")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(letter[0] - 54, 32, page_text)
        self.restoreState()

def build_pdf(filename="Sajha_Khoj_Viva_Preparation_Guide.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=50,
        rightMargin=50,
        topMargin=50,
        bottomMargin=50
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Color Palette
    c_primary = colors.HexColor("#1E3A8A")       # Deep Royal Blue
    c_secondary = colors.HexColor("#0D9488")     # Emerald Teal
    c_accent = colors.HexColor("#EA580C")        # Amber / Orange
    c_dark = colors.HexColor("#0F172A")          # Slate 900
    c_body = colors.HexColor("#334155")          # Slate 700
    c_bg_card = colors.HexColor("#F8FAFC")       # Slate 50
    c_bg_blue = colors.HexColor("#EFF6FF")       # Blue 50
    c_bg_green = colors.HexColor("#F0FDF4")      # Green 50
    c_bg_amber = colors.HexColor("#FFFBEB")      # Amber 50
    c_border = colors.HexColor("#E2E8F0")        # Slate 200
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=c_primary,
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=c_secondary,
        spaceAfter=12
    )
    
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13.5,
        leading=17,
        textColor=c_primary,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14.5,
        textColor=c_secondary,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=c_body,
        spaceAfter=4
    )
    
    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.8,
        leading=12.5,
        textColor=c_body,
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=3
    )
    
    callout_style = ParagraphStyle(
        'Callout_Text',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.8,
        leading=12.5,
        textColor=c_dark
    )
    
    qa_q_style = ParagraphStyle(
        'QA_Q',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.2,
        leading=13,
        textColor=c_primary,
        spaceBefore=4,
        spaceAfter=2,
        keepWithNext=True
    )
    
    qa_a_style = ParagraphStyle(
        'QA_A',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.7,
        leading=12.2,
        textColor=c_body,
        leftIndent=10,
        spaceAfter=4
    )
    
    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.2,
        leading=11,
        textColor=c_dark
    )
    
    table_hdr_style = ParagraphStyle(
        'TableHdr',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.white
    )

    story = []
    
    def make_box(title, text, bg=c_bg_blue, border=c_primary):
        content = [
            Paragraph(f"<b>{title}</b>", ParagraphStyle('BTitle', fontName='Helvetica-Bold', fontSize=9.5, leading=13, textColor=border)),
            Spacer(1, 2),
            Paragraph(text, callout_style)
        ]
        t = Table([[content]], colWidths=[letter[0] - 100])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), bg),
            ('BOX', (0,0), (-1,-1), 1, border),
            ('PADDING', (0,0), (-1,-1), 6),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ]))
        return t

    # HEADER / TITLE
    story.append(Paragraph("Lost and Found Platform (Sajha Khoj)", title_style))
    story.append(Paragraph("Community Web Platform — Step-by-Step Viva & Defense Preparation Guide", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_primary, spaceBefore=0, spaceAfter=8))
    
    # SECTION 1: HOW TO INTRODUCE YOUR PROJECT IN VIVA
    story.append(Paragraph("1. How to Introduce Your Project (1-Minute Opening Pitch)", h1_style))
    pitch_text = (
        "<b>Examiner Prompt: 'Tell me about your project.'</b><br/>"
        "<i>'Respected examiner, our project is <b>Sajha Khoj</b> (Community Lost & Found Platform), a production-ready full-stack web application built using the <b>MERN Stack (MongoDB, Express, React, Node.js)</b>, Vite, Cloudinary, and Nodemailer.<br/>"
        "Traditional platforms like Facebook groups and bulletin boards suffer from high spam, privacy risks, and false claims. "
        "Sajha Khoj solves this fundamental trust issue through our signature <b>Double-Handshake Verification Workflow</b> — where claimants must submit private proof of ownership, finders review and approve the claim, and only verified parties exchange contact details.<br/>"
        "The platform also integrates a <b>gamified reputation system (Hero Points & Badges)</b>, an <b>intelligent Next Step Portal</b>, multi-parameter filtering, daily quota rate-limiting, and a dedicated <b>Admin Moderation Dashboard</b>.'</i>"
    )
    story.append(make_box("🎙️ 60-Second Perfect Viva Introduction", pitch_text, bg=c_bg_blue, border=c_primary))
    story.append(Spacer(1, 8))

    # SECTION 2: ARCHITECTURE & TECH STACK
    story.append(Paragraph("2. System Architecture & Technology Stack Breakdown", h1_style))
    story.append(Paragraph("The system follows a 3-tier decoupled Client-Server architecture with secure RESTful APIs.", body_style))
    
    tech_data = [
        [Paragraph("Layer / Area", table_hdr_style), Paragraph("Technology & Version", table_hdr_style), Paragraph("Role in Project & Technical Reason for Selection", table_hdr_style)],
        [Paragraph("<b>Frontend Framework</b>", table_cell_style), Paragraph("React.js 18.2 + Vite 4.2", table_cell_style), Paragraph("Component-based Single Page App (SPA). Vite provides sub-second HMR and instant builds compared to Webpack.", table_cell_style)],
        [Paragraph("<b>Client Routing</b>", table_cell_style), Paragraph("React Router DOM 6.10", table_cell_style), Paragraph("Client-side routing with protected route guards for Authenticated & Admin-only views.", table_cell_style)],
        [Paragraph("<b>Styling & Animation</b>", table_cell_style), Paragraph("Tailwind CSS + Framer Motion", table_cell_style), Paragraph("Utility-first responsive layouts with smooth micro-animations and page transitions.", table_cell_style)],
        [Paragraph("<b>State & HTTP</b>", table_cell_style), Paragraph("Context API + Axios 1.3", table_cell_style), Paragraph("Global Auth state management with Axios request interceptors automatically attaching JWT Bearer tokens.", table_cell_style)],
        [Paragraph("<b>Backend Server</b>", table_cell_style), Paragraph("Node.js 18+ & Express.js 4.18", table_cell_style), Paragraph("Fast, event-driven, non-blocking REST API server organized into clean MVC controllers & routes.", table_cell_style)],
        [Paragraph("<b>Database & ODM</b>", table_cell_style), Paragraph("MongoDB Atlas + Mongoose 7", table_cell_style), Paragraph("Document-based NoSQL database. Embedded sub-document schema handles claims and rewards with high read speed.", table_cell_style)],
        [Paragraph("<b>Authentication</b>", table_cell_style), Paragraph("JWT + bcryptjs (10 rounds)", table_cell_style), Paragraph("Stateless token-based authentication and secure salted one-way password hashing.", table_cell_style)],
        [Paragraph("<b>Image Cloud Storage</b>", table_cell_style), Paragraph("Multer 1.4 + Cloudinary SDK", table_cell_style), Paragraph("In-memory buffer upload streamed to Cloudinary CDN; MongoDB stores only the secure image URL.", table_cell_style)],
        [Paragraph("<b>Email Gateway</b>", table_cell_style), Paragraph("Nodemailer + Gmail SMTP", table_cell_style), Paragraph("Automated delivery of account activation links and time-limited password reset tokens.", table_cell_style)],
        [Paragraph("<b>API Security</b>", table_cell_style), Paragraph("Helmet + CORS + Rate Limiters", table_cell_style), Paragraph("Sets secure HTTP headers, restricts origin domains, and prevents brute-force / DDoS attacks.", table_cell_style)],
        [Paragraph("<b>Data Visualization</b>", table_cell_style), Paragraph("Recharts 3.8", table_cell_style), Paragraph("Renders administrative analytics for monthly item trends, category distribution, and recovery rates.", table_cell_style)],
    ]
    tech_table = Table(tech_data, colWidths=[110, 130, 272])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_card]),
        ('PADDING', (0,0), (-1,-1), 3.5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(tech_table)
    story.append(Spacer(1, 10))

    # SECTION 3: STEP-BY-STEP WORKFLOW (DOUBLE HANDSHAKE)
    story.append(Paragraph("3. Core Innovation: Double-Handshake Verification Workflow", h1_style))
    story.append(Paragraph("Examiners always ask about the core business logic. Explain this 6-step lifecycle clearly:", body_style))
    
    workflow_steps = [
        "<b>Step 1: Item Listing Creation</b> — A user posts a Lost or Found item with title, category, description, location, date, and image. Found items can specify optional reward details. The backend verifies daily posting limits (12 items/day for free users).",
        "<b>Step 2: Proof Submission (Claim)</b> — A claimant views the item and submits a private claim detailing non-public proof of ownership (e.g. engravings, invoice number, phone lock screen) and contact info.",
        "<b>Step 3: Finder Verification & Approval</b> — The finder reviews incoming claims in their dashboard. When they click 'Approve', the backend marks that claim as 'approved' and automatically marks competing pending claims as 'rejected'.",
        "<b>Step 4: Mutual Contact Reveal & Handover</b> — Only upon approval are phone numbers and emails unlocked so finder and claimant can coordinate a safe meetup.",
        "<b>Step 5: Owner Final Confirmation</b> — Once the owner physically receives the item, they click 'Confirm Recovery' (`/confirm-recovery`). The item status updates to 'resolved'.",
        "<b>Step 6: Gamification & Badge Reward</b> — The finder receives <b>+500 Hero Points</b>. The user model evaluates `checkAndAwardBadges()`, awarding tiered badges and triggering in-app celebration notifications."
    ]
    for step in workflow_steps:
        story.append(Paragraph(f"• {step}", bullet_style))
    
    story.append(Spacer(1, 6))
    story.append(make_box("💡 Viva Defense Advantage", 
        "<b>Why is this better than typical CRUD apps?</b> Most student projects use simple single-button deletes or status toggles. Sajha Khoj models real-world multi-party verification with state machines, role enforcement, and gamified incentives.",
        bg=c_bg_green, border=colors.HexColor("#16A34A")))
    story.append(Spacer(1, 10))

    # SECTION 4: DATABASE SCHEMAS & RELATIONSHIPS
    story.append(Paragraph("4. Database Schema Design & Relationships", h1_style))
    story.append(Paragraph("MongoDB NoSQL design balances relational references with high-performance embedded subdocuments:", body_style))
    
    story.append(Paragraph("<b>1. User Collection (`User.js`):</b>", h2_style))
    story.append(Paragraph("• <code>name, email</code> (unique, lowercase), <code>password</code> (bcrypt hash), <code>phone, role</code> (['user', 'admin']).", bullet_style))
    story.append(Paragraph("• <code>reputationPoints</code> (Number), <code>rating</code> (0-10), <code>totalResolved</code> (Number), <code>badges</code> (Array of subdocs: type, name, earnedAt).", bullet_style))
    story.append(Paragraph("• <code>plan</code> (['free', 'premium']), <code>itemsCreatedToday, itemsCreatedDate</code>, <code>planRequest</code> (status, message, adminResponse).", bullet_style))
    story.append(Paragraph("• <code>isVerified</code> (Boolean), <code>verificationToken</code>, <code>resetToken, resetTokenExpiry</code>.", bullet_style))
    
    story.append(Paragraph("<b>2. Item Collection (`Item.js`):</b>", h2_style))
    story.append(Paragraph("• <code>type</code> (['lost', 'found']), <code>title, description, category, location, date, image</code> (Cloudinary URL).", bullet_style))
    story.append(Paragraph("• <code>poster</code> (ObjectId ref -> User), <code>status</code> (['active', 'resolved']), <code>returnedBy</code> (ref -> User), <code>confirmedByOwner</code> (Boolean).", bullet_style))
    story.append(Paragraph("• <code>claims</code> (Embedded Sub-document Array): <code>user</code> (ref), <code>message, phone, email, status</code> (['pending', 'approved', 'rejected']).", bullet_style))
    story.append(Paragraph("• <code>reward</code> (Embedded Sub-document): <code>amount, currency</code> ('NPR'), <code>description, claimed</code> (Boolean), <code>claimedBy</code> (ref).", bullet_style))

    story.append(Paragraph("<b>3. Notification & Support Report Collections:</b>", h2_style))
    story.append(Paragraph("• <code>Notification.js</code>: <code>recipient, sender, item, type</code> ('claim', 'approval', 'reward', 'badge', 'handshake'), <code>message, isRead</code>.", bullet_style))
    story.append(Paragraph("• <code>Report.js</code>: <code>subject, category, message, userId, status</code> ('pending', 'resolved').", bullet_style))
    story.append(Spacer(1, 10))

    # SECTION 5: GAMIFICATION ENGINE
    story.append(Paragraph("5. Gamification & Reputation Engine Details", h1_style))
    badge_data = [
        [Paragraph("Badge Name", table_hdr_style), Paragraph("Tier", table_hdr_style), Paragraph("Items Resolved", table_hdr_style), Paragraph("Badge Significance", table_hdr_style)],
        [Paragraph("First Find", table_cell_style), Paragraph("Bronze", table_cell_style), Paragraph("1 item", table_cell_style), Paragraph("Welcoming milestone for new community finders.", table_cell_style)],
        [Paragraph("Rising Hero", table_cell_style), Paragraph("Bronze", table_cell_style), Paragraph("5 items", table_cell_style), Paragraph("Demonstrates active participation and reliable returns.", table_cell_style)],
        [Paragraph("Community Helper", table_cell_style), Paragraph("Silver", table_cell_style), Paragraph("10 items", table_cell_style), Paragraph("Double-digit verified item returns.", table_cell_style)],
        [Paragraph("Trusted Finder", table_cell_style), Paragraph("Silver", table_cell_style), Paragraph("25 items", table_cell_style), Paragraph("High credibility marker across the local area.", table_cell_style)],
        [Paragraph("Hero Award", table_cell_style), Paragraph("Gold", table_cell_style), Paragraph("50 items", table_cell_style), Paragraph("Core community pillar and high-reputation citizen.", table_cell_style)],
        [Paragraph("Super Hero", table_cell_style), Paragraph("Gold", table_cell_style), Paragraph("100 items", table_cell_style), Paragraph("Centurion resolver with master-level trust.", table_cell_style)],
        [Paragraph("Legend", table_cell_style), Paragraph("Platinum", table_cell_style), Paragraph("200 items", table_cell_style), Paragraph("Top-tier hall-of-fame community contributor.", table_cell_style)],
        [Paragraph("Master", table_cell_style), Paragraph("Diamond", table_cell_style), Paragraph("500 items", table_cell_style), Paragraph("Supreme platform master.", table_cell_style)],
    ]
    badge_table = Table(badge_data, colWidths=[95, 65, 95, 257])
    badge_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_secondary),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_card]),
        ('PADDING', (0,0), (-1,-1), 3),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(badge_table)
    story.append(Spacer(1, 10))

    # SECTION 6: SECURITY & PRIVACY
    story.append(Paragraph("6. Security, Rate Limiting & Data Privacy Architecture", h1_style))
    sec_points = [
        "<b>Password Encryption (bcryptjs):</b> Salts (10 rounds) and one-way hashes prevent exposure even in case of database leakage.",
        "<b>Stateless JWT Bearer Auth:</b> Tokens signed with a secret key expire automatically; validated via backend <code>protect</code> middleware.",
        "<b>Private Proof Shielding:</b> Contact information and sensitive proof messages are hidden until the finder explicitly approves a claim.",
        "<b>Multi-Tier Rate Limiting:</b> <code>express-rate-limit</code> shields authentication routes against brute-force attacks and item creation against flooding.",
        "<b>Daily Quota Enforcement:</b> User schema tracks <code>itemsCreatedToday</code> and automatically resets at midnight to prevent bot spam.",
        "<b>HTTP Protection (Helmet + CORS):</b> Secures against XSS, clickjacking, MIME sniffing, and cross-origin domain forging."
    ]
    for sp in sec_points:
        story.append(Paragraph(f"• {sp}", bullet_style))
    story.append(Spacer(1, 10))

    # SECTION 7: 35+ DETAILED VIVA QUESTIONS & MODEL ANSWERS
    story.append(Paragraph("7. Master Viva Questions & Model Answers (Categorized)", h1_style))
    story.append(Paragraph("Study these categorized questions thoroughly. They represent 95%+ of questions asked by external examiners.", body_style))
    story.append(Spacer(1, 4))

    viva_qa = [
        # Domain 1: Project Concept & Real World Value
        ("1. What problem does Sajha Khoj solve in society?",
         "Physical lost-and-found desks are localized and inefficient. Social media posts get lost in algorithm feeds and expose owners to scammers. Sajha Khoj provides a centralized, searchable database with private proof verification to ensure lost goods reach their rightful owners safely."),
        
        ("2. Who are the primary stakeholders / users of this system?",
         "There are 3 main user groups: (1) Finders who discover lost items and want to safely return them; (2) Claimants/Owners seeking lost possessions; (3) Platform Admins who oversee moderation, verify users, and manage plan upgrades."),

        ("3. What is the significance of the Nepali name 'Sajha Khoj'?",
         "'Sajha Khoj' translates to 'Shared Search' (साझा खोज), reflecting our core mission of collaborative community search and civic responsibility in Nepal."),

        # Domain 2: Frontend & React Mechanics
        ("4. Why React 18 for the user interface?",
         "React provides component reusability, virtual DOM for high rendering performance, declarative UI state, and seamless integration with libraries like Framer Motion for animations and Recharts for analytics."),

        ("5. How does React's Virtual DOM improve performance?",
         "When state changes, React creates a new Virtual DOM tree, calculates the minimal difference (diffing algorithm) against the previous tree, and batches updates to the real DOM (reconciliation), preventing expensive full-page re-renders."),

        ("6. Explain how AuthContext works in your frontend.",
         "`AuthContext.jsx` wraps the entire application using React's Context API. It stores the active `user` object and `token`. When a user logs in, `login(token, userData)` stores the token in `localStorage` and updates global state; all components re-render accordingly."),

        ("7. What is an Axios Interceptor and why is it used?",
         "In `src/api.js`, an Axios request interceptor intercepts every outgoing HTTP request and automatically attaches `Authorization: Bearer <token>` from `localStorage`, ensuring authenticated endpoints receive tokens without repeating code in every component."),

        ("8. How are Protected Routes implemented in React Router v6?",
         "`PrivateRoute` checks if `user` is logged in. If authenticated, it renders `<Outlet />` or the child component; otherwise, it redirects to `/login`. For Admin routes, it also verifies `user.role === 'admin'`."),

        ("9. What is the role of the 'Next Step Portal' component?",
         "`NextStepPortal.jsx` is a floating smart action hub. It evaluates pending items, unapproved claims, and actionable notifications, prompting the user with one-click navigation to their most urgent task."),

        # Domain 3: Backend & REST API
        ("10. Why Node.js and Express for the backend?",
         "Node.js uses a single-threaded, event-driven, non-blocking asynchronous I/O model based on the V8 engine, making it lightweight and highly scalable for I/O-heavy web services like REST APIs."),

        ("11. Explain the MVC (Model-View-Controller) architecture in your backend.",
         "Our backend separates concerns into: (1) Models (`models/*.js` - schema & DB rules), (2) Controllers (`controllers/*.js` - business logic), (3) Routes (`routes/*.js` - URL routing & middleware binding). The View is decoupled and served by React."),

        ("12. What is Middleware in Express? Name three you used.",
         "Middleware functions intercept incoming HTTP requests before reaching the controller. Examples: `protect` (verifies JWT), `isAdmin` (checks admin role), `upload.single('image')` (Multer file parser), and `express-validator` (sanitizes inputs)."),

        ("13. How does Multer handle image uploads without filling server disk space?",
         "We use `multer.memoryStorage()`, which keeps the incoming image buffer temporarily in RAM instead of writing to disk. The buffer is immediately streamed to Cloudinary CDN via `upload_stream`, keeping the backend server stateless and clean."),

        ("14. How does password hashing with bcryptjs prevent rainbow table attacks?",
         "Bcrypt uses a work-factor salt (10 rounds in our app). Each salt is uniquely generated, meaning identical passwords produce completely different hash outputs, making pre-computed rainbow table dictionaries useless."),

        # Domain 4: Database & Mongoose
        ("15. Why did you choose MongoDB over a SQL database like PostgreSQL/MySQL?",
         "MongoDB's JSON-like document structure naturally models nested items, claim histories, and reward objects as embedded arrays. It offers schema flexibility, fast write performance, and painless cloud scaling with MongoDB Atlas."),

        ("16. When do you use Embedding vs. Referencing in MongoDB?",
         "We embed `claims` inside `Item` because claims are always queried with the item and have an 1-to-few relationship. We reference `poster` (User ObjectId) because users exist independently and have extensive personal profiles."),

        ("17. What is the purpose of Mongoose `.populate()`?",
         "`.populate('poster', 'name email phone')` acts like a SQL JOIN, dynamically replacing the stored User ObjectId with the actual matching user document's selected fields during query execution."),

        ("18. What are Mongoose Schema Pre-save Hooks?",
         "`userSchema.pre('save', ...)` runs automatically before saving a document. We use it to hash modified passwords and check badge qualification thresholds before committing changes."),

        # Domain 5: Security & Verification
        ("19. How does JWT authentication work from start to finish?",
         "(1) User sends email/password to `/api/auth/login`; (2) Server validates credentials and signs a JWT containing `{ id, role }` using `JWT_SECRET`; (3) Client stores JWT and sends it in `Bearer` header; (4) Server's `protect` middleware decodes and verifies the token on private requests."),

        ("20. How is email verification implemented?",
         "Upon registration, a cryptographic token is generated, stored in `user.verificationToken`, and emailed as an activation link via Nodemailer. Clicking the link calls `/api/auth/verify/:token`, flipping `isVerified = true`."),

        ("21. How do you prevent users from submitting claims on their own items?",
         "In `submitClaim`, the controller executes `if (item.poster.toString() === req.user.id) return res.status(400).json({ msg: 'You cannot claim your own item.' })`."),

        ("22. How are concurrent or fake claims rejected?",
         "When a finder approves a valid claim in `verifyClaim`, all other pending claims on that item are atomically updated to `status: 'rejected'`, and the item status flips to 'resolved'."),

        # Domain 6: Advanced & Future Scope
        ("23. What is the difference between Free and Premium subscription plans?",
         "Free plan users can post up to 12 items daily. Premium users have unlimited postings. Users apply for an upgrade via `/plan`, and administrators review and approve requests in the Admin Dashboard."),

        ("24. How does the system handle Rate Limiting?",
         "Using `express-rate-limit`, we throttle API endpoints (e.g. max 5 login attempts per 15 minutes, daily item creation caps) to prevent brute-force login attacks and spamming."),

        ("25. If the platform scales to 1,000,000 items, what optimizations would you introduce?",
         "1) Database compound indexes on `{ category: 1, location: 1, status: 1 }`; 2) Redis caching for frequent feed queries; 3) CDN edge caching for Cloudinary media; 4) ElasticSearch for fuzzy text matching; 5) Kafka for async notification processing.")
    ]

    for q, a in viva_qa:
        story.append(Paragraph(f"<b>{q}</b>", qa_q_style))
        story.append(Paragraph(a, qa_a_style))
        story.append(Spacer(1, 1.5))
    
    story.append(Spacer(1, 8))

    # SECTION 8: EXAMINER TRAP QUESTIONS & HOW TO ANSWER
    story.append(Paragraph("8. Examiner 'Trap Questions' & Smart Responses", h1_style))
    trap_data = [
        [Paragraph("Trap Question", table_hdr_style), Paragraph("Why Examiner Asks It", table_hdr_style), Paragraph("The Winning Answer Strategy", table_hdr_style)],
        [Paragraph("<i>'Is JWT stored in localStorage safe from XSS?'</i>", table_cell_style), 
         Paragraph("Tests knowledge of web security vulnerabilities.", table_cell_style), 
         Paragraph("Acknowledge: <i>'While localStorage is accessible via JavaScript (XSS risk), we sanitize inputs with express-validator and set CSP headers with Helmet. For banking-grade security, httpOnly SameSite cookies can be used as a next iteration.'</i>", table_cell_style)],
        [Paragraph("<i>'Why not use WebSockets for notifications?'</i>", table_cell_style), 
         Paragraph("Tests architectural trade-off reasoning.", table_cell_style), 
         Paragraph("Answer: <i>'For our current user load, REST-based polling with DB notifications keeps the server lightweight and stateless. Socket.io is earmarked for our next phase alongside real-time chat.'</i>", table_cell_style)],
        [Paragraph("<i>'What happens if two people claim the same lost item?'</i>", table_cell_style), 
         Paragraph("Tests your Double-Handshake understanding.", table_cell_style), 
         Paragraph("Answer: <i>'Both claims sit in 'pending' status with their private proof messages. The finder inspects both proofs, selects the genuine owner, and clicking Approve automatically rejects the rival claim.'</i>", table_cell_style)]
    ]
    trap_table = Table(trap_data, colWidths=[130, 110, 272])
    trap_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_accent),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_amber]),
        ('PADDING', (0,0), (-1,-1), 3.5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(trap_table)
    story.append(Spacer(1, 10))

    # SECTION 9: DEMO & PRESENTATION CHECKLIST
    story.append(Paragraph("9. Live Project Demo Walkthrough Checklist", h1_style))
    demo_steps = [
        "<b>1. Registration & Verification:</b> Register a new user (`finder@test.com`) and show the verification email / direct activation.",
        "<b>2. Post Found Item:</b> Post a found item (e.g. 'Blue Leather Wallet at Kathmandu Mall') with image and a 500 NPR reward.",
        "<b>3. Post Lost Item:</b> Switch accounts or show explore search and filter by category ('Electronics') and location.",
        "<b>4. Submit Claim:</b> From a second account (`owner@test.com`), submit a claim with specific proof ('Has student ID ending in 402').",
        "<b>5. Finder Approval:</b> Log back into the finder account, show the private claim in dashboard, and click 'Approve Claim'.",
        "<b>6. Confirm Recovery:</b> Log into claimant account, click 'Confirm Recovery'. Show the item transitioning to 'Resolved'.",
        "<b>7. Badges & Hero Points:</b> Open the finder's profile and show +500 Hero Points and newly unlocked badges ('First Find' / 'Rising Hero').",
        "<b>8. Admin Dashboard:</b> Log in with admin credentials, show platform Recharts analytics, user approval table, and plan upgrade requests."
    ]
    for ds in demo_steps:
        story.append(Paragraph(f"• {ds}", bullet_style))
    story.append(Spacer(1, 10))

    # SECTION 10: VIVA DO'S AND DON'TS
    story.append(Paragraph("10. Golden Rules for Viva Day (Do's & Don'ts)", h1_style))
    story.append(Paragraph("• <b>DO:</b> Speak clearly and confidently. Focus on *why* you built features, not just *what* they do.", bullet_style))
    story.append(Paragraph("• <b>DO:</b> Highlight the 'Double-Handshake Verification' — it's your primary unique selling point (USP).", bullet_style))
    story.append(Paragraph("• <b>DO:</b> Keep local servers running in the background (`npm run dev` on both frontend and backend) with MongoDB Atlas connected.", bullet_style))
    story.append(Paragraph("• <b>DON'T:</b> Say 'I don't know' abruptly. Instead, say: <i>'In our current implementation, we handle this via X; however, a great approach to optimize this would be Y.'</i>", bullet_style))
    story.append(Paragraph("• <b>DON'T:</b> Blame team members or tools if an error occurs. Stay calm, check terminal logs or browser DevTools console, and explain the troubleshooting step.", bullet_style))

    # Build the document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF Successfully generated at: {filename}")

if __name__ == '__main__':
    build_pdf(r"f:\Sajha_Khoj\Sajha_Khoj_Viva_Preparation_Guide.pdf")
