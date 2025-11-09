export async function fetchReply(text: string, lang: "en" | "bn") {
  try {
    const res = await fetch("/api/educator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, language: lang }),
    });
    if (!res.ok) throw new Error("API error");
    
    const contentType = res.headers.get("content-type");
    
    if (contentType?.includes("text/plain")) {
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value, { stream: true });
        }
      }
      
      return { reply: fullText, intent: { type: "answer" as const } };
    } else {
      const data = await res.json();
      return { reply: data.reply, intent: data.intent };
    }
  } catch (e) {
    console.error("fetchReply error", e);
    const fallback = lang === "bn"
      ? "দুঃখিত — কিছু সমস্যা হয়েছে। আবার বলুন বা টাইপ করুন।"
      : "Sorry — something went wrong. Please try again or type your question.";
    return { reply: fallback, intent: { type: "answer" as const } };
  }
}
