// Vercel Serverless Function for sending announcements
export default async function handler(req, res) {
    // تمكين CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { server, map, layer, factions, time, team1_name, team2_name, commander1, commander2 } = req.body;

        // إنشاء embed للإعلان
        const embed = {
            title: '📢 Match Announcement',
            color: 0x7289DA,
            fields: [
                { name: 'Server', value: `\`${server}\``, inline: false },
                { name: 'Map', value: `\`${map}\``, inline: false },
                { name: 'Layer', value: `\`${layer}\``, inline: false },
                { name: 'Factions', value: `\`${factions || 'TBD'}\``, inline: false },
                { name: 'Time', value: `\`${time}\``, inline: false },
                { name: `🇺🇸 ${team1_name}`, value: 'No members yet', inline: true },
                { name: `🇵🇸 ${team2_name}`, value: 'No members yet', inline: true }
            ],
            image: {
                url: 'https://cdn.discordapp.com/attachments/1408681719347023942/1427956738082213929/gif2-ezgif.com-optimize.gif?ex=68f0bfd8&is=68ef6e58&hm=5df9686f2fb88bb880a879931a96da2d248ceacbe164d2175f9f056ae52e856f&'
            }
        };

        // إنشاء الأزرار
        const components = [
            {
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 2,
                        label: commander1 || 'TBD',
                        custom_id: 'commander1_display',
                        disabled: true
                    },
                    {
                        type: 2,
                        style: 2,
                        label: commander2 || 'TBD',
                        custom_id: 'commander2_display',
                        disabled: true
                    }
                ]
            },
            {
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 1,
                        label: 'Join Team 1',
                        custom_id: 'join_team1'
                    },
                    {
                        type: 2,
                        style: 4,
                        label: 'Join Team 2',
                        custom_id: 'join_team2'
                    }
                ]
            }
        ];

        // إرسال للـ Discord Webhook
        const webhookUrl = 'https://discord.com/api/webhooks/1427991799724642426/CV4lTaoXt9mEs4FYts3RQwML9SNOplGnmqeyxO5DwrKClKvB1HUaQGMy8GB6YDW1xMWa';
        
        const webhookResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                embeds: [embed],
                components: components
            })
        });

        if (webhookResponse.ok) {
            return res.status(200).json({ 
                success: true, 
                message: 'تم إرسال الإعلان بنجاح!' 
            });
        } else {
            const errorText = await webhookResponse.text();
            return res.status(500).json({ 
                success: false, 
                error: `خطأ في إرسال الإعلان: ${errorText}` 
            });
        }

    } catch (error) {
        console.error('خطأ في API:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'خطأ داخلي في السيرفر' 
        });
    }
}
