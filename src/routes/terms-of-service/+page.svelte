<script>
    const lastUpdated = '22/02/2026';
    const appName = 'Ark Market Data';
    const contactEmail = 'joearchondis@gmail.com';
    const companyAddress = 'Paris, France';
    const websiteUrl = 'www.ark-market-data.com';
    const governingRegion = 'Paris';
    const governingCountry = 'France';
    const updateNotifyMethod = 'email';

    const sections = [
        {
            title: '1. Who Can Use the Service',
            content: `To use our platform, you must:

- Be at least 16 years old (or the age of digital consent in your region)
- Agree to these Terms and our Privacy Policy
- Create an account with accurate, up-to-date information if required`
        },
        {
            title: '2. User Responsibilities',
            content: `You agree to:

- Use the platform lawfully and respectfully
- Not impersonate others or misrepresent your identity
- Not harass, abuse, or harm other users
- Not post spam, malicious code, or otherwise disrupt the system
- Respect content ownership—yours and others’`
        },
        {
            title: '3. User Content',
            content: `You may submit content such as messages, chats, solutions, votes, discussions, and more ("User Content"). You retain ownership of your content, but grant us a limited license to display and store it as needed.

We reserve the right to remove content that violates these Terms or applicable laws.`
        },
        {
            title: '4. Privacy',
            content: `Your privacy matters. Please see our Privacy Policy to understand how we collect, use, and share your information.

Some content is public (e.g., polls), while other content is private and viewable only by authorized users. Access is governed by strict technical controls.`
        },
        {
            title: '5. Account and Security',
            content: `You're responsible for maintaining the confidentiality of your login credentials. Notify us immediately if you suspect unauthorized use.

We may suspend or terminate your account if you breach these Terms.`
        },
        {
            title: '6. Modifications to the Service',
            content: `We’re always improving the platform and may change or remove features. We'll do our best to notify you ahead of significant changes.`
        },
        {
            title: '7. Termination',
            content: `You may stop using our Services at any time. We may suspend or terminate your access if:

- You violate these Terms
- We are required to by law
- There are technical or security issues`
        },
        {
            title: '8. Disclaimers',
            content: `The Services are provided “as-is” and “as available.” We do not guarantee uninterrupted or error-free access. Your use of the platform is at your own risk.`
        },
        {
            title: '9. Limitation of Liability',
            content: `To the extent permitted by law, we are not liable for:

- Indirect, incidental, or consequential damages
- Loss of data, reputation, or profits
- Unauthorized access to your account or content`
        },
        // {
        //     title: '10. Governing Law',
        //     content: `These Terms are governed by the laws of ${governingCountry}. Disputes will be handled by the courts of ${governingRegion}.`
        // },
        {
            title: '10. Changes to These Terms',
            content: `We may update these Terms. We'll notify you of significant changes via ${updateNotifyMethod}.`
        },
        {
            title: '11. Contact Us',
            content: `📧 Email: ${contactEmail}
📍 Address: ${companyAddress}
🌐 Website: ${websiteUrl}`
        }
    ];
</script>

<svelte:head>
    <title>Terms of Service — MCP Market Data</title>
    <meta name="description" content="MCP Market Data terms of service — the rules governing your use of the platform." />
</svelte:head>

<main class="max-w-3xl mx-auto px-6 py-12 text-gray-800">
    <h1 class="text-3xl font-bold mb-2">📜 Terms of Service</h1>
    <p class="text-sm text-gray-500 mb-8">Last updated: {lastUpdated}</p>

    <p class="mb-6">
        Welcome to {appName}! These Terms of Service ("Terms") govern your access to and use of our platform and services (“Services”).
        By using the Services, you agree to these Terms. If you do not agree, do not use our Services.
    </p>

    {#each sections as section}
        <section class="mb-8">
            <h2 class="text-xl font-semibold mb-2">{section.title}</h2>
            <p class="whitespace-pre-line leading-relaxed">{section.content}</p>
        </section>
    {/each}
</main>
