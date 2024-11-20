import { dbConnect } from "@/lib/dbConnect";
import { Todo } from "@/model/todo";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    // Parse the JSON data from the request
    const { message, url , key } = await req.json();

    // Validate input fields
    if (!message || !url || !key) {
      return NextResponse.json(
        { message: "All fields are required. Please try again!" },
        { status: 400 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Create a new Todo
    const file = {
      url: url,
      key: key, // Placeholder; update this if you're using Cloudinary or another service
    };
    const newTodo = await Todo.create({ message, file });

    // Return success response
    return NextResponse.json(
      { message: "Todo created successfully!", todo: newTodo },
      { status: 201 }
    );
  } catch (error) {
    console.error("Server Error:", error); // Log the error for debugging
    return NextResponse.json(
      { message: "Server error, please try again later!" },
      { status: 500 }
    );
  }
};
