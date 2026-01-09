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
        console.log(`[${msg.type()}] ${msg.text()}`);
    });
    
    page.on('pageerror', error => {
        errors.push(error.message);
        console.log(`[PAGE ERROR] ${error.message}`);
    });
    
    const filePath = path.resolve(__dirname, 'index.html');
    await page.goto(`file://${filePath}`);
    
    await page.waitForTimeout(2000);
    
    console.log('\n=== Debug State ===');
    
    // Check initial state
    const initialState = await page.evaluate(() => {
        return {
            mode: state.mode,
            isRunning: state.isRunning,
            isPaused: state.isPaused,
            timeLeft: state.timeLeft
        };
    });
    console.log('Initial state:', initialState);
    
    // Check toggle button visibility
    const toggleHidden = await page.$eval('#btn-toggle', el => el.classList.contains('hidden'));
    const toggleDisplay = await page.$eval('#btn-toggle', el => window.getComputedStyle(el).display);
    console.log(`Toggle hidden class: ${toggleHidden}, display: ${toggleDisplay}`);
    
    // Check work buttons visibility
    const workButtonsHidden = await page.$eval('#work-buttons', el => el.classList.contains('hidden'));
    const workButtonsDisplay = await page.$eval('#work-buttons', el => window.getComputedStyle(el).display);
    console.log(`Work buttons hidden class: ${workButtonsHidden}, display: ${workButtonsDisplay}`);
    
    // Get CSS
    const workButtonsCss = await page.$eval('#work-buttons', el => {
        const style = window.getComputedStyle(el);
        return {
            display: style.display,
            visibility: style.visibility,
            opacity: style.opacity,
            position: style.position
        };
    });
    console.log('Work buttons CSS:', workButtonsCss);
    
    // Now tap and test
    console.log('\n=== Tapping Start Button ===');
    await page.tap('#btn-toggle');
    await page.waitForTimeout(1000);
    
    const afterTapState = await page.evaluate(() => {
        return {
            mode: state.mode,
            isRunning: state.isRunning,
            isPaused: state.isPaused,
            timeLeft: state.timeLeft
        };
    });
    console.log('State after tap:', afterTapState);
    
    const afterToggleHidden = await page.$eval('#btn-toggle', el => el.classList.contains('hidden'));
    const afterWorkButtonsHidden = await page.$eval('#work-buttons', el => el.classList.contains('hidden'));
    console.log(`After tap - Toggle hidden: ${afterToggleHidden}, Work buttons hidden: ${afterWorkButtonsHidden}`);
    
    console.log('\n=== Error Summary ===');
    if (errors.length > 0) {
        console.log(`❌ ERRORS (${errors.length}):`);
        errors.forEach(err => console.log(`  - ${err}`));
    } else {
        console.log('✅ No JavaScript errors!');
    }
    
    await browser.close();
})();
