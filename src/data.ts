import { ServiceItem, ServiceProduct } from './types';

export const COMPLIANCE_DATA = {
  agencyName: "Mavrick Web Development",
  parentCompany: "Maverick Enterprises",
  proprietor: "Shubham Yadav",
  address: "Bukhara, Near Bakli Fatak, Bijnor, Uttar Pradesh – 246701, India",
  gstin: "09ARGPY8862M1ZL",
  udyam: "UDYAM-UP-17-0066034",
  email: "himavrickdevloper@gmail.com",
};

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'web',
    title: 'Custom Web Applications',
    description: 'Architecting lightning-fast React, Next.js, and specialized web ecosystems. Optimized for 100% Lighthouse scores, secure client-to-server data syncing, and premium consumer-facing product interfaces.',
    features: [
      'React & Next.js Core Architecture',
      '100% Lighthouse & Performance Optimization',
      'Secure Client-to-Server State Synced Layers',
      'Ultra-fluid Interactive Animations'
    ]
  },
  {
    id: 'mobile',
    title: 'Mobile App Development',
    description: 'Building high-fidelity native iOS and Android experiences using industry-standard cross-platform performance engines. Impeccable native performance, offline-first caching mechanisms, and complete device hardware utilization.',
    features: [
      'React Native & Flutter Performance Architectures',
      'Immersive 60FPS UI & Interactive Transitions',
      'Offline-First Local Storage Sync Engines',
      'Advanced Sensor and Security Integrations'
    ]
  },
  {
    id: 'automation',
    title: 'Custom Workflow Automation',
    description: 'Developing unified backend APIs, automating complex enterprise processes, and orchestrating internal administration systems that bridge software dependencies cleanly into robust user interfaces.',
    features: [
      'Tailor-made Backend API Microservices',
      'Automated Third-Party Pipeline Bridges',
      'Interactive Custom Admin Workspaces',
      'Robust Client Database Optimizations'
    ]
  }
];

export const PRODUCTS_DATA: ServiceProduct[] = [
  {
    id: 'starter-mobile',
    title: 'Starter Mobile App Development Blueprint',
    tagline: 'Custom cross-platform MVP layout',
    description: 'A foundational mobile application blueprint engineered for startups and businesses aiming to establish a cross-platform presence. Delivered with a clean, scalable architecture ready for market validation.',
    deliverables: [
      'Cross-platform MVP codebase (React Native)',
      'Core UI/UX screen flow (up to 5 screens)',
      'Basic navigation & state management',
      'Project documentation & handoff guide',
    ],
    price: 20000,
    iconName: 'Smartphone',
  },
  {
    id: 'premium-react',
    title: 'Premium React/Next.js Business Architecture',
    tagline: 'Complete full-stack deployment',
    description: 'A production-grade React or Next.js full-stack architecture tailored for business applications. Includes server-side rendering, API integration, and one-click deployment pipeline.',
    deliverables: [
      'Full Next.js or React project scaffold',
      'Custom component library',
      'Server-side rendering & routing setup',
      'Vercel/cloud deployment configuration',
    ],
    price: 25000,
    iconName: 'Globe',
  },
  {
    id: 'workflow-automation',
    title: 'Custom Tailor-Made Workflow Automation',
    tagline: 'API & webhook orchestrations',
    description: 'Bespoke automation pipelines connecting your tools, APIs, and business logic. Eliminate manual overhead with secure, event-driven orchestrations built to your exact specifications.',
    deliverables: [
      'Custom API integration architecture',
      'Webhook event-driven orchestration',
      'Admin dashboard for flow monitoring',
      'Error handling & logging infrastructure',
    ],
    price: 25000,
    iconName: 'Workflow',
  },
  {
    id: 'enterprise-analytics',
    title: 'Enterprise Analytics & Dashboard Portal',
    tagline: 'High-performance metrics setup',
    description: 'A premium analytics dashboard built for data-driven decision-making. Visualize complex metrics with real-time charts, export capabilities, and role-based access control.',
    deliverables: [
      'Real-time data visualization dashboard',
      'Custom KPI metric tracking modules',
      'CSV/PDF export functionality',
      'Role-based user access controls',
    ],
    price: 25000,
    iconName: 'BarChart3',
  },
  {
    id: 'saas-landing',
    title: 'High-Conversion SaaS Landing Experience',
    tagline: 'Apple-style minimalist UI',
    description: 'A conversion-optimized SaaS landing page with meticulous typography, fluid micro-interactions, and premium visual hierarchy. Built to maximize sign-ups and reduce bounce rates.',
    deliverables: [
      'Pixel-perfect responsive landing page',
      'Conversion-optimized layout & copy grid',
      'Smooth scroll-triggered animations',
      'SEO metadata & Open Graph integration',
    ],
    price: 15000,
    iconName: 'Layout',
  },
  {
    id: 'fullstack-mvp',
    title: 'Full-Stack MVP Product Engineering',
    tagline: 'Database, backend, and frontend logic',
    description: 'End-to-end MVP engineering covering database schema design, RESTful API development, and a polished frontend. Ideal for founders needing a shippable product in weeks.',
    deliverables: [
      'PostgreSQL/MySQL database schema',
      'RESTful API with authentication',
      'React/Next.js frontend integration',
      'Staging deployment & demo environment',
    ],
    price: 25000,
    iconName: 'Box',
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Infrastructure Integration',
    tagline: 'Secure cart & catalog systems',
    description: 'A secure, scalable e-commerce foundation with product catalog management, shopping cart logic, payment gateway integration, and order tracking dashboards.',
    deliverables: [
      'Product catalog & inventory management',
      'Shopping cart & checkout flow',
      'Payment gateway integration',
      'Order tracking admin dashboard',
    ],
    price: 25000,
    iconName: 'ShoppingCart',
  },
  {
    id: 'api-framework',
    title: 'Dedicated API Framework Architecture',
    tagline: 'Scalable backend microservices',
    description: 'A robust, production-ready API framework built with Node.js or Python. Includes rate limiting, caching layers, comprehensive documentation, and automated test coverage.',
    deliverables: [
      'Modular microservice architecture',
      'API rate limiting & caching layer',
      'OpenAPI/Swagger documentation',
      'Automated integration test suite',
    ],
    price: 25000,
    iconName: 'Server',
  },
];

