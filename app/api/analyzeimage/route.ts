import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";


export const runtime = 'edge';


const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY
})

const openai = new OpenAIApi(configuration);


export async function POST(request: Request){
    const {image} = await request.json();

    console.log("tapping the post");

    const response = await openai.createChatCompletion({
        model: "gpt-4-vision-preview",
        stream: true,
        max_tokens: 4096,
        messages: [
            {
                role:"user",
                //@ts-ignore
                content: [
                    {type: "text", text: "Whats in this image"},
                    {type: "image_url",
                        image_url: image
                    }
                ]
            }
        ]
    });


    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
}

