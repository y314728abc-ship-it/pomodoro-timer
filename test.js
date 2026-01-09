const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    const consoleMessages = [];
    const errors = [];
    
    page.on('console', msg => {
        consoleMessages.push({ type: msg.type(), text: msg.text() });
        if (msg.type() === 'error') {
            errors.push(msg.text());
        }
    });
    
    page.on('pageerror', error => {
        errors.push(error.message);
    });
    
    const filePath = path.resolve(__dirname, 'index.html');
    await page.goto(`file://${filePath}`);
    
    // Wait for page to fully load
    await page.waitForTimeout(2000);
    
    // Check if main elements exist
    const title = await page.title();
    const hasTimerDisplay = await page.$('#timer-display') !== null;
    const hasThinkingBoi = await page.$('#thinking-boi') !== null;
    const hasBtnToggle = await page.$('#btn-toggle') !== null;
    
    console.log('=== Page Load Test Results ===');
    console.log(`Title: ${title}`);
    console.log(`Timer display found: ${hasTimerDisplay}`);
    console.log(`Thinking boi found: ${hasThinkingBoi}`);
    console.log(`Toggle button found: ${hasBtnToggle}`);
    console.log(`\nConsole messages (${consoleMessages.length}):`);
    consoleMessages.forEach(msg => {
        console.log(`  [${msg.type}] ${msg.text}`);
    });
    
    if (errors.length > 0) {
        console.log(`\n❌ ERRORS FOUND (${errors.length}):`);
        errors.forEach(err => console.log(`  - ${err}`));
        process.exit(1);
    } else {
        console.log('\n✅ No errors found! Page loaded successfully.');
    }
    
    await browser.close();
})();
