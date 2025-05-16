import { useEffect } from "react";

const Vapi = () => {
  useEffect(() => {
    // Create and load the Vapi script
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
    script.defer = true;
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Basic configuration
      const apiKey = "815deafd-f807-46c0-933f-e39c9a8e787e";
      const assistant = {
        model: {
          provider: "openai",
          model: "gpt-3.5-turbo",
          systemPrompt: "You are a helpful and knowledgeable AI assistant integrated into a blood donation web application called LifeShare. Your job is to help users with questions related to blood donation. Only answer queries about,Blood donation eligibility,Blood group compatibility,How and where to donate blood,Urgent donation needs  ,Safety and health concerns for donors and recipients,You must not answer questions unrelated to blood donation. If asked anything else, politely respond:,I'm here to help only with blood donation-related questions. Please ask me something related to blood connect platform.",
        },
        voice: {
          provider: "11labs",
          voiceId: "paula",
        },
        firstMessage: "Welcome! How can I assist you today?",
      };

      // Minimal button config - just the essentials
      const buttonConfig = {
        position: "bottom-right",
        offset: "40px"
      };

      // Initialize Vapi
      const vapiInstance = window.vapiSDK.run({ 
        apiKey, 
        assistant, 
        config: buttonConfig 
      });
      
      // Basic event logging
      vapiInstance.on("message", (msg) => {
        if (msg.transcriptType && msg.transcriptType !== "final") return;
        console.log("Message received:", msg);
      });
      
      vapiInstance.on('error', (e) => {
        console.error('Vapi error:', e);
      });
    };

    return () => {
      // Clean up script on unmount
      const scriptElement = document.querySelector('script[src="https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js"]');
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
    };
  }, []);

  return null;
};

export default Vapi;