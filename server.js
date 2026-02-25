const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/purchase', async (req, res) => {
    console.log("\n--- নতুন অর্ডার রিসিভ হয়েছে ---");
    
    // প্যানেল বা মেনুয়াল টেস্ট থেকে আসা ডাটা সংগ্রহ
    const player_id = req.body.player_id || req.body.playerid || req.body.uid;
    const voucher = req.body.voucher || req.body.code || req.body.pin;
    const order_id = req.body.order_id || req.body.orderid || "SYNC-" + Date.now();
    
    // প্যাকেজ নাম (টার্মিনালে দেখার জন্য)
    const package_name = req.body.product_name || req.body.package || "Unknown Package";

    console.log(`অর্ডার আইডি  : ${order_id}`);
    console.log(`প্লেয়ার আইডি : ${player_id}`);
    console.log(`প্যাকেজ নাম  : ${package_name}`);
    console.log(`ভাউচার কোড  : ${voucher}`);

    // ডাটা চেক করা
    if (!player_id || !voucher) {
        console.log("ভুল: প্লেয়ার আইডি বা ভাউচার কোড পাওয়া যায়নি!");
        return res.status(400).json({ status: "error", message: "Missing Data" });
    }

    try {
        // UcBot Sync API-তে আপনার টোকেনসহ রিকোয়েস্ট
        const response = await axios.post('http://api.ucbot.store/topup-sync', {
            "orderid": order_id.toString(),
            "playerid": player_id.toString(),
            "code": voucher.toString()
        }, {
            headers: { 
                "Authorization": "ca968e2c-60fc-4855-85d9-a7eab46ec4fd", // আপনার দেওয়া টোকেন বসানো হয়েছে
                "Content-Type": "application/json"
            }
        });

        // সফল হলে রেজাল্ট দেখানো
        console.log("API রেসপন্স:", JSON.stringify(response.data));
        res.status(200).json(response.data);

    } catch (error) {
        console.error("অর্ডারটি ব্যর্থ হয়েছে!");
        if (error.response) {
            // আসল এরর মেসেজ দেখার ব্যবস্থা
            console.log("API থেকে আসা মেসেজ:", JSON.stringify(error.response.data));
            res.status(error.response.status).json(error.response.data);
        } else {
            console.log("Error Message:", error.message);
            res.status(500).send("Network Error");
        }
    }
});

app.listen(3000, () => {
    console.log(`====================================`);
    console.log(`বট চালু হয়েছে! আপনার টোকেন সেট করা আছে।`);
    console.log(`====================================`);
});
