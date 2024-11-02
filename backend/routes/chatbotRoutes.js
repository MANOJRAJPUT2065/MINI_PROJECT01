import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const router = express.Router();

router.post('/send', async (req, res) => {
    const { question } = req.body; // Expecting 'question' from the request body

    // Check if the question is about the bot's creation or identity
    const creationQuestions = [
        "who created you",
        "who is your creator",
        "who made you",
        "who designed you",
        "who developed you"
    ];

    const botInfoQuestions = [
        "what is your role",
        "tell me about yourself",
        "who are you",
        "introduce yourself",
    ];

    // Normalize the question to lower case for comparison
    const normalizedQuestion = question.toLowerCase();

    // Check for creation questions
    if (creationQuestions.some(q => normalizedQuestion.includes(q))) {
        return res.json({ answer: "I was created by Manoj." });
    }

    // Check for bot identity questions
    if (botInfoQuestions.some(q => normalizedQuestion.includes(q))) {
        return res.json({ answer: "I'm your personal doctor created by Manoj and his team." });
    }

    const apiKey = process.env.GEMINI_API_KEY; // Use the API key from .env
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ 
            parts: [{ 
                text: question // Only include the text field
            }] 
        }],
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ error: errorData.error?.message || 'Failed to fetch response from Gemini API.' });
        }

        const data = await response.json();
        const answer = data.candidates[0]?.content?.parts[0]?.text || 'Sorry, I didn\'t get that.';

        return res.json({ answer });
    } catch (error) {
        console.error('Error fetching Gemini response:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
