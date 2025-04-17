const puppeteer = require("puppeteer");

(async () => {
    console.log("🚀 Mở trình duyệt...");

    // Khởi động Puppeteer với cấu hình đúng
    const browser = await puppeteer.launch({
        headless: true,  // Chạy ở chế độ headless (không GUI)
        args: [
            "--no-sandbox", 
            "--disable-setuid-sandbox", 
            "--disable-gpu",  // Tắt GPU
            "--disable-software-rasterizer"  // Tắt phần mềm rasterizer
        ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
    console.log("✅ Trình duyệt đã mở!");

    console.log("🌐 Đăng nhập...");
    await page.goto("https://labs.play-with-docker.com/oauth/providers/docker/login", { waitUntil: "networkidle2" });
    await page.type("input#username", "1931jade@edny.net");
    await page.click("button[data-action-button-primary='true']");
    await page.waitForSelector("input#password", { visible: true });
    await page.type("input#password", "Hoang0909@@");
    await page.click("button._button-login-password");
    await new Promise(r => setTimeout(r, 2000));

    console.log("🌐 Truy cập trang chính...");
    await page.goto("https://labs.play-with-docker.com/", { waitUntil: "networkidle2" });

    console.log("🖱️ Bấm Start...");
    await page.waitForSelector("a.btn.btn-lg.btn-success[ng-click='start()']", { visible: true });
    await page.click("a.btn.btn-lg.btn-success[ng-click='start()']");
    await new Promise(r => setTimeout(r, 5000));

    console.log("🖱️ Add new instance...");
    const addBtn = await page.$("span.ng-binding.ng-scope");
    if (addBtn) await addBtn.click();
    else console.log("❌ Không tìm thấy nút Add");
    await new Promise(r => setTimeout(r, 3000));

    console.log("🌐 Truy cập URL hiện tại...");
    const currentUrl = page.url();
    console.log("🔗 URL hiện tại:", currentUrl);
    await page.goto(currentUrl, { waitUntil: "networkidle2" });
    console.log("📌 Tiêu đề trang:", await page.title());

    console.log("🔍 Kiểm tra terminal...");
    const elements = await page.$$('div[role="listitem"]');
    if (!elements.length) {
        console.error("❌ Không tìm thấy terminal!");
        await browser.close();
        return;
    }

    console.log("⌨️ Nhập lệnh...");
    await elements.at(-1).click();
    await page.keyboard.type("git clone https://github.com/NGCSL2025/testcommit.git && cd testcommit && docker build -t server .");
    await page.keyboard.press("Enter");
    await new Promise(r => setTimeout(r, 5000));

    console.log("📸 Chụp ảnh...");
    await page.screenshot({ path: "screenshot.png", fullPage: true });
    console.log("✅ Đã lưu ảnh full page: screenshot.png");

    console.log("🛑 Đóng trình duyệt");
    await browser.close();
})();