export const TERMS_VERBATIM = `Terms and Conditions
Last Updated: June 16, 2026

Welcome to Mavrick Web Development (accessible via our official domain and temporary staging links). These Terms and Conditions govern your use of our website and the custom software development services provided by Maverick Enterprises ("Company", "We", "Us", or "Our"), owned and operated by Proprietor Shubham Yadav, with its registered office at Bukhara, Near Bakli Fatak, Bijnor, Uttar Pradesh – 246701, India.

By accessing our website, inquiring about our services, or signing a project agreement, you agree to comply with and be bound by these Terms.

1. Scope of Services
Mavrick Web Development is a specialized digital agency that designs and develops custom websites, mobile applications, web applications, and tailor-made workflow automations ("Services") for business partners and clients. Every project is unique and custom-built according to the specific Statement of Work (SOW) or invoice agreed upon with the client.

2. Milestone-Based Execution & Payments
- Tailor-Made Solutions: Because our services are highly customized, projects are executed in defined phases or milestones (e.g., UI/UX design, frontend development, backend integration, testing).
- Invoicing & Fees: Clients agree to pay the fees specified in the respective project invoices or service agreements. Payments are processed securely via our integrated payment gateway partners.
- Approval of Milestones: Upon completion of a milestone, the client is required to review and approve the work. Progression to the next phase is contingent upon milestone approval and clearance of the corresponding payment.

3. Intellectual Property
Upon final clearance of all dues and project completion, the ownership of the custom source code, design assets, and application deliverables will be transferred to the client, unless specified otherwise in a separate written agreement. Maverick Enterprises retains the right to display the completed work in its portfolio and marketing case studies.

4. Client Responsibilities
The client must provide timely feedback, assets, API keys, content, and credentials necessary for project execution. We are not responsible for project delays caused by a client’s failure to provide required information.

5. Limitation of Liability
In no event shall Maverick Enterprises, its proprietor Shubham Yadav, or its developers be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from any system bugs, server downtime, system failures, or errors in the delivered custom software. Our maximum aggregate liability for any claim arising out of these Terms or our services shall be strictly limited to, and not exceed, the total invoice amount actually paid by the client under the specific Statement of Work (SOW) related to the dispute.

6. Contact and Queries
If you have any questions or require clarifications regarding these Terms and Conditions, please contact us at our official support number: +91 9027579170 or email: himavrickdevloper@gmail.com.

7. Governing Law & Jurisdiction
These terms shall be governed by and construed in accordance with the laws of India. Any legal disputes, claims, or proceedings arising out of or in connection with our services shall be subject to the exclusive jurisdiction of the courts located in Bijnor, Uttar Pradesh, India.`;

