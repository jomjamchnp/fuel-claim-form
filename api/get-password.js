export default async function handler(req, res) {
    const genratrApiUrl = "https://api.genratr.com/?length=6&lowercase&numbers";
    const genResponse = await fetch(genratrApiUrl);
    const res = await genResponse.json(); 
    const message = `รหัสประจำวันนี้: ${res.password}`;
  
    const token = process.env.LINE_TOKEN;
    const groupId = process.env.LINE_GROUP_ID;

  
    const pushUrl = "https://api.line.me/v2/bot/message/push";
  
    const payload = {
      to: groupId,
      messages: [
        {
          type: "text",
          text: message
        }
      ]
    };
  
    const response = await fetch(pushUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
  
    if (response.ok) {
      res.status(200).json({ success: true, password });
    } else {
      const errorText = await response.text();
      res.status(500).json({ success: false, error: errorText });
    }
  }