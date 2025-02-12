import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json(); // Parse the request body

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        {
          role: "user",
          content: `create a user goal plan for a user and return the response containing  the json object containing the following keys: 
      {
        title: should be a string with a title related to the goal the user typed: ${body.userGoal.title},
        purpose: should be a string ${body.userGoal.purpose},
        advice: should be a string, add advise to what the user should do for how long, how many times a day, week or month, and to help user keep their motivation,
        repeat_term: choose the interval the user need to set to accomplish the goal: ["daily", "weekly", "monthly"],
        duration: "entire_day" or "specific_duration",
        duration_length: If duration is "specific_duration" set the length as a integer.
        duration_measure: If duration is "specific_duration" set the measure like ["Minutes", "Hours", "Kilometers", "Pages"]
      }`,
        },
      ],
    });

    // Extract JSON using regex
    const jsonMatch = completion.choices[0].message.content.match(
      /```json\s*([\s\S]*?)\s*```/
    );

    if (jsonMatch) {
      const jsonString = jsonMatch[1]; // Extracted JSON string
      const jsonObject = JSON.parse(jsonString); // Convert to Object

      return NextResponse.json(jsonObject);
    } else {
      return NextResponse.json(completion.choices[0].message);
    }
  } catch (error) {
    console.error("Error in session creation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
