const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({
        viewport: { width: 375, height: 667 },
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
    
    await page.waitForTimeout(1500);
    
    console.log('=== Improved Mobile Interaction Test ===\n');
    
    // Test 1: Check initial state
    const initialMode = await page.$eval('#mode-break', el => el.classList.contains('active'));
    console.log(`Initial state - Work mode active: ${!initialMode}, Break mode active: ${initialMode}`);
    
    // Test 2: Tap on mode-break directly (should switch to break mode)
    console.log('\nTest: Tapping on mode-break...');
    await page.tap('#mode-break');
    await page.waitForTimeout(800);
    
    const breakModeAfterTap = await page.$eval('#mode-break', el => el.classList.contains('active'));
    const workModeAfterTap = await page.$eval('#mode-work', el => el.classList.contains('active'));
    console.log(`After tap - Work mode active: ${workModeAfterTap}, Break mode active: ${breakModeAfterTap}`);
    
    // Test 3: Get timer value to confirm mode
    const timerValue = await page.textContent('#timer-display');
    console.log(`Timer value: ${timerValue}`);
    
    // Test 4: Start timer in break mode
    console.log('\nTest: Starting timer in break mode...');
    await page.tap('#btn-toggle');
    await page.waitForTimeout(500);
    
    const breakBtnText = await page.textContent('#btn-toggle-text');
    console.log(`Button text: "${breakBtnText}"`);
    
    // Test 5: End break early
    console.log('\nTest: Ending break early...');
    await page.tap('#btn-end-break');
    await page.waitForTimeout(800);
    
    // Test 6: Now tap on mode-break again (should work now)
    console.log('\nTest: Tapping mode-break after reset...');
    await page.tap('#mode-break');
    await page.waitForTimeout(800);
    
    const breakModeAfterReset = await page.$eval('#mode-break', el => el.classList.contains('active'));
    console.log(`Break mode active: ${breakModeAfterReset}`);
    
    // Test 7: Test all other interactions quickly
    console.log('\n=== Quick Tests ===');
    
    await page.tap('#theme-toggle');
    await page.waitForTimeout(200);
    console.log(`Dark mode toggle: ${await page.$eval('body', el => el.classList.contains('dark-mode'))}`);
    
    await page.tap('#settings-btn');
    await page.waitForTimeout(200);
    console.log(`Settings modal: ${await page.$eval('#settings-modal', el => el.classList.contains('active'))}`);
    
    await page.tap('#settings-close-btn');
    await page.waitForTimeout(200);
    
    await page.tap('.theme-btn.blue');
    await page.waitForTimeout(200);
    console.log(`Blue theme: ${await page.$eval('body', el => el.classList.contains('theme-blue'))}`);
    
    await page.tap('.bg-preset.pink');
    await page.waitForTimeout(200);
    console.log(`Pink background: ${await page.$eval('.bg-preset.pink', el => el.classList.contains('active'))}`);
    
    await page.tap('#thinking-boi');
    await page.waitForTimeout(300);
    console.log(`Speech bubble: ${await page.$eval('#boi-speech-bubble', el => el.classList.contains('active'))}`);
    
    console.log('\n=== Error Summary ===');
    if (errors.length > 0) {
        console.log(`❌ ERRORS (${errors.length}):`);
        errors.forEach(err => console.log(`  - ${err}`));
    } else {
        console.log('✅ No JavaScript errors!');
    }
    
    console.log('\n=== Test Complete ===');
    
    await browser.close();
})();
