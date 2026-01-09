const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    // Create a mobile device context
    const context = await browser.newContext({
        viewport: { width: 375, height: 667 }, // iPhone SE size
        isMobile: true,
        hasTouch: true
    });
    const page = await context.newPage();
    
    const errors = [];
    
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        }
    });
    
    page.on('pageerror', error => {
        errors.push(error.message);
    });
    
    const filePath = path.resolve(__dirname, 'index.html');
    await page.goto(`file://${filePath}`);
    
    await page.waitForTimeout(1000);
    
    console.log('=== Mobile Interaction Test (iPhone SE) ===\n');
    
    // Test 1: Check viewport and mobile settings
    const viewport = page.viewportSize();
    console.log(`Viewport: ${viewport.width}x${viewport.height}`);
    console.log(`Mobile mode: true`);
    console.log(`Has touch: true`);
    
    // Test 2: Tap on start button (mobile uses tap, not click)
    console.log('\nTesting tap on start button...');
    await page.tap('#btn-toggle');
    await page.waitForTimeout(500);
    
    const btnText = await page.textContent('#btn-toggle-text');
    console.log(`Button text after tap: "${btnText}"`);
    
    // Test 3: Check if work buttons appeared
    const toggleHidden = await page.$eval('#btn-toggle', el => el.classList.contains('hidden'));
    const workButtonsVisible = await page.$eval('#work-buttons', el => !el.classList.contains('hidden'));
    console.log(`Toggle hidden: ${toggleHidden}`);
    console.log(`Work buttons visible: ${workButtonsVisible}`);
    
    // Test 4: Tap on complete button
    console.log('\nTesting tap on complete button...');
    await page.tap('#btn-complete');
    await page.waitForTimeout(500);
    
    const breakButtonsVisible = await page.$eval('#break-buttons', el => !el.classList.contains('hidden'));
    console.log(`Break buttons visible: ${breakButtonsVisible}`);
    
    // Test 5: Tap on end break button
    console.log('\nTesting tap on end break button...');
    await page.tap('#btn-end-break');
    await page.waitForTimeout(500);
    
    const toggleVisibleAgain = await page.$eval('#btn-toggle', el => !el.classList.contains('hidden'));
    console.log(`Toggle visible again: ${toggleVisibleAgain}`);
    
    // Test 6: Tap on theme toggle
    console.log('\nTesting tap on theme toggle...');
    await page.tap('#theme-toggle');
    await page.waitForTimeout(300);
    
    const isDarkMode = await page.$eval('body', el => el.classList.contains('dark-mode'));
    console.log(`Dark mode: ${isDarkMode}`);
    
    // Test 7: Tap on settings button
    console.log('\nTesting tap on settings button...');
    await page.tap('#settings-btn');
    await page.waitForTimeout(300);
    
    const settingsOpen = await page.$eval('#settings-modal', el => el.classList.contains('active'));
    console.log(`Settings modal opened: ${settingsOpen}`);
    
    // Test 8: Tap on close button
    await page.tap('#settings-close-btn');
    await page.waitForTimeout(300);
    
    // Test 9: Tap on thinking boi
    console.log('\nTesting tap on thinking boi...');
    await page.tap('#thinking-boi');
    await page.waitForTimeout(500);
    
    const speechVisible = await page.$eval('#boi-speech-bubble', el => el.classList.contains('active'));
    console.log(`Speech bubble visible: ${speechVisible}`);
    
    // Test 10: Check mode badges are tappable
    console.log('\nTesting tap on mode badge...');
    await page.tap('#mode-break');
    await page.waitForTimeout(300);
    
    const breakModeActive = await page.$eval('#mode-break', el => el.classList.contains('active'));
    console.log(`Break mode active: ${breakModeActive}`);
    
    // Test 11: Check theme buttons
    console.log('\nTesting tap on theme button...');
    await page.tap('.theme-btn.blue');
    await page.waitForTimeout(300);
    
    const blueTheme = await page.$eval('body', el => el.classList.contains('theme-blue'));
    console.log(`Blue theme: ${blueTheme}`);
    
    // Test 12: Check background presets
    console.log('\nTesting tap on background preset...');
    await page.tap('.bg-preset.pink');
    await page.waitForTimeout(300);
    
    const pinkActive = await page.$eval('.bg-preset.pink', el => el.classList.contains('active'));
    console.log(`Pink background: ${pinkActive}`);
    
    console.log('\n=== Error Summary ===');
    if (errors.length > 0) {
        console.log(`❌ ERRORS FOUND (${errors.length}):`);
        errors.forEach(err => console.log(`  - ${err}`));
    } else {
        console.log('✅ No JavaScript errors detected!');
    }
    
    console.log('\n=== Mobile Test Complete ===');
    
    await browser.close();
})();
