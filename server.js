const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const diamondMapping = {
    "25 diamond": "20",
    "50 diamond": "36",
    "115 diamond": "80",
    "240 diamond": "160",
    "610 diamond": "405",
    "1240 diamond": "810",
    "2530 diamond": "1625",
    "Weekly": "161",
    "Monthly": "800"
};

app.post('/purchase', async (req, res) => {
    console.log("--- নতুন অর্ডার রিসিভ হয়েছে ---");
    console.log("Raw Data:", req.body); // এটি টার্মিনালে আসল নামগুলো দেখাবে

    // ওয়েবসাইট বিভিন্ন নামে ডাটা পাঠাতে পারে, আমরা সব চেক করছি
    const player_id = req.body.player_id || req.body.uid || req.body.user_id || req.body.playerid;
    const voucher = req.body.voucher || req.body.code || req.body.pin;
    const order_id = req.body.order_id || req.body.id || req.body.orderid;
    const product_name = req.body.product_name || req.body.package || req.body.item_name;

    const apiPackageCode = diamondMapping[product_name] || product_name;

    console.log(`অর্ডার আইডি: ${order_id}`);
    console.log(`প্লেয়ার আইডি: ${player_id}`);
    console.log(`প্যাকেজ: ${product_name} -> API কোড: ${apiPackageCode}`);
    console.log(`ভাউচার: ${voucher}`);

    if(!player_id || !voucher) {
        console.log("ভুল: প্লেয়ার আইডি বা ভাউচার পাওয়া যায়নি!");
        return res.status(400).send("Missing Data");
    }

    try {
        const response = await axios.post('http://api.ucbot.store/topup', {
            "orderid": order_id,
            "playerid": player_id,
            "code": voucher,
            "package": apiPackageCode,
            "url": "https://rrrbazar.com/callback"
        }, {
            headers: { 
                "Authorization": "আপনার_আসল_টোকেন_এখানে_দিন", // এটি ভুলবেন না
                "Content-Type": "application/json"
            }
        });

        console.log("API রেসপন্স:", response.data);
        res.status(200).send("Success");

    } catch (error) {
        console.error("অর্ডার প্রসেস করতে সমস্যা হয়েছে!");
        res.status(500).send("Failed");
    }
});

app.listen(3000, () => console.log("বট রেডি! পোর্ট: 3000"));
