<script>
    // Page metadata
    const lastUpdated = '01/01/2026';
    const appName = 'MCP Market Data';
    const contactEmail = 'joearchondis@gmail.com';
    const businessAddress = 'Paris, France';
    const websiteUrl = 'www.ark-market-data.arkhamides.com';
    const notificationMethod = 'email';

    // Sections
    const sections = [
        {
            title: '1. Introduction',
            content: `Welcome to ${appName}! Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our website and services.

By using our platform, you agree to the terms of this policy.`
        },
        {
            title: '2. What Information We Collect',
            content: `We may collect and store the following data:

- Account Information: Email address, username, and unique identifier (UUID).
- User-Generated Content: Messages, solutions, discussions, poll responses, task submissions.
- Connection & Chat Data: Connection requests, chat conversations, and related metadata.
- Activity Data: Votes, tasks you create, polls you participate in.
- Technical Information: IP address, browser type, device info, and usage analytics (via cookies or tools).`
        },
        {
            title: '3. How We Use Your Information',
            content: `We use your data to:

- Provide and operate the service.
- Facilitate community interactions like chats and votes.
- Enable task submissions and feedback.
- Improve performance and user experience.
- Prevent abuse and ensure platform security.`
        },
        {
            title: '4. Public vs. Private Data',
            content: `- Publicly Viewable: Some content like polls and discussions is visible to anyone.
- Restricted Access: Content such as chat messages and solutions is only accessible to participants, enforced through Row Level Security (RLS).
- Your Data, Your Control: You control what you submit and can request changes.`
        },
        {
            title: '5. Data Sharing',
            content: `We do not sell your personal data. We may share data with:

- Service providers (e.g., databases, analytics, authentication).
- Legal authorities if required.`
        },
        {
            title: '6. Data Retention',
            content: `We retain your data as long as needed to provide services and meet legal obligations. You can request deletion, subject to limits.`
        },
        {
            title: '7. Security',
            content: `We use industry-standard security practices including access controls like RLS. However, no system is 100% secure—share data wisely.`
        },
        {
            title: '8. Cookies & Analytics',
            content: `We may use cookies and third-party analytics (e.g., Google Analytics) to monitor usage. Manage cookies in your browser settings.`
        },
        {
            title: '9. Your Rights',
            content: `Depending on your location, you may:

- Access your data
- Request corrections or deletion
- Withdraw consent

Contact us at ${contactEmail} to exercise your rights.`
        },
        {
            title: '10. Changes to This Policy',
            content: `We may update this Privacy Policy as needed. We’ll notify users via ${notificationMethod}.`
        },
        {
            title: '11. Contact',
            content: `📧 Email: ${contactEmail}
🏢 Address: ${businessAddress}
🌍 Website: ${websiteUrl}`
        }
    ];
</script>

<svelte:head>
    <title>Privacy Policy — MCP Market Data</title>
    <meta name="description" content="MCP Market Data privacy policy — how we collect, use, and protect your information." />
</svelte:head>

<main class="max-w-3xl mx-auto px-6 py-12 text-gray-800">
    <h1 class="text-3xl font-bold mb-2">🛡️ Privacy Policy</h1>
    <p class="text-sm text-gray-500 mb-8">Last updated: {lastUpdated}</p>

    {#each sections as section}
        <section class="mb-8">
            <h2 class="text-xl font-semibold mb-2">{section.title}</h2>
            <p class="whitespace-pre-line leading-relaxed">{section.content}</p>
        </section>
    {/each}
</main>
