const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/purchase', async (req, res) => {
    console.log("--- নতুন অর্ডার রিসিভ হয়েছে ---");
    
    // ১. প্যানেল থেকে আসা ডাটাগুলো ভেরিয়েবলে জমা করা
    const player_id = req.body.playerid || req.body.player_id || req.body.uid;
    const voucher = req.body.voucher || req.body.code || req.body.pin;
    const order_id = req.body.orderid || req.body.order_id || req.body.id;
    
    // ২. প্যাকেজ নাম ধরার জন্য এই নতুন লাইনটি যোগ করা হয়েছে
    const package_name = req.body.product_name || req.body.package || req.body.item_name || "Unknown Package";

    // ৩. টার্মিনালে সব তথ্য প্রিন্ট করা
    console.log(`অর্ডার আইডি: ${order_id}`);
    console.log(`প্লেয়ার আইডি: ${player_id}`);
    console.log(`প্যাকেজ নাম: ${package_name}`); // এখন এটি '25 diamond' দেখাবে
    console.log(`ভাউচার কোড: ${voucher}`);

    try {
        // UcBot Sync API লিঙ্ক
        const response = await axios.post('http://api.ucbot.store/topup-sync', {
            "orderid": order_id || Date.now().toString(),
            "playerid": player_id,
            "code": voucher 
        }, {
            headers: { 
                "Authorization": "আপনার_আসল_টোকেন_এখানে_দিন", // এখানে আপনার টেলিগ্রাম থেকে পাওয়া টোকেন বসান
                "Content-Type": "application/json"
            }
        });

        console.log("API সফল রেসপন্স:", response.data);
        res.status(200).json(response.data);

    } catch (error) {
        console.error("অর্ডারটি ব্যর্থ হয়েছে!");
        if (error.response) {
            console.log("API Error Message:", error.response.data);
        }
        res.status(500).send("API Error");
    }
});

app.listen(3000, () => console.log("বট নতুন সিঙ্ক মোডে চালু হয়েছে! পোর্ট: 3000"));
