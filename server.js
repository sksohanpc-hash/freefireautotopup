const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// আপনার দেওয়া ডাটা অনুযায়ী ম্যাপিং
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
    
    // আপনার প্যানেল যে ফিল্ড নামে ডাটা পাঠায় সেগুলো এখানে দিন
    const { player_id, voucher, order_id, product_name } = req.body;

    // ম্যাপিং চেক করা (যদি লিস্টে না থাকে তবে অরিজিনাল নামটাই থাকবে)
    const apiPackageCode = diamondMapping[product_name] || product_name;

    console.log(`অর্ডার আইডি: ${order_id}`);
    console.log(`আইডি: ${player_id} | প্যাকেজ: ${product_name} -> API কোড: ${apiPackageCode}`);
    console.log(`ভাউচার: ${voucher}`);

    try {
        const response = await axios.post('http://api.ucbot.store/topup', {
            "orderid": order_id,
            "playerid": player_id,
            "code": voucher,
            "package": apiPackageCode, // এটি ২০, ৩৬ বা ৮০ হিসেবে যাবে
            "url": "https://rrrbazar.com/callback"
        }, {
            headers: { 
                "Authorization": "আপনার_আসল_টোকেন_এখানে_দিন", 
                "Content-Type": "application/json"
            }
        });

        console.log("API থেকে রেসপন্স:", response.data);
        res.status(200).json({ status: "Success", data: response.data });

    } catch (error) {
        console.error("অর্ডার প্রসেস করতে সমস্যা হয়েছে!");
        res.status(500).json({ status: "Failed", error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`বট রেডি! পোর্ট: ${PORT}`));
