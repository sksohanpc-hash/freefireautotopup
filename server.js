const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/purchase', async (req, res) => {
    console.log("\n--- নতুন অর্ডার রিসিভ হয়েছে ---");
    
    // প্যানেল থেকে আসা ডাটা সংগ্রহ
    const player_id = req.body.player_id || req.body.playerid || req.body.uid;
    const voucher = req.body.voucher || req.body.code || req.body.pin;
    const order_id = req.body.order_id || req.body.orderid || "TEST-" + Date.now();
    
    // প্যাকেজ নাম (এটি শুধু আপনার টার্মিনালে দেখার জন্য)
    const package_name = req.body.product_name || req.body.package || "Unknown Package";

    console.log(`অর্ডার আইডি  : ${order_id}`);
    console.log(`প্লেয়ার আইডি : ${player_id}`);
    console.log(`প্যাকেজ নাম  : ${package_name}`);
    console.log(`ভাউচার কোড  : ${voucher}`);

    // ডাটা চেক করা
    if (!player_id || !voucher) {
        console.log("ভুল: প্লেয়ার আইডি বা ভাউচার কোড পাওয়া যায়নি!");
        return res.status(400).json({ status: "error", message: "Missing PlayerID or Voucher" });
    }

    try {
        // UcBot Sync API-তে রিকোয়েস্ট পাঠানো
        const response = await axios.post('http://api.ucbot.store/topup-sync', {
            "orderid": order_id.toString(),
            "playerid": player_id.toString(),
            "code": voucher.toString()
        }, {
            headers: { 
                "Authorization": "ca968e2c-60fc-4855-85d9-a7eab46ec4fd", // টেলিগ্রাম থেকে পাওয়া টোকেনটি এখানে দিন
                "Content-Type": "application/json"
            }
        });

        // সফল হলে টার্মিনালে রেজাল্ট দেখানো
        console.log("API রেসপন্স:", JSON.stringify(response.data));
        res.status(200).json(response.data);

    } catch (error) {
        console.error("অর্ডারটি ব্যর্থ হয়েছে!");
        if (error.response) {
            console.log("API এরর মেসেজ:", JSON.stringify(error.response.data));
            res.status(error.response.status).json(error.response.data);
        } else {
            console.log("Error:", error.message);
            res.status(500).send("Network Error");
        }
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`====================================`);
    console.log(`বট চালু হয়েছে! পোর্ট: ${PORT}`);
    console.log(`====================================`);
});