export const PRIVACY_VERBATIM = `Privacy Policy
Last Updated: June 16, 2026

At Mavrick Web Development (a unit of Maverick Enterprises), we are committed to protecting the privacy of our clients and website visitors. This Privacy Policy outlines how we collect, use, and safeguard your information.

1. Information We Collect
We only collect information necessary to communicate, scope custom projects, and process transactions. This includes:
- Contact Information: Name, business name, email address, and phone number when you fill out an inquiry form.
- Project Requirements: Wireframes, custom flow details, and business logistics shared during scoping.
- Billing Details: Financial information required for payment processing, which is handled directly by our secure payment gateway partner.

2. How We Use Your Information
We use the collected data strictly to:
- Deliver, test, and deploy your custom web applications and custom flows.
- Provide customer support and project updates.
- Process secure transactions through our billing partner.

3. Data Security & Third-Party Sharing
We employ strict technical measures to safeguard your source code and business data. We never sell, rent, or share your personal or business data with third parties for marketing purposes.

All financial transactions are safely encrypted and securely processed. We do not store credit card, debit card, or banking credentials on our local servers. For any privacy-related concerns or data inquiries, you can reach us at himavrickdevloper@gmail.com.

4. Cookies and Data Rights
Our website uses cookies to analyze web traffic, optimize performance, and personalize your visual experience. These cookies do not store any sensitive personal credentials or banking data. Furthermore, you hold full data rights over your personal contact information collected by us. You have the right to request access to, correction of, or permanent deletion of your personal contact details stored in our databases at any time simply by emailing our support desk at himavrickdevloper@gmail.com.`;

export const REFUND_VERBATIM = `Refund and Cancellation Policy
Last Updated: June 16, 2026

Thank you for partnering with Mavrick Web Development (operated under Maverick Enterprises). As a professional service agency delivering 100% tailor-made software solutions, apps, and custom business flows, our refund policy is governed by the specialized nature of our work.

1. Project Cancellation
- Before Commencement: A client can request cancellation of a project within 24 hours of making an initial advance payment, provided that work, research, or resource allocation has not yet commenced.
- Mid-Project Cancellation: Clients may pause or cancel further development at any stage. However, cancellation will apply only to future, unexecuted milestones.

2. Refund Terms for Tailor-Made Services
- Non-Refundable Work: Because engineering hours, UI/UX designs, and custom backend flows are built uniquely to order, no refunds will be issued for completed milestones or approved phases of development.
- Unstarted Milestones: If a project is cancelled mid-way by mutual agreement, any advance funds holding for a milestone that has not been started will be evaluated for a partial or full refund.

3. Refund Processing
- Approved refund requests are processed and initiated on our end within 5 to 7 working days from the date the cancellation agreement is finalized.
- All refunds will be credited automatically to the client's original payment method used during the transaction via our secure payment gateway partner. Please note that depending on your banking institution, it may take an additional 2-3 working days for the credit to reflect in your account.

4. Service Delivery & Shipping Timeline
- Service Delivery: Since Mavrick Web Development specializes exclusively in custom digital solutions, custom software, app blueprints, and workflow automation, there are no physical products to be packaged or shipped. NO PHYSICAL SHIPPING IS INVOLVED.
- Digital Transmission: All deliverables, customized source code directories, databases, and application packages are handled 100% digitally. Deliverables are securely provisioned and deployed via secure cloud staging environments, private version control repositories (such as GitHub), or directly hosted on the client's authorized servers.
- Timeline: Development milestones and digital delivery timelines are specified under the project's Statement of Work (SOW) or invoice. Upon approval of the final milestone, digital credentials or source code access is shared with the client within 24 to 48 hours of clearing the respective invoice balance.

For cancellation or refund claims, please drop an official request to himavrickdevloper@gmail.com.`;
